

import { Booking } from "./bookingModel.js";
import Listing from "../Listings/listingModel.js";
import { prisma } from "../lib/prisma.js";


export const createBooking = async (req, res) => {
    try {
       

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error creating booking",
            error: err.message
        });
    }
}



export const cancelBooking = async (req, res) => {
    try {

        const user = req.user;
        const { listingId, bookingId } = req.params;

        const { paymentStatus } = req.body;

        let listing = await Listing.findById(listingId);
        let booking = await Booking.findById(bookingId)
        if (!listing || !booking) {
            return res.json({ success: false, message: "Air bnb is not found" })
        }

        if (paymentStatus === 'cancelled') {

            listing.isBook = null;
            listing.currentBooking = null

            await listing.save();

            await Booking.findByIdAndDelete(bookingId)

            return res.json({ success: false, message: "Booking cancell" })

        } else if (paymentStatus === 'confirmed') {
            booking.paymentStatus = 'confirmed'
            await booking.save()

            return res.json({ success: false, message: "Booking confirmation successfully" })
        }


    } catch (err) {
        res.json({ success: false, message: err.message })

    }
}

export const getAllBookingByUser= async(req, res)=>{
    try {
        const {user}= req
        const bookings= await Booking.find({guest: user._id}).populate("listing")

        res.json({success:true, message:"All bookings", bookings})

    } catch (error) {
        console.log(error.message)
        res.json({success:false, message:error.message})
    }
}

export const getAllBookingsOfListing= async(req, res )=>{
    console.log("req is comming for booking")
    const listingId = req.params.id;
    try {
        const bookings=  await prisma.booking.findMany({
            where : {
                listingId
            }
        })
        console.log("All Booking of this listing ",bookings)
        res.status(200).json({bookings})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message:error.message})  }
}