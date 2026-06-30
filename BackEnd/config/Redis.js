
import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config()


const client = createClient({
    username: process.env.RedisUserName,
    password: process.env.RedisPassword,
    socket: {
        host: process.env.RedisSocket,
        port: 14781
    }
});

client.on('error', err => console.log('Redis Client Error', err));



export default client;

