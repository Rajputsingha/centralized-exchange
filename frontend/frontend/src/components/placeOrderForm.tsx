import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { api } from "@/services/api";

import { useState } from "react";

interface Props {
  market: string
}

export function PlaceOrderForm({ market }: Props) {
  const [side, setSide]     = useState<"BUY" | "SELL">("BUY")
  const [price, setPrice]   = useState("")
  const [qty, setQty]       = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubmit = async () => {
    setLoading(true)
    setMessage("")
    try {
      await api.post("/api/order", {
        market,
        price: Number(price),
        qty: Number(qty),
        type: "LIMIT",
        side,
      })
      setMessage("Order placed! ")
      setPrice("")
      setQty("")
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error placing order")
    }
    setLoading(false)
  }

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <h2 className="text-white font-bold mb-4">Place Order</h2>

      {/* BUY/SELL tabs */}
      <div className="flex mb-4 rounded-lg overflow-hidden">
        <button
          onClick={() => setSide("BUY")}
          className={`flex-1 py-2 text-sm font-bold transition-colors
            ${side === "BUY"
              ? "bg-green-600 text-white"
              : "bg-gray-800 text-gray-400"}`}
        >
          BUY
        </button>
        <button
          onClick={() => setSide("SELL")}
          className={`flex-1 py-2 text-sm font-bold transition-colors
            ${side === "SELL"
              ? "bg-red-600 text-white"
              : "bg-gray-800 text-gray-400"}`}
        >
          SELL
        </button>
      </div>

      {/* Price */}
      <div className="space-y-2 mb-3">
        <Label className="text-gray-300">Price (USD)</Label>
        <Input
          type="number"
          placeholder="0.00"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="bg-gray-800 border-gray-700 text-white"
        />
      </div>

      {/* Quantity */}
      <div className="space-y-2 mb-4">
        <Label className="text-gray-300">Quantity (BTC)</Label>
        <Input
          type="number"
          placeholder="0.00"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          className="bg-gray-800 border-gray-700 text-white"
        />
      </div>

      {/* Total */}
      <div className="flex justify-between text-sm text-gray-400 mb-4">
        <span>Total</span>
        <span className="text-white">
          ${(Number(price) * Number(qty)).toLocaleString()}
        </span>
      </div>

      {/* Message */}
      {message && (
        <p className="text-sm text-center mb-3 text-green-400">{message}</p>
      )}

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full font-bold ${
          side === "BUY"
            ? "bg-green-600 hover:bg-green-700"
            : "bg-red-600 hover:bg-red-700"
        }`}
      >
        {loading ? "Placing..." : `${side} ${market.split("_")[0]}`}
      </Button>
    </div>
  )
}