
import Review from './reviewModel.js';
import Listing from '../Listings/listingModel.js';
import { prisma } from '../lib/prisma.js';
import client from '../config/Redis.js';

//create a review for a listing
export const createReview = async (req, res) => {
    console.log("req is comming for creating reviews")
    const { rating, comment } = req.body;
    if(!rating || !comment)
        return res.status(400).json({message:"missing Details"})

    if(rating<0 || rating > 5 || comment.length < 2 )
        return res.status(400).json({message:"wrong detils"})

    const user = req.user;

    const { id } = req.params;
    try {
        const listing = await Listing.findById(id);
        if (!listing)
            return res.status(404).json({ success: false });

        const newReview = await prisma.review.create({
            data:{
                rating,
                comment,
                userId : user.id,
                listingId : id
            }
        })
        listing = await Listing.findByIdAndUpdate(id, {
            $inc:{
                reviewsCount : 1
            }
        })
        newReview.user={
            name: user.name,
            email : user.email,
            id : user.id
        }
        await client.set(`Listing:${id}`, JSON.stringify(listing), {EX : 5 * 60})
        res.status(201).json({ success: true, newReview,  message: "review is create" })
    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: err.message })
    }
}


//delte a revie for a listing
export const deleteRevie = async (req, res) => {
    console.log("delete req comming")
    const { Lid, Rid } = req.params;

    const user = req.user;
    try {
        
        const deleteRev= await prisma.review.delete({
            where:{
                id :Rid, 
                userId : user.id,
                listingId : Lid
            }
        })
        if(!deleteRev)
            return res.status(400).json({message:'reviews not found'})
        
        const listing= await Listing.findByIdAndUpdate(Lid, {
            $inc:{
                reviewsCount : -1
            }
            
        })

        console.log("listing decrease", listing)
        
        await client.set(`Listing:${listing._id}`, JSON.stringify(listing),{EX : 5 * 60})
        res.json({ success: true, message: "review is deleted", deleteRev })

    } catch (err) {
        res.json({ success: false, message: err.message })
    }
}