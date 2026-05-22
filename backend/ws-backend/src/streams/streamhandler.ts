import { marketManager } from "../memory/Marketmanager";
import { prisma } from "db";
import { balanceManager, BalanceManager } from "../memory/BalanceManager";
import { MatchEngine } from "../engine/Matchengine";
import { createClient } from "redis";
import { broadcast } from "../websocket/broadcaster";
const publisher = await createClient()
  .on("error", console.error)
  .connect()

export async function handleOrder(order: any) {
  try {
    // Step 1 - get orderbook from memory
    const orderbook = marketManager.getOrderBook(order.market)

    // Step 2 - get user from DB
    const user = await prisma.user.findUnique({
      where: { id: order.userId }
    })
    if (!user) throw new Error("User not found")

    // Step 3 - load balance into memory
    balanceManager.initUser(order.userId, {
     USD: 999999, 
      BTC: 999999,  
      SOL: 999999,   
      ETH: 999999,   
    })

    // Step 4 - match order
    const engine = new MatchEngine(orderbook, balanceManager)
    const result = engine.match(order)
    console.log("result.order:", result.order)

    // Step 5 - save order to DB
    await prisma.order.create({
      data: {
        id:        order.id,
        userId:    result.order.userId,
        market:    result.order.market,
        price:     String(result.order.price),       // String for Decimal
        qty:       String(result.order.qty),   
        filledQty: String(result.order.filledQty),  
        type:      order.type as "LIMIT" | "MARKET", 
        side:      result.order.side as "BUY" | "SELL", 
        status:    result.order.status as "OPEN" | "PARTIALLY_FILLED" | "FILLED" | "CANCELLED", // ← cast enum
      }
    })

    // Step 6 - save fills to DB
    for (const fill of result.fills) {
      await prisma.fill.create({
        data: {
          orderId:  fill.takerOrderId,
          userId:   fill.takerUserId,
          market:   fill.market,
          price:    String(fill.price),   
          qty:      String(fill.qty),     
          side:     fill.side as "BUY" | "SELL", 
          asset:    fill.asset,
        }
      })
    }

    // Step 7 - broadcast orderbook update
    broadcast(order.market, {
      type: "orderbook_update",
      data: orderbook.getSnapshot()
    })

    // broadcast trades if any
    if (result.fills.length > 0) {
      broadcast(order.market, {
        type: "trades",
        data: result.fills
      })
    }

    // Step 8 - reply to http-backend
    await publisher.lPush(
      `order-response-${order.userId}`,
      JSON.stringify(result)
    )

    console.log("Order processed:", result.order.status)
    console.log("Fills:", result.fills.length)

  } catch (err: any) {
    console.error("Error handling order:", err.message)

    // send error back to http-backend
    await publisher.lPush(
      `order-response-${order.userId}`,
      JSON.stringify({ error: err.message })
    )
  }
}