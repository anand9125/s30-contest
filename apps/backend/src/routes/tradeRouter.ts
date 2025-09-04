import { Router } from "express";

const router = Router();


router.post("/open",openTrade)


export const tradeRouter = router;