import { WebSocket,WebSocketServer } from "ws";

import jwt from "jsonwebtoken";
import { secret } from "http-backend/secret";
import { prisma } from "./db/src";

const wss = new WebSocketServer({ port: 4000 });

interface  User  {
    ws:WebSocket,
    rooms:string[],
    userId:string,
}

const users:User[]=[];

function checkUser(token:string): string|null {
    try { 
        const decode=jwt.verify(token, secret) as any;
        return decode.userId ||null

    } catch {
        return null;
    }
}

wss.on("connection",(ws,request)=>{
    const url=request.url;
    if(!url) return;

    const query=new  URLSearchParams(url.split("?")[1]);
    const token=query.get("token") || "";
    const userId=checkUser(token);

    if(!userId){
        ws.close();
        return;
    }

    users.push({userId,rooms:[],ws});// push user to usersarray
    ws.on("message",async(data)=>{
        const msg=JSON.parse(data.toString())
    

        if(msg.type=== "subscribe") {
            const user=users.find((u)=> u.ws===ws);
            if (user) user.rooms.push(String(msg.roomId));
        }
        // unsubscribe
        if(msg.type==="unsubscribe") {
            const user = users.find((u) => u.ws === ws);
            if (user) {
              user.rooms = user.rooms.filter((r) => r !== String(msg.roomId));
            }
        }
        ws.on("close",()=>{
            console.log('Client disconnected');
        })
    })
    
})