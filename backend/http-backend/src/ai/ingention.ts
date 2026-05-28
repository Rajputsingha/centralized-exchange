import { prisma } from "db";
import { getEmbedding } from "./embeddings";
import { index } from "./vectoreStore";
import axios from "axios";

export async function ingestUserTrades(userId: string){
    const trade=await prisma.fill.findMany({
        where:{userId},
        orderBy:{createdAt:"desc"},
        take:50
    })
    console.log(trade)
    console.log("Trades found:", trade.length);
      if (trade.length === 0) {
    console.log("No trades for user");
    return;
  }
    // chunk +embeddings
    const vectors=await Promise.all( // all together in parallel.
        trade.map(async(trade)=>{ // map do array of promise
            const text=    `Trade: ${trade.side} ${trade.qty} ${trade.asset}
        Price: $${trade.price}
        Market: ${trade.market}
        Date: ${trade.createdAt}
      `
       const embedding = await getEmbedding(text) // embeddings model covert text to vector
    return {
        id: trade.id,
        values: embedding, // vector number store in pincone
        metadata: {
          userId,
          type: "trade",
          market: trade.market,
          side: trade.side,
          price: String(trade.price),
          qty: String(trade.qty),
          date: trade.createdAt.toISOString(),
          text  // store original text
        }
    }
        })
    )
    //store in pinecone
         await index.upsert({ records: vectors }) // pinecone stote embeddings + metadeta + trade  text 
  console.log(`Ingested ${vectors.length} trades for user ${userId}`)
}

export async function ingestMarketNews(market:string){
   const coinMap: Record<string, string> = {
    "BTC": "bitcoin",
    "SOL": "solana",
    "ETH": "ethereum"
  }

  const symbol = market.split("_")[0] ?? "BTC"
  const coin = coinMap[symbol] ?? "bitcoin" 

  
  const res = await axios.get(
    `https://api.coingecko.com/api/v3/coins/${coin}?localization=false`
  )
  const data=res.data;
  const text=`Market: ${market}
    Current Price: $${data.market_data?.current_price?.usd}
    24h Change: ${data.market_data?.price_change_percentage_24h}%
    Market Cap: $${data.market_data?.market_cap?.usd}
    Description: ${data.description?.en?.slice(0, 500)}
  
  `
    const embedding = await getEmbedding(text)

  
await index.upsert({
  records: [
    {
      id: `market-${market}-${Date.now()}`,
      values: embedding,
      metadata: {
        type: "market_news",
        market,
        text
      }
    }
  ]
})
  console.log(`Ingested market data for ${market}`)
}
