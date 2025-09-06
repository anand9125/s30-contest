import {w3cwebsocket as W3CWebsocket} from "websocket";
import {createClient} from "redis";

const ws=new W3CWebsocket('wss://ws.backpack.exchange/');
const publisher=createClient({url:"redis://localhost:6379"})

const liveData:{asset:string; price:number,decimal:number}[]=[];
const bidAskData:{asset:string; bid:number,ask:number}[]=[];
async function connect(){
    try{
        await publisher.connect();
        console.log("connected to redis");

    }catch(err){
        console.log("Redis connection failed",err)
    }
    
    ws.onopen=()=>{
        console.log("Connected to Backpack api");
        ws.send(JSON.stringify(
            {
                method:"SUBSCRIBE",
                params:[ "bookTicker.SOL_USDC_PERP", "bookTicker.BTC_USDC_PERP", "bookTicker.ETH_USDC_PERP"]
            }
        ))
        runTrades();
    }

    ws.onmessage=(event)=>{
        const msg=JSON.parse(event.data.toString());
        console.log(msg);
        let price = msg.data.a;
        let decimal:number;
        price = price.replace('.', '');
        decimal =msg.data.a.split('.')[1].length;

        const trade={
            asset:msg.data.s,
            price:price,
            decimal
        }
        const BidAskdata = {
            asset:msg.data.s,
            bid:msg.data.b,
            ask:msg.data.a
        }
        const existingBidAskEntry=bidAskData.find(d=>d.asset===trade.asset);

        if(existingBidAskEntry){
               existingBidAskEntry.bid=BidAskdata.bid;
               existingBidAskEntry.ask=BidAskdata.ask;
        } 
        else bidAskData.push(BidAskdata)

        const existingEntry=liveData.find(d=>d.asset===trade.asset);

        if(existingEntry){
               existingEntry.price=trade.price;
               existingEntry.decimal=trade.decimal;
        } 
        else liveData.push(trade)
    }

    ws.onclose=()=>{
        console.log("Disconnected from backapck")
    }
}

function runTrades(){
        setInterval(sendTrades,100);
}

async function sendTrades() {
//   const id = await publisher.xAdd(
//     "tradesFromPooler", 
//     "*",                
//     { priceOfTrade: JSON.stringify(liveData) } 
//   );
//   console.log("Produced:", id, liveData);
  const id2 = await publisher.xAdd(
    "bidaskFromPooler", 
    "*",                
    { bidask: JSON.stringify(bidAskData) } 
  );
  console.log("Produced:", id2, bidAskData);
}

connect();