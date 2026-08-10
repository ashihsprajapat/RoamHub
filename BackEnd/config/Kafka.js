

let broker= process.env.KAFKA_BROKER
console.log(" broker ",broker)

import { Kafka } from "kafkajs";

export const kafka = new Kafka({
    clientId: "roamhub-backend",
    brokers: [process.env.KAFKA_BROKER],
});

export  const producer = kafka.producer();

export  const consumer = kafka.consumer({
    groupId: "notification-group",
});
    
