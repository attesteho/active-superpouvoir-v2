import { Livre } from "./Livre";
import { usePetitEcran } from "../lib/motion";
import type { Produit } from "../data/site";

/** Chaque pièce sous sa vraie forme : volume, deck ou affiche. Aucun visuel photographique n'existe. */
export function VisuelProduit({
  produit,
  largeur: demande = 190,
  flottera = false,
}: {
  produit: Produit;
  largeur?: number;
  flottera?: boolean;
}) {
  // L'éventail de cartes est plus large que le plat : on réduit réellement la taille
  // sur petit écran au lieu de laisser dépasser du conteneur.
  const petit = usePetitEcran(640);
  const largeur = petit ? Math.min(demande, 208) : demande;

  if (produit.type === "Cartes") {
    const h = largeur * 1.34;
    return (
      <div className="relative" style={{ width: largeur, height: h }}>
        {[0, 1, 2].map((k) => (
          <div
            key={k}
            className="absolute rounded-[14px] transition-transform duration-500"
            style={{
              transform: `rotate(${(k - 1) * 8}deg) translateY(${k * -7}px)`,
              background: k === 2 ? "#FFF8EC" : k === 1 ? "#FFB000" : "#F3781E",
              boxShadow: k === 2 ? "0 12px 28px rgba(50,16,68,0.18)" : "none",
            }}
          >
            {k === 2 && (
              <div className="flex flex-col justify-between text-[#321044]">
                <span className="font-mono font-bold uppercase" style={{ fontSize: largeur * 0.052 }}>
                  Anti-doutes
                </span>
                <span className="font-display font-extrabold uppercase" style={{ fontSize: largeur * 0.105 }}>
                  Je n’ai aucun talent particulier.
                </span>
                <span className="border-t border-[#321044]/15 font-mono font-bold uppercase" style={{ fontSize: largeur * 0.052 }}>
                  30 cartes
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (produit.type === "Poster") {
    return (
      <div
        className="relative flex items-center justify-center rounded-[18px] bg-[#FFF8EC] ombre-sm"
        style={{ width: largeur, height: largeur * 1.414 }}
        role="img"
        aria-label="Poster Ikigai A3 : quatre cercles qui se croisent"
      >
        <svg viewBox="0 0 100 128" className="">
          <g style={{ mixBlendMode: "multiply" }}>
            {[
              [40, 50, "#FFB000"],
              [60, 50, "#FFB000"],
              [40, 70, "#FFB000"],
              [60, 70, "#FFB000"],
            ].map(([cx, cy, c]) => (
              <circle key={String(c)} cx={cx as number} cy={cy as number} r="24" fill={c as string} opacity="0.78" />
            ))}
          </g>
          <text x="50" y="16" textAnchor="middle" fontSize="9" fill="#321044" fontFamily="Bricolage Grotesque, sans-serif" fontWeight="800">
            IKIGAI
          </text>
          <text x="50" y="118" textAnchor="middle" fontSize="6" fill="#321044" fontFamily="Space Mono, monospace">
            POSTER A3
          </text>
        </svg>
      </div>
    );
  }

  return <Livre largeur={largeur} inclinaison={-16} ouverture={0} interactif={!flottera} flottera={flottera} priere={produit.nom} />;
}
