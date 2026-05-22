
import {z}from  "zod";
export const CreateUserSchema=z.object({
    email: z.string().email("Invalid email format"),
    username: z.string().min(3, "Username must be at least 3 characters").max(20, "Username must be less than 20 characters"),
    passwordHash: z.string().min(6, "Password must be at least 6 characters").max(100, "Password must be less than 100 characters"),
});

export const LoginSchema = z.object({
    email: z.string().email("Invalid email format"),
    passwordHash: z.string().min(6, "Password must be at least 6 characters"),
  });
export const createOrderSchema = z.object({
    market: z.string().min(3),
  
    price: z.number().positive(),
  
    qty: z.number().positive(),
  
    side: z.enum(["BUY", "SELL"]),
  
    type: z.enum(["LIMIT", "MARKET"]),
  });