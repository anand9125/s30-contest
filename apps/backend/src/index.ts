import express from "express"
import { Request, Response } from "express"

import jwt from "jsonwebtoken"
import { secret, user } from "./store"
import { sendSigninEmail } from "./sendmail"
require('dotenv').config()
import Cookies from "cookies"

const app = express()
app.use(express.json())



app.post("/user/signup",(req:Request,res:Response)=>{
    const{username} = req.body;
    const userexist = user.has(username)
     if(userexist){
      res.json({
        message:"user already exist"
      })
      return ;
    }
    const User = user.set(username,username)
    
    res.json({
      message:"user created",
      user:user.get(username)
    })
})

app.post("/user/login",async(req:Request,res:Response)=>{
    const{username} = req.body;
   const userExist = user.has(username)
   if(!userExist){
    res.status(404).json({
        message:"user not exist exist"
    })
    return
   }
   const sign = jwt.sign({userId:user.get(username)},secret)
   await sendSigninEmail(username,sign)
   res.json({
    message:"user successfully login"
   })
})

app.get("/signin/post", (req: Request, res: Response) => {
  const { token } = req.query as { token: string };

  try {
    const verify = jwt.verify(token, secret);

   
    res.cookie("auth_token", token)

    res.json({
      message: "User successfully logged in",
      user: verify
    });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});







app.listen(3000,()=>{
  console.log("server is running on port 3000")
})
