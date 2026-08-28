import dns from "node:dns";
import { Kafka } from "kafkajs";
import dotenv from 'dotenv';
dotenv.config();

dns.setDefaultResultOrder("ipv4first");

let broker = process.env.KAFKA_BROKER;
console.log("broker", broker)

export const kafka = new Kafka({
    clientId: "roamhub-backend",
    brokers: [process.env.KAFKA_BROKER],
    ssl: {
    rejectUnauthorized: process.env.KAFKA_SSL_REJECT_UNAUTHORIZED !== "false",
    },
    sasl: {
    mechanism: "plain",
    username: process.env.KAFKA_USERNAME,
    password: process.env.KAFKA_PASSWORD,
  },
});

export const producer = kafka.producer();

export const consumer = kafka.consumer({
    groupId: "notification-group",
});

export const admin = kafka.admin();
