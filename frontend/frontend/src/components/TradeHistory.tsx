interface Trade {
  id: string
  orderId: string
  userId: string
  market: string
  price: number
  qty: number
  side: string
  asset: string
  createdAt: string
}

interface Props {
  trades: Trade[]
}

export function TradeHistory({ trades }: Props) {
  return (
    <div className="bg-gray-900 rounded-lg p-4 h-full">
      <h2 className="text-white font-bold mb-4">Trade History</h2>

      {/* Header */}
      <div className="grid grid-cols-3 text-gray-400 text-xs mb-2 border-b border-gray-700 pb-2">
        <span>Price (USD)</span>
        <span className="text-center">Size</span>
        <span className="text-right">Time</span>
      </div>

      {/* Trades */}
      {trades.length === 0 ? (
        <p className="text-gray-500 text-sm text-center mt-8">
          No trades yet
        </p>
      ) : (
        <div className="overflow-y-auto max-h-48 trade-history-scroll">
          {trades.map((trade, i) => (
            <div
              key={i}
              className="grid grid-cols-3 text-xs py-1 hover:bg-gray-800 rounded"
            >
              <span className={
                trade.side.toUpperCase() === "BUY"
                  ? "text-green-400 font-medium"
                  : "text-red-400 font-medium"
              }>
                {Number(trade.price).toLocaleString()}
              </span>
              <span className="text-center text-gray-300">
                {Number(trade.qty).toFixed(4)}
              </span>
              <span className="text-right text-gray-400">
                {new Date(trade.createdAt).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}