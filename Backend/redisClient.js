import { createClient } from "redis";

let client;

const connectRedis = async () => {
    client = createClient({
        url: process.env.REDIS_URL,
    });

    client.on("error", (err) => console.log("Redis Client Error", err));
    await client.connect()
    console.log("Redis Connected Successfully !!");
};

export default connectRedis;
export { client };