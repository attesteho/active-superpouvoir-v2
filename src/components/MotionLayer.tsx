import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRoute } from "../lib/router";
import { mouvementReduit } from "../lib/motion";
import { Etoile } from "./Atelier";

gsap.registerPlugin(ScrollTrigger);

const ANGLES_ECLATS = Array.from({ length: 10 }, (_, i) => i * 36);

const SEL_TITRES = ":is(h2, h3).display-xl, :is(h2, h3).display-l, :is(h2, h3).display-m";
const SEL_CARTES = ".community-story-item, .community-space-list > li, .etape-tuile";
const baseDe = (c: string) => c.split("#")[0].replace(/\/+$/, "") || "/";

/** Découpe un titre statique en mots masqués. Idempotent : sûr si l'effet est rejoué. */
function decouper(h: HTMLElement) {
  if (h.dataset.split) return;
  h.dataset.split = "1";
  const marcheur = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
  const noeuds: Text[] = [];
  while (marcheur.nextNode()) noeuds.push(marcheur.currentNode as Text);
  noeuds.forEach((t) => {
    const texte = t.nodeValue ?? "";
    if (!texte.trim()) return;
    const frag = document.createDocumentFragment();
    texte.split(/(\s+)/).forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part)) {
        frag.appendChild(document.createTextNode(part));
        return;
      }
      const mot = document.createElement("span");
      mot.className = "split-w";
      const interieur = document.createElement("span");
      interieur.className = "split-i";
      interieur.textContent = part;
      mot.appendChild(interieur);
      frag.appendChild(mot);
    });
    t.parentNode?.replaceChild(frag, t);
  });
}

/**
 * Couche de mouvement v2 : scroll-driven, sans toucher aux textes ni à la mise en page.
 *  - rideau de transition entre pages (étoile de la marque) ;
 *  - titres révélés mot à mot, étiquettes en volet ;
 *  - photos révélées en rideau (sens alterné) avec parallaxe interne ;
 *  - objets produit en profondeur par rapport à leur photo ;
 *  - cartes en cascade, compteurs, bandeaux sensibles à la vitesse de scroll ;
 *  - entrée orchestrée du hero.
 * Tout est annulé en `prefers-reduced-motion`.
 */
export function MotionLayer({ pret }: { pret: boolean }) {
  const { chemin } = useRoute();
  const base = baseDe(chemin);
  const rideau = useRef<HTMLDivElement>(null);
  const precedente = useRef<string | null>(null);
  const tlRideau = useRef<gsap.core.Timeline | null>(null);

  /* ——— Rideau de transition : iris qui s'ouvre au centre, étoile qui éclate avec des éclats,
     puis se referme — plus proche d'un effet BD/jeu vidéo qu'un simple fondu. ——— */
  useLayoutEffect(() => {
    const el = rideau.current;
    if (!el) return;
    const avant = precedente.current;
    precedente.current = base;
    if (avant === null || avant === base || mouvementReduit()) return;
    const etoile = el.querySelector<SVGElement>(".rideau-etoile");
    const eclats = el.querySelector<SVGElement>(".rideau-eclats");
    tlRideau.current?.kill();
    gsap.killTweensOf([el, etoile, eclats]);
    gsap.set(el, { display: "flex", clipPath: "circle(0% at 50% 50%)" });
    gsap.set(etoile, { scale: 0.3, rotate: -70, opacity: 0 });
    gsap.set(eclats, { opacity: 0, scale: 0.5 });
    tlRideau.current = gsap
      .timeline({ onComplete: () => gsap.set(el, { display: "none" }) })
      .to(el, { clipPath: "circle(75% at 50% 50%)", duration: 0.45, ease: "power3.out" }, 0)
      .to(etoile, { scale: 1, rotate: 0, opacity: 1, duration: 0.42, ease: "back.out(2.6)" }, 0.06)
      .to(eclats, { opacity: 1, scale: 1.5, duration: 0.32, ease: "power1.out" }, 0.08)
      .to(eclats, { opacity: 0, duration: 0.22 }, 0.38)
      .to(etoile, { scale: 0.25, rotate: 50, opacity: 0, duration: 0.3, ease: "power2.in" }, 0.56)
      .to(el, { clipPath: "circle(0% at 50% 50%)", duration: 0.48, ease: "power3.inOut" }, 0.62);
  }, [base]);

  /* ——— Mouvement des sections ——— */
  useLayoutEffect(() => {
    if (!pret || mouvementReduit()) return;
    const stage = document.querySelector<HTMLElement>(".route-stage");
    if (!stage) return;

    const titres = Array.from(stage.querySelectorAll<HTMLElement>(SEL_TITRES));
    const etiquettes = Array.from(stage.querySelectorAll<HTMLElement>(".etiquette"));
    const photos = Array.from(stage.querySelectorAll<HTMLElement>(".photo-cadre"));
    const outils = Array.from(stage.querySelectorAll<HTMLElement>(".outil-carte-photo"));
    const cartes = Array.from(stage.querySelectorAll<HTMLElement>(SEL_CARTES));
    const compteurs = Array.from(stage.querySelectorAll<HTMLElement>("[data-compte]"));
    const scenes = Array.from(stage.querySelectorAll<HTMLElement>(".produit-scene"));
    const hero = base === "/" ? stage.querySelector<HTMLElement>(".pinterest-hero") : null;
    const heroNav = hero?.querySelector<HTMLElement>(".pinterest-hero-nav");
    const heroTitre = hero ? Array.from(hero.querySelectorAll<HTMLElement>(".pinterest-hero-copy h1 > *")) : [];
    const heroCta = hero?.querySelector<HTMLElement>(".pinterest-hero-cta");
    const heroLivres = hero?.querySelector<HTMLElement>(".pinterest-books");
    const heroEtagere = hero?.querySelector<HTMLElement>(".pinterest-books-shelf");
    const heroBas = hero ? Array.from(hero.querySelectorAll<HTMLElement>(".pinterest-hero-detail, .pinterest-hero-controls")) : [];
    const restaurations: Array<() => void> = [];
    const suivi: Array<{ el: Element; tw: gsap.core.Tween }> = [];
    let garde = 0;

    titres.forEach(decouper);

    /* A. État initial, posé avant la peinture : aucun flash du contenu final. */
    const ctxA = gsap.context(() => {
      titres.forEach((h) => gsap.set(h.querySelectorAll(".split-i"), { yPercent: 118, rotate: 4, transformOrigin: "0% 100%" }));
      gsap.set(etiquettes, { clipPath: "inset(0% 100% 0% 0%)" });
      photos.forEach((f, i) => gsap.set(f, { clipPath: i % 2 ? "inset(0% 100% 0% 0%)" : "inset(100% 0% 0% 0%)" }));
      gsap.set(cartes, { opacity: 0, y: 72 });
      compteurs.forEach((el) => {
        const brut = el.dataset.final ?? el.textContent ?? "";
        el.dataset.final = brut;
        const m = brut.match(/^(\D*)(\d[\d ]*)(.*)$/);
        if (!m || !parseInt(m[2].replace(/ /g, ""), 10)) return;
        el.textContent = m[1] + "0".repeat(Math.max(1, m[2].length)) + m[3];
        restaurations.push(() => (el.textContent = brut));
      });
      if (hero) {
        gsap.set(heroNav ?? [], { opacity: 0, y: -26 });
        gsap.set(heroTitre, { opacity: 0, y: 70 });
        gsap.set(heroCta ?? [], { opacity: 0, y: 30 });
        gsap.set(heroLivres ?? [], { clipPath: "inset(100% 0% 0% 0%)" });
        gsap.set(heroEtagere ?? [], { scaleX: 0, transformOrigin: "0% 50%" });
        gsap.set(heroBas, { opacity: 0, y: 24 });
      }
    }, stage);

    /* B. Déclencheurs, créés une fois la page stabilisée (pins de l'accueil déjà posés). */
    let ctxB: gsap.Context | null = null;
    let r2 = 0;
    const r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => {
        ctxB = gsap.context(() => {
          const declencher = (trigger: Element, start = "top 90%") => ({ trigger, start, once: true });

          titres.forEach((h) => {
            const tw = gsap.to(h.querySelectorAll(".split-i"), {
              yPercent: 0, rotate: 0, duration: 0.95, ease: "power4.out", stagger: 0.05,
              scrollTrigger: declencher(h, "top 95%"),
            });
            suivi.push({ el: h, tw });
          });

          etiquettes.forEach((el) => {
            const tw = gsap.to(el, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: "power3.out", clearProps: "clipPath", scrollTrigger: declencher(el, "top 97%") });
            suivi.push({ el, tw });
          });

          photos.forEach((fig, i) => {
            const twPhoto = gsap.to(fig, {
              clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "power4.inOut", clearProps: "clipPath",
              scrollTrigger: declencher(fig, "top 99%"),
            });
            suivi.push({ el: fig, tw: twPhoto });
            const img = fig.querySelector("img");
            if (img) {
              gsap.fromTo(
                img,
                { yPercent: i % 2 ? 6 : -6, scale: 1.17 },
                { yPercent: i % 2 ? -6 : 6, scale: 1.17, ease: "none", scrollTrigger: { trigger: fig, start: "top bottom", end: "bottom top", scrub: true } }
              );
            }
          });

          outils.forEach((bloc) => {
            const img = bloc.querySelector("img");
            if (img) {
              gsap.fromTo(img, { yPercent: -5, scale: 1.14 }, { yPercent: 5, scale: 1.14, ease: "none", scrollTrigger: { trigger: bloc, start: "top bottom", end: "bottom top", scrub: true } });
            }
          });

          scenes.forEach((scene) => {
            const objet = scene.querySelector(".produit-scene-objet");
            if (objet) {
              gsap.fromTo(objet, { y: 56 }, { y: -34, ease: "none", scrollTrigger: { trigger: scene, start: "top bottom", end: "bottom top", scrub: 0.6 } });
            }
          });

          if (cartes.length) {
            ScrollTrigger.batch(cartes, {
              start: "top 92%", once: true,
              onEnter: (lot) => gsap.to(lot, { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.12, clearProps: "opacity,transform" }),
            });
          }

          compteurs.forEach((el) => {
            const brut = el.dataset.final ?? "";
            const m = brut.match(/^(\D*)(\d[\d ]*)(.*)$/);
            if (!m) return;
            const cible = parseInt(m[2].replace(/ /g, ""), 10);
            if (!cible) return;
            const largeur = Math.max(1, m[2].length);
            const o = { v: 0 };
            gsap.to(o, {
              v: cible, duration: 1.6, ease: "power3.out",
              onUpdate: () => (el.textContent = m[1] + String(Math.round(o.v)).padStart(largeur, "0") + m[3]),
              scrollTrigger: declencher(el, "top 94%"),
            });
          });

          /* Bandeaux défilants : ils accélèrent avec la vitesse du scroll, puis reprennent leur allure. */
          const bandeaux = Array.from(document.querySelectorAll<HTMLElement>(".anim-defile"));
          const animations = bandeaux.flatMap((b) => b.getAnimations());
          if (animations.length) {
            const rythme = { v: 1 };
            const appliquer = () => animations.forEach((a) => a.updatePlaybackRate(rythme.v));
            ScrollTrigger.create({
              onUpdate: (self) => {
                const cible = 1 + Math.min(Math.abs(self.getVelocity()) / 320, 7);
                gsap.to(rythme, {
                  v: cible, duration: 0.18, overwrite: true, onUpdate: appliquer,
                  onComplete: () => gsap.to(rythme, { v: 1, duration: 1.4, ease: "power2.out", onUpdate: appliquer }),
                });
              },
            });
            restaurations.push(() => animations.forEach((a) => a.updatePlaybackRate(1)));
          }

          document.querySelectorAll<HTMLElement>(".fond-photo[data-parallaxe]").forEach((fond) => {
            const img = fond.querySelector("img");
            const section = fond.parentElement;
            if (img && section) {
              gsap.fromTo(img, { yPercent: -9, scale: 1.2 }, { yPercent: 9, scale: 1.2, ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true } });
            }
          });

          /* Garde : tout élément visible à l'écran qui n'est pas apparu est forcé à apparaître. */
          garde = window.setInterval(() => {
            const hv = window.innerHeight;
            suivi.forEach(({ el, tw }) => {
              if (tw.progress() > 0) return;
              const b = el.getBoundingClientRect();
              if (b.top < hv - 60 && b.bottom > 40) {
                tw.scrollTrigger?.kill();
                tw.play(0);
              }
            });
          }, 500);

          if (hero) {
            const fin = { clearProps: "opacity,transform,clipPath" };
            gsap
              .timeline({ defaults: { ease: "power4.out" } })
              .to(heroNav ?? [], { opacity: 1, y: 0, duration: 0.9, ...fin }, 0.1)
              .to(heroTitre, { opacity: 1, y: 0, duration: 1.1, stagger: 0.14, ...fin }, 0.2)
              .to(heroCta ?? [], { opacity: 1, y: 0, duration: 0.9, ...fin }, 0.75)
              .to(heroLivres ?? [], { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "power4.inOut", clearProps: "clipPath" }, 0.35)
              .to(heroEtagere ?? [], { scaleX: 1, duration: 1.2, ease: "power4.inOut", clearProps: "transform" }, 0.35)
              .to(heroBas, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ...fin }, 1.0);
          }
        }, stage);
        ScrollTrigger.refresh();
      });
    });

    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
      window.clearInterval(garde);
      ctxB?.revert();
      ctxA.revert();
      restaurations.forEach((f) => f());
    };
  }, [chemin, pret, base]);

  return (
    <div ref={rideau} className="rideau" aria-hidden="true" style={{ display: "none" }}>
      <svg className="rideau-eclats" viewBox="0 0 200 200" aria-hidden="true">
        {ANGLES_ECLATS.map((angle) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <line
              key={angle}
              x1={100 + 38 * Math.cos(rad)}
              y1={100 + 38 * Math.sin(rad)}
              x2={100 + 92 * Math.cos(rad)}
              y2={100 + 92 * Math.sin(rad)}
            />
          );
        })}
      </svg>
      <Etoile taille={104} fil="#321044" className="rideau-etoile" />
    </div>
  );
}
