
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { NotificationConsumer } from './Notification/Consumer/notificationConsumer.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Notification service is running');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Notification service is running on port ${PORT}`);
});


const notificationConsumer = new NotificationConsumer()
await notificationConsumer.start().then(() => {
    console.log("Notification Consumer started successfully");      
}).catch((error) => {
    console.error("Error starting Notification Consumer:", error);
}  )     