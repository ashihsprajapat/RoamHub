import connectToCloudinary from "./config/cloundinary.js"
import { consumer, producer } from "./config/Kafka.js"
import connectToDataBase from "./config/mongooseDB.js"
import client from "./config/Redis.js"
import { NotificationProducer } from "./Notification/Producer/NotificationProducer.js"
import { notificationTypes } from './Notification/Event/notificationTypes.js';
import { NotificationConsumer } from './Notification/Consumer/notificationConsumer.js';

 

const test=async()=>{
    const notificationProducter= new NotificationProducer()
    console.log("test function run ")
    await  notificationProducter.publish({
        type : notificationTypes.SEND_OTP,
        email:"abhishekpal508@gmail.com",
        otp:"124522",
        name:"Abhishek Pal"
    })
    .then(()=>{
        console.log("test function run successfull")
    })
    .catch((e)=>{console.log(e)})
}


export const startServerF= async()=>{
    try {

        await producer.connect()
        console.log("✅ Kafka Producer Connected");

        await consumer.connect()
        console.log("✅ Kafka Consumer Connected");

        await connectToCloudinary()
        console.log(" ✅ Connect to claudinary")

        await client.connect()
        console.log(" ✅ Connecting to redis")

        await connectToDataBase()
        console.log("✅ Connect to Database")

        const notificationConsumer = new NotificationConsumer()
        await notificationConsumer.start();

       // await test();
        
    } catch (error) {
        console.log("error in starter ",error)
    }
}