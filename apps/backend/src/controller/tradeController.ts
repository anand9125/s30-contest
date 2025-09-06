import { Request, Response } from "express";
import { createClient } from "redis";
import { RedisSubscriber } from "../sevices/redisSubscriber";

export const client = createClient({ url: "redis://localhost:6379" });

client.connect()
  .then(() => console.log("Redis connected"))
  .catch(err => console.error("Redis connection failed:", err));

const redisSubscriber = new RedisSubscriber()


async function connectToRedis() {
  try {
    await redisSubscriber.connect();
  } catch (err) {
    console.error("Failed to connect to Redis:", err);
  }
}
connectToRedis();


export const createTrade = async (req: Request, res: Response) => {
  try{
      const { asset, type, margin, leverage, slippage,userId } = req.body;
      const requestId =crypto.randomUUID() 
      const id = await client.xAdd(
        "requestFromBackend",
        "*",
        { data: JSON.stringify({ asset, type, margin, leverage, slippage,userId,requestId }) }
      );
      console.log("Produced:", id);
     
      const response= redisSubscriber.waitForMessage(requestId)
    
      console.log("Produced:", id);
      res.json({ message: "Trade created", id, response});
  }catch (err) {
    console.error(err);
    res.status(500).json({ 
      error: "Failed to create trade"
    });
  }
};

export const closeTrade = async (req: Request, res: Response) => {
  try{
      const { orderId,type } = req.body;
      const id = await client.xAdd(
        "requestFromBackend", 
        "*",
        { data: JSON.stringify({ orderId ,type}) }
      );
      const response =  redisSubscriber.waitForMessage(orderId)
      console.log("Produced:", id);
      res.json({ message: "Trade closed", id ,response});
  }catch (err) {
      console.error(err);
      res.status(500).json({
        error: "Failed to close trade"
      });
  }
};


export const getUsdBalance = async (req: Request, res: Response) => {

};

export const getSupportedAssets = async (req: Request, res: Response) => {
};
