import { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowRight, SkipForward } from "lucide-react";
import { Etoile } from "./Atelier";
import { mouvementReduit } from "../lib/motion";

export function OuvertureLivre({ onTerminer }: { onTerminer: () => void }) {
  const scene = useRef<HTMLDivElement>(null);
  const skip = useRef<HTMLButtonElement>(null);
  const enter = useRef<HTMLButtonElement>(null);
  const sortie = useRef(false);

  const terminer = useCallback(() => {
    const root = scene.current;
    if (!root || sortie.current) return;
    sortie.current = true;
    if (mouvementReduit()) {
      onTerminer();
      return;
    }
    gsap.timeline({ onComplete: onTerminer })
      .to(root.querySelector("[data-opening-world]"), { scale: 1.035, autoAlpha: 0, duration: 0.42, ease: "power2.in" }, 0)
      .to(root, { autoAlpha: 0, duration: 0.52, ease: "power3.inOut" }, 0.18);
  }, [onTerminer]);

  useEffect(() => {
    const root = scene.current;
    if (!root) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    skip.current?.focus({ preventScroll: true });

    const world = root.querySelector<HTMLElement>("[data-opening-world]");
    const book = root.querySelector<HTMLElement>("[data-opening-book]");
    const copy = Array.from(root.querySelectorAll<HTMLElement>("[data-opening-copy]"));
    const enterButton = enter.current;
    if (!world || !book) return;

    const clamp = (value: number) => Math.min(1, Math.max(0, value));
    const paint = () => {
      const max = Math.max(1, root.scrollHeight - root.clientHeight);
      const raw = clamp(root.scrollTop / max);
      const reveal = clamp((raw - 0.02) / 0.86);
      const eased = reveal * reveal * (3 - 2 * reveal);
      book.style.setProperty("--book-progress", String(eased));
      copy.forEach((element, index) => {
        element.style.opacity = String(Math.max(0, (eased - 0.42) / 0.58));
        element.style.transform = `translateY(${(1 - eased) * (index ? 12 : 18)}px)`;
      });
      if (enterButton) enterButton.tabIndex = eased > 0.72 ? 0 : -1;
      if (raw >= 0.985 && !sortie.current) window.setTimeout(terminer, 180);
    };

    if (mouvementReduit()) {
      book.style.setProperty("--book-progress", "1");
      copy.forEach((element) => { element.style.opacity = "1"; element.style.transform = "none"; });
      if (enterButton) enterButton.tabIndex = 0;
    } else {
      paint();
      root.addEventListener("scroll", paint, { passive: true });
      window.addEventListener("resize", paint);
    }

    const onWheel = (event: WheelEvent) => {
      if (mouvementReduit()) return;
      event.preventDefault();
      const max = Math.max(1, root.scrollHeight - root.clientHeight);
      root.scrollTop = Math.min(max, Math.max(0, root.scrollTop + event.deltaY));
      paint();
    };
    document.addEventListener("wheel", onWheel, { passive: false, capture: true });

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        terminer();
      }
      if (event.key === "Tab" && !root.contains(document.activeElement)) {
        event.preventDefault();
        skip.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      root.removeEventListener("scroll", paint);
      window.removeEventListener("resize", paint);
      document.removeEventListener("wheel", onWheel, true);
      document.removeEventListener("keydown", onKey);
    };
  }, [terminer]);

  return (
    <div ref={scene} className="book-intro opening-intro opening-scroll-container fixed inset-0 z-[100] overflow-y-auto" role="dialog" aria-modal="true" aria-label="Ouverture du livre Active ton Superpouvoir">
      <div className="opening-scroll-track">
        <div className="opening-sticky">
          <div className="opening-grid pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="opening-grain pointer-events-none absolute inset-0" aria-hidden="true" />

          <header className="opening-top relative z-10 mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4 px-5 pt-5 sm:px-8 sm:pt-7 xl:px-14">
            <p className="flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-paper"><Etoile taille={22} fil="#FFF0D9" /><span>Active ton superpouvoir</span></p>
            <button ref={skip} type="button" onClick={terminer} className="opening-skip inline-flex min-h-11 items-center gap-2 rounded-full border border-paper/40 px-4 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-paper transition-colors hover:bg-paper hover:text-ink focus-visible:bg-paper focus-visible:text-ink sm:px-5 sm:text-[11px]">Passer au site <SkipForward size={15} /></button>
          </header>

          <main className="opening-main relative z-10 mx-auto flex w-full max-w-[1440px] flex-col items-center px-5 pb-4 pt-8 sm:px-8 sm:pt-10 xl:px-14">
            <h1 className="opening-title text-center font-display text-[clamp(2.4rem,6vw,6.4rem)] font-extrabold uppercase leading-[0.82] tracking-[-0.07em] text-paper">Le pouvoir commence<br /><span className="text-jaune">par un geste.</span></h1>

            <div className="opening-canvas relative mx-auto mt-7 w-full" data-opening-world>
              <div className="opening-backdrop" aria-hidden="true" />
              <div data-opening-book className="opening-book" aria-label="Livre fermé qui s’ouvre au défilement">
                <div className="opening-book-shadow" aria-hidden="true" />
                <div className="opening-book-pages" aria-hidden="true" />
                <div className="opening-book-cover opening-book-cover--left" aria-hidden="true"><span>ACTIVE TON<br /><em>SUPERPOUVOIR</em></span><b>LA FABRIQUE DES HÉROS · 2026</b></div>
                <div className="opening-book-spine" aria-hidden="true" />
                <div className="opening-book-spread">
                  <div data-opening-copy className="opening-book-page opening-book-page--left"><small>PREMIER GESTE / 01</small><strong>Observe ce qui<br /><em>te met en mouvement.</em></strong><span>Le livre commence par une question.</span></div>
                  <div data-opening-copy className="opening-book-page opening-book-page--right"><small>LA RÉPONSE / 02</small><strong>Le pouvoir<br /><em>commence ici.</em></strong><button ref={enter} type="button" onClick={terminer} className="opening-enter group inline-flex min-h-11 items-center justify-center gap-3 bg-paper px-5 font-display text-[12px] font-extrabold uppercase tracking-[0.06em] text-ink shadow-[5px_5px_0_#FFB000] transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-[1px_1px_0_#FFB000]">Entrer dans le livre <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></button></div>
                </div>
              </div>
            </div>

            <p className="opening-instruction mt-4 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-paper/60">Fais défiler pour ouvrir le livre</p>
          </main>
        </div>
      </div>
    </div>
  );
}
