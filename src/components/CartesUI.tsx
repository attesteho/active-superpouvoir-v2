import { useEffect, useRef, type ReactNode } from "react";
import { MoveRight } from "lucide-react";
import { Link } from "../lib/router";
import { Etoile, Monogramme } from "./Atelier";
import { VisuelProduit } from "./VisuelProduit";
import { mouvementReduit } from "../lib/motion";
import { fcfa, type Produit } from "../data/site";

/**
 * Bibliothèque de cartes du site, inspirée des patterns de 21st.dev (tilt card, testimonial card,
 * notched card, bento facts, product link card), réécrite dans le langage graphique de la marque :
 * aplats, ombres franches, aucun dégradé ni lueur.
 */

/** Carte 3D : s'incline vers le pointeur (désactivée au tactile et en mouvement réduit). */
export function Tilt({ children, className = "", max = 6 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || mouvementReduit() || window.matchMedia("(hover: none)").matches) return;
    let raf = 0;
    const bouger = (e: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty("--ry", `${(px * max * 2).toFixed(2)}deg`);
        el.style.setProperty("--rx", `${(-py * max * 2).toFixed(2)}deg`);
      });
    };
    const quitter = () => {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    };
    el.addEventListener("pointermove", bouger);
    el.addEventListener("pointerleave", quitter);
    return () => {
      el.removeEventListener("pointermove", bouger);
      el.removeEventListener("pointerleave", quitter);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [max]);
  return (
    <div ref={ref} className={`tilt ${className}`}>
      {children}
    </div>
  );
}

type Avis = { nom: string; date: string; note: number; texte: string };

/** Carte d'avis : guillemet géant, étoiles, texte en display, signature avec monogramme. */
export function CarteAvis({ avis }: { avis: Avis }) {
  const initiales = avis.nom
    .replace(/[^A-Za-zÀ-ÿ ]/g, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();
  return (
    <Tilt className="">
      <article className="avis-carte">
        <span className="avis-guillemet" aria-hidden="true">“</span>
        <p className="avis-etoiles" aria-label={`${avis.note} étoiles sur 5`}>
          {Array.from({ length: 5 }).map((_, k) => (
            <Etoile key={k} taille={16} fil={k < avis.note ? "#FFB000" : "rgba(50,16,68,.2)"} />
          ))}
        </p>
        <p className="avis-texte">{avis.texte}</p>
        <footer className="avis-pied">
          <Monogramme initiales={initiales} fil="#FFB000" taille={42} />
          <span>
            <strong>{avis.nom}</strong>
            <em>{avis.date}</em>
          </span>
        </footer>
      </article>
    </Tilt>
  );
}

/** Carte « fait » à coin coupé : numéro, étiquette, valeur ; s'ambre au survol. */
export function CarteFait({ etiquette, valeur, index }: { etiquette: string; valeur: string; index: number }) {
  return (
    <div className="fait-carte">
      <div className="fait-carte-in">
        <span className="fait-num">{String(index).padStart(2, "0")}</span>
        <span className="label">{etiquette}</span>
        <span className="fait-valeur">{valeur}</span>
      </div>
    </div>
  );
}

type Archetype = { type: string; archetype: string; tagline: string };

/** Carte d'archétype : numéro en contour, étoile, inversion de couleurs et barre qui s'étire au survol. */
export function CarteArchetype({ a, index }: { a: Archetype; index: number }) {
  return (
    <Tilt className="">
      <article className="arch-carte">
        <span className="arch-num" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
        <Etoile taille={32} fil="#FFB000" className="arch-etoile" />
        <p className="arch-type">{a.type}</p>
        <p className="arch-arche">{a.archetype}</p>
        <p className="arch-tagline livre">{a.tagline}</p>
        <span className="arch-barre" aria-hidden="true" />
      </article>
    </Tilt>
  );
}

/** Carte produit : objet sur panneau ambre, nom, prix et flèche. */
export function CarteLien({ produit }: { produit: Produit }) {
  return (
    <Tilt className="">
      <Link to={`/boutique/${produit.slug}`} className="lien-carte">
        <span className="lien-carte-visuel">
          <VisuelProduit produit={produit} largeur={96} />
        </span>
        <span className="lien-carte-corps">
          <span className="lien-carte-type">{produit.type}</span>
          <strong>{produit.nom}</strong>
          <span className="lien-carte-prix">
            {fcfa(produit.fcfa)} <MoveRight size={16} />
          </span>
        </span>
      </Link>
    </Tilt>
  );
}
