import jwt from "jsonwebtoken"
import { Request, Response } from "express";
import { secret, user } from "../store";
import { sendSigninEmail } from "../sevices/sendmail";


export const userSignup = (req:Request,  res:Response) => {
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
};

export const userSignin = async(req:Request,  res:Response) => {
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
}
 

export const userValidater = (req:Request,  res:Response) => {
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
}