import { Router } from "express";
import { authmiddleware } from "../middleware/authmiddleware";
import type { Request,Response} from "express";
import { prisma } from "db";

export const tradeRouter:Router=Router();
interface AuthenticatedRequest extends Request {
    userId?: string;
}

tradeRouter.use(authmiddleware);
tradeRouter.get("/trades/:market",async(req:AuthenticatedRequest,res:Response)=>{
 const { market } = req.params
  try {
    const trades = await prisma.fill.findMany({
      where: { market: Array.isArray(market) ? market[0] : market},
      orderBy: { createdAt: "desc" },
      take: 20
    })
    res.json({ trades })
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch trades" })
  }
})