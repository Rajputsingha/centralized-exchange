interface OrderLevel {
  price: number;
  qty: number;
}

interface OrderBookData {
  bids: OrderLevel[];
  asks: OrderLevel[];
}

interface Props {
  orderbook: OrderBookData;
}

export function OrderBook({ orderbook }: Props) {

  return (
    <div className="bg-gray-900 rounded-lg p-4 h-full">
      <h2 className="text-white font-bold mb-4">Order Book</h2>

      {/* Header */}
      <div className="grid grid-cols-3 text-gray-400 text-xs mb-2">
        <span>Price (USD)</span>
        <span className="text-center">Size (BTC)</span>
        <span className="text-right">Total</span>
      </div>

      {/* Asks - sell orders (red) */}
      <div className="mb-2">
        {[...orderbook.asks].reverse().map((ask, i) => (
          <div key={i} className="grid grid-cols-3 text-xs py-0.5 hover:bg-gray-800">
            <span className="text-red-400">{ask.price.toLocaleString()}</span>
            <span className="text-center text-gray-300">{ask.qty.toFixed(4)}</span>
            <span className="text-right text-gray-300">
              {(ask.price * ask.qty).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* Spread */}
      <div className="text-center text-green-400 font-bold text-sm py-2 border-y border-gray-700">
        {orderbook.asks[0]?.price.toLocaleString() ?? "—"}
      </div>

      {/* Bids - buy orders (green) */}
      <div className="mt-2">
        {orderbook.bids.map((bid, i) => (
          <div key={i} className="grid grid-cols-3 text-xs py-0.5 hover:bg-gray-800">
            <span className="text-green-400">{bid.price.toLocaleString()}</span>
            <span className="text-center text-gray-300">{bid.qty.toFixed(4)}</span>
            <span className="text-right text-gray-300">
              {(bid.price * bid.qty).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}