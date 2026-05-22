
import { useEffect, useRef, useState } from "react"

interface Props {
  market: string  // "BTC_USD" → "BTCUSD"
}

export function TradingViewChart({ market }: Props) {
  const container = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!container.current) return

    // Clear previous widget
    container.current.innerHTML = ""

    // Convert market format
    // BTC_USD → BTCUSD
    const symbol = market.replace("_", "")

    // Create script element
    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
    script.async = true
    script.type = "text/javascript"
    script.onload = () => setLoaded(true)
    script.onerror = () => {
      setLoaded(false)
      console.error("TradingView chart failed to load")
    }

    const config = {
      autosize: true,
      symbol,
      interval: "1",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      backgroundColor: "rgba(17, 24, 39, 1)",
      gridColor: "rgba(55, 65, 81, 0.5)",
      hide_top_toolbar: false,
      hide_legend: false,
      hide_side_toolbar: false,
      allow_symbol_change: false,
      save_image: false,
      calendar: false,
      support_host: "https://www.tradingview.com",
    }

    script.textContent = JSON.stringify(config)
    container.current.appendChild(script)

  }, [market]) // re-runs when market changes

  return (
    <div className="relative w-full h-full">
      <div
        className="tradingview-widget-container w-full h-full"
        ref={container}
      >
        <div
          className="tradingview-widget-container__widget w-full h-full"
        />
      </div>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-300 bg-black/70">
          Loading chart…
        </div>
      )}
    </div>
  )
}