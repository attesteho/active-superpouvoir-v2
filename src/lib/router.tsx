import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { obtenirLenis } from "./lenis";

/** Remet la page en haut — en passant par Lenis s'il tourne, sinon il ignorerait l'appel natif
    et resterait sur sa position mémorisée (c'était la cause du « retour où j'étais » au clic sur
    un lien de menu). `force` : fonctionne même si Lenis est actuellement arrêté (PagesEmpilees). */
function remonterEnHaut() {
  const lenis = obtenirLenis();
  if (lenis) {
    // Repart toujours actif : si la page quittée était une pile de sections (PagesEmpilees) en
    // plein milieu, Lenis pouvait être arrêté — sans ce `start()`, rien ne le relancerait jamais
    // sur une page d'arrivée qui n'a pas elle-même de pile pour le faire.
    lenis.start();
    lenis.scrollTo(0, { immediate: true, force: true });
  } else {
    window.scrollTo(0, 0);
  }
}

const lire = () => {
  const h = window.location.hash.replace(/^#/, "");
  return h === "" ? "/" : h;
};

const RouteCtx = createContext<{ chemin: string; aller: (to: string) => void }>({
  chemin: "/",
  aller: () => {},
});

export function RouteProvider({ children }: { children: ReactNode }) {
  const [chemin, setChemin] = useState(() => (typeof window === "undefined" ? "/" : lire()));

  // Le navigateur restaure sinon lui-même la position de scroll mémorisée pour chaque entrée
  // d'historique (y compris par hash) — ce qui court-circuitait silencieusement notre remise en
  // haut, après coup, sans qu'aucun de nos appels ne puisse plus rien y faire.
  useEffect(() => {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
  }, []);

  useEffect(() => {
    const onChange = () => {
      const nouveau = lire();
      setChemin(nouveau);
      remonterEnHaut();
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  /* Filet de sécurité : relance la remise en haut une fois la nouvelle page effectivement montée
     (après le re-rendu déclenché par `setChemin`), au cas où une restauration de scroll ou un
     effet de la page arrivée l'aurait déplacée entre-temps. */
  useEffect(() => {
    remonterEnHaut();
    const r = requestAnimationFrame(remonterEnHaut);
    return () => cancelAnimationFrame(r);
  }, [chemin]);

  const aller = useCallback((to: string) => {
    if (lire() === to) {
      remonterEnHaut();
      return;
    }
    window.location.hash = to;
  }, []);

  return <RouteCtx.Provider value={{ chemin, aller }}>{children}</RouteCtx.Provider>;
}

export const useRoute = () => useContext(RouteCtx);

export function Link({
  to,
  children,
  className,
  onClick,
  ...rest
}: { to: string; children: ReactNode; className?: string; onClick?: () => void } & Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "onClick"
>) {
  const { aller } = useRoute();
  return (
    <a
      href={"#" + to}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
        aller(to);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
