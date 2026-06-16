
import Review from './reviewModel.js';
import Listing from '../Listings/listingModel.js';
import { prisma } from '../lib/prisma.js';
import client from '../config/Redis.js';

//create a review for a listing
export const createReview = async (req, res) => {

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

        // const newReview = new Review({
        //     rating, comment, onwer: user._id,
        //     ownerName: user.name
        // })
        const newReview = await prisma.review.create({
            data:{
                rating,
                comment,
                userId : user.id,
                listingId : id
            }
        })
        listing.reviewsCount ++;

        await listing.save();
        res.status(201).json({ success: true, newReview,  message: "review is create" })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}


//delte a revie for a listing
export const deleteRevie = async (req, res) => {
    
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
        console.log("deleted Reviews is ", deleteRev)
        if(!deleteRev)
            return res.status(400).json({message:'reviews not found'})
        
        const listing= await Listing.findByIdAndUpdate(Lid, {
            $inc:{
                reviewsCount : -1
            }
            
        },{
                new:true
            })
        
       // await client.set(`Listing:${Lid}`, Listing)
        res.json({ success: true, message: "review is deleted", deleteRev })

    } catch (err) {
        res.json({ success: false, message: err.message })
    }
}