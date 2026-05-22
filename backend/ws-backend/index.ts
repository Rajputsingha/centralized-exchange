import { prisma } from "db"
import { secret } from "http-backend/secret"
import { WebSocket, WebSocketServer } from "ws"
import jwt from "jsonwebtoken"
import { subscribe, unsubscribe } from "./src/websocket/broadcaster"
import { startConsumer } from "./src/streams/consumer"  

const wss = new WebSocketServer({ port: 4000 })

interface User {
  ws: WebSocket
  rooms: string[]
  userId: string
}

const users: User[] = []

function checkUser(token: string): string | null {
  try {
    const decode = jwt.verify(token, secret) as any
    return decode.userId || null
  } catch {
    return null
  }
}

wss.on("connection", (ws, request) => {
  const url = request.url
  if (!url) return

  const query = new URLSearchParams(url.split("?")[1])
  const token = query.get("token") || ""
  const userId = checkUser(token)

  if (!userId) {
    ws.close()
    return
  }

  users.push({ userId, rooms: [], ws })

  ws.on("message", async (data) => {
    const msg = JSON.parse(data.toString())

    if (msg.type === "subscribe") {
      const user = users.find((u) => u.ws === ws)
      if (user) user.rooms.push(String(msg.roomId))
      subscribe(String(msg.roomId), ws)
    }

    if (msg.type === "unsubscribe") {
      const user = users.find((u) => u.ws === ws)
      if (user) {
        user.rooms = user.rooms.filter((r) => r !== String(msg.roomId))
        unsubscribe(String(msg.roomId), ws)
      }
    }
  })


  ws.on("close", () => {
    console.log("Client disconnected")

  })
})


startConsumer()
console.log("WS server running on port 4000")