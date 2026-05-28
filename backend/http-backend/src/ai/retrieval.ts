import { getEmbedding } from "./embeddings"
import { index } from "./vectoreStore"
import { CohereClient } from "cohere-ai"

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY!
})

//  Semantic Search 
export async function semanticSearch(
  question: string,
  userId: string,   // lowercase d
  topK: number = 10
) {
  const questionEmbedding = await getEmbedding(question)

  const result = await index.query({
    vector: questionEmbedding,
    topK,
    filter: { userId },  // matches parameter name
    includeMetadata: true
  })

  console.log(`Semantic search found: ${result.matches.length} results`)
  return result.matches
}

//  Phase 1B Keyword Search 
export async function keywordSearch(
  question: string,
  userId: string,   //  lowercase d
) {
  //  uppercase markets
  const markets = ["BTC", "SOL", "ETH"]

  // fixed find with auto return
  const foundMarket = markets.find(m =>
    question.toUpperCase().includes(m)
  )

  // check side keyword
  const foundSide = question.toUpperCase().includes("BUY")
    ? "BUY"
    : question.toUpperCase().includes("SELL")
    ? "SELL"
    : null

  const result = await index.query({
    vector: new Array(1536).fill(0),
    topK: 10,
    filter: {
      userId,   // lowercase d matches parameter
      ...(foundMarket && { market: `${foundMarket}_USD` }),
      ...(foundSide && { side: foundSide })
    },
    includeMetadata: true
  })

  console.log(`Keyword search found: ${result.matches.length} results`)
  return result.matches
}

// ── Hybrid Search ──
export async function hybridSearch(
  question: string,
  userId: string
) {
  const [semanticResults, keywordResults] = await Promise.all([
    semanticSearch(question, userId),
    keywordSearch(question, userId)
  ])


  const seen = new Set<string>()
  const combined = []

  for (const result of [...semanticResults, ...keywordResults]) {
    if (!seen.has(result.id)) {
      seen.add(result.id)
      combined.push(result)
    }
  }

  console.log(`Hybrid total: ${combined.length} unique results`)
  return combined
}


export async function rerank(
  question: string,
  candidates: any[],
  topN: number = 3
) {
  if (candidates.length === 0) return []

  const documents = candidates.map(c =>
    String(c.metadata?.text ?? "")
  )

  const reranked = await cohere.rerank({
    model: "rerank-english-v3.0",
    query: question,
    documents,
    topN
  })

  return reranked.results.map(r => ({
    text: documents[r.index],
    score: r.relevanceScore,
    metadata: candidates[r.index]?.metadata
  }))
}


export async function retrieve(
  question: string,
  userId: string
) {
  // Phase 1 Hybrid
  const phase1 = await hybridSearch(question, userId)
  if (phase1.length === 0) return []


  const phase2 = await rerank(question, phase1, 3)
  return phase2
}


