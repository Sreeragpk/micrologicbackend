import fs from "fs";
import path from "path";

const SRC_DIR = "../micrologic/src";

const results = [];

function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    const stat = fs.statSync(p);

    if (stat.isDirectory()) walk(p);
    else if (f.endsWith(".jsx") || f.endsWith(".js")) {
      const text = fs.readFileSync(p, "utf8");
      const matches = text.matchAll(/<(h1|h2|p)[^>]*>(.*?)<\/\1>/gs);
      for (const m of matches) {
        const clean = m[2].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
        if (clean.length > 20) results.push(clean);
      }
    }
  }
}

walk(SRC_DIR);
fs.writeFileSync("./data/siteContent.json", JSON.stringify(results, null, 2));
console.log("Extracted", results.length, "blocks.");
