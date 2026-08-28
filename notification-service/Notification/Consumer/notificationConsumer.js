
import { admin, consumer } from './../../config/Kafka.js';
import { topic } from './../Event/topics.js';
import { disPechHandler } from './../DisPechHandler.js';


export class NotificationConsumer {

    async start(){
        try {
            await admin.connect()
            await admin.createTopics({
                waitForLeaders: true,
                topics: [{ topic: topic.NOTIFICATION_TOPIC, numPartitions: 1, replicationFactor: 1 }]
            });
            await admin.disconnect();

            await consumer.connect();
            await consumer.subscribe({
                topic: topic.NOTIFICATION_TOPIC,
                fromBeginning : false
            })
            console.log("✅ Notification Consumer Started");

            await consumer.run({
                eachMessage : async({topic , partition, message})=>{
                    try {
                        const event= JSON.parse(message.value.toString())
                        console.log("\n===============================");
                        console.log("📩 New Notification Received");
                        console.log("===============================");

                      
                        await disPechHandler(event);
                        console.log("✅ Event processed successfully and called to dispechHnadle");

                    } catch (error) {
                        console.log("error is process each mesage",error)
                    }
                }
            })
            
        } catch (error) {
            console.error("Consumer Error");
            console.error("error in consumer listener",error);
            throw error;
        }
    }
}