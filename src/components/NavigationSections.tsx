import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { mouvementReduit } from "../lib/motion";
import { obtenirLenis } from "../lib/lenis";
import { Etoile } from "./Atelier";

export type SectionNav = { id: string; label: string };

/**
 * Petite navigation flottante « jeu vidéo » : un point par section de la page
 * courante, le point actif s'allume en étoile, un clic saute directement à la
 * section (via Lenis si actif, sinon scrollIntoView natif). Masquée sous 2
 * sections ou sur petit écran — c'est un plus, pas un remplacement du scroll.
 */
export function NavigationSections({ sections }: { sections: SectionNav[] }) {
  const [actif, setActif] = useState(sections[0]?.id);

  useEffect(() => {
    const cibles = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!cibles.length) return;

    const observateur = new IntersectionObserver(
      (entrees) => {
        const visible = entrees
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActif(visible.target.id);
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] }
    );
    cibles.forEach((el) => observateur.observe(el));
    return () => observateur.disconnect();
  }, [sections]);

  if (sections.length < 2) return null;

  const allerA = (id: string) => {
    const cible = document.getElementById(id);
    if (!cible) return;
    const lenis = obtenirLenis();
    if (lenis && !mouvementReduit()) {
      lenis.scrollTo(cible, { offset: -24, duration: 1.1 });
    } else {
      cible.scrollIntoView({ behavior: mouvementReduit() ? "auto" : "smooth", block: "start" });
    }
  };

  return createPortal(
    // Portail direct vers <body> : un ancêtre de page avec un `transform` actif (ex. l'animation
    // d'entrée de route) crée un containing block pour les éléments `position: fixed`, ce qui les
    // piégerait dans la mise en page au lieu de les fixer au viewport. Le portail contourne le problème.
    <nav className="nav-sections" aria-label="Navigation entre les sections de la page">
      <ol>
        {sections.map((s, i) => {
          const estActif = s.id === actif;
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => allerA(s.id)}
                aria-current={estActif ? "true" : undefined}
                className={`nav-sections-point${estActif ? " is-active" : ""}`}
              >
                <span className="sr-only">{s.label}</span>
                {estActif ? <Etoile taille={13} fil="#FFB000" /> : <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>,
    document.body
  );
}
