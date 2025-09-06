import zod from "zod";
export type User= {
    username:string
}

export interface Tick{
    symbol:string;
    bid:number; 
    ask:number;
}