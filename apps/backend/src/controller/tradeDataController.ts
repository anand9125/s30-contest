import { Request, Response } from "express";
import { TradeDataManager } from "../creatingCandle/tradeDataManager";

const tradeData = new TradeDataManager();
export const getAllBidAsk = async (req: Request, res: Response) => {
  try{
    const data = await tradeData.waitForCandleData();
    res.json(data);
  }
  catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to get all bid ask"
    });
  }
}

export const singleAssetBidAsk = async (req: Request, res: Response) => {
   try{
       const{asset} = req.body;
       
   }catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to get single asset bid ask"
    });
  }
}