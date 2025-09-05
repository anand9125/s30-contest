import { UUID } from "crypto"

export type PRICE = {
    [key:string]:{
        price: string,
        decimal:number
    }
}

export interface Incomingmessage {
    asset:"string",
    price:"string",
    decimal:number
}


export type OpenTrade = {
  userId:string,
  id:UUID,
  asset:string,
  type:"LONG"|"SHORT",
  margin:number,
  leverage:number,
  slippage:number,
  exposure:number,//derived value from margin and leverage(margin*leverage)amount of money or value that you have at risk in the market
  quantity:number,
  entryPrice:number,
  decimal:number,
  status:"OPEN"|"CLOSED"|"CANCELLED"
  createdAt:Date,
}
export type User ={
    id:string,
    balance: Map<string,balance>;
}
export type balance ={
    asset:string,
    quantity:number
}
