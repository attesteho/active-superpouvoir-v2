import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "../lib/router";
import { cn } from "../utils/cn";

/**
 * Forme de pinceau irrégulière (pas un rectangle vectoriel parfait) : bords
 * ondulés en haut/bas. `preserveAspectRatio="none"` étire le blob pour qu'il
 * remplisse exactement la boîte du bouton, quelle que soit la longueur du texte.
 */
const FORME_PEINTE =
  "M9,27 C6,15 21,5 46,4 C88,2 138,9 186,5 C224,2 262,7 284,15 C297,20 296,33 293,41 C290,52 297,62 282,69 C248,76 198,69 150,73 C101,78 52,73 23,67 C7,64 2,51 6,41 C9,33 4,35 9,27 Z";

type TaillePeint = "md" | "lg";
type VariantePeint = "or" | "craie";

type ProposPartagees = {
  children: ReactNode;
  icone?: ReactNode;
  variante?: VariantePeint;
  taille?: TaillePeint;
  /** Pour une utilisation sur fond sombre (ex. section .inverse) : inverse les teintes de la variante "craie". */
  inverse?: boolean;
  className?: string;
};

type ProposCommunes = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement> & ButtonHTMLAttributes<HTMLButtonElement>,
  "className" | "children" | "href" | "onClick" | "color"
>;

export type BoutonPeintProps = ProposPartagees &
  ProposCommunes & {
    /** Navigation interne via le routeur maison (src/lib/router) — rendu en <Link>. */
    to?: string;
    /** Lien externe ou ancre classique — rendu en <a>. */
    href?: string;
    onClick?: () => void;
  };

const TAILLES: Record<TaillePeint, string> = {
  md: "min-h-[50px] gap-2 px-6 py-3 text-[0.95rem]",
  lg: "min-h-[58px] gap-2.5 px-8 py-3.5 text-base",
};

export function BoutonPeint({
  children,
  icone,
  variante = "or",
  taille = "md",
  inverse = false,
  className,
  to,
  href,
  onClick,
  type,
  ...rest
}: BoutonPeintProps) {
  const estOr = variante === "or";
  const couleurTexte = estOr ? "text-ink" : inverse ? "text-ink" : "text-paper";

  const base = cn(
    "relative inline-flex select-none items-center justify-center whitespace-nowrap",
    "font-display font-semibold no-underline",
    "transition-transform duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0",
    "disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-40",
    TAILLES[taille],
    couleurTexte,
    className
  );

  const svg = (
    <svg
      className="pointer-events-none absolute inset-0 -z-0 h-full w-full"
      viewBox="0 0 300 80"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={FORME_PEINTE}
        fill={estOr ? "var(--color-orange)" : "none"}
        stroke={estOr ? "none" : `var(${inverse ? "--color-ink" : "--color-paper"})`}
        strokeWidth={estOr ? 0 : 3}
        strokeOpacity={estOr ? 1 : 0.55}
        strokeLinejoin="round"
        style={estOr ? { filter: "drop-shadow(0 4px 0 color-mix(in srgb, var(--color-paper) 16%, transparent))" } : undefined}
      />
    </svg>
  );

  const contenu = (
    <span className="relative z-10 inline-flex items-center gap-[inherit]">
      {icone}
      {children}
    </span>
  );

  if (to) {
    return (
      <Link to={to} className={base} onClick={onClick} {...rest}>
        {svg}
        {contenu}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={base} onClick={onClick} {...rest}>
        {svg}
        {contenu}
      </a>
    );
  }

  return (
    <button type={type ?? "button"} className={base} onClick={onClick} {...rest}>
      {svg}
      {contenu}
    </button>
  );
}
