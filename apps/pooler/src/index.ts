
import WebSocket from "ws";
import { client, connectRedis } from "./redis";

const ws = new WebSocket("wss://ws.backpack.exchange");
type message ={
  
    A: "string",
    "B": "string",
    "E": number,
    "T": number,
    "a": "string",
    "b": "string",
    "e": "string",
    "s": "string",
    "u": number
  
}

connectRedis();

ws.on("open", () => {
  ws.send(JSON.stringify({method:"SUBSCRIBE",params:["bookTicker.SOL_USDC_PERP","bookTicker.BTC_USDC_PERP","bookTicker.ETH_USDC_PERP"],id:2}));
  //{"method":"SUBSCRIBE","params":[],"id":1}
  //{"method":"SUBSCRIBE","params":[],"id":1}
});
let SOL_USDC_PERP:message;
let solPrice:string;
let solDecimalPLace:number;
let ETH_USDC_PERP:message;
let ethPrice:string;
let ethDecimalPLace:number;
let BTC_USDC_PERP:message;
let btcPrice:string;
let btcDecimalPLace:number;

ws.on("message", async (data) => {
  try {
    const message = JSON.parse(data.toString());
    console.log(message.data);
    

    if(message.stream == 'bookTicker.SOL_USDC_PERP'){
        SOL_USDC_PERP = message.data
        solPrice = SOL_USDC_PERP.a
        solPrice = solPrice.replace(".",'');
        solDecimalPLace=SOL_USDC_PERP.a.split(".")[1].length
        

    }else if(message.stream == 'bookTicker.BTC_USDC_PERP'){
      ETH_USDC_PERP = message.data
      ethPrice = ETH_USDC_PERP.a
      ethPrice = ethPrice.replace(".",'');
      ethDecimalPLace=ETH_USDC_PERP.a.split(".")[1].length

    }else if(message.stream == 'bookTicker.ETH_USDC_PERP'){
      BTC_USDC_PERP = message.data
      btcPrice = BTC_USDC_PERP.a
      btcPrice = btcPrice.replace(".",'');
      btcDecimalPLace=BTC_USDC_PERP.a.split(".")[1].length   //first it will split in form of arary ['4312', '57']  of two value ,decimal ke bad ka part and pahle ka part phir dursa wale part ka lenght is what decimal
    }
  
    setInterval(()=>{
        async function startPublishing(){
            await client.publish("price_updates", JSON.stringify([{
              "asset":"SOL_USDC_PERP",
              "price":solPrice,
              "decimal":solDecimalPLace
            },{
              "asset":"ETH_USDC_PERP",
              "price":ethPrice,
              "decimal":ethDecimalPLace
            },{
              "asset":"BTC_USDC_PERP",
              "price":btcPrice,
              "decimal":btcDecimalPLace
            }]));
        }
     startPublishing()
    },100)
  } catch (err) {
    console.error(" Failed to parse message", err);
  }
});
