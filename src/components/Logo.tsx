import { useId } from "react";

/**
 * Logo « Active ton Superpouvoir — La Fabrique des Héros », redessiné en vecteur net
 * d'après le logo fourni (cadre arrondi, étoile à éclair, filet vertical, trois lignes de texte).
 * `clair` : version vanille pour fond aubergine ; sinon version aubergine pour fond vanille.
 */
export function Logo({ clair = false, className = "" }: { clair?: boolean; className?: string }) {
  const encre = clair ? "#FFF0D9" : "#321044";
  const fond = clair ? "#321044" : "#FFF0D9";
  const id = useId().replace(/:/g, "");
  const etoile = "50,7 60,36.3 90.9,36.7 66.2,55.3 75.3,84.8 50,67 24.7,84.8 33.8,55.3 9.1,36.7 40,36.3";
  const police = { fontFamily: "var(--font-display)" } as const;

  return (
    <svg viewBox="0 0 502 112" className={className} role="img" aria-label="Active ton Superpouvoir — La Fabrique des Héros">
      <title>Active ton Superpouvoir — La Fabrique des Héros</title>
      <defs>
        <clipPath id={`logo-${id}`}>
          <polygon points={etoile} />
        </clipPath>
      </defs>
      <rect x="3" y="3" width="106" height="106" rx="22" fill="none" stroke={encre} strokeWidth="4" />
      <g transform="translate(6 10)">
        <polygon points={etoile} fill={encre} />
        <path d="M 57,20 L 36,54 L 47,54 L 43,82 L 63,47 L 52,47 Z" fill={fond} clipPath={`url(#logo-${id})`} />
      </g>
      <rect x="128" y="14" width="3" height="84" fill={encre} />
      <text x="152" y="38" fontSize="17" fontWeight="700" letterSpacing="5" fill={encre} style={police}>
        ACTIVE TON
      </text>
      <text x="150" y="82" fontSize="44" fontWeight="800" fill={encre} textLength="344" lengthAdjust="spacingAndGlyphs" style={police}>
        SUPERPOUVOIR
      </text>
      <text x="152" y="102" fontSize="11.5" fontWeight="600" letterSpacing="4.2" fill={encre} textLength="340" lengthAdjust="spacing" style={police}>
        LA FABRIQUE DES HÉROS
      </text>
    </svg>
  );
}
