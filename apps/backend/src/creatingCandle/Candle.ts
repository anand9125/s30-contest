import { createClient, RedisClientType } from "redis";
export class Candle{
   private client: RedisClientType;
   constructor(){
    this.client = createClient();
    this.setUp();
   }

   async setUp(){
    await this.client.connect();
   }
   async getBidAsk(){ 
    while(true){
      try{
         const data = await this.client.xRead(
          {
            key: "bidaskFromPooler",
            id: "$",
          },
          {
            BLOCK: 0,
            COUNT: 1,
          }
        );
        if (!data) continue;
        for (const stream of data) {
          console.log("Stream:", stream.name);
          for (const msg of stream.messages) {
            console.log("Message ID:", msg.id);
            console.log("Raw Message Data:", msg.message);
            if(msg.message.bidAsk){
            const msgData = JSON.parse(msg.message.bidAsk);
            console.log(msgData,"msg data")
            if(msgData){
                const bidAsk = msgData.map(d=>{
                    return {
                        asset:d.asset,
                        bid:d.bid,
                        ask:d.ask
                    }
                })
                console.log(bidAsk,"bid ask")
            }
          }

        }
      }
        
   }catch(err){}
}
   }


    
}