import express from "express"
import { Request, Response } from "express"
require('dotenv').config()
import { userRouter } from "./routes/userRouter"
import { tradeRouter } from "./routes/tradeRouter"
import { client } from "./controller/tradeController"

const app = express()
app.use(express.json())


app.use("/api/v1/user",userRouter)

app.use("/api/v1/trade",tradeRouter)






app.listen(3000,()=>{
  console.log("server is running on port 3000")
})
