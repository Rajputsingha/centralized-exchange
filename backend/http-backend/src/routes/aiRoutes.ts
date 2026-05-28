import { Router } from "express";
import type { Request, Response } from "express"
import { authmiddleware } from "../middleware/authmiddleware";
import {  ingestUserTrades } from "../ai/ingention";
import { retrieve } from "../ai/retrieval";
import { generateAnswar } from "../ai/generation";
import { ingestMarketNews } from "../ai/ingention";
export const aiRouter:Router=Router()
aiRouter.use(authmiddleware)

interface AuthRequest extends Request {
  userId?: string
}
aiRouter.post("/ai/chat",async(req:AuthRequest,res:Response)=>{
    const {question}=req.body;
    const userId=req.userId;
      if (!userId) {
    res.status(401).json({ message: "Unauthorized" })
    return
  }
     if (!question) {
    res.status(400).json({ message: "Question required" })
    return
  }
 
  
  try {
      await ingestUserTrades(userId)
      await ingestMarketNews("BTC_USD")  
await ingestMarketNews("SOL_USD")
await ingestMarketNews("ETH_USD")
      const results = await retrieve(question, userId)
      // Build context
          const context = results.length > 0
      ? results.map(r => r.text).join("\n\n")
      : "No trading data available yet"
      // generate answar
 const answer = await generateAnswar(question, context);

   res.json({
      answer,
      chunks_used: results.length
    })
  }catch (err: any) {
    console.error("RAG error:", err.message)
    res.status(500).json({ message: "AI unavailable" })
  }
})