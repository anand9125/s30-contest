import {  CloseTrade, getUser, Opentrade } from "./helper";
import { openTrade, users } from "./store/store";
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

export const closeTrade = (data: any) => {
    const { orderId } = data;
    
    const open = openTrade.get(orderId) as OpenTrade;
    if (!open) {
        console.log("No such trade exists");
        return null;
    }
    if (open.status !== "OPEN") {
        console.log("Trade is not open");
        return null;
    }
    const closedTrade = CloseTrade(orderId) as OpenTrade;
    return closedTrade;
};

export const liquidation = (data: { asset: string; price: string; decimal: number }) => {
    const allOpenOrders = Array.from(openTrade.values()).filter(trade => trade.status === "OPEN");
    const { asset, price } = data;
    const currentPrice = Number(price);
    const closedTrades: OpenTrade[] = [];
    allOpenOrders.forEach(trade => {
        if (trade.asset === asset) {
            let pnl = 0;

            if (trade.type === "LONG") {
                pnl = trade.exposure * (currentPrice - trade.entryPrice) / trade.entryPrice;
            } else if (trade.type === "SHORT") {
                pnl = trade.exposure * (trade.entryPrice - currentPrice) / trade.entryPrice;
            }

            if (pnl <= -0.9 * trade.margin) {
                console.log(`Liquidating trade ${trade.id} for user ${trade.userId}`);
                const closedTrade = closeTrade({ orderId: trade.id }); // using your closeTrade wrapper
                if (closedTrade) {
                    closedTrades.push(closedTrade as OpenTrade);
                }
            }
        }
    });

    return closedTrades; // array of all closed trades
};
