import { getUser, Opentrade } from "./helper";
import { users } from "./store/store";
import { OpenTrade, User } from "./type";

export const buyAsset = (data:any):OpenTrade|null=>{
    const {asset,type,margin,leverage,slippage,userId} = data;
    console.log("buyAsset")
    let User = getUser(userId) as User 
    if(!User){
          users.set(userId,{id:userId,balance:new Map([["USDT", { asset:"USDT", quantity:100000 }]])})
          User = users.get(userId) as User
    }
    console.log(User,"user")
    const isEnoughBalance = User.balance.get("USDT")!.quantity >=margin;
    if(!isEnoughBalance){
        return null
    }
    console.log("i have enough balacne")
    const openTrade = Opentrade(asset,type,margin,leverage,slippage,userId)
    console.log(openTrade,"openTrade")
    return openTrade;
}
export const sellAsset = (data:any)=>{
     //TODO: Implement sell asset logic
    const {asset,type,margin,leverage,slippage,userId} = data;
    let User = getUser(userId) as User 
    if(!User){
          users.set(userId,{id:userId,balance:new Map([["USDT", { asset:"USDT", quantity:100000 }]])})
          User = users.get(userId) as User
    }
    const isEnoughBalance = User.balance.get("USDT")!.quantity >=margin;
    if(!isEnoughBalance){
        return null
    }
    const openTrade = Opentrade(asset,type,margin,leverage,slippage,userId)
    console.log("i am able to do it bor i did it")
    return openTrade;
}