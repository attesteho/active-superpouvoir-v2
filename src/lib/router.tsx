import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

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

  useEffect(() => {
    const onChange = () => {
      const nouveau = lire();
      setChemin(nouveau);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "auto" });
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  const aller = useCallback((to: string) => {
    if (lire() === to) {
      window.scrollTo({ top: 0, behavior: "smooth" });
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
