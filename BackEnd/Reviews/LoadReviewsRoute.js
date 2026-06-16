
import  express  from 'express';
import { prisma } from '../lib/prisma.js';

const LoadRoute = express.Router();


LoadRoute.route("/:id")
    .get( async(req, res)=>{
        try {
        
        const {id} = req.params;
        const {skip, take}= req.body;
        console.log(take ,skip)

        if(skip === undefined  | undefined === take)
            return res.status(400).json({message:"Missing Details"})
        const reviwes = await prisma.review.findMany({
            where:{
                listingId : id
            },
            orderBy:{
                rating : 'desc'
            },
            skip,
            take 
        })
        res.status(200).json({reviwes})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})


export default LoadRoute;