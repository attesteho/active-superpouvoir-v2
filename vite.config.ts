import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Déployé sous un sous-chemin (ex. GitHub Pages : username.github.io/<dépôt>/), fourni au build
// via VITE_BASE ; "/" en local (dev et build par défaut), donc rien ne change hors déploiement.
const base = process.env.VITE_BASE || "/";

/** Les chemins vers `public/images`, `public/book`, `public/press-logos` sont écrits en dur comme
    des chemins absolus (`"/images/..."`) dans de nombreux fichiers sources — corrects à la racine
    d'un domaine, mais cassés sous un sous-chemin. `base` de Vite ne réécrit que les tags qu'il gère
    lui-même (script/link), jamais ces chaînes littérales. On les corrige donc après coup, dans le
    HTML final (un seul fichier, tout y est déjà inliné par vite-plugin-singlefile à ce stade). */
function prefixerCheminsPublics(): Plugin {
  return {
    name: "prefixer-chemins-publics",
    apply: "build",
    closeBundle() {
      if (base === "/") return;
      const prefixe = base.endsWith("/") ? base : `${base}/`;
      const fichier = path.resolve(__dirname, "dist/index.html");
      if (!fs.existsSync(fichier)) return;
      // Les chemins sont tantôt des chaînes simples ("/images/x.webp"), tantôt des gabarits
      // de chaîne avec interpolation (`/images/${c}`, préservés tels quels par la minification
      // dès qu'ils contiennent une interpolation) — il faut couvrir les deux guillemets.
      let html = fs.readFileSync(fichier, "utf-8");
      for (const dossier of ["images/", "book/", "press-logos/"]) {
        for (const guillemet of ['"', "`"]) {
          html = html.split(`${guillemet}/${dossier}`).join(`${guillemet}${prefixe}${dossier}`);
        }
      }
      fs.writeFileSync(fichier, html);
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react(), tailwindcss(), viteSingleFile(), prefixerCheminsPublics()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
