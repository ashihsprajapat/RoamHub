
import dotenv from "dotenv"
dotenv.config();




import express from "express";
import connectToCloudinary from "./config/cloundinary.js";
import cors from 'cors'

import  client from './config/Redis.js'
import {transport} from './config/NodeMailer.js'
import { prisma } from "./lib/prisma.js";
import { protectListing, verifyEmail } from "./middleware/protectListing.js";
import LoadRoute from "./Reviews/LoadReviewsRoute.js";

//route for review
import revieRoute from './Reviews/review.rout.js'

//route for user authentication
import userRoute from './User/User.routes.js'

//routes for listing
import ListingRoute from "./Listings/listing.route.js";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


const allowedOrigins = ['http://localhost:5173',  'https://roam-hub-eight.vercel.app' , 'https://air-bnb-booking-app-psi.vercel.app']; // Add production domain here

app.use(cors({
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,  // Allow credentials (cookies) to be sent
}));
const port = process.env.PORT || 3030;

app.listen(port, () => {
  console.log("app is listening on port", port);
})

import connectToDataBase from "./config/mongooseDB.js";
import bookingRout from "./Booking/booking.rout.js";
import transactionRoute from "./Transaction/transacation.rout.js";
import { startServerF } from "./startServer.js";


await startServerF()



app.get("/", (req, res) => { res.send( "Api is working fine" ) })




//routes for listing
app.use("/listing", ListingRoute);

//router for revie
app.use("/reviews",  protectListing, verifyEmail,  revieRoute)


//route for user login and register
app.use("/auth", userRoute)

app.use("/loadReviews", LoadRoute )

app.use("/booking",  protectListing, verifyEmail,  bookingRout)

app.use("/transaction", protectListing, verifyEmail,   transactionRoute)

