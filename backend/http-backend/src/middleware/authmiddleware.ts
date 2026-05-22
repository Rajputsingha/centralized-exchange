import type { Request, Response ,NextFunction} from "express";
import jwt from "jsonwebtoken"
import {secret} from "./secret";

interface AuthenticatedRequest extends Request {
    userId?: string;
  }
export function authmiddleware(
    req:AuthenticatedRequest, res:
    Response,
    next:NextFunction)  {
try{
    const authHeader=req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authorization header missing or invalid" });
      }
const token= authHeader.slice(7);
const decoded = jwt.verify(token, secret) as { userId: string };

req.userId = decoded.userId;
next();
} catch (err) {
return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
}  
}

