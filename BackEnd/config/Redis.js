
import { createClient } from 'redis';

const client = createClient({
    username: 'default',
    password: '5MX2jLruCWD9k1msAIYzNwbXqCTSQSVZ',
    socket: {
        host: 'redis-14781.c301.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 14781
    }
});

client.on('error', err => console.log('Redis Client Error', err));

await client.connect()
.then(()=>console.log("Connecting to redis"))

//await client.set('foo', 'bar');
// const result = await client.get('foo');
// console.log(result)  // >>> bar

export default client;

