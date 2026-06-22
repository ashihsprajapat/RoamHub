import Transaction from "./transaction.model.js";
import Razorpay from "razorpay";
import User from '../User/userSchema.js';
import { prisma } from "../lib/prisma.js";
import Listing from "../Listings/listingModel.js";
import client from "../config/Redis.js";

//getway initailize
const razorpayInstance = new Razorpay({
    key_id: process.env.ROZORPAY_ID,
    key_secret: process.env.ROZORPAY_SECRET,
});

//api to make payment  for credits
export const paymnetRazorPay = async (req, res) => {
    try {
        const { totalAmount, paymentType, from, to } = req.body;
        
        const {user} = req;
        const { id: listingId } = req.params;


        const listing = await Listing.findById(listingId);
        if(!listing)
                return res.status(404).json({message:"Listing not found"})


        const bookings= await prisma.booking.findFirst({
            where :{
                listingId ,
                AND:[
                    {
                        from : {
                            lt : new Date(to)
                        },
                        to:{
                            gt : new Date(from)
                        }
                    }
                ]
            }
        })

        if(bookings)
            return res.status(400).json({message:"Selected dates are already booked for this listing."})

        const transaction = await prisma.transaction.create({
            data:{
                totalAmount,
                userId : user.id,
                listingId ,
                paymentType
            }
        })

        const amount = totalAmount; 

        const options = {
            amount: amount * 100,
            currency: process.env.CURRENCY,
            receipt: transaction.id,
            notes: {
                listingId: listingId,
                userId: user.id
            }
        };


    const order =   await razorpayInstance.orders.create(options);
        
    await prisma.transaction.update({
                where:{id : transaction.id},
                data:{
                    order_id : order.id
                }
            })
            res.status(200).json({ success: true, order });
    } catch (error) {
        console.error("Error in paymnetRazorPay:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

//api controller finction to verify razorpay payment verifu
export const verifyRazorpay = async (req, res, next) => {
   
    try {
        const { razorpay_order_id, from , to , totalAmount, TotalNights, pernightCharge , guests } = req.body;
        
        
        const orderinfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        if (orderinfo.status === 'paid') {

            let transactionData = await prisma.transaction.findUnique({where:{id : orderinfo.receipt}})

            const listingId = orderinfo.notes.listingId

            const listing = await Listing.findById(listingId);
            if(!listing)
                return res.status(404).json({message:"Listing not found", success:false})


            const result= await prisma.$transaction(async(tx)=>{
                
                transactionData =  await tx.transaction.update({where:{id : orderinfo.receipt},
                    data:{
                        paymentStatus : "SUCCESS"
                    }}
                )   
                const newBooking = await tx.booking.create({
                    data:{
                        ownerId : req.user.id,
                        listingId : String(listing._id),
                        from : new Date(from) ,
                        to  : new Date(to) ,
                        totalAmount,
                        paymentStatus : transactionData.paymentStatus,
                        transactionId : transactionData.id,
                        TotalNights,
                        pernightCharge,
                        listingTitle :listing.title,
                        listingAddress : listing.location,
                        listingImage :listing.image[0].url

                    }
                })  

                

                await tx.guest.createMany({
                    data:guests.map((g, i)=> ({
                        name : g.name,
                        age:g.age,
                        gender : g.gender,
                        bookingId : newBooking.id
                    }))
                })

                console.log("exception is created")
                

                let  updateuser =  await tx.user.update({
                    where:
                        {id : req.user.id},
                    data :{
                        totalBookings:{
                            increment:1
                        }
                }})

                return {
                    newBooking,
                    user: updateuser, 
                    transaction : transactionData
                }


            })

                await client.set(
                    `user:${result.user.id}`,
                    JSON.stringify(result.user),
                    {
                        EX: 10 * 60
                    }
                );

                    return res.status(200).json({
                        success: true,
                        booking: result.newBooking,
                        user : result.user,
                        message: "Booking conformed",
                    });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message:error.message})
    }
}
