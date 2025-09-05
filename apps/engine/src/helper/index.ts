import { trades } from "../services/polarConsumer"
import { users ,openTrade} from "../store/store"
import { OpenTrade, User } from "../type"

export const getUser = (userId:string)=>{
      const User = users.get(userId)
      if(User){
          return User
      }
      
      
}
export const getCurrentPriceOfAsset = (asset: string): { asset: string; price: string ,decimal:number} => {
    console.log("getCurrentPriceOfAsset")
  const trade = trades.find(t => t.asset === asset) as { asset: string; price: string ,decimal:number};
  return trade
};

export const findQuantity = (margin: number, leverage: number, price: number, slippage: number): number => {
    const exposure = margin * leverage;
    const qnt = exposure/(price);
    return qnt
}

export const Opentrade =(asset:string,type:"LONG"|"SHORT",margin:number,leverage:number,slippage:number,userId:string):OpenTrade=>{
    const currentPriceOfAsset = getCurrentPriceOfAsset(asset)
    console.log(currentPriceOfAsset,"i am able to find current price")
    const qnt = findQuantity(margin,leverage,Number(currentPriceOfAsset.price),slippage)
    const id = crypto.randomUUID()
    const exposure = margin*leverage
    const Opentrade:OpenTrade = {
        userId,
        id,
        asset,
        type,
        margin,
        leverage,
        slippage,
        exposure,
        quantity:qnt,
        entryPrice:Number(currentPriceOfAsset.price),
        decimal:Number(currentPriceOfAsset.decimal),
        status:"OPEN",
        createdAt:new Date()
    }
    const user = users.get(userId) as User
    console.log(user,"user")
    user.balance.get("USDT")!.quantity-=margin
    console.log(user.balance,"user balance")
    user.balance.set(asset,{asset, quantity:qnt})
    console.log(user.balance,"user balance")
    openTrade.set(id,Opentrade)
    console.log(openTrade,"open trade")
    return Opentrade
}