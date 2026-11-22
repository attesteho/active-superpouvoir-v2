import { useEffect, useRef, useState } from "react";

export const mouvementReduit = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Observe l'élément et ajoute la classe `vu` une seule fois. Aucun layout shift : opacité/transform uniquement. */
export function useVu<T extends HTMLElement>(marge = "0px 0px -12% 0px") {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (mouvementReduit() || typeof IntersectionObserver === "undefined") {
      el.classList.add("vu");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("vu");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: marge, threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [marge]);
  return ref;
}

/** Progression de lecture 0 → 1, calculée en rAF (passif, nettoyé). */
export function useProgression() {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const maj = () => {
      raf = 0;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setP(h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(maj);
    };
    maj();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return p;
}

/** Vrai sous le seuil donné — permet de réduire réellement la taille des objets, pas seulement de les scaler. */
export function usePetitEcran(seuil = 640) {
  const [petit, setPetit] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${seuil}px)`);
    const maj = () => setPetit(mq.matches);
    maj();
    mq.addEventListener("change", maj);
    return () => mq.removeEventListener("change", maj);
  }, [seuil]);
  return petit;
}

/** Vrai quand la page a défilé au-delà du seuil. */
export function useDefile(seuil = 40) {
  const [oui, setOui] = useState(false);
  useEffect(() => {
    const on = () => setOui(window.scrollY > seuil);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [seuil]);
  return oui;
}
