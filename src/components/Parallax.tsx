import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { mouvementReduit } from "../lib/motion";

gsap.registerPlugin(ScrollTrigger);

export type ParallaxProps = {
  /**
   * Multiplicateur de vitesse relatif au défilement normal.
   * - `1`   : avance à la vitesse normale du scroll (aucun effet, comportement par défaut).
   * - `0`   : reste à peu près fixe par rapport à la fenêtre (effet arrière-plan).
   * - `0.4` : avance plus lentement que le scroll (plan intermédiaire).
   * - `<0`  : avance en sens inverse du scroll (l'arrière-plan « recule »).
   * - `>1`  : avance plus vite que le scroll (effet premier plan).
   */
  vitesse?: number;
  /** Amplitude totale du décalage, en % de la hauteur de l'élément. */
  ampleur?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

/**
 * Enveloppe de parallaxe scroll-driven : déplace son contenu plus vite/plus
 * lentement que le défilement réel, via une translation `yPercent` pilotée par
 * un ScrollTrigger `scrub`. Fonctionne que Lenis soit démarré ou non — c'est
 * ScrollTrigger qui pilote l'animation (Lenis ne fait que le garder synchronisé
 * quand il intercepte le scroll, voir `src/lib/lenis.ts`).
 *
 * Se désactive entièrement sous `prefers-reduced-motion: reduce` : le contenu
 * reste alors dans sa position naturelle, sans aucun mouvement de profondeur.
 */
export function Parallax({ vitesse = 1, ampleur = 30, className, style, children }: ParallaxProps) {
  const racine = useRef<HTMLDivElement>(null);
  const couche = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const trigger = racine.current;
    const cible = couche.current;
    if (!trigger || !cible) return;

    // Vitesse normale ou mouvement réduit : rien à faire, on laisse le flux naturel.
    if (mouvementReduit() || vitesse === 1) return;

    // vitesse=1 → décalage nul ; vitesse=0 → décalage plein ; vitesse<0 → au-delà, sens inverse.
    const decalage = (1 - vitesse) * (ampleur / 2);

    const tween = gsap.fromTo(
      cible,
      { yPercent: -decalage },
      {
        yPercent: decalage,
        ease: "none",
        scrollTrigger: {
          trigger,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(cible, { clearProps: "transform" });
    };
  }, [vitesse, ampleur]);

  return (
    <div ref={racine} className={className} style={style}>
      <div ref={couche} style={{ willChange: "transform" }}>
        {children}
      </div>
    </div>
  );
}
