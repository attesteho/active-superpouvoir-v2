import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis (défilement doux/inertie) câblé sur le ticker GSAP, pour que
 * ScrollTrigger reste parfaitement synchronisé (lenis pilote le rAF,
 * GSAP n'en lance pas un second — cf. doc officielle Lenis x GSAP).
 *
 * Instance unique (singleton) : `demarrerLenis()` est sûr à rappeler
 * plusieurs fois (idempotent), `arreterLenis()` nettoie tout.
 */

let lenis: Lenis | null = null;
let surTick: ((time: number) => void) | null = null;

/** Démarre Lenis, sauf si l'utilisateur·rice a demandé `prefers-reduced-motion: reduce`. */
export function demarrerLenis() {
  if (lenis || typeof window === "undefined") return lenis;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;

  lenis = new Lenis({ autoRaf: false });

  // Garde ScrollTrigger informé à chaque frame de défilement lissé par Lenis.
  lenis.on("scroll", ScrollTrigger.update);

  // Lenis se branche sur le ticker GSAP plutôt que son propre requestAnimationFrame,
  // pour qu'une seule boucle pilote à la fois le lissage et les animations GSAP.
  surTick = (time) => lenis?.raf(time * 1000);
  gsap.ticker.add(surTick);

  // Désactive le lissage de décalage du ticker (inutile avec Lenis, qui gère déjà l'inertie).
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

/** Détruit l'instance Lenis et débranche le ticker GSAP. Sûr à appeler même si rien n'a démarré. */
export function arreterLenis() {
  if (surTick) {
    gsap.ticker.remove(surTick);
    surTick = null;
  }
  lenis?.destroy();
  lenis = null;
}

/** L'instance Lenis courante, ou `null` si elle n'a pas démarré (réduite ou pas encore lancée). */
export function obtenirLenis() {
  return lenis;
}
