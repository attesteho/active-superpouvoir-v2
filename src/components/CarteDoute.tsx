import { useState } from "react";
import { RotateCcw } from "lucide-react";

export type Carte = { id: number; category: string; doute: string; affirmation: string; action: string };

export const filCategorie: Record<string, string> = {
  Identité: "#F3781E",
  Talent: "#FFB000",
  Courage: "#FF6F59",
  "Regard des autres": "#2E7D8C",
  Progression: "#F3781E",
  Vision: "#FFB000",
  "Famille & Pression": "#FF6F59",
  Confiance: "#2E7D8C",
  Action: "#321044",
  Résilience: "#F3781E",
};

/** Uniquement des illustrations du livre — aucune photo stock. */
const imageCategorie: Record<string, string> = {
  Identité: "/book/illus-pointe.jpg",
  Talent: "/book/illus-bureau.jpg",
  Courage: "/book/fond-sarcelle-doutes.jpg",
  "Regard des autres": "/book/illus-marche.jpg",
  Progression: "/book/illus-chemin-heros.jpg",
  Vision: "/book/illus-ikigai.jpg",
  "Famille & Pression": "/book/illus-marche.jpg",
  Confiance: "/book/illus-pointe.jpg",
  Action: "/book/illus-chemin-heros.jpg",
  Résilience: "/book/fond-sarcelle-doutes.jpg",
};

export function CarteDoute({ carte, hauteur = 340 }: { carte: Carte; hauteur?: number }) {
  const [tournee, setTournee] = useState(false);
  const fil = filCategorie[carte.category] || "#FFB000";
  const image = imageCategorie[carte.category] || "/book/illus-pointe.jpg";

  return (
    <button
      type="button"
      onClick={() => setTournee((v) => !v)}
      aria-pressed={tournee}
      aria-label={`Carte ${carte.id}, ${carte.category}. ${tournee ? "Affirmation" : "Doute"} : ${tournee ? carte.affirmation : carte.doute}. Activer pour retourner la carte.`}
      className="carte-doute block w-full text-left"
      style={{ perspective: "1500px", height: hauteur }}
    >
      <span className="carte-doute-flip" style={{ transform: tournee ? "rotateY(180deg)" : "rotateY(0deg)" }}>
        {/* recto : le doute, encre sur papier */}
        <span className="carte-doute-face carte-doute-face--recto">
          <span className="flex items-center justify-between">
            <span className="carte-doute-chip" style={{ background: fil }}>
              {carte.category}
            </span>
            <span className="font-mono text-xs font-bold opacity-45">#{String(carte.id).padStart(2, "0")}</span>
          </span>
          <span className="carte-doute-photo">
            <img src={image} alt="" aria-hidden="true" loading="lazy" />
          </span>
          <span className="carte-doute-texte">{carte.doute}</span>
          <span className="carte-doute-pied">
            <RotateCcw size={13} /> Retourner
          </span>
        </span>

        {/* verso : l'affirmation, aplat d'encre */}
        <span className="carte-doute-face carte-doute-face--verso" style={{ background: fil }}>
          <span className="carte-doute-chip">Affirmation {String(carte.id).padStart(2, "0")}</span>
          <span className="carte-doute-photo">
            <img src={image} alt="" aria-hidden="true" loading="lazy" />
          </span>
          <span className="carte-doute-texte">{carte.affirmation}</span>
          <span className="carte-doute-action">
            <span className="carte-doute-action-label" style={{ color: fil }}>
              Action
            </span>
            {carte.action}
          </span>
        </span>
      </span>
    </button>
  );
}
