import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight, Mail, MoveRight, ShoppingBag } from "lucide-react";
import { Link, useRoute } from "../lib/router";
import { useDefile, useProgression } from "../lib/motion";
import { BandeKente, Etoile, Defilement } from "./Atelier";
import { marque, navigation } from "../data/site";
import { useCart } from "../lib/cart";
import { Logo } from "./Logo";
import { fonds } from "../data/media";
import { FondPhoto } from "./Photo";

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
      <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-paper focus:px-4 focus:py-2 focus:font-bold focus:text-ink">Aller au contenu</a>

      <header className={`site-header fixed inset-x-0 top-0 z-50 bg-ink transition-shadow duration-300 ${solide ? "shadow-[0_3px_0_#FFB000]" : ""}`}>
        <div className="mx-auto flex h-[70px] w-full max-w-[1440px] items-center gap-4 px-5 sm:px-8 xl:px-14">
          <Link to="/" className="group flex shrink-0 items-center" aria-label="Active ton Superpouvoir — accueil">
            <Logo className="h-auto w-[154px] shrink-0 sm:w-[176px] xl:w-[208px]" />
          </Link>

          <nav aria-label="Navigation principale" className="ml-auto hidden items-center gap-2 lg:flex">
            {[{ href: "#/", label: "Accueil" }, ...navigation.slice(0, 4)].map((n) => {
              const actif = chemin === n.href.slice(1);
              return (
                <Link
                  key={n.href}
                  to={n.href.slice(1)}
                  className={`font-display text-[14px] font-bold tracking-[-0.01em] transition-colors ${actif ? "rounded-full bg-orange px-4 py-2 text-ink-2" : "souligne px-2 py-2 text-paper hover:text-orange"}`}
                  aria-current={actif ? "page" : undefined}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>

          <Link to="/panier" className="header-cart hidden items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.1em] sm:inline-flex" aria-label={`Panier, ${count} pièce${count > 1 ? "s" : ""}`}>
            <ShoppingBag size={16} /><span>Panier</span><b>{count}</b>
          </Link>

          <Link to="/boutique" className="btn btn-or ml-auto hidden !min-h-[42px] !px-4 !py-1.5 !text-[13px] sm:inline-flex lg:ml-5">Commander <MoveRight size={15} strokeWidth={2.6} /></Link>

          <button type="button" onClick={() => setOuvert((v) => !v)} aria-expanded={ouvert} aria-controls="menu-atelier" className="ml-auto flex h-[42px] items-center gap-2 rounded-full border border-paper/30 px-3 font-mono text-[11px] font-bold uppercase tracking-[0.12em] transition-colors hover:bg-paper hover:text-ink sm:ml-0 lg:hidden">
            {ouvert ? <X size={16} /> : <Menu size={16} />}{ouvert ? "Fermer" : "Menu"}
          </button>
        </div>
        <div className="h-[3px] w-full bg-paper/12"><div className="h-[3px] bg-or" style={{ width: `${p * 100}%` }} /></div>
      </header>

      <div id="menu-atelier" aria-hidden={!ouvert} className={`fixed inset-0 z-40 flex-col overflow-y-auto bg-jaune pt-[73px] lg:!hidden ${ouvert ? "flex" : "hidden"}`}>
        <BandeKente hauteur={12} />
        <nav aria-label="Menu mobile" className="flex-1 px-5 py-6 sm:px-8">
          <ul>{[{ href: "#/", label: "Accueil" }, ...navigation, { href: "#/boutique", label: "Boutique" }, { href: "#/panier", label: `Panier (${count})` }, { href: "#/contact", label: "Contact" }].map((n, i) => <li key={n.href} className="border-b-2 border-paper/25"><Link to={n.href.slice(1)} className="flex items-baseline gap-4 py-3.5 font-display text-[30px] font-extrabold uppercase leading-none tracking-[-0.04em] transition-colors hover:text-or" onClick={() => setOuvert(false)}><span className="font-mono text-[11px] tracking-normal">{String(i).padStart(2, "0")}</span>{n.label}</Link></li>)}</ul>
          <a href={`mailto:${marque.emailMailto}`} className="mt-8 inline-flex items-center gap-2 font-mono text-[13px] font-bold"><Mail size={15} /> {marque.email}</a>
        </nav>
      </div>
    </>
  );
}

export function Pied() {
  return (
    <footer className="champ inverse relative mt-0 overflow-hidden bg-paper text-ink">
      <FondPhoto photo={fonds.pied} parallaxe={false} opacite={0.14} />
      <div className="h-[6px] w-full bg-orange" />
      <div className="mx-auto w-full max-w-[1440px] px-5 pb-10 pt-16 sm:px-8 xl:px-14">
        <Logo clair className="mb-12 block h-auto w-full max-w-[420px]" />
        <div className="grid gap-10 border-t border-ink/15 pt-10 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          <div><p className="max-w-sm text-[15px] text-dim">{marque.mission}</p></div>
          <nav aria-label="Explorer"><p className="label mb-4">Explorer</p><ul className="space-y-2.5 text-[15px]">{navigation.slice(0, 5).map((n) => <li key={n.href}><Link to={n.href.slice(1)} className="souligne hover:text-orange">{n.label}</Link></li>)}</ul></nav>
          <nav aria-label="Ressources"><p className="label mb-4">Ressources</p><ul className="space-y-2.5 text-[15px]">{[{ to: "/bibliotheque", l: "Bibliothèque" }, { to: "/boutique", l: "Boutique" }, { to: "/communaute", l: "Communauté" }, { to: "/contact", l: "Contact & presse" }].map((n) => <li key={n.to}><Link to={n.to} className="souligne hover:text-orange">{n.l}</Link></li>)}</ul></nav>
          <div><p className="label mb-4">Écrire à l’atelier</p><a href={`mailto:${marque.emailMailto}`} className="inline-flex items-center gap-2 font-display text-[17px] font-extrabold text-orange underline-offset-4 hover:underline">{marque.email} <ArrowUpRight size={16} /></a><p className="mt-4 text-[13.5px] text-dim-2">Presse, partenariats, programmes écoles. Les réseaux sociaux du mouvement ne sont pas renseignés publiquement : aucun lien vide n’est publié ici.</p><Link to="/contact" className="btn btn-craie mt-5 !min-h-[46px] !text-[13px]">Ouvrir un projet <MoveRight size={15} /></Link></div>
        </div>
      </div>
      <div className="border-y border-ink/15 py-3"><Defilement vitesse={34} enfants={<span className="flex items-center gap-10 whitespace-nowrap font-display text-[15px] font-extrabold uppercase tracking-[0.2em] text-ink/70">{marque.villes.map((v) => <span key={v} className="flex items-center gap-10">{v} <Etoile taille={12} fil="#F3781E" /></span>)}</span>} /></div>
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-2 px-5 py-6 font-mono text-[11.5px] text-dim-2 sm:flex-row sm:items-center sm:justify-between sm:px-8 xl:px-14"><p>© 2026 Active ton Superpouvoir — Nadine Zoro</p><p>Abidjan · Dakar · Paris · Le Monde</p></div>
    </footer>
  );
}
