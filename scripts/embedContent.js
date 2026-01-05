import fs from "fs";
import { pipeline } from "@xenova/transformers";

const embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
const content = JSON.parse(fs.readFileSync("./data/siteContent.json"));

const vectors = [];

for (const text of content) {
  const emb = await embedder(text, { pooling: "mean", normalize: true });
  vectors.push({ content: text, embedding: Array.from(emb.data) });
}

fs.writeFileSync("./data/siteVectors.json", JSON.stringify(vectors));
console.log("Local vectors stored.");
