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

