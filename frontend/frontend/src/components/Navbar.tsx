import { useNavigate } from "react-router-dom"
import { Button } from "./button"

interface Props {
  market: string
  onMarketChange: (market: string) => void
}

const MARKETS = ["BTC_USD", "SOL_USD", "ETH_USD"]

export function Navbar({ market, onMarketChange }: Props) {
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem("token")
    navigate("/signin")
  }

  return (
    <div className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center justify-between">
      {/* Logo */}
      <div className="text-white font-bold text-xl">
     
      </div>

      {/* Market Selector */}
      <div className="flex gap-2">
        {MARKETS.map((m) => (
          <button
            key={m}
            onClick={() => onMarketChange(m)}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors
              ${market === m
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-white"}`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Logout */}
      <Button
        onClick={logout}
        variant="outline"
        className="border-gray-700 text-gray-300 hover:text-white text-sm"
      >
        Logout
      </Button>
    </div>
  )
}