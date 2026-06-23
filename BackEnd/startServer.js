import connectToCloudinary from "./config/cloundinary.js"
import connectToDataBase from "./config/mongooseDB.js"
import { transport } from "./config/NodeMailer.js"
import client from "./config/Redis.js"


export const startServerF= async()=>{
    try {

        await connectToCloudinary()
        console.log("Connect to claudinary")

        await client.connect()
        .then(()=>console.log("Connecting to redis"))


        await  transport.verify()
        console.log("connect to nodemail ")

        await connectToDataBase()
        console.log("Connect to Database")
        
    } catch (error) {
        console.log(error)
    }
}