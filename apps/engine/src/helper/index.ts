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

export const CloseTrade = (orderId: string) => {
    console.log("closeing the trade")
    const open = openTrade.get(orderId) as OpenTrade;
    if (!open) return null;
    const user = users.get(open.userId) as User;

    const currentDetailsOfAsset = getCurrentPriceOfAsset(open.asset);
    const currentPriceOfAsset = Number(currentDetailsOfAsset.price);
    let pnl = 0;
    if (open.type === "LONG") {
        pnl = open.exposure * (currentPriceOfAsset - open.entryPrice) / open.entryPrice;
        console.log("this is the pnl",pnl)
    } else if (open.type === "SHORT") {
        pnl = open.exposure * (open.entryPrice - currentPriceOfAsset) / open.entryPrice;
        console.log("this is the pnl",pnl)
    }
    const qntUserBet = open.quantity;
    const oldQnt = user.balance.get(open.asset)?.quantity ?? 0;
    const remQnt = oldQnt - qntUserBet;
    if (remQnt <= 0) {
        user.balance.delete(open.asset);
    } else {
        user.balance.set(open.asset, { asset: open.asset, quantity: remQnt });
    }

    user.balance.get("USDT")!.quantity += open.margin + pnl;
    console.log("user balance",user.balance)

    const closedTrade: OpenTrade = {
        ...open,
        status: "CLOSED",
        pnl,
        currentPrice: currentPriceOfAsset,
        closedAt: new Date()
    };
    console.log("closed trade",closedTrade)
    openTrade.set(orderId, closedTrade);
    console.log("open trade",openTrade)
    return closedTrade;
};

