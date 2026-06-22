

import express from 'express'
import { protectListing, verifyEmail } from '../middleware/protectListing.js';
import { paymnetRazorPay, verifyRazorpay } from './transaction.controller.js';
import { createBooking } from '../Booking/booking.controller.js';
import { transactioncreateSchema, transactionVerifySchma } from './validateschemaTransaction.js';

import { validate } from '../middleware/Validate.js';

const transactionRoute= express.Router();


//api to make payment  for credits
transactionRoute.post("/payment/:id" ,    validate(transactioncreateSchema) ,  paymnetRazorPay)

transactionRoute.post("/verify",  validate(transactionVerifySchma) ,   verifyRazorpay)


export default transactionRoute;