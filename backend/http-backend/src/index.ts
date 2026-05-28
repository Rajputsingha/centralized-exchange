//$env:DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/cex"
import express from "express";
import "dotenv/config";
import cors from "cors";

console.log("OPENROUTER:", process.env.PINECONE_API_KEY);
console.log("COHERE:", process.env.COHERE_API_KEY);
console.log("PINECONE:", process.env.OPENROUTER_API_KEY);

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    })
);
app.use(express.json());

// Simple request logger for debugging
app.use((req, res, next) => {
    try {
        console.log("[HTTP]", req.method, req.path, "Authorization:", req.headers.authorization ?? "<none>");
    } catch (e) {}
    next();
});

import { authrouter } from "./routes/authroute";
import { orderBookrouter } from "./routes/orderBook";
import { connectRedis } from "./config/redis";
import { tradeRouter } from "./routes/tradeRoutes";
import { aiRouter } from "./routes/aiRoutes";
app.use("/api/auth", authrouter);
app.use("/api", orderBookrouter);
app.use("/api",tradeRouter);
app.use("/api",aiRouter);

await connectRedis()

app.listen(8080,()=>{
    console.log("server listining to the request ");
})

