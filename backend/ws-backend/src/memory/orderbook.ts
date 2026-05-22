
export interface Order {
    id:string,
    userId:string,
    price:number,
    market:string,
    qty: number
    filledQty:number,
    side:"BUY" |"SELL",
    status:"OPEN" |"PARTIALLY_FILLED" |"FILLED"| "CANCELLED",
    timestamp:number
}

export class OrderBook {
    market:string
    bids:Map<number, Order[]>
    asks:Map<number, Order[]>


    constructor(market:string){
        this.market=market
        this.bids=new Map()
        this.asks=new Map()

    }
    addOrder(order:Order){
        const book = order.side === "BUY" ? this.bids : this.asks;

        const level = book.get(order.price);
        if (!level) {
            book.set(order.price, [order]);
            return;
        }
        level.push(order);
    }

    removeOrder(orderId: string, price: number, side: "BUY" | "SELL") {
        const book = side === "BUY" ? this.bids : this.asks;

        const level = book.get(price);
        if (!level) return;

        const remaining = level.filter((o: Order) => o.id !== orderId);
        if (remaining.length === 0) {
            book.delete(price);
        } else {
            book.set(price, remaining);
        }
    }
        getSnapshot(){
            return {
                market: this.market,
                bids: this._formatSide(this.bids, "desc"),
                asks: this._formatSide(this.asks, "asc"),
              }
    
        }
        private _formatSide(map: Map<number, Order[]>, dir: "asc" | "desc") {
            return [...map.entries()]
              .map(([price, orders]) => ({
                price,
                qty: orders.reduce((sum, o) => sum + (o.qty - o.filledQty), 0)
              }))
              .sort((a, b) => dir === "desc" ? b.price - a.price : a.price - b.price)
          }

    
}
 

