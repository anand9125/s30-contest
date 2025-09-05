import { createClient } from 'redis';


export let trades: { asset: string; price: string ,decimal:number}[] = [];
let userBalance: number = 0;

export const streamClient = createClient({ url: "redis://localhost:6379" });

export async function polarConsumer() {
    try {
        await streamClient.connect();
        console.log('Connected to Redis...');
    } catch (err) {
        console.log("Failed to connect to Redis:", err);
        return;
    }
    
    try {
        //create a consumer grp called tradeGroups on stram tradesFromPooler
        await streamClient.XGROUP_CREATE("tradesFromPooler", "engineGroups", "0", { MKSTREAM: true });
    } catch (err) {
        console.log("Group already exists or error creating group:", err);
    }

    while (true) {
        try {
            const data = await streamClient.xReadGroup( // read messages as part of a consumer group
                "engineGroups", //grp name
                "engine1",     //consumer name
                { key: "tradesFromPooler", id: ">" },//stram name and only fetch new messages
                { BLOCK: 5000, COUNT: 1 }  //wait upto 5 seconds reads 1 message at a time
            );
          // console.log(data,"this is data");
            if (data) {
                const streams: any = data;
                for (let i = 0; i < streams.length; i++) {
                    const stream = streams[i];
                    const messages = stream.messages;
                    
                    for (let j = 0; j < messages.length; j++) {
                        const msg = messages[j];
                        const msgId = msg.id;
                    const msgData = msg.message;

                    if (msgData.priceOfTrade) {
                        const tradeArray = JSON.parse(msgData.priceOfTrade) as { asset: string; price: string; decimal: number }[];
                        console.log(tradeArray, "trade array");

                        tradeArray.forEach((newTrade) => {
                            const existingEntry = trades.find(d => d.asset === newTrade.asset);
                            if (existingEntry) {
                                if (existingEntry.price !== newTrade.price || existingEntry.decimal !== newTrade.decimal) {
                                    existingEntry.price = newTrade.price;
                                    existingEntry.decimal = newTrade.decimal;
                                    console.log(` Updated trade: ${newTrade.asset} => ${newTrade.price}`);
                                }
                            } else {
                                trades.push(newTrade);
                                console.log(` Added trade: ${newTrade.asset} => ${newTrade.price}`);
                                console.log("Total trades stored:", trades.length);
                            }
                        });
                    }

                     await streamClient.xAck("tradesFromPooler", "tradeGroups", msgId);
                    }
                }
            }
        } catch (err) {
            console.log("Error processing stream:", err);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait before retrying
        }
    }
}

