import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "../lib/router";
import { mouvementReduit } from "../lib/motion";

export function LivreHero() {
  const scene = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = scene.current;
    if (!element || mouvementReduit() || window.matchMedia("(hover: none)").matches) return;
    let raf = 0;
    const move = (event: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const bounds = element.getBoundingClientRect();
        element.style.setProperty("--book-x", String(((event.clientX - bounds.left) / bounds.width - 0.5) * 2));
        element.style.setProperty("--book-y", String(((event.clientY - bounds.top) / bounds.height - 0.5) * 2));
      });
    };
    const leave = () => {
      element.style.setProperty("--book-x", "0");
      element.style.setProperty("--book-y", "0");
    };
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerleave", leave);
    return () => {
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerleave", leave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={scene} className="book-world" aria-label="Livre ouvert Active ton Superpouvoir">
      <div className="book-world-grid" aria-hidden="true" />
      <div className="book-world-header"><span>PROTOCOLE DE LECTURE / 00</span><span>Une page peut changer une trajectoire</span><span className="book-world-live">LIVE</span></div>
      <div className="book-world-scope" aria-hidden="true"><i /><b /></div>

      <div className="book-world-spread">
        <div className="book-world-page book-world-page--left">
          <div className="book-world-page-top"><span>LA FABRIQUE DES HÉROS</span><span>PAGE 01</span></div>
          <div className="book-world-left-content">
            <p className="book-world-kicker">PREMIER CHAPITRE / IDENTITÉ</p>
            <h1>Tu n’es pas<br /><span>un hasard.</span></h1>
            <p className="book-world-lede">Le livre pour découvrir tes talents uniques, dépasser le doute et bâtir ta mission de vie.</p>
          </div>
          <div className="book-world-page-bottom"><span>01</span><span>Observe ce qui te met en mouvement.</span></div>
        </div>
        <div className="book-world-spine" aria-hidden="true"><span>ACTIVE TON SUPERPOUVOIR</span></div>
        <div className="book-world-page book-world-page--right">
          <div className="book-world-page-top"><span>ACTIVE TON SUPERPOUVOIR · 2026</span><span>PAGE 02</span></div>
          <div className="book-world-right-content">
            <p className="book-world-kicker">LA QUESTION EST OUVERTE</p>
            <h2>Tu es une<br /><em>réponse.</em></h2>
            <div className="book-world-rule" />
            <p className="book-world-instruction">Feuillette avec ton regard.<br />Le premier geste est à toi.</p>
          </div>
          <div className="book-world-actions">
            <Link to="/quiz" className="book-world-cta">Lancer le voyage <ArrowUpRight size={16} /></Link>
            <Link to="/le-livre" className="book-world-link">Explorer les chapitres</Link>
          </div>
        </div>
      </div>

      <div className="book-world-footer"><span> NADINE ZORO / ABIDJAN</span><span className="book-world-scroll">↓ Fais défiler pour entrer dans le livre</span><span>8 CHAPITRES · 4 OUTILS</span></div>
      <span className="book-world-index book-world-index--left">N° 00</span><span className="book-world-index book-world-index--right">ÉDITION 2026</span>
    </div>
  );
}
