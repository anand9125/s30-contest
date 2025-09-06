import express from "express"
require('dotenv').config()
import { userRouter } from "./routes/userRouter"
import { tradeRouter } from "./routes/tradeRouter"
import { tradeDataRouter } from "./routes/tradeDataRouter"
import { Trade } from "./creatingCandle/main";
const app = express()
app.use(express.json())

const tradeData = new Trade();
tradeData.startGettingAllBidAsk("BTC");
app.use("/api/v1/user",userRouter)

app.use("/api/v1/trade",tradeRouter)

app.use("/api/v1/tradeData",tradeDataRouter)

app.listen(4000,()=>{
  console.log("server is running on port 3000")
})
