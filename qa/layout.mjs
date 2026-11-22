/**
 * Contrôle qualité réel dans Chromium (Playwright).
 * Vérifie, à 10 largeurs : débordements horizontaux, éléments hors fenêtre,
 * textes rognés, chevauchements de blocs de texte, erreurs console, ressources cassées.
 *
 *   node qa/layout.mjs            (démarre un serveur statique sur dist/)
 */
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFileSync, existsSync, mkdirSync } from "node:fs";
import { extname, join } from "node:path";

const PORT = 4321;
const html = readFileSync("dist/index.html");
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml" };
const serveur = createServer((req, res) => {
  const u = (req.url || "/").split("?")[0];
  const f = join("dist", u);
  if (u !== "/" && existsSync(f) && extname(f)) {
    res.writeHead(200, { "content-type": types[extname(f)] || "application/octet-stream" });
    res.end(readFileSync(f));
  } else {
    res.writeHead(200, { "content-type": "text/html" });
    res.end(html);
  }
});
await new Promise((r) => serveur.listen(PORT, r));

const LARGEURS = [320, 360, 375, 390, 430, 768, 1024, 1280, 1440, 1920];
const ROUTES = ["/", "/le-livre", "/quiz", "/cartes", "/defis", "/bibliotheque", "/boutique", "/boutique/30-cartes-anti-doutes", "/parcours/explorateur", "/communaute", "/a-propos", "/contact", "/notes-de-fabrication"];

mkdirSync("qa/captures", { recursive: true });
const navigateur = await chromium.launch();
let total = 0;
const rapport = [];

for (const largeur of LARGEURS) {
  const page = await navigateur.newPage({ viewport: { width: largeur, height: 900 }, deviceScaleFactor: 1 });
  const erreurs = [];
  page.on("console", (m) => m.type() === "error" && erreurs.push(m.text().slice(0, 160)));
  page.on("pageerror", (e) => erreurs.push("JS: " + e.message.slice(0, 160)));
  page.on("requestfailed", (r) => erreurs.push("404?: " + r.url().slice(0, 90)));

  for (const route of ROUTES) {
    await page.goto(`http://localhost:${PORT}/#${route}`, { waitUntil: "load" });
    await page.waitForTimeout(largeur >= 1024 ? 700 : 450);
    // déclenche les révélations sur toute la hauteur
    await page.evaluate(async () => {
      const pas = window.innerHeight * 0.8;
      for (let y = 0; y < document.body.scrollHeight; y += pas) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 45));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(250);

    const soucis = await page.evaluate(() => {
      const out = [];
      const vw = document.documentElement.clientWidth;
      if (document.documentElement.scrollWidth > vw + 1)
        out.push({ type: "page-large", detail: `${document.documentElement.scrollWidth} > ${vw}` });

      // Exclusions légitimes : contenu réservé aux lecteurs d'écran, calques 3D
      // superposés volontairement (livre), et faces cachées d'une carte à retourner.
      const ignore = (el) =>
        !!el.closest(".sr-only, .preserve-3d, [data-scene-3d]") ||
        el.classList.contains("sr-only") ||
        !!el.closest(".backface-hidden");

      const visibles = [...document.querySelectorAll("body *")].filter((el) => {
        const s = getComputedStyle(el);
        if (s.display === "none" || s.visibility === "hidden" || s.opacity === "0") return false;
        if (ignore(el)) return false;
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      });

      for (const el of visibles) {
        const r = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        if (s.position === "fixed") continue;
        // hors fenêtre à droite (les scènes horizontales épinglées sont dans un conteneur clipé)
        if (r.right > vw + 2 && r.width < vw * 1.6) {
          let clip = false;
          for (let p = el.parentElement; p; p = p.parentElement) {
            const ps = getComputedStyle(p);
            if (["hidden", "clip", "auto", "scroll"].includes(ps.overflowX)) { clip = true; break; }
          }
          if (!clip) out.push({ type: "hors-fenetre", detail: `${el.tagName}.${(el.className || "").toString().slice(0, 46)} right=${Math.round(r.right)}` });
        }
        // texte rogné verticalement par une hauteur contrainte
        if (el.children.length === 0 && el.textContent.trim().length > 12) {
          if (el.scrollHeight > el.clientHeight + 3 && ["hidden", "clip"].includes(s.overflowY))
            out.push({ type: "texte-rogne", detail: `${el.tagName} "${el.textContent.trim().slice(0, 40)}"` });
        }
      }

      // chevauchement entre blocs de texte de sections différentes
      const blocs = [...document.querySelectorAll("h1, h2, h3, p, .btn")].filter((el) => {
        const r = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        if (ignore(el)) return false;
        // une scène épinglée en cours d'animation est une superposition voulue
        if (el.closest(".pin-spacer")) return false;
        return r.width > 40 && r.height > 12 && s.visibility !== "hidden" && s.opacity !== "0" && el.textContent.trim();
      });
      for (let i = 0; i < blocs.length; i++) {
        for (let j = i + 1; j < blocs.length; j++) {
          const a = blocs[i], b = blocs[j];
          if (a.contains(b) || b.contains(a)) continue;
          const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
          const ox = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left);
          const oy = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
          if (ox > 8 && oy > 8) {
            const aire = ox * oy;
            const petite = Math.min(ra.width * ra.height, rb.width * rb.height);
            if (aire / petite > 0.2)
              out.push({ type: "chevauchement", detail: `"${a.textContent.trim().slice(0, 26)}" ×  "${b.textContent.trim().slice(0, 26)}"` });
          }
        }
      }
      return out.slice(0, 12);
    });

    if (soucis.length) {
      total += soucis.length;
      rapport.push({ largeur, route, soucis });
    }
    if (largeur === 390 || largeur === 1440) {
      const nom = `${largeur}${route === "/" ? "-accueil" : route.replace(/\//g, "_")}.png`;
      await page.screenshot({ path: `qa/captures/${nom}`, fullPage: largeur === 390 ? false : false });
    }
  }
  if (erreurs.length) rapport.push({ largeur, route: "console", soucis: [...new Set(erreurs)].slice(0, 6).map((e) => ({ type: "console", detail: e })) });
  await page.close();
}

await navigateur.close();
serveur.close();

if (!rapport.length) console.log("✓ Aucun défaut de layout détecté sur 13 routes × 10 largeurs.");
else {
  for (const r of rapport) {
    console.log(`\n[${r.largeur}px] ${r.route}`);
    for (const s of r.soucis) console.log(`   ✗ ${s.type} — ${s.detail}`);
  }
  console.log(`\n${total} anomalie(s) de layout.`);
}
