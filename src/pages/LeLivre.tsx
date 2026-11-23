import { ArrowUpRight, AlertTriangle } from "lucide-react";
import { CarteAvis, CarteFait } from "../components/CartesUI";
import { EntetePage, Bloc } from "../components/Page";
import { PagesEmpilees } from "../components/PagesEmpilees";
import { Vignette } from "../components/Photo";
import { ProduitScene } from "../components/Visuels";
import { VisuelProduit } from "../components/VisuelProduit";
import { CadreDecoupe } from "../components/CadreDecoupe";
import { BoutonPeint } from "../components/BoutonPeint";
import { Icone } from "../components/Icone";
import { Vu } from "../components/Atelier";
import { Link } from "../lib/router";
import { fcfa, marque, methode, produits } from "../data/site";
import { methodePhotos, photos } from "../data/media";

const livre = produits[0];

export default function LeLivre() {
  return (
    <>
      <EntetePage
        arrierePlan="/images/10-le-livre.webp"
        arrierePlanPosition="center bottom"
        surtitre="La pièce maîtresse"
        lignes={[<>Active ton</>, <>Superpouvoir&nbsp;!</>, <span key="s" className="livre font-normal text-or">Nadine Zoro</span>]}
        intro={livre.description}
        photo={photos.livreLecture}
      />

      <PagesEmpilees>
      <Bloc numero="01" titre="L’objet" className="champ">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <Vu className="lg:col-span-5">
            <ProduitScene produit={livre} flottera />
          </Vu>
          <div className="lg:col-span-7">
            <Vu className="flex flex-col gap-6">
              <h2 className="display-m">Huit chapitres, une fabrication</h2>
              <p className="text-dim">
                Le livre fondateur du mouvement. Il aide à découvrir ses talents uniques, à surmonter le doute et à bâtir
                sa propre mission de vie. Écrit dans un langage accessible et motivant, il se lit à tout âge — seul,
                en famille ou en classe.
              </p>

              <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                {[
                  ["Format", livre.format],
                  ["Chapitres", "8 chapitres transformateurs"],
                  ["Public", "Mini-Héros 8-12 · Explorateur 13-16 · Bâtisseur 17-22 · Mentor 23+"],
                  ["Prix", `${fcfa(livre.fcfa)} / ${livre.eur} €`],
                ].map(([k, v], i) => (
                  <CarteFait key={k} etiquette={k} valeur={v} index={i + 1} />
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <BoutonPeint to={`/boutique/${livre.slug}`} variante="or" icone={<ArrowUpRight size={16} />}>
                  Commander le livre
                </BoutonPeint>
                <BoutonPeint to="/quiz" variante="craie">
                  Trouver mon profil d’abord
                </BoutonPeint>
              </div>
            </Vu>
          </div>
        </div>
      </Bloc>

      <Bloc numero="02" titre="La méthode" fil="#FFB000" className="champ">
        <Vu className="flex flex-col gap-5">
          <h2 className="display-l">
            Quatre outils nommés,<br />
            <span className="livre font-normal text-or">une même trajectoire.</span>
          </h2>
          <p className="text-dim">
            Ce sont les quatre outils que le livre et le journal travaillent explicitement. Ils se répondent :
            on se cartographie, on cherche sa zone d’impact, on passe à l’action, on relie le tout à sa mission.
          </p>
        </Vu>

        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-10">
          {methode.map((m, i) => (
            <Vu as="li" key={m.num} delay={i * 90}>
              <article className="outil-carte group">
                <div className="outil-carte-photo">
                  <Vignette photo={methodePhotos[m.num]} largeur={900} decoratif className="h-full w-full" />
                  <span className="outil-carte-num">{m.num}</span>
                </div>
                <h3 className="font-display font-extrabold text-lg">{m.nom}</h3>
                <p className="border-paper text-dim">{m.description}</p>
              </article>
            </Vu>
          ))}
        </ol>

        <div className="flex items-start gap-3 rounded-2xl border border-or/25 bg-or/[0.06] p-5 mt-10">
          <AlertTriangle size={18} className="shrink-0 text-or" />
          <p className="text-dim">
            <strong className="text-paper">Transparence éditoriale.</strong> Le sommaire détaillé des huit chapitres n’est
            pas publié par le mouvement. Nous n’en inventons donc pas les titres. Ce qui est certain et documenté :
            le chapitre V traite des doutes (c’est la matière des 30 cartes) et les chapitres II & III traitent du talent
            et de la passion.
          </p>
        </div>
      </Bloc>

      <Bloc numero="03" titre="Ce qu’on y lit" fil="#FFB000" className="champ">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <Vu className="flex flex-col gap-6 lg:col-span-7">
            <div className="relative aspect-[16/10] max-sm:aspect-[4/5]">
              <CadreDecoupe variante="vague-bas-prononcee" className="h-full w-full shadow-[0_18px_44px_rgba(50,16,68,0.22)]">
                <img
                  src={photos.citation.src}
                  alt={photos.citation.alt}
                  className="h-full w-full object-cover"
                  style={{ objectPosition: photos.citation.pos || "50% 50%" }}
                  loading="lazy"
                />
              </CadreDecoupe>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-paper/50 via-transparent to-transparent" />
              <blockquote className="citation-photo">« Tu n’es pas un hasard. Tu es une réponse. »</blockquote>
            </div>
            <p className="text-dim">
              C’est la phrase d’ouverture du mouvement. Tout le livre en découle : si tu es une réponse, alors il existe
              une question à laquelle toi seul·e réponds — et le travail consiste à la trouver, pas à t’inventer.
            </p>
            <div className="flex flex-wrap gap-4">
              <BoutonPeint to="/cartes" variante="craie" icone={<Icone nom="fleche-droite" taille={16} />}>
                Lire les 30 affirmations
              </BoutonPeint>
            </div>
          </Vu>

          <Vu delay={120} className="lg:col-span-5">
            <div className="grid gap-5">
              <p className="label">Les avis publiés</p>
              {livre.avis.map((a) => (
                <CarteAvis key={a.nom} avis={a} />
              ))}
            </div>
          </Vu>
        </div>
      </Bloc>

      <Bloc numero="04" titre="Prolonger l’atelier" fil="#FFB000" className="champ">
        <div className="grid gap-6 sm:grid-cols-2">
          {produits.slice(1, 3).map((p, i) => (
            <Vu key={p.slug} delay={i * 110}>
              <Link
                to={`/boutique/${p.slug}`}
                className="group flex items-stretch gap-4 rounded-[20px] border border-paper/12 bg-ink-2 p-4 transition-colors hover:border-paper/35"
                style={{ borderLeft: `2px solid ${p.fil}` }}
              >
                <div className="flex shrink-0 items-end">
                  <VisuelProduit produit={p} largeur={104} />
                </div>
                <div className="flex flex-1 flex-col justify-between gap-2">
                  <div className="flex flex-col gap-1.5">
                    <span className="label">{p.type}</span>
                    <h3 className="font-display font-extrabold text-base">{p.nom}</h3>
                    <p className="text-dim">{p.description.slice(0, 120)}…</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 font-display font-extrabold uppercase text-sm" style={{ color: p.fil }}>
                    {fcfa(p.fcfa)} <Icone nom="fleche-droite" taille={15} className="transition-transform group-hover:translate-x-1.5" />
                  </span>
                </div>
              </Link>
            </Vu>
          ))}
        </div>
        <p className="text-dim-2 mt-8">
          {marque.titre} — {marque.autrice}. Une interprétation visuelle de l’objet-livre, pensée pour prolonger l’univers de la méthode.
        </p>
      </Bloc>
      </PagesEmpilees>
    </>
  );
}
