import Transaction from "./transaction.model.js";
import Razorpay from "razorpay";
import User from '../User/userSchema.js';
import { prisma } from "../lib/prisma.js";
import Listing from "../Listings/listingModel.js";

//getway initailize
const razorpayInstance = new Razorpay({
    key_id: process.env.ROZORPAY_ID,
    key_secret: process.env.ROZORPAY_SECRET,
});

//api to make payment  for credits
export const paymnetRazorPay = async (req, res) => {
    try {
        const { totalAmount, paymentType } = req.body;

        const {user} = req;
        const { id: listingId } = req.params;


        const listing = await Listing.findById(listingId);
        if(!listing)
                return res.status(404).json({message:"Listing not found"})

        if(listing.isBook)
            return res.status(400).json({message:"Listing is Already Booked"})
        console.log("req body is", req.body)
        
        if ( totalAmount === null || ! paymentType )
            return res.json({ success: false, message: "Missing Details" });

        //return res.json({message:"return from here"})

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
            receipt: transaction.id
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
//e1ede6d4-621a-4fee-a4b2-5392be432d9c

//api controller finction to verify razorpay payment verifu
export const verifyRazorpay = async (req, res, next) => {
   
    try {
        const { razorpay_order_id, from , to , totalAmount, TotalNights, pernightCharge  } = req.body;
       
        let guests = [
            {
                name:"Ashish",
                age:21,
                gender:"Male"
            },
            {
                name:"Anisha",
                age:23,
                gender:"FeMale"
            }
            , {
                name:"Vishal",
                age:19,
                gender:"Male"
            }
        ]
        if (!razorpay_order_id)
            return res.json({ success: false, message: "razorpay_order_id is requried" })

        const orderinfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        console.log("Orderinfo of razorPay", orderinfo)

        if (orderinfo.status === 'paid') {

            let transactionData = await prisma.transaction.findUnique({where:{id : orderinfo.receipt}})
            console.log("getting trnasaction from trnas", transactionData)

            console.log("Update trnasaction paymentstatus")

            transactionData =  await prisma.transaction.update({where:{id : transactionData.id},
            data:{
                paymentStatus : "SUCCESS"
            }})

            let user = await prisma.user.findUnique({where : {id : String(req.user.id)}})
            console.log("user from db ", user)
            const listingId = transactionData.listingId
            const listing = await Listing.findById(listingId);
                    
            const newBooking = await prisma.booking.create({
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
                }
            })
            for(let g of guests ){
                await prisma.guest.create({data:{
                    name : g.name,
                    age : g.age,
                    gender : g.gender,
                    bookingId : newBooking.id
                }})
            } 
            console.log("user is updating totalBooking ")
            console.log("user value", user)
            let  updateuser =  await prisma.user.update({
                    where:
                        {id : user.id},
                    data :{
                        totalBookings : user.totalBookings + 1
                    }})
                    
            
                    console.log("listing isBook update")
                    listing.isBook = true;
                    listing.currentBooking.push( newBooking.id);
                    await listing.save();
                    
            
                    return res.status(200).json({
                        success: true,
                        booking: newBooking,
                        user : updateuser,
                        message: "Booking conformed"
                    });
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message:error.message})
    }
}
