import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFileSync } from "node:fs";
const html = readFileSync("dist/index.html");
const s = createServer((_q,r)=>{r.writeHead(200,{"content-type":"text/html"});r.end(html);});
await new Promise(r=>s.listen(4322,r));
const b = await chromium.launch();
const p = await b.newPage({viewport:{width:320,height:800}});
for (const route of ["/","/contact","/boutique/30-cartes-anti-doutes"]) {
  await p.goto("http://localhost:4322/#"+route,{waitUntil:"load"});
  await p.waitForTimeout(600);
  const r = await p.evaluate(()=>{
    const vw=document.documentElement.clientWidth, out=[];
    for(const el of document.querySelectorAll("body *")){
      const b=el.getBoundingClientRect(); const st=getComputedStyle(el);
      if(st.display==="none"||b.width===0) continue;
      if(b.right>vw+1){
        let clip=false; for(let q=el.parentElement;q;q=q.parentElement){if(["hidden","clip","auto","scroll"].includes(getComputedStyle(q).overflowX)){clip=true;break;}}
        out.push(`${el.tagName}.${String(el.className).slice(0,60)} | right=${Math.round(b.right)} w=${Math.round(b.width)} clip=${clip} | ${(el.textContent||"").trim().slice(0,30)}`);
      }
    }
    return out.slice(0,8);
  });
  console.log("=== "+route+" ==="); console.log(r.join("\n")||"(aucun)");
}
await b.close(); s.close();
