import { useState } from "react";
import { ArrowUpRight, Mail, AlertTriangle } from "lucide-react";
import { EntetePage, Bloc } from "../components/Page";
import { Etoile, Vu, BandeKente } from "../components/Atelier";
import { PhotoCadre } from "../components/Photo";
import { marque, navigation } from "../data/site";
import { photos, villePhotos } from "../data/media";
import { CarteFait } from "../components/CartesUI";
import { CadreDecoupe } from "../components/CadreDecoupe";
import { BoutonPeint } from "../components/BoutonPeint";
import { Icone } from "../components/Icone";

/* ——————————————————— QUI SUIS-JE ——————————————————— */
export function APropos() {
  return (
    <>
      <EntetePage
        arrierePlan="/images/11-a-propos.webp"
        arrierePlanPosition="center bottom"
        surtitre="Qui suis-je ?"
        lignes={[<>La mission derrière</>, <span key="s" className="livre font-normal text-or">le mouvement</span>]}
        intro={marque.mission}
        photo={photos.apropos}
      />

      <Bloc numero="01" titre="L’autrice" fil="#FFB000">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <Vu className="lg:col-span-5">
            <PhotoCadre photo={photos.auteure} ratio="4 / 5" creditVisible={false} sizes="(min-width: 1024px) 40vw, 100vw">
              <BandeKente hauteur={6} className="absolute inset-x-0 top-0 z-10" />
              <div className="absolute inset-x-0 bottom-0 z-10 bg-paper/90 px-5 py-4 text-[#FFF0D9]">
                <Etoile taille={40} fil="#FFB000" className="anim-tourne" />
                <p className="mt-2 font-display text-xl font-extrabold">
                  Nadine<br />Zoro
                </p>
                <p className="mt-1 font-mono text-xs font-bold uppercase text-[#FFB000]">Autrice & coach de vie</p>
              </div>
            </PhotoCadre>
          </Vu>

          <div className="lg:col-span-7">
            <Vu>
              <p className="text-dim">{marque.fondation}</p>
              <p className="mt-5 border-l-[6px] border-or py-1 pl-5 font-display text-lg font-extrabold uppercase text-or sm:text-xl">
                « Tu n’es pas un hasard. Tu es une réponse. »
              </p>
              <p className="text-dim mt-5">
                C’est la phrase sur laquelle s’ouvre le mouvement, et celle qui tient toute la méthode : découvrir ses
                talents uniques, activer sa mission de vie et bâtir son avenir — avec courage et authenticité.
              </p>

              <ul className="mt-7 grid gap-4 sm:grid-cols-2">
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

              <div className="mt-7 flex flex-wrap gap-3">
                <BoutonPeint to="/le-livre" icone={<Icone nom="fleche-droite" taille={16} />}>
                  Découvrir le livre
                </BoutonPeint>
                <BoutonPeint to="/contact" variante="craie">
                  Presse & partenariats
                </BoutonPeint>
              </div>
            </Vu>
          </div>
        </div>
      </Bloc>

      <Bloc numero="02" titre="Où vit le mouvement" fil="#FFB000">
        <Vu>
          <h2 className="display-l">
            Abidjan, Dakar, Paris : <span className="livre font-normal text-or">un même fil.</span>
          </h2>
          <p className="text-dim mt-2">
            {marque.communaute} — {marque.communauteDetail}. Le mouvement est né à Abidjan et se retrouve aujourd’hui dans les villes de la diaspora.
          </p>
        </Vu>
        <div className="mt-8 grid gap-4 md:grid-cols-12">
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
        <div className="flex items-start gap-3 rounded-2xl border border-or/25 bg-or/[0.06] p-5">
          <AlertTriangle size={20} className="mt-0.5 shrink-0 text-or" />
          <div>
            <p className="text-dim">
              La biographie détaillée et le portrait officiel seront ajoutés dès que les éléments validés seront disponibles.
              En attendant, cette page reste volontairement simple et centrée sur la mission du mouvement.
            </p>
            <p className="text-dim-2 mt-3">
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
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <Vu>
              <p className="label">Adresse officielle</p>
              <a
                href={`mailto:${marque.emailMailto}`}
                className="mt-2 inline-flex flex-wrap items-center gap-2 font-display text-[clamp(1.05rem,4.4vw,1.875rem)] font-extrabold text-or underline-offset-8 hover:underline"
                style={{ overflowWrap: "anywhere" }}
              >
                {marque.email} <ArrowUpRight size={20} className="shrink-0" />
              </a>

              <p className="label mt-7">Ton sujet</p>
              <ul className="mt-3 space-y-2">
                {INTENTIONS.map((i) => {
                  const actif = i.id === intention.id;
                  return (
                    <li key={i.id}>
                      <button
                        type="button"
                        onClick={() => setIntention(i)}
                        aria-pressed={actif}
                        className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-left transition-colors ${
                          actif ? "border-or bg-or/12 text-paper" : "border-paper/16 text-dim hover:border-paper/40"
                        }`}
                      >
                        {i.label}
                        {actif && <Icone nom="validation" taille={17} className="text-or" />}
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="photo-legendee mt-7">
                <CadreDecoupe variante="vague-bas-douce">
                  <PhotoCadre photo={photos.ecoles} ratio="4 / 3" />
                </CadreDecoupe>
                <p className="photo-legende">{photos.ecoles.legende}</p>
              </div>

              <p className="text-dim-2 mt-4">
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
                className="flex flex-col gap-5 rounded-[22px] border border-paper/14 bg-ink-2 p-6 sm:p-8"
              >
                <label className="block">
                  <span className="label mb-2 block">Ton nom</span>
                  <input
                    required
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    className="w-full rounded-xl border border-paper/22 bg-ink px-4 py-3 outline-none transition-colors focus:border-or"
                    placeholder="Prénom et nom"
                  />
                </label>

                <label className="block">
                  <span className="label mb-2 block">Ton message</span>
                  <textarea
                    required
                    rows={7}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full resize-y rounded-xl border border-paper/22 bg-ink px-4 py-3 outline-none transition-colors focus:border-or"
                    placeholder="Dis-nous tout : contexte, échéance, public concerné…"
                  />
                </label>

                <div className="flex flex-wrap items-center gap-3">
                  <BoutonPeint type="submit" icone={<Mail size={16} />}>
                    Ouvrir dans ma messagerie
                  </BoutonPeint>
                  <span className="text-dim-2">Objet : {intention.objet}</span>
                </div>

                <p className="text-dim-2" role="status">
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
    <div className="champ relative mx-auto w-full max-w-[640px]">
      <p className="label flex items-center gap-2">
        <Etoile taille={13} /> Poste introuvable
      </p>
      <h1 className="display-l mt-2">
        Cette pièce n’est pas<br />
        <span className="livre font-normal text-or">sur l’établi.</span>
      </h1>
      <p className="text-dim">
        L’adresse <code className="rounded-md bg-paper/8 px-1.5 py-0.5 font-mono text-[0.9em] text-or">{chemin}</code> ne correspond à aucune page de l’atelier. Voici les postes
        qui existent.
      </p>
      <ul className="mt-7 flex flex-wrap gap-3">
        {[{ href: "#/", label: "Accueil" }, ...navigation, { href: "#/boutique", label: "Boutique" }].map((n) => (
          <li key={n.href}>
            <BoutonPeint to={n.href.slice(1)} variante="craie">
              {n.label}
            </BoutonPeint>
          </li>
        ))}
      </ul>
    </div>
  );
}
