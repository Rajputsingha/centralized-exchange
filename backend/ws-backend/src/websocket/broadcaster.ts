import { prisma} from "db";
import { WebSocket } from "ws";

const rooms=new Map<string,Set<WebSocket>>();

export function subscribe(market:string, ws:WebSocket){
    if(!rooms.has(market)){ // check  market exist or not 
        rooms.set(market, new Set()) // set the market
    }

    rooms.get(market)!.add(ws) //now safly add client
    console.log(`Client subscribed to ${market}`)
}
export function unsubscribe(market:string, ws:WebSocket){
    const room= rooms.get(market);
    if(!room) return;
    room.delete(ws)
  console.log(`Client unsubscribed from ${market}`)

  // cleanup empty room
  if (room.size === 0) {
    rooms.delete(market)
  }

}

export function broadcast(market:string, data:any){
    const room=rooms.get(market);
    if(!room) return;


    const message=JSON.stringify(data);

    for(const ws of room){
        if(ws.readyState===WebSocket.OPEN){
            ws.send(message)
        } else{
            room.delete(ws);
        }
    }

}
// Get number of clients in market
export function getRoomSize(market: string): number {
    return rooms.get(market)?.size ?? 0
  }
