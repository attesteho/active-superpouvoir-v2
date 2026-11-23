import { Children, useEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { mouvementReduit } from "../lib/motion";
import { obtenirLenis } from "../lib/lenis";

const MARGE = 2;

/**
 * Pile de sections façon « pages de livre qu'on tourne » : une page reste
 * entièrement statique à l'écran ; un seul geste de scroll (molette, trackpad,
 * flèches, tactile) fait monter la suivante par-dessus pour la recouvrir —
 * jamais un défilement progressif/scrubbed. Si le contenu d'une page dépasse
 * l'écran, il défile d'abord normalement en interne ; l'avancée vers la page
 * suivante n'est déclenchée qu'une fois arrivé au bout de ce défilement interne,
 * pour ne jamais couper de contenu.
 *
 * L'appartenance à la pile (dedans/dehors) est recalculée à CHAQUE événement, sur
 * la géométrie réelle du conteneur à cet instant précis — jamais déduite d'un état
 * mémorisé (observateur, drapeau…) qui pourrait désynchroniser au premier
 * chargement en plein milieu de la pile, restauration de scroll du navigateur,
 * retour arrière, etc. C'est ce qui garantit qu'on ne reste jamais bloqué.
 *
 * Inerte sous `prefers-reduced-motion` : les pages s'empilent alors en flux
 * normal, défilement classique, sans capture du scroll.
 */
export function PagesEmpilees({ children }: { children: ReactNode }) {
  const panneaux = Children.toArray(children);
  const [actif, setActif] = useState(0);
  const conteneurRef = useRef<HTMLDivElement>(null);
  const panneauxRef = useRef<Array<HTMLDivElement | null>>([]);
  const actifRef = useRef(0);
  const verrouRef = useRef(false);
  const reduit = mouvementReduit();

  useEffect(() => {
    actifRef.current = actif;
  }, [actif]);

  /* Position de départ posée UNE SEULE FOIS, impérativement : au-delà de ce point, `transform`/
     `filter` n'appartiennent plus qu'à GSAP — jamais au style React, qui serait réappliqué (et donc
     écraserait l'animation) à chaque re-rendu déclenché par `setActif`. */
  useEffect(() => {
    if (reduit) return;
    panneauxRef.current.forEach((panneau, i) => {
      if (panneau && i > 0) gsap.set(panneau, { yPercent: 100 });
    });
  }, [reduit]);

  useEffect(() => {
    if (reduit) return;
    const conteneur = conteneurRef.current;
    if (!conteneur) return;

    /* Le conteneur est « engagé » quand il occupe (à peu près) tout le viewport — c'est le cas
       pendant toute la durée où `position: sticky` le maintient collé en haut. Recalculé en direct
       à chaque geste : aucune dépendance à un état mémorisé qui pourrait se désynchroniser. */
    const estEngage = () => {
      const r = conteneur.getBoundingClientRect();
      return r.top <= MARGE && r.bottom >= window.innerHeight - MARGE;
    };

    // Passe à `true` pendant une sortie volontaire (premier/dernier panneau) : le conteneur est
    // encore géométriquement « engagé » l'instant où on relance Lenis (il n'a pas encore bougé),
    // donc sans ce drapeau `surDefilementLenis` le re-arrêterait aussitôt à l'image suivante,
    // annulant la sortie en un aller-retour immédiat qui bloquait tout.
    const enSortie = { current: false };

    /* Un geste de molette unique mais puissant (trackpad lancé fort, souris à roulette libre…) ne
       produit souvent qu'UN SEUL événement `wheel`, auquel Lenis répond par une longue animation
       d'inertie qui peut traverser toute la pile en une fois, sans qu'aucun nouvel événement
       n'arrive entre-temps pour nous laisser réagir. On surveille donc aussi en continu, à chaque
       image défilée par Lenis (pas seulement à chaque geste), pour arrêter l'inertie dès que le
       conteneur devient engagé — même en plein milieu d'une animation de défilement. */
    const surDefilementLenis = () => {
      if (verrouRef.current) return;
      if (enSortie.current) {
        if (!estEngage()) enSortie.current = false; // sortie confirmée : surveillance normale reprend
        return;
      }
      if (estEngage()) obtenirLenis()?.stop();
    };
    obtenirLenis()?.on("scroll", surDefilementLenis);

    const avancer = (sens: 1 | -1) => {
      const prochain = actifRef.current + sens;
      if (prochain < 0 || prochain >= panneaux.length) return;
      const sortant = panneauxRef.current[actifRef.current];
      const entrant = panneauxRef.current[prochain];
      if (!sortant || !entrant) return; // refs pas encore posées : on ignore ce geste plutôt que de bloquer
      verrouRef.current = true;
      actifRef.current = prochain;
      setActif(prochain);
      const relacher = () => (verrouRef.current = false);
      // Filet de sécurité : si `onComplete` ne se déclenche jamais pour une raison quelconque
      // (cible invalide, exception GSAP), le verrou ne doit jamais rester bloqué indéfiniment.
      const secours = window.setTimeout(relacher, 900);
      const tl = gsap.timeline({
        onComplete: () => {
          window.clearTimeout(secours);
          relacher();
        },
      });
      if (sens === 1) {
        tl.to(entrant, { yPercent: 0, duration: 0.65, ease: "power3.inOut" }, 0)
          .to(sortant, { scale: 0.96, filter: "brightness(0.82)", duration: 0.65, ease: "power3.inOut" }, 0);
      } else {
        tl.to(sortant, { yPercent: 100, duration: 0.65, ease: "power3.inOut" }, 0)
          .to(entrant, { scale: 1, filter: "brightness(1)", duration: 0.65, ease: "power3.inOut" }, 0);
      }
    };

    const gerer = (sens: 1 | -1, event: Event) => {
      if (!estEngage()) {
        obtenirLenis()?.start(); // on n'est pas (ou plus) dans la pile : on laisse Lenis faire son travail
        return;
      }
      if (verrouRef.current) {
        obtenirLenis()?.stop();
        event.preventDefault();
        return;
      }
      const estPanneau = panneauxRef.current[actifRef.current];
      if (!estPanneau) return;

      const peutDefiler =
        sens === 1
          ? estPanneau.scrollTop + estPanneau.clientHeight < estPanneau.scrollHeight - 2
          : estPanneau.scrollTop > 2;
      if (peutDefiler) {
        obtenirLenis()?.stop();
        event.preventDefault();
        // Lenis intercepte la molette globalement et annule toujours son comportement par défaut
        // (même arrêté) : on ne peut pas compter sur le scroll natif du navigateur — on avance
        // nous-mêmes le `scrollTop` du panneau actif.
        if (event instanceof WheelEvent) estPanneau.scrollTop += event.deltaY;
        else estPanneau.scrollTop += sens * 120;
        return;
      }

      const prochain = actifRef.current + sens;
      if (prochain < 0 || prochain >= panneaux.length) {
        // Premier/dernier panneau : on sort de la pile. On N'APPELLE PAS `.stop()` ici — même
        // brièvement — sous peine d'annuler l'élan de CET événement sans rien y substituer
        // (`.start()` ne rejoue pas l'inertie perdue), ce qui bloquait la sortie pile à la frontière.
        enSortie.current = true;
        obtenirLenis()?.start();
        return;
      }
      obtenirLenis()?.stop();
      event.preventDefault();
      avancer(sens);
    };

    const onWheel = (event: WheelEvent) => gerer(event.deltaY > 0 ? 1 : -1, event);

    const onKey = (event: KeyboardEvent) => {
      if (!["ArrowDown", "ArrowUp", "PageDown", "PageUp"].includes(event.key)) return;
      if (!estEngage()) return;
      gerer(event.key === "ArrowDown" || event.key === "PageDown" ? 1 : -1, event);
    };

    let depart = 0;
    const onTouchStart = (event: TouchEvent) => {
      depart = event.touches[0].clientY;
    };
    const onTouchEnd = (event: TouchEvent) => {
      const delta = depart - event.changedTouches[0].clientY;
      if (Math.abs(delta) < 48) return;
      gerer(delta > 0 ? 1 : -1, event);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      obtenirLenis()?.off("scroll", surDefilementLenis);
      obtenirLenis()?.start();
    };
  }, [reduit, panneaux.length]);

  if (reduit) {
    return <>{panneaux}</>;
  }

  return (
    <div className="pages-empilees-piste">
      <div ref={conteneurRef} className="pages-empilees">
        {panneaux.map((panneau, i) => (
          <div
            key={i}
            ref={(el) => {
              panneauxRef.current[i] = el;
            }}
            className="pages-empilees-panneau"
            style={{ zIndex: i + 1, visibility: i <= actif ? "visible" : "hidden" }}
          >
            {panneau}
          </div>
        ))}
      </div>
    </div>
  );
}
