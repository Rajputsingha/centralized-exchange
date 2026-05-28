// ai/embeddings.ts
import OpenAI from "openai"

const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY!
})

export async function getEmbedding(text: string) {
  const response = await openrouter.embeddings.create({
    model: "openai/text-embedding-3-small",
    input: text,
  })
  const embedding = response.data?.[0]?.embedding // give me the first item of array
  if (!embedding) {
    throw new Error("Embedding not returned from OpenAI/OpenRouter API")
  }
  return embedding
}