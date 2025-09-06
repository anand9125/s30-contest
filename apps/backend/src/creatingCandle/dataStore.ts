import { Tick } from "../type";

export class DataStore{
    private latestTickBySymbol = new Map<string,Tick>();
    processTick(tick:any){
        this.latestTickBySymbol.set(tick.symbol,tick);
    }
}