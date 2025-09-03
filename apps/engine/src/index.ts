import {createClient} from 'redis';
import { price } from './store/store';
import {  Incomingmessage } from './type';

const client = createClient();



async function start() {
    await client.connect();
    client.pSubscribe("*",(message,channel)=>{
        const msg:Incomingmessage= JSON.parse(message)
        console.log(msg)
        price[msg.asset] = {
            price:msg.price,
            decimal:msg.decimal
        }
    })
}

start()