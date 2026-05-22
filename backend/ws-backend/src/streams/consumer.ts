

import { createClient } from "redis"
import { handleOrder } from "./streamhandler"

const client = createClient({
  url: "redis://localhost:6379"
})

client.on("error", (err) => console.error("Redis error:", err))

export async function startConsumer() {
  await client.connect()
  console.log("Consumer started — waiting for orders...")

  while (true) {
    const response = await client.brPop("incoming-order", 0)  // ← fixed!
    if (!response) continue

    const order = JSON.parse(response.element)
    console.log("Order received:", order)

    try {
      await handleOrder(order)
    } catch (err) {
      console.error("Error processing order:", err)
    }
  }
}