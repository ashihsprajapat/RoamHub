
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import User from '../User/userModel.js';
dotenv.config();
import client from './../config/Redis.js';
import { prisma } from '../lib/prisma.js';

export const protectListing = async (req, res, next) => {

    const {authorization} = req.headers

    if(!authorization){
            return res.status(400).json({message:"Token is required"})
    }
    const token = authorization.substring(7);
    
    if (!token) {
        return res.json({ success: false, message: "User not register" })
    }
    try {

        const decode = jwt.verify(token, process.env.JwT_SECRET)
        if(!decode.id)
            return res.status(400).json({message : "Invalid Token"})

        const cachedUser = await client.get(`token:${decode.id}`)
        
        if(cachedUser ){
            req.user= JSON.parse(cachedUser)
            return next();
        }
        const user = await prisma.user.findFirst({where : {id : decode.id}})
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        
        }
        const { password, ...userWithoutPassword } = user;
        req.user= userWithoutPassword;
        if(user.verify)
            await client.set(`token:${user.id}`, JSON.stringify(userWithoutPassword),{EX:20*60 })

        next();
    } catch (err) {
        console.log(err)
        res.json({ success: false, message: err.message });
    }

}

export const verifyEmail=async(req,res,next)=>{
    try {
        const user= req.user;
        if(!user.verify){
            return res.json({message:"Please verify Email", success:false})
        }
        next();
    } catch (error) {   
        
    }
}

