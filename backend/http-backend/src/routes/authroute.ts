//$env:DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/cex"
import {Router} from "express";
export const authrouter:Router=Router();
import { CreateUserSchema } from "validation";
import { LoginSchema } from "validation";
import bcrypt from 'bcrypt'
import { secret } from "../middleware/secret";
import{prisma} from "db";
import jwt from "jsonwebtoken"
authrouter.post("/signup",async(req,res)=>{
    const parseData=CreateUserSchema.safeParse(req.body);
    if(!parseData.success){
        console.log(parseData.error);
    res.json({
        message:"Incorrect inputs"
    })
    return;
    }
    try{
        const {email, username, passwordHash}=parseData.data;
        const hashPassword=await bcrypt.hash(passwordHash,10);
        const user=await prisma.user.create({
            data:{
                email,
                username,
                passwordHash:hashPassword

            }
        })
        res.json({
            userId:user.id
        })
    }catch(error){
        res.status(409).json({
            message:"User already exists"
         })
    }
    });

    authrouter.post("/signin",async(req,res)=>{
        const parseData=LoginSchema.safeParse(req.body);
        if(!parseData.success){
            console.log(parseData.error)
            res.json({
              message:"incorrect Inputs"
            })
            return;
        }
        try{
            const {email,passwordHash}=parseData.data;
            let user=await prisma.user.findFirst({
                where:{
                    email
                }
            })
            if(!user){
                return  res.status(401).json({
                    message:"user not found"
                })
        }
        const isPassword=await bcrypt.compare(passwordHash, user.passwordHash);
        if (!isPassword) {
            res.status(401).json({
                message: "Invalid credentials"
            });
            return;
        }
        
       const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "7d" })
res.json({ userId: user.id, token })
    }  catch(error) {
        res.status(500).json({
            message:"Internal server error"
        })
    }
    })
  

    

 