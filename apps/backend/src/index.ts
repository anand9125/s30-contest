import express from "express"
import { Request, Response } from "express"
require('dotenv').config()
import { runProducer } from "./sevices/producer"
import { userRouter } from "./routes/userRouter"
import { tradeRouter } from "./routes/tradeRouter"

const app = express()
app.use(express.json())


app.use("/api/v1/user",userRouter)

app.use("/api/v1/trade",tradeRouter)


runProducer().catch(console.error);




app.listen(3000,()=>{
  console.log("server is running on port 3000")
})
