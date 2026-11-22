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

const imageCategorie: Record<string, string> = {
  Identité: "/cards/identity.jpg",
  Talent: "/cards/talent.jpg",
  Courage: "/cards/courage.jpg",
  "Regard des autres": "/cards/community.jpg",
  Progression: "/cards/vision.jpg",
  Vision: "/cards/vision.jpg",
  "Famille & Pression": "/cards/community.jpg",
  Confiance: "/cards/identity.jpg",
  Action: "/cards/courage.jpg",
  Résilience: "/cards/vision.jpg",
};

export function CarteDoute({ carte, hauteur = 340 }: { carte: Carte; hauteur?: number }) {
  const [tournee, setTournee] = useState(false);
  const fil = filCategorie[carte.category] || "#FFB000";
  const image = imageCategorie[carte.category] || "/cards/identity.jpg";

  return (
    <button
      type="button"
      onClick={() => setTournee((v) => !v)}
      aria-pressed={tournee}
      aria-label={`Carte ${carte.id}, ${carte.category}. ${tournee ? "Affirmation" : "Doute"} : ${tournee ? carte.affirmation : carte.doute}. Activer pour retourner la carte.`}
      className="group block w-full text-left"
      style={{ perspective: "1500px", height: hauteur }}
    >
      <span
        className="preserve-3d relative block h-full w-full transition-transform duration-[700ms]"
        style={{ transform: tournee ? "rotateY(180deg)" : "rotateY(0deg)", transitionTimingFunction: "cubic-bezier(.2,.8,.2,1)" }}
      >
        {/* recto : le doute, encre sur papier */}
        <span
          className="backface-hidden absolute inset-0 flex flex-col justify-between rounded-[22px] bg-[#FFF8EC] p-5 text-[#321044] shadow-[0_10px_28px_rgba(50,16,68,0.14)] transition-shadow duration-300 group-hover:shadow-[0_16px_36px_rgba(50,16,68,0.22)]"
        >
          <span className="flex items-center justify-between">
            <span className="rounded-full px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#FFF8EC]" style={{ background: fil }}>
              {carte.category}
            </span>
            <span className="font-mono text-[12px] font-bold opacity-45">#{String(carte.id).padStart(2, "0")}</span>
          </span>
          <span className="mt-3 block h-[112px] overflow-hidden rounded-[14px]">
            <img src={image} alt="Jeune Africain noir dans un moment de confiance et de réflexion" className="h-full w-full object-cover" loading="lazy" />
          </span>
          <span className="block font-display text-[25px] font-extrabold uppercase leading-[0.92] tracking-[-0.035em]">
            {carte.doute}
          </span>
          <span className="flex items-center gap-2 border-t border-[#321044]/15 pt-3 font-mono text-[10.5px] font-bold uppercase tracking-[0.14em]">
            <RotateCcw size={13} /> Retourner
          </span>
        </span>

        {/* verso : l'affirmation, aplat d'encre */}
        <span
          className="backface-hidden absolute inset-0 flex flex-col justify-between rounded-[22px] p-5 text-[#FFF8EC] shadow-[0_10px_28px_rgba(50,16,68,0.14)]"
          style={{ transform: "rotateY(180deg)", background: fil }}
        >
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] opacity-80">Affirmation {String(carte.id).padStart(2, "0")}</span>
          <span className="block h-[92px] overflow-hidden rounded-[14px]">
            <img src={image} alt="Jeune Africain noir dans un moment de confiance et de réflexion" className="h-full w-full object-cover" loading="lazy" />
          </span>
          <span className="block font-display text-[22px] font-extrabold uppercase leading-[0.95] tracking-[-0.03em]">{carte.affirmation}</span>
          <span className="block rounded-[14px] bg-[#FFF8EC] p-3 text-[12.5px] leading-snug text-[#321044]">
            <span className="mb-1 block font-mono text-[9.5px] font-bold uppercase tracking-[0.14em]" style={{ color: fil }}>
              Action
            </span>
            {carte.action}
          </span>
        </span>
      </span>
    </button>
  );
}
