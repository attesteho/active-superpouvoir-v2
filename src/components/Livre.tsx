import { useEffect, useRef, type CSSProperties } from "react";
import { Etoile } from "./Atelier";
import { mouvementReduit } from "../lib/motion";
import { couverture } from "../data/media";

/**
 * Représentation du livre.
 *
 * IMPORTANT — fidélité produit : le volume est présenté en reliure toile neutre avec un bandeau d'éditeur
 * portant le titre et le nom de l'autrice, et la mention « maquette » est affichée à côté.
 *
 * Dès que `couverture.src` est renseigné (fichier officiel), la vraie couverture remplace
 * automatiquement le plat, sans autre modification.
 */
export function Livre({
  largeur = 300,
  inclinaison = -16,
  ouverture,
  interactif = true,
  flottera = false,
  className = "",
  priere,
}: {
  largeur?: number;
  inclinaison?: number;
  ouverture?: number;
  interactif?: boolean;
  flottera?: boolean;
  className?: string;
  priere?: string;
}) {
  const scene = useRef<HTMLDivElement>(null);
  const hauteur = Math.round(largeur * 1.44);
  const dos = Math.max(20, Math.round(largeur * 0.1));
  const vraie = Boolean(couverture.src);

  useEffect(() => {
    const el = scene.current;
    if (!el || !interactif || mouvementReduit()) return;
    if (window.matchMedia("(hover: none)").matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--px", String((e.clientX - r.left) / r.width - 0.5));
        el.style.setProperty("--py", String((e.clientY - r.top) / r.height - 0.5));
      });
    };
    const onLeave = () => {
      el.style.setProperty("--px", "0");
      el.style.setProperty("--py", "0");
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [interactif]);

  const style = {
    width: largeur,
    height: hauteur,
    perspective: "1800px",
    "--px": 0,
    "--py": 0,
    ...(ouverture === undefined ? {} : { "--open": ouverture }),
  } as CSSProperties;

  return (
    <div ref={scene} className={`relative ${className}`} style={style}>
      <div className={flottera ? "anim-flotte h-full w-full" : "h-full w-full"}>
        <div
          className="preserve-3d relative h-full w-full transition-transform duration-500 ease-out"
          style={{
            transform: `rotateY(calc(${inclinaison}deg + var(--px) * 12deg)) rotateX(calc(var(--py) * -7deg))`,
            filter: "drop-shadow(0 20px 32px rgba(50, 16, 68,.35))",
          }}
        >
          <div className="absolute inset-0 border-2 border-[#321044] bg-[#FFB000]" style={{ transform: `translateZ(-${dos / 2}px)` }} aria-hidden="true" />

          {/* tranche */}
          <div
            className="absolute left-0 top-0 overflow-hidden border-y-2 border-[#321044] bg-[#FFB000]"
            style={{ width: dos, height: hauteur, transformOrigin: "left center", transform: `translateZ(-${dos / 2}px) rotateY(-90deg)` }}
            aria-hidden="true"
          >
            <div className="flex h-full w-full items-center justify-center">
              <span
                className="whitespace-nowrap font-display font-bold uppercase tracking-[0.16em] text-[#FFF0D9]"
                style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", fontSize: Math.max(7, dos * 0.4) }}
              >
                Nadine Zoro
              </span>
            </div>
          </div>

          {/* bloc de pages */}
          <div
            className="absolute right-0 top-[1%] border-y-2 border-r-2 border-[#321044]"
            style={{
              width: dos - 3,
              height: hauteur * 0.98,
              transformOrigin: "right center",
              transform: `translateZ(-${dos / 2}px) rotateY(90deg)`,
              background: "repeating-linear-gradient(90deg,#FFF0D9 0 2px,#FFF0D9 2px 3.5px)",
            }}
            aria-hidden="true"
          />

          {/* page de garde */}
          <div
            className="absolute inset-0 flex flex-col justify-between border-2 border-[#321044] bg-[#FFF0D9] p-[8%]"
            style={{ transform: `translateZ(${dos / 2 - 1}px)`, color: "#321044" }}
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] opacity-60">La Fabrique des Héros</span>
            <p className="font-display font-bold leading-[1.02]" style={{ fontSize: largeur * 0.095 }}>
              {priere || "Tu n’es pas un hasard. Tu es une réponse."}
            </p>
            <span className="h-[3px] w-1/3 bg-[#FFB000]" />
          </div>

          {/* premier plat */}
          <div
            className="backface-hidden absolute inset-0 overflow-hidden border-2 border-[#321044] bg-[#FFB000]"
            style={{
              transformOrigin: "left center",
              transform: `translateZ(${dos / 2}px) rotateY(calc(var(--open) * -150deg))`,
            }}
          >
            {vraie ? (
              <img
                src={couverture.src as string}
                alt={couverture.alt}
                width={couverture.largeur}
                height={couverture.hauteur}
                className="h-full w-full object-cover"
                loading="eager"
                decoding="async"
              />
            ) : (
              <>
                {/* reliure toile : matière, pas de couverture inventée */}
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, rgba(255,255,255,.09) 0 1px, transparent 1px 4px), repeating-linear-gradient(90deg, rgba(0,0,0,.16) 0 1px, transparent 1px 4px)",
                  }}
                  aria-hidden="true"
                />
                <div className="absolute inset-[7%] border border-[#FFF0D9]/25" aria-hidden="true" />
                <div className="absolute inset-0 flex items-center justify-center opacity-70">
                  <Etoile taille={largeur * 0.2} fil="#FFB000" />
                </div>

                {/* bandeau d'éditeur : élément réel et amovible, distinct de la couverture */}
                <div
                  className="absolute inset-x-[-3%] border-y-2 border-[#321044] bg-[#FFF0D9] px-[8%] py-[5%] text-[#321044]"
                  style={{ top: "58%" }}
                >
                  <p className="font-display font-extrabold uppercase leading-[0.95]" style={{ fontSize: largeur * 0.082, letterSpacing: "-0.03em" }}>
                    Active ton<br />Superpouvoir&nbsp;!
                  </p>
                  <p className="mt-[4%] flex items-center justify-between gap-2 border-t border-[#321044]/30 pt-[3%] text-[#321044]" style={{ fontSize: Math.max(7, largeur * 0.032) }}>
                    <span className="font-semibold uppercase tracking-[0.12em]">Nadine Zoro</span>
                    <span className="font-semibold">8 chapitres</span>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Mention obligatoire tant que le fichier officiel n'est pas fourni. */
export function MentionMaquette({ className = "" }: { className?: string }) {
  if (couverture.src) return null;
  return (
    <p className={`text-[12px] leading-snug text-dim-2 ${className}`}>
      Maquette de présentation. La couverture officielle n’est pas fournie par l’éditeur&nbsp;: nous ne la
      reproduisons pas. Le bandeau porte les seules informations authentiques (titre, autrice, 8 chapitres).
    </p>
  );
}
