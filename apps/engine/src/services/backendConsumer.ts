
import { buyAsset, sellAsset } from '../trade';
import { streamClient } from './polarConsumer';
import {createClient} from 'redis';


export async function backendConsumer() {
  
    // 1 service = 1 group (across all streams it consumes). service = ourengine
    while (true) {
        try{
            const data = await streamClient.xReadGroup(
                "engineGroups",
                "engine2",
                { key: "requestFromBackend", id: ">" },
                { BLOCK: 5000, COUNT: 1 }
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
                        console.log("Received message:", msgData.data);
                        const data = JSON.parse(msgData.data);
                        // TODO: Process the message data
                        if(data.type=="LONG"){
                           console.log("buy asset")
                           console.log(data.requestId )
                           const openTrade=  buyAsset(data) 
                           if(openTrade){
                            console.log("request data",data.requestId)
                               streamClient.xAdd("responseFromBackend", "*", {
                                    response: JSON.stringify({
                                        openTrade,
                                        requestId: data.requestId
                                    })
                                });
                           }else{
                              streamClient.xAdd("responseFromBackend", "*", {response:"user don't have enough balance"})
                           } 
                        }
                        else if(data.type=="SHORT"){
                            console.log("sell asset")
                            const openTrade= sellAsset(data)
                            if(openTrade){
                                streamClient.xAdd("responseFromBackend", "*", {
                                    response: JSON.stringify({
                                        openTrade,
                                        requestId: data.requestId
                                    })
                                });
                            }else{
                                streamClient.xAdd("responseFromBackend", "*", {response:"user don't have enough balance"})
                            }

                        }

                        await streamClient.xAck("requestFromBackend", "engineGroups", msgId);
                    }
                }
            }
            
        }
        catch (err) {
            
            console.log("Error processing stream:", err);
        }
    }
}