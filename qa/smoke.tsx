/**
 * Vérification de rendu — aucun navigateur n'est disponible dans cet environnement.
 * On effectue donc un rendu serveur de CHAQUE page et de CHAQUE variante dynamique,
 * puis on contrôle la présence des contenus attendus. Cela détecte les erreurs
 * d'exécution, les données manquantes et les routes cassées.
 *
 *   npx esbuild qa/smoke.tsx --bundle --platform=node --format=esm --loader:.css=empty --outfile=/tmp/smoke.mjs && node /tmp/smoke.mjs
 */
import { renderToString } from "react-dom/server";
import type { ReactElement } from "react";
import Accueil from "../src/pages/Accueil";
import LeLivre from "../src/pages/LeLivre";
import Quiz from "../src/pages/Quiz";
import Cartes from "../src/pages/Cartes";
import Defis from "../src/pages/Defis";
import Bibliotheque from "../src/pages/Bibliotheque";
import { Boutique, FicheProduit } from "../src/pages/Boutique";
import Parcours from "../src/pages/Parcours";
import Communaute from "../src/pages/Communaute";
import { APropos, Contact, Notes, Introuvable } from "../src/pages/Annexes";
import { produits, etapes } from "../src/data/site";

type Cas = { nom: string; el: ReactElement; attendus: string[] };

const cas: Cas[] = [
  { nom: "Accueil", el: <Accueil />, attendus: ["Tu es une réponse", "établi", "Explorateur", "Reconnecteur", "Kit Complet", "Fatoumata", "RTI"] },
  { nom: "Le livre", el: <LeLivre />, attendus: ["Radar Personnel", "Ikigai", "Méthode CAP", "Chemin du Héros", "Amina K."] },
  { nom: "Quiz", el: <Quiz />, attendus: ["Découvre ton", "Le Créateur", "Le Sage", "10"] },
  { nom: "Cartes", el: <Cartes />, attendus: ["Tire la carte", "Résilience", "Identité", "6 000 FCFA"] },
  // La mission 60 est derrière un dépliant : on vérifie la première mission de chaque défi.
  { nom: "Défis", el: <Defis />, attendus: ["Révèle ton superpouvoir", "Rituel du miroir", "MonIkigai", "Écris ta déclaration", "Voir les"] },
  { nom: "Bibliothèque", el: <Bibliotheque />, attendus: ["Poster Ikigai A3", "Tous les âges", "404"] },
  { nom: "Boutique", el: <Boutique />, attendus: ["10 000 FCFA", "3 000 FCFA", "14 900 FCFA", "32 000"] },
  { nom: "Communauté", el: <Communaute />, attendus: ["Fatoumata Diallo", "Pont d’Or", "Douala", "Mentors"] },
  { nom: "Qui suis-je", el: <APropos />, attendus: ["Nadine", "coach de vie", "biographie"] },
  { nom: "Contact", el: <Contact />, attendus: ["contact@nadinezoro.com", "Programmes écoles"] },
  { nom: "Notes", el: <Notes />, attendus: ["404", "GSAP", "prefers-reduced-motion"] },
  { nom: "404", el: <Introuvable chemin="/nulle-part" />, attendus: ["nulle-part", "Accueil"] },
  ...produits.map((p) => ({ nom: `Fiche ${p.slug}`, el: <FicheProduit slug={p.slug} />, attendus: [p.nom, "FCFA"] })),
  { nom: "Fiche inconnue", el: <FicheProduit slug="inexistant" />, attendus: ["n’existe pas"] },
  ...etapes.map((e) => ({ nom: `Parcours ${e.id}`, el: <Parcours id={e.id} />, attendus: [e.nom, e.faq[0].q.slice(0, 20)] })),
  { nom: "Parcours inconnu", el: <Parcours id="zzz" />, attendus: ["n’existe pas"] },
];

/* ——— Intégrité des données extraites du site source ——— */
import missions from "../src/data/defis.json";
import cartesData from "../src/data/cards.json";
import profilsData from "../src/data/profiles.json";
import quizData from "../src/data/quiz.json";

const m = missions as Record<string, string[]>;
const controles: [string, boolean][] = [
  ["7 missions au défi 7", m["7"].length === 7],
  ["30 missions au défi 30", m["30"].length === 30],
  ["60 missions au défi 60", m["60"].length === 60],
  ["30 cartes anti-doutes", cartesData.length === 30],
  ["10 familles de cartes", new Set(cartesData.map((c) => c.category)).size === 10],
  ["8 profils héros", Object.keys(profilsData).length === 8],
  ["10 questions de quiz", quizData.length === 10],
  ["4 options par question", quizData.every((q) => q.options.length === 4)],
  ["vecteurs de score à 8 dimensions", quizData.every((q) => q.options.every((o) => o.scores.length === 8))],
  ["5 produits au catalogue", produits.length === 5],
  ["4 étapes de vie", etapes.length === 4],
];
for (const [nom, ok] of controles) console.log(`${ok ? "✓" : "✗"} donnée — ${nom}`);

let echecs = controles.filter(([, ok]) => !ok).length;
const originales = console.error;
console.error = (...args: unknown[]) => {
  const t = String(args[0] ?? "");
  if (t.includes("useLayoutEffect does nothing on the server")) return;
  originales(...(args as []));
};

for (const c of cas) {
  try {
    const html = renderToString(c.el);
    const manquants = c.attendus.filter((a) => !html.includes(a));
    const vide = html.length < 400; // les pages d'erreur sont volontairement courtes
    if (manquants.length || vide) {
      echecs++;
      console.log(`✗ ${c.nom} — ${html.length} caractères${manquants.length ? ` — manquants : ${manquants.join(" | ")}` : " — rendu suspectement court"}`);
    } else {
      console.log(`✓ ${c.nom} — ${html.length} caractères`);
    }
  } catch (e) {
    echecs++;
    console.log(`✗ ${c.nom} — EXCEPTION : ${(e as Error).message}`);
  }
}

console.log(echecs === 0 ? `\nTOUT EST VERT (${cas.length} rendus)` : `\n${echecs} ÉCHEC(S) sur ${cas.length}`);
process.exit(echecs === 0 ? 0 : 1);
