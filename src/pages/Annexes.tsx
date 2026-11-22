import { useState } from "react";
import { ArrowUpRight, MoveRight, Mail, AlertTriangle, CheckCircle2 } from "lucide-react";
import { EntetePage, Bloc } from "../components/Page";
import { Etoile, Vu, BandeKente } from "../components/Atelier";
import { PhotoCadre } from "../components/Photo";
import { PhotoLegendee } from "../components/Visuels";
import { Link } from "../lib/router";
import { marque, navigation } from "../data/site";
import { photos, villePhotos } from "../data/media";
import { CarteFait } from "../components/CartesUI";

/* ——————————————————— QUI SUIS-JE ——————————————————— */
export function APropos() {
  return (
    <>
      <EntetePage
        surtitre="Qui suis-je ?"
        lignes={[<>La mission derrière</>, <span key="s" className="livre font-normal text-or">le mouvement</span>]}
        intro={marque.mission}
        photo={photos.apropos}
      />

      <Bloc numero="01" titre="L’autrice" fil="#FFB000">
        <div className="grid gap-12 lg:grid-cols-12">
          <Vu className="lg:col-span-5">
            <PhotoCadre photo={photos.auteure} ratio="4 / 5" creditVisible={false} sizes="(min-width: 1024px) 40vw, 100vw">
              <BandeKente hauteur={6} className="absolute inset-x-0 top-0 z-10" />
              <div className="absolute inset-x-0 bottom-0 z-10 bg-paper p-7 text-[#FFF0D9] sm:p-9">
                <Etoile taille={40} fil="#FFB000" className="anim-tourne" />
                <p className="mt-5 font-display text-[46px] font-extrabold leading-[0.9] sm:text-[62px]">
                  Nadine<br />Zoro
                </p>
                <p className="mt-4 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[#FFB000]">Autrice & coach de vie</p>
                <p className="mt-3 max-w-sm text-[12.5px] leading-snug opacity-85">
                  Photographie d’illustration. Aucun portrait officiel n’est publié par le mouvement : nous n’en générons pas.
                </p>
              </div>
            </PhotoCadre>
          </Vu>

          <div className="lg:col-span-7">
            <Vu>
              <p className="text-[18px] leading-relaxed text-dim">{marque.fondation}</p>
              <p className="mt-8 border-l-[6px] border-or pl-6 font-display text-[26px] font-extrabold uppercase leading-[0.95] tracking-[-0.035em] text-or sm:text-[34px]">
                « Tu n’es pas un hasard. Tu es une réponse. »
              </p>
              <p className="mt-8 text-[16px] leading-relaxed text-dim">
                C’est la phrase sur laquelle s’ouvre le mouvement, et celle qui tient toute la méthode : découvrir ses
                talents uniques, activer sa mission de vie et bâtir son avenir — avec courage et authenticité.
              </p>

              <ul className="mt-10 grid gap-4 sm:grid-cols-2">
                {[
                  ["Le livre", "Active ton Superpouvoir ! — 8 chapitres"],
                  ["La méthode", "Radar Personnel · Ikigai · CAP · Chemin du Héros"],
                  ["Le public", "13–35 ans, et au-delà : quatre étapes de vie"],
                  ["L’ancrage", "Abidjan · Dakar · Paris · Le Monde"],
                ].map(([k, v], i) => (
                  <li key={k}>
                    <CarteFait etiquette={k} valeur={v} index={i + 1} />
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/le-livre" className="btn btn-or">
                  Découvrir le livre <MoveRight size={16} />
                </Link>
                <Link to="/contact" className="btn btn-craie">
                  Presse & partenariats
                </Link>
              </div>
            </Vu>
          </div>
        </div>
      </Bloc>

      <Bloc numero="02" titre="Où vit le mouvement" fil="#FFB000">
        <Vu>
          <h2 className="display-l max-w-3xl">
            Abidjan, Dakar, Paris : <span className="livre font-normal text-or">un même fil.</span>
          </h2>
          <p className="mt-5 max-w-2xl text-[16.5px] text-dim">
            {marque.communaute} — {marque.communauteDetail}. Le mouvement est né à Abidjan et se retrouve aujourd’hui dans les villes de la diaspora.
          </p>
        </Vu>
        <div className="mt-10 grid gap-4 md:grid-cols-12">
          <Vu className="md:col-span-7">
            <PhotoCadre photo={villePhotos.Abidjan} ratio="16 / 11" ratioMobile="4 / 3" voile>
              <span className="ville-etiquette">Abidjan</span>
            </PhotoCadre>
          </Vu>
          <div className="grid gap-4 md:col-span-5">
            <Vu delay={90}>
              <PhotoCadre photo={villePhotos.Dakar} ratio="16 / 9" voile>
                <span className="ville-etiquette">Dakar</span>
              </PhotoCadre>
            </Vu>
            <Vu delay={180}>
              <PhotoCadre photo={villePhotos.Paris} ratio="16 / 9" voile>
                <span className="ville-etiquette">Paris</span>
              </PhotoCadre>
            </Vu>
          </div>
        </div>
      </Bloc>

      <Bloc numero="03" titre="Ce que le mouvement ne publie pas encore" fil="#FFB000">
        <div className="flex items-start gap-4 border border-or/25 bg-or/[0.06] p-7">
          <AlertTriangle size={20} className="mt-1 shrink-0 text-or" />
          <div>
            <p className="text-[15.5px] leading-relaxed text-dim">
              La biographie détaillée et le portrait officiel seront ajoutés dès que les éléments validés seront disponibles.
              En attendant, cette page reste volontairement simple et centrée sur la mission du mouvement.
            </p>
            <p className="mt-3 text-[14px] text-dim-2">
              Éléments à fournir pour compléter cette page : biographie validée par l’autrice, portrait officiel,
              couverture du livre en haute définition, sommaire des huit chapitres.
            </p>
          </div>
        </div>
      </Bloc>
    </>
  );
}

/* ——————————————————— CONTACT ——————————————————— */
const INTENTIONS = [
  { id: "presse", label: "Presse & médias", objet: "Demande presse — Active ton Superpouvoir" },
  { id: "partenariat", label: "Partenariats", objet: "Proposition de partenariat — Active ton Superpouvoir" },
  { id: "ecoles", label: "Programmes écoles", objet: "Programme scolaire — Active ton Superpouvoir" },
  { id: "bonjour", label: "Simplement bonjour", objet: "Bonjour Nadine" },
];

export function Contact() {
  const [intention, setIntention] = useState(INTENTIONS[0]);
  const [nom, setNom] = useState("");
  const [message, setMessage] = useState("");
  const [envoye, setEnvoye] = useState(false);

  const lien = `mailto:${marque.emailMailto}?subject=${encodeURIComponent(intention.objet)}&body=${encodeURIComponent(
    `${message}\n\n— ${nom}`
  )}`;

  return (
    <>
      <EntetePage
        surtitre="Contact"
        lignes={[<>Parlons de ton</>, <span key="s" className="livre font-normal text-or">superpouvoir</span>]}
        intro="Presse, partenariats, programmes écoles ou simplement dire bonjour. Une seule adresse, celle du mouvement — et une vraie personne derrière."
        fil="#FFB000"
        photo={photos.contact}
        variante="decale"
      />

      <Bloc numero="01" titre="Écrire" fil="#FFB000">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Vu>
              <p className="label mb-3">Adresse officielle</p>
              <a
                href={`mailto:${marque.emailMailto}`}
                className="inline-flex max-w-full flex-wrap items-center gap-2 font-display text-[clamp(1.05rem,4.4vw,1.875rem)] font-extrabold text-or underline-offset-8 hover:underline"
                style={{ overflowWrap: "anywhere" }}
              >
                {marque.email} <ArrowUpRight size={20} className="shrink-0" />
              </a>

              <p className="label mb-3 mt-10">Ton sujet</p>
              <ul className="space-y-2">
                {INTENTIONS.map((i) => {
                  const actif = i.id === intention.id;
                  return (
                    <li key={i.id}>
                      <button
                        type="button"
                        onClick={() => setIntention(i)}
                        aria-pressed={actif}
                        className={`flex w-full items-center justify-between border px-4 py-3 text-left text-[15px] transition-colors ${
                          actif ? "border-or bg-or/12 text-paper" : "border-paper/16 text-dim hover:border-paper/40"
                        }`}
                      >
                        {i.label}
                        {actif && <CheckCircle2 size={17} className="text-or" />}
                      </button>
                    </li>
                  );
                })}
              </ul>

              <PhotoLegendee photo={photos.ecoles} ratio="4 / 3" className="mt-10" />

              <p className="mt-8 text-[13.5px] leading-snug text-dim-2">
                Les actualités, rencontres et collaborations seront annoncées ici au fil du développement du mouvement.
              </p>
            </Vu>
          </div>

          <div className="lg:col-span-7">
            <Vu delay={100}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setEnvoye(true);
                  window.location.href = lien;
                }}
                className="border border-paper/14 bg-ink-2 p-7 sm:p-9"
              >
                <label className="block">
                  <span className="label mb-2 block">Ton nom</span>
                  <input
                    required
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    className="min-h-[48px] w-full border border-paper/22 bg-ink px-4 outline-none transition-colors focus:border-or"
                    placeholder="Prénom et nom"
                  />
                </label>

                <label className="mt-6 block">
                  <span className="label mb-2 block">Ton message</span>
                  <textarea
                    required
                    rows={7}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full resize-y border border-paper/22 bg-ink p-4 outline-none transition-colors focus:border-or"
                    placeholder="Dis-nous tout : contexte, échéance, public concerné…"
                  />
                </label>

                <div className="mt-7 flex flex-wrap items-center gap-4">
                  <button type="submit" className="btn btn-or">
                    <Mail size={16} /> Ouvrir dans ma messagerie
                  </button>
                  <span className="text-[13px] text-dim-2">Objet : {intention.objet}</span>
                </div>

                <p className="mt-4 text-[12.5px] leading-snug text-dim-2" role="status">
                  {envoye
                    ? "Ta messagerie s’ouvre avec ton message pré-rempli. Il ne reste qu’à l’envoyer."
                    : "Ce formulaire ne stocke rien : il compose un email réel dans ta messagerie, à l’adresse du mouvement."}
                </p>
              </form>
            </Vu>
          </div>
        </div>
      </Bloc>
    </>
  );
}

/* ——————————————————— 404 ——————————————————— */
export function Introuvable({ chemin }: { chemin: string }) {
  return (
    <div className="mx-auto w-full max-w-[1000px] px-5 pb-24 pt-40 sm:px-8">
      <p className="label mb-6 flex items-center gap-2">
        <Etoile taille={13} /> Poste introuvable
      </p>
      <h1 className="display-l">
        Cette pièce n’est pas<br />
        <span className="livre font-normal text-or">sur l’établi.</span>
      </h1>
      <p className="mt-6 max-w-xl text-[16.5px] text-dim">
        L’adresse <code className="text-or">{chemin}</code> ne correspond à aucune page de l’atelier. Voici les postes
        qui existent.
      </p>
      <ul className="mt-10 flex flex-wrap gap-3">
        {[{ href: "#/", label: "Accueil" }, ...navigation, { href: "#/boutique", label: "Boutique" }].map((n) => (
          <li key={n.href}>
            <Link to={n.href.slice(1)} className="btn btn-craie">
              {n.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
