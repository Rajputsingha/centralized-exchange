import { useState, useEffect } from "react"
import {
  connectionSocket,
  addSocketListener,
  subscribeToMarket,
  unsubscribeFromMarket,
} from "@/services/socket"
import { api } from "@/services/api"


interface OrderLevel {
  price: number
  qty: number
}
interface OrderBookData {
  bids: OrderLevel[]
  asks: OrderLevel[]
}

interface Trade {
  id: string
  orderId: string
  userId: string
  market: string
  price: number
  qty: number
  side: string
  asset: string
  createdAt: string  // ← fixed!
}

export function useOrderbook(market: string) {
  const [orderbook, setOrderbook] = useState<OrderBookData>({
    bids: [],
    asks: [],
  })
  const [trades, setTrades] = useState<Trade[]>([])

  // Fetch existing trades from DB on load
  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const res = await api.get(`/api/trades/${market}`)
        console.log("Fetched trades:", res.data) // ← debug
        setTrades(res.data.trades)
      } catch (err) {
        console.error("Failed to fetch trades:", err)
      }
    }
    fetchTrades()
  }, [market])

  // WebSocket for live updates
  useEffect(() => {
    const token = localStorage.getItem("token") ?? ""
    const socket = connectionSocket(token)

    const removeListener = addSocketListener((msg) => {
      if (msg.type === "orderbook_update") {
        setOrderbook(msg.data ?? { bids: [], asks: [] })
      }
      if (msg.type === "trades") {
        setTrades((prev) => [...(msg.data ?? []), ...prev].slice(0, 20))
      }
    })

    subscribeToMarket(market)

    return () => {
      removeListener()
      unsubscribeFromMarket(market)
    }
  }, [market])

  return { orderbook, trades }
}
