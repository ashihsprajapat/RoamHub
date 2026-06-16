

import express from 'express'
import { protectListing, verifyEmail } from '../middleware/protectListing.js';
import { paymnetRazorPay, verifyRazorpay } from './transaction.controller.js';
import { createBooking } from '../Booking/booking.controller.js';

const transactionRoute= express.Router();


//api to make payment  for credits
transactionRoute.post("/payment/:id", paymnetRazorPay)

transactionRoute.post("/verify",  verifyRazorpay)


export default transactionRoute;