import { createClient, RedisClientType } from "redis";
export class TradeDataManager{
   private client: RedisClientType;
   constructor(){
    this.client = createClient();
    this.setUp();
   }

   async setUp(){
    await this.client.connect();
   }

  async getBidAskLoop() {
    while (true) {
      try {
        const data = await this.client.xRead(
          { key: "bidaskFromPooler", id: "$" },
          { BLOCK: 0, COUNT: 1 }
        );
        if (!data) continue;

        for (const stream of data) {
          for (const msg of stream.messages) {
            if (msg.message.bidask) {
              const msgData = JSON.parse(msg.message.bidask);
              if (msgData) {
                const bidAsk = msgData.map((d: any) => ({
                  asset: d.asset,
                  bid: d.bid,
                  ask: d.ask,
                }));
                console.log("BidAsk:", bidAsk);
                this.resolveWaiters(bidAsk);
              }
            }
          }
        }
      } catch (err) {
        console.error("Error in getBidAskLoop:", err);
      }
    }
  }

  private waiters: ((data: any) => void)[] = [];

  private resolveWaiters(data: any) {
    this.waiters.forEach((resolve) => resolve(data));//take every resolve and call it Whoever was awaiting waitForCandleData() now gets the result.
    this.waiters = []; 
  }

  waitForCandleData(): Promise<any> {
    return new Promise((resolve) => {
      this.waiters.push(resolve);
    });
  }
}