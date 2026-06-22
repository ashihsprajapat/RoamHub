import cloudinary from 'cloudinary';
import Listing from './listingModel.js';
import client from '../config/Redis.js';
import {templetListingCreate, transport} from '../config/NodeMailer.js'
import User from '../User/userModel.js';
import { prisma } from '../lib/prisma.js';


//get all listings
export const getAllListings = async (req, res) => {
    try {
        const Listings = await Listing.find({});
        res.json({ success: true, Listings });

    } catch (err) {
        console.log(err.message)
        res.json({ success: false, message: err.message })
    }
}

//get a single listing by id
export const getListingById = async (req, res) => {
    const { id } = req.params;
    const {booking}= req.query;
    
    try {
        let listing;
        const Redlisting= await client.get(`Listing:${id}`);
        
        if(Redlisting){
            listing= JSON.parse( Redlisting);
        }else{
            listing = await Listing.findById(id)
                if (!listing) {
                    return res.status(404).json({ success: false, message: "Listing not found " })
                }
            
            await client.set(`Listing:${id}`, JSON.stringify(listing), {EX: 60 * 5})
        }

        const reviews = await prisma.review.findMany({
            where:{
                listingId : id
            },
            include:{
                user : {
                select:{
                    name:true,
                    email:true,
                    id:true
                }}
            },
            orderBy :{
                rating:'desc'
            },
            take : 5
        })

        let bookings= null;
        if(booking){
            let today = new Date();
            bookings= await prisma.booking.findMany({
                where:{
                    listingId : id,
                    to:{
                        gte: today
                    }
                },
                select:{
                    from:true,
                    to:true
                }
            })
        }
        const response = {
            listing,
            reviews,
            bookings
        }
        res.json({ success: true, response })
    } catch (err) {
        console.log(err)
        res.json({ success: false, message: err.message })
    }
}


//update listing by id and new data
export const updateListing = async (req, res) => {
    console.log("req is comming for update listing")
    const { title, description, price, address, location, country } = req.body;
    

    const user = req.user;
    const { id } = req.params;
    try {
        const listing = await Listing.findById(id);
        if(!listing)
            return res.status(404).json({success:false, message:"Listing is not found "})
        
        if ( user.totalPublicListings == 0 ||  user.id !== listing.owner) {
            return res.status(400).json({ success: false, message: "you are not onwer of this listing" })
        }

        const imageFile = req.files;
        let updateListing ;
        if (!imageFile) {

        updateListing =  await Listing.findByIdAndUpdate(id, {
                title, description, price, location, country,
                address
            })
        }else{

        const image = listing.image ;

        for(let img of imageFile){
            const imageUpload = await cloudinary.uploader.upload(img.path)
            image.push({
                filename: imageUpload.filename,
                url: imageUpload.secure_url,
                public_id : imageUpload.public_id
            })
        }   


        updateListing= await Listing.findByIdAndUpdate(id, {
            title, description, price, location, country, image,
            address
        })
        }
        const reviews = await prisma.review.findMany({
            where:{
                listingId : id
            },
            orderBy :{
                rating:'desc'
            },
            take : Math.min(5, listing.reviewsCount)
            })
       
        let exist = await client.exists(`Listing:${updateListing._id}`)
        if(exist)
            await client.set(`Listing:${updateListing._id}`, JSON.stringify({listing : updateListing, reviews}), {EX: 60 * 5});

        res.status(200).json({ success: true, updateListing , message: "listing update successfully" })

    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }

}




//delete listing 
export const deleteListing = async (req, res) => {
    let user= req.user
    
    const { id } = req.params;
    try {

        const listing = await Listing.findById( id);
        
        if (!listing) {
            return res.json({ success: false, message: "listing not exist " })
        }

        if( user.totalPublicListings === 0  ||  listing.owner !== user.id ){
            return res.json({success:false,  message:"Your are not owner of this listing "})
        }

        console.log("delete image from cloudinary ")

        for(let img of listing.image){
            await cloudinary.uploader.destroy(img.public_id);
        }

        const deleteListing  = await Listing.findByIdAndDelete(id);

        await prisma.user.update({where :{email : user.email}, data : {totalPublicListings : user.totalPublicListings -1}})
        user.totalPublicListings--

         await client.set(`token:${user.id}`, JSON.stringify( user ) , {EX : 12 * 60})


        res.status(200).json({ success: true, user ,  message: "listing is deleted Sucessfully " })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }

}

//create listing
export const createListing = async (req, res) => {
    console.log("come in main Controller function ")
    let  { title,   description, price, address, location, country,  category } = req.body;
    
    
    const user = await prisma.user.findUnique({where : {id : req.user.id}});
    address= JSON.parse(address);

    try {
        //  console.log(req.files)
        const imageFiles = req.files;

        const image = [];

        for (const imageFile of imageFiles) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path)


            image.push({
                filename: imageUpload.originalname,
                url: imageUpload.secure_url,
                public_id: imageUpload.public_id
            })
        }

        const newListing = new Listing({
            title ,
            description,
            price,
            location, 
            country,
            image,
            owner:user.id,
            address,
            category
        })

        await newListing.save();
        
        await prisma.user.update({where : {email : user.email}, data :{totalPublicListings : user.totalPublicListings +1}});
        user.totalPublicListings++;

        await client.set(`token:${user.id}`, JSON.stringify( user), {EX : 12 * 60})
        res.json({ success: true, newListing, user, message:"Listing create successfully" })

        const content= templetListingCreate(newListing._id, user.email,  newListing)
        const info= await transport.sendMail(content);

        const exists = await client.exists("Listing");

        await  client.lPush('Listing', JSON.stringify( newListing));
        if(!exists)
            await client.expire("Listing",12* 60);
        
        
    } catch (err) {
        console.log(err)
        res.json({ success: false, message: err.message })
    }
}


export const getAllListingHostByUser = async (req, res) => {

    try {
        const user = req.user;
        const id = user.id;
        console.log("user id is", id)
        // const listing= await client.lRange(`userListing:${_id}`, 0 , -1);
        
        // if(listing.length   > 1){
        //     const Listings= listing.map((list)=> JSON.parse(list))
        //     return res.json({ success:true, Listings})
        // }
        const Listings = await Listing.find({ owner: id });
       // for(let l of Listings){
            
        // await client.lPush(`userListing:${_id}`, JSON.stringify(l));
        // }
        //await client.expire(`userListing:${_id}`, 300)
        res.json({ success: true, Listings });
        
    } catch (err) {
        console.log(err)
    }

}


export const deleteImageLiting = async(req,res)=>{
    try{
        console.log("In delete Listing iamge ")
        const {id}= req.params;
        let listing = await Listing.findById(id);
        if(!listing)
            return res.status(404).json({message:"Listing not found"})

        const user = req.user;
        const {imageRemove}= req.body;
        console.log("iamge remove is ",imageRemove)

        if(!imageRemove)
            return res.status(400).json({message:"ImageRemove is required"})

        if(imageRemove.length >= listing.image.length )
            return res.status(400).json({message:"one image leave"})
        const newImage =[]


        for(let img of listing.image){
            let safe= true;
            for(let rem of imageRemove){
            
                if(String(img._id) === rem ){
                    safe =false;
                    break;
                }
            }
            if(safe)
                newImage.push(img)
            else{
                await cloudinary.uploader.destroy(img.public_id);
            }
        }
        console.log("new Image push is ", newImage)

        listing.iamge = [...newImage];
        await listing.save();
        res.status(200).json({message:"Image remvoed", listing})

    }catch(err){
        console.log(err)
        res.status(500).json({message:err.message})
    }
}