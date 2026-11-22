import { ArrowUpRight, MoveRight, AlertTriangle } from "lucide-react";
import { CarteAvis, CarteFait } from "../components/CartesUI";
import { EntetePage, Bloc } from "../components/Page";
import { PhotoCadre, Vignette } from "../components/Photo";
import { ProduitScene } from "../components/Visuels";
import { VisuelProduit } from "../components/VisuelProduit";
import { Vu } from "../components/Atelier";
import { Link } from "../lib/router";
import { fcfa, lienCommande, marque, methode, produits } from "../data/site";
import { methodePhotos, photos } from "../data/media";

const livre = produits[0];

export default function LeLivre() {
  return (
    <>
      <EntetePage
        surtitre="La pièce maîtresse"
        lignes={[<>Active ton</>, <>Superpouvoir&nbsp;!</>, <span key="s" className="livre font-normal text-or">Nadine Zoro</span>]}
        intro={livre.description}
        photo={photos.livreLecture}
      />

      <Bloc numero="01" titre="L’objet">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <Vu className="lg:col-span-5">
            <ProduitScene produit={livre} flottera />
          </Vu>
          <div className="lg:col-span-7">
            <Vu>
              <h2 className="display-m">Huit chapitres, une fabrication</h2>
              <p className="mt-5 max-w-xl text-[16.5px] text-dim">
                Le livre fondateur du mouvement. Il aide à découvrir ses talents uniques, à surmonter le doute et à bâtir
                sa propre mission de vie. Écrit dans un langage accessible et motivant, il se lit à tout âge — seul,
                en famille ou en classe.
              </p>

              <div className="mt-9 grid gap-4 sm:grid-cols-2">
                {[
                  ["Format", livre.format],
                  ["Chapitres", "8 chapitres transformateurs"],
                  ["Public", "Mini-Héros 8-12 · Explorateur 13-16 · Bâtisseur 17-22 · Mentor 23+"],
                  ["Prix", `${fcfa(livre.fcfa)} / ${livre.eur} €`],
                ].map(([k, v], i) => (
                  <CarteFait key={k} etiquette={k} valeur={v} index={i + 1} />
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a href={lienCommande(livre.nom)} className="btn btn-or">
                  Commander le livre <ArrowUpRight size={16} />
                </a>
                <Link to="/quiz" className="btn btn-craie">
                  Trouver mon profil d’abord
                </Link>
              </div>
            </Vu>
          </div>
        </div>
      </Bloc>

      <Bloc numero="02" titre="La méthode" fil="#FFB000">
        <Vu>
          <h2 className="display-l max-w-3xl">
            Quatre outils nommés,<br />
            <span className="livre font-normal text-or">une même trajectoire.</span>
          </h2>
          <p className="mt-5 max-w-2xl text-[16.5px] text-dim">
            Ce sont les quatre outils que le livre et le journal travaillent explicitement. Ils se répondent :
            on se cartographie, on cherche sa zone d’impact, on passe à l’action, on relie le tout à sa mission.
          </p>
        </Vu>

        <ol className="mt-12 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {methode.map((m, i) => (
            <Vu as="li" key={m.num} delay={i * 90}>
              <article className="outil-carte group">
                <div className="outil-carte-photo">
                  <Vignette photo={methodePhotos[m.num]} largeur={900} decoratif />
                  <span className="outil-carte-num">{m.num}</span>
                </div>
                <h3 className="mt-5 font-display text-[24px] font-extrabold leading-none">{m.nom}</h3>
                <p className="mt-3 border-t-2 border-paper pt-3 text-[14.5px] leading-snug text-dim">{m.description}</p>
              </article>
            </Vu>
          ))}
        </ol>

        <div className="mt-12 flex items-start gap-3 border border-or/25 bg-or/[0.06] p-5">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-or" />
          <p className="text-[14px] leading-snug text-dim">
            <strong className="text-paper">Transparence éditoriale.</strong> Le sommaire détaillé des huit chapitres n’est
            pas publié par le mouvement. Nous n’en inventons donc pas les titres. Ce qui est certain et documenté :
            le chapitre V traite des doutes (c’est la matière des 30 cartes) et les chapitres II & III traitent du talent
            et de la passion.
          </p>
        </div>
      </Bloc>

      <Bloc numero="03" titre="Ce qu’on y lit" fil="#FFB000">
        <div className="grid gap-10 lg:grid-cols-12">
          <Vu className="lg:col-span-7">
            <PhotoCadre photo={photos.citation} ratio="16 / 10" ratioMobile="4 / 5" voile>
              <blockquote className="citation-photo">« Tu n’es pas un hasard. Tu es une réponse. »</blockquote>
            </PhotoCadre>
            <p className="mt-6 max-w-xl text-[16px] text-dim">
              C’est la phrase d’ouverture du mouvement. Tout le livre en découle : si tu es une réponse, alors il existe
              une question à laquelle toi seul·e réponds — et le travail consiste à la trouver, pas à t’inventer.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/cartes" className="btn btn-craie">
                Lire les 30 affirmations <MoveRight size={16} />
              </Link>
            </div>
          </Vu>

          <Vu delay={120} className="lg:col-span-5">
            <div className="grid gap-6">
              <p className="label">Les avis publiés</p>
              {livre.avis.map((a) => (
                <CarteAvis key={a.nom} avis={a} />
              ))}
            </div>
          </Vu>
        </div>
      </Bloc>

      <Bloc numero="04" titre="Prolonger l’atelier" fil="#FFB000">
        <div className="grid gap-5 sm:grid-cols-2">
          {produits.slice(1, 3).map((p, i) => (
            <Vu key={p.slug} delay={i * 110}>
              <Link
                to={`/boutique/${p.slug}`}
                className="group flex h-full gap-6 border border-paper/12 bg-ink-2 p-7 transition-colors hover:border-paper/35"
                style={{ borderLeft: `2px solid ${p.fil}` }}
              >
                <div className="flex w-[104px] shrink-0 items-end sm:w-[132px]">
                  <VisuelProduit produit={p} largeur={104} />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <span className="label">{p.type}</span>
                    <h3 className="mt-3 font-display text-[24px] font-extrabold">{p.nom}</h3>
                    <p className="mt-3 text-[14.5px] leading-snug text-dim">{p.description.slice(0, 120)}…</p>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-2 font-display text-[13px] font-extrabold uppercase tracking-[0.1em]" style={{ color: p.fil }}>
                    {fcfa(p.fcfa)} <MoveRight size={15} className="transition-transform group-hover:translate-x-1.5" />
                  </span>
                </div>
              </Link>
            </Vu>
          ))}
        </div>
        <p className="mt-8 text-[13.5px] text-dim-2">
          {marque.titre} — {marque.autrice}. Une interprétation visuelle de l’objet-livre, pensée pour prolonger l’univers de la méthode.
        </p>
      </Bloc>
    </>
  );
}
