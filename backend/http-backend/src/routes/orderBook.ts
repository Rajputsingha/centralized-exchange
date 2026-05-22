import {Router}from "express";
import type { Request,Response} from "express";
import { createOrderSchema } from "validation";
import { authmiddleware } from "../middleware/authmiddleware";
import { placeOrder } from "../services/orderService";

export const orderBookrouter:Router=Router();

interface AuthenticatedRequest extends Request {
    userId?: string;
}

orderBookrouter.use(authmiddleware);
orderBookrouter.post("/order",async(req:AuthenticatedRequest,res:Response)=>{
    const parseData=createOrderSchema.safeParse(req.body);
    if(!parseData.success){
        console.log(parseData.error);
        res.json({
            message:" Incorrect Inputs"
        })
        return;
    }
    const userId=req.userId;
    if(!userId){
        res.status(401).json({message:"Unauthorized"});
        return;
    
    }
   
    try {
        
        const result = await placeOrder({ userId, ...parseData.data });  // ← add this
        res.json({ message: "Order placed", result });
      } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
 


})