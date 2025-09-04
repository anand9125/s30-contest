import { createClient } from 'redis';


// In-memory storage
let trades: any[] = [];
let userBalance: number = 0;

const streamClient = createClient({ url: "redis://localhost:6379" });

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
        await streamClient.XGROUP_CREATE("tradesFromPooler", "tradeGroups", "0", { MKSTREAM: true });
    } catch (err) {
        console.log("Group already exists or error creating group:", err);
    }

    while (true) {
        try {
            const data = await streamClient.xReadGroup( // read messages as part of a consumer group
                "tradeGroups", //grp name
                "engine1",     //consumer name
                { key: "tradesFromPooler", id: ">" },//stram name and only fetch new messages
                { BLOCK: 5000, COUNT: 1 }  //wait upto 5 seconds reads 1 message at a time
            );

            if (data) {
                const streams: any = data;
                for (let i = 0; i < streams.length; i++) {
                    const stream = streams[i];
                    const messages = stream.messages;
                    
                    for (let j = 0; j < messages.length; j++) {
                        const msg = messages[j];
                        const msgId = msg.id;
                        const msgData = msg.message;
                        
                        console.log("Received trade:", msgData);

                        if (msgData.priceOfTrade) {
                            const trade = JSON.parse(msgData.priceOfTrade);
                            trades.push(trade);
                            console.log("Total trades stored:", trades.length);
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

