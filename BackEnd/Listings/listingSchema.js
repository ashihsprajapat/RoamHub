import { Schema } from "mongoose";
//const Review
import User from "../User/userModel.js";

const listingSchema = new Schema({
    owner: {
        type: String ,
        required:true
    },
    title: { type: String, required: true, },
    date: { type: Date, default: Date.now(), },
    location: { type: String, required: true, },
    address: {
        country: { type: String, },
        float: { type: String },
        streetAddress: { type: String },
        NearByLandMark: { type: String },
        District: { type: String, },
        city: { type: String, },
        state: { type: String },
        pinConde: { type: String },
    },
    category: { type: String },
    description: { type: String, required: true },


    price: { type: Number, required:true },
    
    image: [{
        filename: String,
        url: {
            type: String,
            default: 'https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTIzNjE1MDExMTUxNzU5ODEyNw%3D%3D/original/19b0b33e-6a94-43c3-9ec7-48bfb79be8c8.jpeg?im_w=720&im_format=avif',
        },
        public_id:String

    }],

    reviewsCount : {type : Number, default : 0},
    
    createdAt: {
        type: Date,
        default: Date.now
    },

}, {timestamps : true})
export default listingSchema;