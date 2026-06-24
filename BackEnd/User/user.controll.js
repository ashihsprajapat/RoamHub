
import bcrypt from 'bcrypt'


import { generateToekn } from './../utils/tokenGenret.js';

import { optGernate } from './../utils/optGererate.js';
import { transport , templetOTPMail } from '../config/NodeMailer.js';
import client from '../config/Redis.js';
import { prisma } from '../lib/prisma.js';


//user register
export const userRegister = async (req, res) => {

    const { name, email, password } = req.body;

    
    try {
    
        const user = await prisma.user.findUnique({
            where:{ email}
        })
        if (user)
            return res.status(400).json({ success: false, message: "email is already exist" })
        const hashpassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create ({
            data:{
                name,
                email,
                password: hashpassword
            }
            
        })

        
        res.status(201).json({ success: true, message: "user register successfull", token: generateToekn(newUser.id) })

    } catch (err) {
        console.log(err.message)
        res.status(500).json({ success: false, message: err.message })
    }

}


//login
export const userLogin = async (req, res) => {

    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({where:{email}})
        if (!user)
            return res.status(400).json({ success: false, message: "email not exist" })
      

        const match = await bcrypt.compare(password, user.password);
        if (!match)
            return res.json({ success: false, message: "wrong password" })
        
        
        res.status(200).json({
            success: true,
            message: "Login success full",
            token: generateToekn(user.id),
        })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }

}


//get user data

export const getUserData= async(req,res, next)=>{
    res.status(200).json({success:true, user : req.user});
}

//sending email 
export const otpsend= async(req, res)=>{
    try {
        const user= req.user;
        const otp = optGernate()
        let val= await  client.set(`otp:${user.id}`, otp, {EX : 3*60} )
        console.log("send email and otp is --->", otp)
        const content= templetOTPMail(user.email, otp)

        const result= await transport.verify();
        console.log("VERIFY RESULT:", result);
        
        const info = await transport.sendMail(content)
        console.log("info after sending mail", info)
        if(info.rejected.length  > 0)
            return res.json({message:"Something went wrong", success:false})
        
        res.json({success:true, message:"opt save Success full "})
        
        
        
    } catch (error) {
        console.log("email error occurr which is ------->",error)
        res.json({message:error.message, success:false})
    }
}

//verify user email
export const verifyEmail= async(req,res)=>{
    try{
        const {otp}= req.body;
        if(!otp  )
            return res.json({success:false, message:"Please give me otp"})

        let user = req.user;

        
        let val= await client.get(`otp:${user.id}`)
        if(!val)
            return res.status(200).json({message:"Otp is expire", success: false})
        

        if(JSON.parse(val) !== JSON.parse(otp))
            return res.json({message:"Wrong Otp", success:false})
        
        
        user = await prisma.user.update({
            where:{email:user.email} ,
            data:{
                verify : true
            }
        });
        
        await client.expire(`otp:${user.id}`, 3)
        await client.set(`token:${user.id}`, JSON.stringify(user),{EX:20*60}) // 20 minit

        res.json({success:true, message:"Email verify success", user})
        
    }catch(err){
        console.log(err)
        res.json({message:err.message, success:false})
    }
}