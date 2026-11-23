import type { ReactNode } from "react";

/**
 * Variantes de découpe disponibles (voir src/styles/decoupes.css).
 * NOTE : ce composant suppose que `decoupes.css` est importé quelque part
 * dans l'app (il ne l'importe pas lui-même) — ex. depuis src/index.css.
 */
export type VarianteDecoupe =
  | "vague-bas"
  | "vague-haut"
  | "dechiree"
  | "vague-bas-douce"
  | "vague-bas-prononcee";

const CLASSES_PAR_VARIANTE: Record<VarianteDecoupe, string> = {
  "vague-bas": "decoupe-vague-bas",
  "vague-haut": "decoupe-vague-haut",
  dechiree: "decoupe-dechiree",
  "vague-bas-douce": "decoupe-vague-bas decoupe-vague-bas--douce",
  "vague-bas-prononcee": "decoupe-vague-bas decoupe-vague-bas--prononcee",
};

/**
 * Petit cadre qui applique une découpe « papier déchiré / vague » (façon
 * stayveluwe.com) à son contenu — typiquement une `<img>`, mais ça marche
 * avec n'importe quel enfant (vidéo, bloc de couleur, etc.).
 *
 * Usage :
 *   <CadreDecoupe variante="vague-bas">
 *     <img src="..." alt="..." className="h-full w-full object-cover" />
 *   </CadreDecoupe>
 */
export function CadreDecoupe({
  variante = "vague-bas",
  className = "",
  children,
}: {
  variante?: VarianteDecoupe;
  className?: string;
  children: ReactNode;
}) {
  const classesDecoupe = CLASSES_PAR_VARIANTE[variante];

  return (
    <div className={`decoupe relative ${classesDecoupe} ${className}`}>
      {children}
    </div>
  );
}
