import { Router } from "express";
import { closeTrade, createTrade, getSupportedAssets, getUsdBalance } from "../controller/tradeController";

const router = Router();


router.post("/create",createTrade)

router.post("/close",closeTrade)

router.get("/balance/usd",getUsdBalance)

router.get("/supportedAssets",getSupportedAssets)


export const tradeRouter = router;