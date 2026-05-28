import { Pinecone } from "@pinecone-database/pinecone";
const pinecone=new Pinecone({
    apiKey:process.env.PINECONE_API_KEY!
})
console.log(await pinecone.listIndexes());
export const index = pinecone.index("cex-trades")