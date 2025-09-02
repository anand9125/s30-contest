import {createClient} from "redis";

export const client = createClient();

export const connectRedis = async()=>{
    await client.connect();
}