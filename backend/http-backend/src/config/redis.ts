// http-backend/src/config/redis.ts

import { createClient } from "redis"

export const redisClient = createClient({
  url: "redis://localhost:6379"
})

export const redisSubscriber = createClient({
  url: "redis://localhost:6379"
})

redisClient.on("error", (err) => console.error("Redis Client Error:", err))
redisSubscriber.on("error", (err) => console.error("Redis Subscriber Error:", err))

// connect function — call this in index.ts
export async function connectRedis() {
  await redisClient.connect()
  await redisSubscriber.connect()
  console.log("Redis connected ")
}
