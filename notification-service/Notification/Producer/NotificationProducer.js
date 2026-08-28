import { producer } from "../../config/Kafka.js";
import { topic } from './../Event/topics.js';


export  class NotificationProducer{
    async publish(event) {
        try {
            await producer.send({
                topic : topic.NOTIFICATION_TOPIC,
                messages:[{
                    value: JSON.stringify(event)
                }]
            })
            console.log("✅ Notification Published");
        } catch (error) {
            console.error("❌ Kafka Publish Error");

            console.error(error);

            throw error;
        }
    }
};

