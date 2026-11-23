import { useCallback, useEffect, useState } from "react";
import { cn } from "../utils/cn";

/** Clé sessionStorage : le préchargement ne joue qu'une fois par session de navigation. */
const CLE_SESSION = "atp-v2-precharge-vu";

const DUREE_COMPTEUR_MS = 1500;
const DUREE_SORTIE_MS = 450;
const DUREE_SORTIE_REDUITE_MS = 300;

function dejaVu() {
  if (typeof window === "undefined") return true;
  try {
    return window.sessionStorage.getItem(CLE_SESSION) === "1";
  } catch {
    return false;
  }
}

/**
 * Rideau de préchargement plein écran, affiché une seule fois par session
 * (avant la première apparition de l'accueil). Ne nécessite aucune logique
 * côté appelant : le composant gère lui-même sa visibilité via sessionStorage
 * et ne rend rien s'il a déjà joué dans cette session.
 */
export function Precharge() {
  const [actif, setActif] = useState(() => !dejaVu());
  const [pourcentage, setPourcentage] = useState(0);
  const [sortie, setSortie] = useState(false);
  // Calculé une fois à l'initialisation (avant le premier rendu peint) : jamais de flash animé pour les utilisateurs "mouvement réduit".
  const [reduit] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const terminer = useCallback((dureeFade: number) => {
    setSortie(true);
    window.setTimeout(() => {
      try {
        window.sessionStorage.setItem(CLE_SESSION, "1");
      } catch {
        // Le préchargement reste inoffensif si le stockage de session est bloqué : il rejouera simplement.
      }
      setActif(false);
    }, dureeFade);
  }, []);

  useEffect(() => {
    if (!actif) return;

    if (reduit) {
      // Pas de montée animée ni de balancement : on affiche 100 % directement puis on referme vite.
      setPourcentage(100);
      terminer(DUREE_SORTIE_REDUITE_MS);
      return;
    }

    const depart = performance.now();
    let raf = 0;
    const animer = (maintenant: number) => {
      const t = Math.min(1, (maintenant - depart) / DUREE_COMPTEUR_MS);
      const progression = 1 - Math.pow(1 - t, 3); // ease-out cubique
      const valeur = Math.round(progression * 100);
      setPourcentage((precedent) => (valeur > precedent ? valeur : precedent));
      if (t < 1) {
        raf = requestAnimationFrame(animer);
      } else {
        terminer(DUREE_SORTIE_MS);
      }
    };
    raf = requestAnimationFrame(animer);
    return () => cancelAnimationFrame(raf);
  }, [actif, reduit, terminer]);

  if (!actif) return null;

  const dureeFade = reduit ? DUREE_SORTIE_REDUITE_MS : DUREE_SORTIE_MS;

  return (
    <div
      role="status"
      aria-label="Chargement"
      className={cn(
        "fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-7 bg-paper",
        "transition-opacity ease-out",
        sortie ? "pointer-events-none opacity-0" : "opacity-100"
      )}
      style={{ transitionDuration: `${dureeFade}ms` }}
    >
      <style>{`
        @keyframes precharge-idle {
          0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
          50% { transform: translateY(-3%) rotate(-2deg) scale(1.015); }
        }
      `}</style>
      <img
        src="/images/01-accueil-heroine.webp"
        alt=""
        aria-hidden="true"
        width={1127}
        height={1395}
        className={cn("w-[42vw] max-w-[240px] select-none", !reduit && "[animation:precharge-idle_2.6s_ease-in-out_infinite]")}
      />
      <p
        aria-hidden="true"
        className="font-display text-[clamp(2.75rem,13vw,5.5rem)] font-extrabold leading-none text-or"
      >
        {pourcentage}%
      </p>
    </div>
  );
}
