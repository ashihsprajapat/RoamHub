import connectToCloudinary from "./config/cloundinary.js"
import connectToDataBase from "./config/mongooseDB.js"
import client from "./config/Redis.js"


export const startServerF= async()=>{
    try {

        await connectToCloudinary()
        console.log("Connect to claudinary")

        await client.connect()
        console.log("Connecting to redis")

        await connectToDataBase()
        console.log("Connect to Database")

        
    } catch (error) {
        console.log("error in starter ",error)
    }
}