
import WebSocket from "ws";
import { client, connectRedis } from "./redis";
const PRICE_CHANNEL = "price_updates";
const ws = new WebSocket("wss://ws.backpack.exchange");
type message ={
      data: {
    E: number,
    T: number,
    e: 'string',
    f: 'string',
    i: 'string',
    n: number,
    p: 'string',
    s: 'string'
  }
}

connectRedis();

ws.on("open", () => {
  ws.send(JSON.stringify({method:"SUBSCRIBE",params:["markPrice.SOL_USDC_PERP","markPrice.BTC_USDC_PERP","markPrice.ETH_USDC_PERP"],id:1}));
  //{"method":"SUBSCRIBE","params":[],"id":1}
  //{"method":"SUBSCRIBE","params":[],"id":1}
});
let SOL_USDC_PERP:message;
let ETH_USDC_PERP:message;
let BTC_USDC_PERP:message;

ws.on("message", async (data) => {
  try {
    const message = JSON.parse(data.toString());

    if(message.stream == 'markPrice.SOL_USDC_PERP'){
        SOL_USDC_PERP = message.data.p

    }else if(message.stream == 'markPrice.BTC_USDC_PERP'){
      ETH_USDC_PERP = message.data.p

    }else if(message.stream == 'markPrice.ETH_USDC_PERP'){
      BTC_USDC_PERP = message.data.p
    }
    console.log(" Message:", message);
    setInterval(()=>{
        async function startPublishing(){
            await client.publish(PRICE_CHANNEL, JSON.stringify({
                SOL_USDC_PERP,
                ETH_USDC_PERP, 
                BTC_USDC_PERP
            }));
        }
     startPublishing()
    },100)
  } catch (err) {
    console.error(" Failed to parse message", err);
  }
});
