import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type FocusEvent, type KeyboardEvent } from "react";
import { ChevronLeft, ChevronRight, MoveRight } from "lucide-react";
import { Link, useRoute } from "../lib/router";
import { fcfa, type Produit } from "../data/site";
import { photos, type Photo } from "../data/media";

const visuels: Record<string, Photo> = {
  Livre: photos.metier,
  Workbook: photos.journal,
  Cartes: photos.tissage,
  Rituels: photos.dakar,
  Poster: photos.abidjan,
};

function imageDe(produit: Produit) {
  return visuels[produit.type] || photos.tissage;
}

export function BibliothequeCarousel({ produits }: { produits: Produit[] }) {
  const [active, setActive] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [enPause, setEnPause] = useState(false);
  const [focusDansRail, setFocusDansRail] = useState(false);
  const [mouvementReduit, setMouvementReduit] = useState(false);
  const { aller } = useRoute();
  const startX = useRef<number | null>(null);
  const distanceRef = useRef(0);
  const moved = useRef(false);
  const total = produits.length;

  const go = (next: number) => {
    if (!total) return;
    setActive((next + total) % total);
  };
  const direction = (offset: number) => {
    if (!total) return 0;
    const half = total / 2;
    if (offset > half) return offset - total;
    if (offset < -half) return offset + total;
    return offset;
  };

  useEffect(() => {
    setActive(0);
  }, [produits]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMouvementReduit(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (total < 2 || enPause || focusDansRail || mouvementReduit) return;
    const timer = window.setInterval(() => go(active + 1), 5200);
    return () => window.clearInterval(timer);
  }, [active, enPause, focusDansRail, mouvementReduit, total]);

  const produitActif = useMemo(() => produits[active], [active, produits]);
  if (!produitActif) return null;

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    startX.current = event.clientX;
    distanceRef.current = 0;
    moved.current = false;
    setEnPause(true);
  };
  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (startX.current === null) return;
    const distance = event.clientX - startX.current;
    distanceRef.current = distance;
    if (Math.abs(distance) > 8 && !moved.current) {
      moved.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    if (moved.current) setDragX(distance);
  };
  const onPointerUp = () => {
    if (startX.current === null) return;
    if (Math.abs(distanceRef.current) > 54) go(active + (distanceRef.current < 0 ? 1 : -1));
    startX.current = null;
    distanceRef.current = 0;
    setDragX(0);
    setEnPause(false);
  };
  const onBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocusDansRail(false);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!(event.target as HTMLElement).closest(".catalogue-slide-hit")) return;
    if (event.key === "ArrowRight") { event.preventDefault(); go(active + 1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); go(active - 1); }
  };

  return (
    <section
      className="catalogue-rail"
      aria-label="Carrousel des pièces de la bibliothèque"
      onMouseEnter={() => setEnPause(true)}
      onMouseLeave={() => setEnPause(false)}
      onFocusCapture={() => setFocusDansRail(true)}
      onBlurCapture={onBlur}
      onKeyDown={onKeyDown}
    >
      <div className="catalogue-rail-head">
        <p className="catalogue-rail-hint"><span className="catalogue-rail-pulse" /> Sélectionne une pièce, puis ouvre sa fiche</p>
        <div className="catalogue-rail-controls">
          <button type="button" className="catalogue-arrow" onClick={() => go(active - 1)} aria-label="Pièce précédente"><ChevronLeft size={18} /></button>
          <span aria-live="polite" className="catalogue-count"><strong>{String(active + 1).padStart(2, "0")}</strong> / {String(total).padStart(2, "0")}</span>
          <button type="button" className="catalogue-arrow" onClick={() => go(active + 1)} aria-label="Pièce suivante"><ChevronRight size={18} /></button>
        </div>
      </div>

      <div className="catalogue-carousel" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
        <div className="catalogue-carousel-track" style={{ transform: `translateX(${dragX * 0.35}px)` }}>
          {produits.map((produit, index) => {
            const offset = direction(index - active);
            const distance = Math.abs(offset);
            const isActive = offset === 0;
            const media = imageDe(produit);
            return (
              <article key={produit.slug} className={`catalogue-slide ${isActive ? "is-active" : ""}`} style={{ "--slide-offset": offset, "--slide-distance": distance, "--slide-fil": produit.fil } as CSSProperties}>
                <button
                  type="button"
                  className="catalogue-slide-hit"
                  onClick={() => {
                    if (moved.current) return;
                    if (isActive) aller(`/boutique/${produit.slug}`);
                    else go(index);
                  }}
                  aria-label={`${isActive ? "Ouvrir la description et commander" : "Sélectionner"} : ${produit.nom}`}
                  aria-current={isActive ? "true" : undefined}
                >
                  <span className="catalogue-slide-image">
                    <img src={media.src} alt={media.alt} loading="lazy" decoding="async" />
                    <span className="catalogue-slide-wash" aria-hidden="true" />
                    <span className="catalogue-slide-index">{String(index + 1).padStart(2, "0")} <span aria-hidden="true">/</span> {produit.type}</span>
                  </span>
                  <span className="catalogue-slide-body">
                    <span className="catalogue-slide-meta"><span>{produit.format}</span>{produit.badge && <strong>{produit.badge}</strong>}</span>
                    <strong className="catalogue-slide-name">{produit.nom}</strong>
                    <span className="catalogue-slide-price">{fcfa(produit.fcfa)}</span>
                  </span>
                </button>
              </article>
            );
          })}
        </div>
      </div>

      <div className="catalogue-selected" aria-live="polite" aria-atomic="true">
        <div className="catalogue-selected-copy">
          <p className="catalogue-selected-label">Pièce sélectionnée · {produitActif.type} · {produitActif.format}</p>
          <h3>{produitActif.nom}</h3>
          <p className="catalogue-selected-description">{produitActif.description}</p>
          <p className="catalogue-selected-ages"><strong>Pour :</strong> {produitActif.ages.join(" · ")}</p>
        </div>
        <div className="catalogue-selected-action">
          <p className="catalogue-selected-price">{fcfa(produitActif.fcfa)} <span>· {produitActif.eur} €</span></p>
          <Link className="catalogue-selected-link" to={`/boutique/${produitActif.slug}`}>Voir la description complète & commander <MoveRight size={17} /></Link>
          <p className="catalogue-selected-note">La fiche détaille le contenu et les avis; tu pourras ajouter la pièce au panier puis poursuivre la commande.</p>
        </div>
      </div>

      <div className="catalogue-rail-footer">
        <span className="catalogue-rail-help">Utilise les flèches ou fais glisser la pièce.</span>
        <span className="catalogue-progress" aria-hidden="true"><i style={{ width: `${((active + 1) / Math.max(total, 1)) * 100}%` }} /></span>
      </div>
    </section>
  );
}
