// import express from "express";
// import fs from "fs";
// import { pipeline } from "@xenova/transformers";

// const router = express.Router();
// const embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
// const vectors = JSON.parse(fs.readFileSync("./data/siteVectors.json"));

// function cosine(a,b){
//   let d=0,na=0,nb=0;
//   for(let i=0;i<a.length;i++){d+=a[i]*b[i];na+=a[i]*a[i];nb+=b[i]*b[i];}
//   return d/(Math.sqrt(na)*Math.sqrt(nb));
// }

// router.post("/", async (req,res)=>{
//   const q = req.body.message;
//   const qe = await embedder(q,{pooling:"mean",normalize:true});
//   const qv = Array.from(qe.data);

//   const scored = vectors.map(v=>({...v,score:cosine(qv,v.embedding)}));
//   const top = scored.sort((a,b)=>b.score-a.score).slice(0,3);

//   const reply = top.map(t=>`• ${t.content}`).join("\n");

//   res.json({ reply });
// });

// export default router;
import express from "express";
import fs from "fs";
import { pipeline } from "@xenova/transformers";

const router = express.Router();
const embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");

const VECTOR_FILE = "./data/siteVectors.json";
let vectors = [];

async function loadVectors() {
  if (fs.existsSync(VECTOR_FILE)) {
    vectors = JSON.parse(fs.readFileSync(VECTOR_FILE));
    console.log("Loaded existing vectors:", vectors.length);
  } else {
    console.log("Vectors missing — generating...");
    const content = JSON.parse(fs.readFileSync("./data/siteContent.json"));
    for (const text of content) {
      const emb = await embedder(text, { pooling: "mean", normalize: true });
      vectors.push({ content: text, embedding: Array.from(emb.data) });
    }
    fs.writeFileSync(VECTOR_FILE, JSON.stringify(vectors));
    console.log("Vectors generated:", vectors.length);
  }
}

await loadVectors();

function cosine(a,b){
  let d=0,na=0,nb=0;
  for(let i=0;i<a.length;i++){d+=a[i]*b[i];na+=a[i]*a[i];nb+=b[i]*b[i];}
  return d/(Math.sqrt(na)*Math.sqrt(nb));
}

router.post("/", async (req,res)=>{
  const q = req.body.message;
  const qe = await embedder(q,{pooling:"mean",normalize:true});
  const qv = Array.from(qe.data);

  const scored = vectors.map(v=>({...v,score:cosine(qv,v.embedding)}));
  const top = scored.sort((a,b)=>b.score-a.score).slice(0,3);

  const reply = top.map(t=>`• ${t.content}`).join("\n");
  res.json({ reply });
});

export default router;
