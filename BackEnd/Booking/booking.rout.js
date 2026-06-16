
import express from "express";
import { protectListing } from '../middleware/protectListing.js';
import {  cancelBooking,getAllBookingsOfListing, getAllBookingByUser,createBooking } from "./booking.controller.js";
const bookingRout= express.Router()


//bookingRout.post("/createBooking/:listingId", protectListing, createBooking)


bookingRout.delete("/cancellBooking/:bookingId/:listingId", cancelBooking)

bookingRout.get("/user-bookings", getAllBookingByUser)

bookingRout.get("/:id", getAllBookingsOfListing);


export default bookingRout;