import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { PlaceOrderForm } from "@/components/placeOrderForm";
import { TradeHistory } from "@/components/TradeHistory";
import { OrderBook } from "@/components/orderbook";
import { TradingViewChart } from "@/components/Tradepage";
import { useOrderbook } from "@/hooks/useOrdebook";

export function TradePage() {
  const [market, setMarket] = useState("BTC_USD");
  const { orderbook, trades } = useOrderbook(market);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <div className="px-4 py-4 text-white text-lg font-semibold">
        Trade Dashboard
      </div>

      {/* Navbar */}
      <Navbar market={market} onMarketChange={setMarket} />

      {/* Main Content */}
      <div className="flex flex-1 gap-2 p-2 overflow-hidden">

        {/* Left Side - Chart + Order Form */}
        <div className="flex flex-col flex-1 gap-2">
          {/* Chart */}
          <div className="h-96 bg-gray-900 rounded-lg overflow-hidden">
            <TradingViewChart market={market} />
          </div>

          {/* Bottom - Form + History */}
          <div className="flex gap-2">
            <div className="flex-1">
              <PlaceOrderForm market={market} />
            </div>
            <div className="flex-1">
              <TradeHistory trades={trades} />
            </div>
          </div>
        </div>

        {/* Right Side - OrderBook */}
        <div className="w-72">
          <OrderBook orderbook={orderbook} />
        </div>

      </div>
    </div>
  )
}