import { redisClient,redisSubscriber} from "../config/redis";

export async function placeOrder(orderData:{
    userId: string;
    market: string;
    price: number;
    qty: number;
    type: string;
    side: string;

}) {
    const order = {
        id: crypto.randomUUID(),
        ...orderData,
        filledQty: 0,
        status: "OPEN",
}
await redisClient.lPush("incoming-order", JSON.stringify(order)); //sends to ws-backend engine

const response = await redisSubscriber.brPop( //WAITS for ws-backend response
  `order-response-${order.userId}`,
  5
);

if (!response) throw new Error("Engine timeout");

return JSON.parse(response.element);
}