import { useEffect, useRef, useState, type ReactNode } from "react";
import { useVu } from "../lib/motion";

/* ————— Marque : géométrie exacte du logo officiel ————— */
export function Etoile({ taille = 28, fil = "#321044", className = "" }: { taille?: number; fil?: string; className?: string }) {
  const id = `cl-${fil.replace("#", "")}-${taille}`;
  return (
    <svg width={taille} height={taille} viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={id}>
          <polygon points="50,7 60,36.3 90.9,36.7 66.2,55.3 75.3,84.8 50,67 24.7,84.8 33.8,55.3 9.1,36.7 40,36.3" />
        </clipPath>
      </defs>
      <polygon points="50,7 60,36.3 90.9,36.7 66.2,55.3 75.3,84.8 50,67 24.7,84.8 33.8,55.3 9.1,36.7 40,36.3" fill={fil} />
      <path d="M 57,20 L 36,54 L 47,54 L 43,82 L 63,47 L 52,47 Z" fill="#FFF0D9" clipPath={`url(#${id})`} />
    </svg>
  );
}

/* ————— Repères de calage : le détail d'imprimerie ————— */
export function Repere({ className = "", fil = "#321044" }: { className?: string; fil?: string }) {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" className={className} aria-hidden="true">
      <circle cx="13" cy="13" r="7.5" fill="none" stroke={fil} strokeWidth="1.2" />
      <path d="M13 0v9M13 17v9M0 13h9M17 13h9" stroke={fil} strokeWidth="1.2" />
    </svg>
  );
}

/* ————— Bande tissée : rappel kente, en aplats d'encre ————— */
export function BandeKente({ hauteur = 14, className = "", opacite = 1 }: { hauteur?: number; className?: string; opacite?: number }) {
  const id = useRef("k" + Math.random().toString(36).slice(2, 8)).current;
  return (
    <svg className={className} width="100%" height={hauteur} aria-hidden="true" style={{ opacity: opacite, display: "block" }}>
      <defs>
        <pattern id={id} width="88" height={hauteur} patternUnits="userSpaceOnUse">
          <rect width="88" height={hauteur} fill="#321044" />
          <rect x="0" width="22" height={hauteur} fill="#FFB000" />
          <rect x="22" width="12" height={hauteur} fill="#FFB000" />
          <rect x="40" width="16" height={hauteur} fill="#FFB000" />
          <rect x="62" width="8" height={hauteur} fill="#FFF0D9" />
          <rect x="76" width="12" height={hauteur} fill="#FFB000" />
          <rect x="44" y={hauteur / 3} width="8" height={hauteur / 3} fill="#FFF0D9" />
        </pattern>
      </defs>
      <rect width="100%" height={hauteur} fill={`url(#${id})`} />
    </svg>
  );
}

/* ————— Révélation au scroll ————— */
export function Vu({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}) {
  const ref = useVu<HTMLDivElement>();
  const T = Tag as React.ElementType;
  return (
    <T ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </T>
  );
}

export function LignesMasquees({ lignes, className = "" }: { lignes: ReactNode[]; className?: string }) {
  const ref = useVu<HTMLHeadingElement>("0px");
  return (
    <span ref={ref} className={className}>
      {lignes.map((l, i) => (
        <span className="mask-line" key={i}>
          <span style={{ transitionDelay: `${i * 100}ms` }}>{l}</span>
        </span>
      ))}
    </span>
  );
}

/* ————— Étiquette de poste : numéro plein, pas de filet gris ————— */
export function Etiquette({ num, label, fond = "#321044" }: { num: string; label: string; fond?: string; encre?: string }) {
  const accent = fond === "#321044" ? "#F3781E" : fond;
  return (
    <div className="etiquette inline-flex items-center rounded-full" style={{ background: `${accent}14` }}>
      <span className="font-mono font-bold" style={{ color: accent }}>{num}</span>
      <span className="rounded-full" style={{ background: accent }} />
      <span className="font-mono font-bold uppercase" style={{ color: accent }}>{label}</span>
    </div>
  );
}

/* ————— Coquille de section ————— */
export function Poste({
  num,
  label,
  id,
  children,
  className = "",
  teinte = "#321044",
  encre,
}: {
  num: string;
  label: string;
  id?: string;
  children: ReactNode;
  className?: string;
  teinte?: string;
  encre?: string;
}) {
  return (
    <section id={id} className={`champ relative ${className}`} data-poste={num}>
      <div className="">
        <Etiquette num={num} label={label} fond={teinte} encre={encre} />
        {children}
      </div>
    </section>
  );
}

/* ————— Bandeau défilant ————— */
export function Defilement({ enfants, vitesse = 40 }: { enfants: ReactNode; vitesse?: number }) {
  return (
    <div className="relative flex overflow-hidden">
      <div className="anim-defile flex shrink-0 items-center" style={{ animationDuration: `${vitesse}s` }}>
        {enfants}
        {enfants}
      </div>
    </div>
  );
}

/* ————— Monogramme ————— */
export function Monogramme({ initiales, fil, taille = 56 }: { initiales: string; fil: string; taille?: number }) {
  // Contraste calculé : l'encre est noire sur les aplats clairs, papier sur les aplats sombres.
  const hex = fil.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full font-display font-extrabold"
      style={{ width: taille, height: taille, background: fil, color: lum > 0.55 ? "#321044" : "#FFF0D9", fontSize: taille * 0.36 }}
      aria-hidden="true"
    >
      {initiales}
    </span>
  );
}

/* ————— Rail de progression ————— */
export function RailFils({ postes }: { postes: { num: string; label: string; id: string }[] }) {
  const [actif, setActif] = useState(0);
  const [p, setP] = useState(0);

  useEffect(() => {
    let raf = 0;
    const maj = () => {
      raf = 0;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setP(h > 0 ? Math.min(1, window.scrollY / h) : 0);
      let courant = 0;
      postes.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.42) courant = i;
      });
      setActif(courant);
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(maj);
    };
    maj();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [postes]);

  return (
    <nav aria-label="Progression" className="pointer-events-none fixed z-30 hidden mix-blend-difference xl:block">
      <div className="absolute bg-[#FFF0D9]/30" />
      <div className="absolute bg-[#FFB000]" style={{ height: `${p * 100}%` }} />
      <ul className="pointer-events-auto absolute flex -translate-y-1/2 flex-col">
        {postes.map((s, i) => (
          <li key={s.id} className="group relative flex items-center">
            <a href={`#${s.id}`} className="flex items-center" aria-label={`Poste ${s.num} — ${s.label}`}>
              <span
                className="block transition-all duration-500"
                style={{ width: i === actif ? 24 : 10, background: i === actif ? "#FFB000" : "rgba(255, 240, 217,.55)" }}
              />
            </a>
            <span className="pointer-events-none absolute whitespace-nowrap bg-[#321044] font-mono uppercase text-[#FFF0D9] opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
              {s.num} · {s.label}
            </span>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Fil({ fil = "#FFB000", className = "" }: { fil?: string; className?: string }) {
  return <span className={`anim-fil block${className}`} style={{ background: fil }} />;
}
