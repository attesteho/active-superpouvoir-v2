import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight, Mail, MoveRight, Search, ShoppingBag, User } from "lucide-react";
import { Link, useRoute } from "../lib/router";
import { useDefile, useProgression } from "../lib/motion";
import { BandeKente, Defilement, Etoile } from "./Atelier";
import { marque, navigation } from "../data/site";
import { useCart } from "../lib/cart";
import { Logo } from "./Logo";

export function Entete() {
  const [ouvert, setOuvert] = useState(false);
  const solide = useDefile(30);
  const p = useProgression();
  const { chemin } = useRoute();
  const { count } = useCart();

  useEffect(() => setOuvert(false), [chemin]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOuvert(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = ouvert ? "hidden" : "";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [ouvert]);

  return (
    <>
      <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-paper focus:px-4 focus:py-2 focus:font-bold focus:text-ink">Aller au contenu</a>

      <header className={`site-header fixed inset-x-0 top-0 z-50 bg-ink text-paper transition-shadow duration-300 ${solide ? "shadow-[0_2px_10px_rgba(47,15,73,0.1)]" : ""}`}>
        <div className="mx-auto flex h-[64px] w-full max-w-[1320px] items-center gap-6 px-5 sm:px-8 xl:px-12">
          <Link to="/" className="flex shrink-0 items-center" aria-label="Active ton Superpouvoir — accueil">
            <Logo className="h-9 w-auto sm:h-10" />
          </Link>

          <nav aria-label="Navigation principale" className="hidden items-center gap-1 lg:flex">
            {[{ href: "#/", label: "Accueil" }, ...navigation.slice(0, 4)].map((n) => {
              const actif = chemin === n.href.slice(1);
              return (
                <Link
                  key={n.href}
                  to={n.href.slice(1)}
                  className={`pastille-nav ${actif ? "bg-or text-paper" : "text-paper/80 hover:text-orange"}`}
                  aria-current={actif ? "page" : undefined}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-4">
            <button type="button" className="hidden items-center text-paper/70 transition-colors hover:text-orange sm:inline-flex" aria-label="Rechercher">
              <Search size={19} />
            </button>
            <Link to="/contact" className="hidden items-center text-paper/70 transition-colors hover:text-orange sm:inline-flex" aria-label="Mon compte">
              <User size={19} />
            </Link>
            <Link to="/panier" className="relative inline-flex items-center text-paper/70 transition-colors hover:text-orange" aria-label={`Panier, ${count} pièce${count > 1 ? "s" : ""}`}>
              <ShoppingBag size={19} />
              {count > 0 && <b className="absolute -right-2 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-orange px-1 font-body text-[10px] font-bold leading-none text-ink">{count}</b>}
            </Link>

            <button type="button" onClick={() => setOuvert((v) => !v)} aria-expanded={ouvert} aria-controls="menu-atelier" className="flex h-9 w-9 items-center justify-center rounded-full border border-paper/20 text-paper transition-colors hover:bg-paper hover:text-ink lg:hidden">
              {ouvert ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>
        <div className="h-[3px] w-full bg-paper/8"><div className="h-full bg-orange transition-[width]" style={{ width: `${p * 100}%` }} /></div>
      </header>

      <div id="menu-atelier" aria-hidden={!ouvert} className={`fixed inset-0 z-40 flex-col overflow-y-auto bg-ink pt-[64px] text-paper lg:!hidden ${ouvert ? "flex" : "hidden"}`}>
        <BandeKente hauteur={8} />
        <nav aria-label="Menu mobile" className="flex-1 px-6 py-8">
          <ul className="flex flex-col gap-1">{[{ href: "#/", label: "Accueil" }, ...navigation, { href: "#/boutique", label: "Boutique" }, { href: "#/panier", label: `Panier (${count})` }, { href: "#/contact", label: "Contact" }].map((n) => <li key={n.href} className="border-b border-paper/10 py-3"><Link to={n.href.slice(1)} className="block font-display text-[21px] font-bold transition-colors hover:text-orange" onClick={() => setOuvert(false)}>{n.label}</Link></li>)}</ul>
          <a href={`mailto:${marque.emailMailto}`} className="mt-6 inline-flex items-center gap-2 font-body text-[14px] font-semibold text-paper/80"><Mail size={15} /> {marque.email}</a>
        </nav>
      </div>
    </>
  );
}

export function Pied() {
  return (
    <footer className="fond-tisse relative overflow-hidden text-ink">
      <BandeKente hauteur={8} />
      <div className="mx-auto max-w-[1320px] px-5 pb-10 pt-14 sm:px-8 xl:px-12">
        <Logo className="block h-10 w-auto" />
        <div className="mt-10 grid gap-10 border-t border-ink/15 pt-10 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] lg:gap-6">
          <div><p className="font-body text-[15px] leading-relaxed text-ink/70">{marque.mission}</p></div>
          <nav aria-label="Explorer"><p className="label text-ink/50">Explorer</p><ul className="mt-3 space-y-2.5">{navigation.slice(0, 5).map((n) => <li key={n.href}><Link to={n.href.slice(1)} className="font-body text-[14px] font-medium text-ink/75 transition-colors hover:text-or">{n.label}</Link></li>)}</ul></nav>
          <nav aria-label="Ressources"><p className="label text-ink/50">Ressources</p><ul className="mt-3 space-y-2.5">{[{ to: "/bibliotheque", l: "Bibliothèque" }, { to: "/boutique", l: "Boutique" }, { to: "/communaute", l: "Communauté" }, { to: "/contact", l: "Contact & presse" }].map((n) => <li key={n.to}><Link to={n.to} className="font-body text-[14px] font-medium text-ink/75 transition-colors hover:text-or">{n.l}</Link></li>)}</ul></nav>
          <div>
            <p className="label text-ink/50">Écrire à l’atelier</p>
            <a href={`mailto:${marque.emailMailto}`} className="mt-3 inline-flex items-center gap-1.5 font-display text-[17px] font-extrabold text-or underline-offset-4 hover:underline">{marque.email} <ArrowUpRight size={16} /></a>
            <p className="mt-3 font-body text-[13px] leading-relaxed text-ink/55">Presse, partenariats, programmes écoles. Les réseaux sociaux du mouvement ne sont pas renseignés publiquement : aucun lien vide n’est publié ici.</p>
            <Link to="/contact" className="btn btn-craie mt-5 !min-h-[46px] !text-[13px]">Ouvrir un projet <MoveRight size={15} /></Link>
          </div>
        </div>
      </div>
      <div className="border-y border-ink/12"><Defilement vitesse={34} enfants={<span className="flex items-center whitespace-nowrap font-display text-[13px] font-extrabold uppercase tracking-wide text-ink/60">{marque.villes.map((v) => <span key={v} className="flex items-center gap-2 px-3">{v} <Etoile taille={11} fil="#FDB905" /></span>)}</span>} /></div>
      <div className="mx-auto flex max-w-[1320px] flex-col gap-1 px-5 py-6 font-body text-[13px] text-ink/50 sm:flex-row sm:items-center sm:justify-between sm:px-8 xl:px-12"><p>© 2026 Active ton Superpouvoir — Nadine Zoro</p><p>Abidjan · Dakar · Paris · Le Monde</p></div>
    </footer>
  );
}
