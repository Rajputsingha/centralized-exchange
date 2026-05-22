import { OrderBook } from "./orderbook"
export class MarketManager {
    private orderbooks: Map<string, OrderBook>
  
    constructor() {
      this.orderbooks = new Map()
      this.orderbooks.set("BTC_USD", new OrderBook("BTC_USD"))
      this.orderbooks.set("SOL_USD", new OrderBook("SOL_USD"))
      this.orderbooks.set("ETH_USD", new OrderBook("ETH_USD")) 
    }
  
    getOrderBook(market: string) {
      const orderbook = this.orderbooks.get(market)
      if (!orderbook) {
        throw new Error("Orderbook not found")
      }
      return orderbook
    }
  
    getAllMarkets() {
      return [...this.orderbooks.keys()]
    }
  }
  
  // Singleton
  export const marketManager = new MarketManager()