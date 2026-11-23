import { useCallback, useEffect, useRef, useState } from "react";
import "./EtincellesCurseur.css";

/**
 * EtincellesCurseur — petites étincelles "super-pouvoir" qui suivent le curseur.
 *
 * Inspiré de l'effet abeilles/feuilles de stayveluwe.com : au lieu d'insectes,
 * on fait apparaître de petites étoiles/éclairs au fil du mouvement de la souris,
 * qui grossissent brièvement puis s'effacent en dérivant.
 *
 * Usage : <EtincellesCurseur /> — aucune prop requise. À monter une seule fois
 * près de la racine d'une page. Ne s'active que sur pointeur fin (souris) et
 * uniquement si l'utilisateur n'a pas demandé de réduire les animations.
 */

type FormeEtincelle = "etoile" | "eclair";

type Particule = {
  id: number;
  x: number;
  y: number;
  couleur: string;
  forme: FormeEtincelle;
  duree: number;
  tx: number;
  ty: number;
};

const COULEURS = ["var(--color-orange)", "var(--color-or)", "var(--color-corail)"];
const NB_MAX_PARTICULES = 16;
const INTERVALLE_MIN_MS = 45;

// Tracé étoile 4 branches extrait de src/icones/etoile-logo.svg (sans le cadre arrondi).
const TRACE_ETOILE = "m12 5 2.2 4.5 5 .7-3.6 3.5.8 5-4.4-2.3L7.6 19l.8-5L4.8 10.2l5-.7Z";
// Tracé éclair repris de src/icones/eclair.svg.
const TRACE_ECLAIR = "m13 2-9 12h7l-1 8 10-13h-7Z";

function FormeSvg({ forme, couleur }: { forme: FormeEtincelle; couleur: string }) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill={couleur}
      stroke="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d={forme === "etoile" ? TRACE_ETOILE : TRACE_ECLAIR} />
    </svg>
  );
}

function devraitEtreInerte(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return true;
  const prefereMouvementReduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pointeurGrossier = window.matchMedia("(pointer: coarse)").matches;
  return prefereMouvementReduit || pointeurGrossier;
}

export function EtincellesCurseur() {
  const [inerte] = useState(devraitEtreInerte);
  const [particules, setParticules] = useState<Particule[]>([]);
  const actif = useRef(false);
  const dernierSpawn = useRef(0);
  const compteurId = useRef(0);

  const retirerParticule = useCallback((id: number) => {
    setParticules((prev) => prev.filter((p) => p.id !== id));
  }, []);

  useEffect(() => {
    if (inerte) {
      // Composant inerte : aucun écouteur, aucun rendu (mouvement réduit ou pointeur tactile).
      return;
    }

    actif.current = true;

    function gererMouvement(e: PointerEvent) {
      if (!actif.current) return;
      if (e.pointerType === "touch") return;

      const maintenant = performance.now();
      if (maintenant - dernierSpawn.current < INTERVALLE_MIN_MS) return;
      dernierSpawn.current = maintenant;

      const id = ++compteurId.current;
      const couleur = COULEURS[id % COULEURS.length];
      const forme: FormeEtincelle = id % 2 === 0 ? "etoile" : "eclair";
      const duree = 600 + Math.random() * 300; // 600–900ms
      const tx = (Math.random() - 0.5) * 24;
      const ty = (Math.random() - 0.5) * 24 - 6; // légère dérive vers le haut

      setParticules((prev) => {
        const next = [...prev, { id, x: e.clientX, y: e.clientY, couleur, forme, duree, tx, ty }];
        if (next.length > NB_MAX_PARTICULES) {
          return next.slice(next.length - NB_MAX_PARTICULES);
        }
        return next;
      });
    }

    window.addEventListener("pointermove", gererMouvement, { passive: true });

    return () => {
      actif.current = false;
      window.removeEventListener("pointermove", gererMouvement);
    };
  }, [inerte]);

  if (inerte) return null;

  return (
    <div className="etincelles-curseur-couche" aria-hidden="true">
      {particules.map((p) => (
        <span
          key={p.id}
          className="etincelles-curseur-particule"
          style={
            {
              left: p.x,
              top: p.y,
              color: p.couleur,
              animationDuration: `${p.duree}ms`,
              "--etincelle-tx": `${p.tx}px`,
              "--etincelle-ty": `${p.ty}px`,
            } as React.CSSProperties
          }
          onAnimationEnd={() => retirerParticule(p.id)}
        >
          <FormeSvg forme={p.forme} couleur={p.couleur} />
        </span>
      ))}
    </div>
  );
}

export default EtincellesCurseur;
