import { createClient, RedisClientType } from "redis";

export class RedisSubscriber {
  private redisClient: RedisClientType;
  private callbacks: Record<string, (data: any) => void> = {};

  constructor() {
    this.redisClient = createClient({ url: "redis://localhost:6379" });
  }

  async connect() {
    await this.redisClient.connect();
    this.runLoop();
  }

  private async runLoop() {
    while (true) {
      try {
        const data = await this.redisClient.xRead(
          {
            key: "responseFromBackend",
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

            if (msg.message.response) {
              try {
                const parsed = JSON.parse(msg.message.response);
                const id = parsed.requestId as string;

                if (this.callbacks[id]) {
                  this.callbacks[id](parsed); 
                  delete this.callbacks[id];  
                }
              } catch (err) {
                console.error("Failed to parse response:", err);
              }
            }
          }
        }
      } catch (err) {
        console.error("Error in runLoop:", err);
        await new Promise(res => setTimeout(res, 1000)); 
      }
    }
  }

  waitForMessage(callbackId: string): Promise<any> {
    return new Promise((resolve,reject) => {
      this.callbacks[callbackId] = resolve;
      setTimeout(() => {
          reject()
      },5000)
    });

  }
}
