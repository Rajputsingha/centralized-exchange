import { OrderBook } from "../memory/orderbook";
import type { Order } from "../memory/orderbook";
import { BalanceManager } from "../memory/BalanceManager";

export class MatchEngine{

    constructor(
        private orderbook: OrderBook,
        private balanceManager: BalanceManager
      ) {}

    match(incoming: Order) {
        const fills: any[] = []

        const oppositeSide = incoming.side === "BUY" 
        ? this.orderbook.asks //buy
        : this.orderbook.bids// sell

        const shortprice= [...oppositeSide.keys()].sort((a,b)=>
         incoming.side=="BUY"  ? a-b:b-a
        )

        for (const price of shortprice) {
            const priceMatch=incoming.side==="BUY"
            ? price <= incoming.price
            : price >= incoming.price
            if (!priceMatch) break  // no more matches possible


  // get all orders at this price level
  const orders = oppositeSide.get(price) ?? []
  for (const resting of orders) {

    if (incoming.filledQty >= incoming.qty) break

    const incomingnNeeds=incoming.qty-incoming.filledQty;
    const restingHas=resting.qty-resting.filledQty;
    const fillQty= Math.min(incomingnNeeds, restingHas);

resting.filledQty +=fillQty;
incoming.filledQty += fillQty;

const asset=this.orderbook.market.split("_")[0]! // Btc
const quote =this.orderbook.market.split("_")[1]!;
const fillValue  = fillQty * resting.price         // maker price!

if (incoming.side =="BUY"){
    this.balanceManager.transfer(incoming.userId, resting.userId,quote,fillValue) // usd Transfer
    this.balanceManager.transfer(resting.userId,incoming.userId,asset, fillQty)
}else{
    // seller pays BTC, gets USD
          // buyer  pays USD, gets BTC
          this.balanceManager.transfer(incoming.userId, resting.userId, asset, fillQty)
          this.balanceManager.transfer(resting.userId, incoming.userId, quote, fillValue)
}
//Each match creates a fill record
//Push to fills array
fills.push({
    price,
    qty:fillQty,
    makerOrderId: resting.id,   // ← order id
    takerOrderId: incoming.id,  // ← order id
    makerUserId:  resting.userId,
    takerUserId:  incoming.userId,
    asset,
    market: this.orderbook.market,
    side: incoming.side,
    timestamp: Date.now(),


    

})
 //  remove resting if fully filled
 if (resting.filledQty >= resting.qty) {
    resting.status = "FILLED"
    this.orderbook.removeOrder(resting.id, price, resting.side)
  }

  }
  // Stop if incoming fully filled
  if (incoming.filledQty >= incoming.qty) break;


        }




        if (incoming.filledQty === 0) {
            incoming.status = "OPEN"
          } else if (incoming.filledQty < incoming.qty) {
            incoming.status = "PARTIALLY_FILLED"
          } else {
            incoming.status = "FILLED"
          }
// Step 11 - add to book if not fully filled
if (incoming.status !== "FILLED") {
    this.orderbook.addOrder(incoming)
  }
   // Step 12 - return fills
   return {
    order: incoming,
    fills
   }
    }


}