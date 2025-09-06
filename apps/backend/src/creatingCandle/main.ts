import { TradeDataManager } from "./tradeDataManager";
import{ DataStore} from "./dataStore";
export class Trade{
    private tradeData: TradeDataManager;
    private dataStore: DataStore;
    constructor(){
      this.tradeData = new TradeDataManager();
      this.dataStore = new DataStore();
    }
   
    async startGettingAllBidAsk(asset:string){
         this.tradeData.getBidAskLoop();  //start the loop once
         const data = await this.tradeData.waitForCandleData();
         console.log("Data:",data);
         if(data){
            const found = data.find((d:any)=>d.asset===asset);
            if(found){
                this.dataStore.processTick(found);
            }
         }
    }
}