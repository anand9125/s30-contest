import Router from "express";
import { getAllBidAsk, singleAssetBidAsk } from "../controller/tradeDataController";
const router = Router();

router.get("/allBidAsk",getAllBidAsk);

router.post("/getSingleAssetBidAsk",singleAssetBidAsk);




export const tradeDataRouter = router;