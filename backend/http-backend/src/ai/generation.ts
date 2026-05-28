import OpenAI from "openai"

const openrouter=new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey:process.env.OPENROUTER_API_KEY!,
    defaultHeaders:{
         "HTTP-Referer": "http://localhost:5173",
    "X-Title": "CEX AI Assistant"
    }
})

export async function  generateAnswar(
      question: string,
  context: string

 
){
const response=await openrouter.chat.completions.create({
    model: "openai/gpt-3.5-turbo",
    messages:[
       // generation.ts
{
  role: "system",
  content: `You are an expert crypto trading assistant.
    You have access to:
    1. User's personal trade history
    2. Current market data

    For trading questions:
    → Analyze user's past trades
    → Consider current market conditions
    → Give actionable advice
    → Mention risks

    Never give guaranteed predictions.
    Always mention crypto is volatile.`
},
       {
        role: "user",
        content: `
          Context from trading data:
          ${context}

          Question: ${question}
        `
      }

    ],
       max_tokens: 500,
    temperature: 0.3
})
 return response.choices[0]?.message?.content
    ?? "Could not generate answer"
}