import { useEffect, useState } from "react";
import { ChevronDown, Hash } from "lucide-react";
import { EntetePage, Bloc } from "../components/Page";
import { NavigationSections } from "../components/NavigationSections";
import { Vu } from "../components/Atelier";
import { CadreDecoupe } from "../components/CadreDecoupe";
import { BoutonPeint } from "../components/BoutonPeint";
import { Icone } from "../components/Icone";
import { useRoute } from "../lib/router";
import { defisMeta, hashtags } from "../data/site";
import missions from "../data/defis.json";
import { PhotoCadre, Vignette } from "../components/Photo";
import { defiPhotos, hashtagPhotos, photos } from "../data/media";

const toutes = missions as Record<string, string[]>;

export default function Defis() {
  const { chemin } = useRoute();
  const [suivi, setSuivi] = useState<Record<string, number[]>>({});

  // Ancre directe (#/defis#defi-30) : on défile vers le défi demandé.
  useEffect(() => {
    const m = window.location.hash.match(/#defi-(\d+)/);
    if (m) {
      const el = document.getElementById(`defi-${m[1]}`);
      if (el) window.setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
    }
  }, [chemin]);

  const basculer = (id: string, i: number) => {
    setSuivi((s) => {
      const fait = s[id] || [];
      return { ...s, [id]: fait.includes(i) ? fait.filter((x) => x !== i) : [...fait, i] };
    });
  };

  const sections = [
    { id: "defis-liste", label: "Tous les défis" },
    ...defisMeta.map((d) => ({ id: `defi-${d.id}`, label: `${d.jours} jours` })),
    { id: "defis-communautaires", label: "Communautaires" },
  ];

  return (
    <>
      <NavigationSections sections={sections} />

      <EntetePage
        photo={photos.defisEntete}
        arrierePlan="/images/06-defis.webp"
        arrierePlanPosition="bottom right"
        surtitre="Les défis"
        lignes={[<>Passe de lecteur à</>, <span key="s" className="livre font-normal text-or">héros en action.</span>]}
        intro="Choisis ton défi et transforme-toi jour après jour. Du défi gratuit de 7 jours au parcours complet de 60 jours."
        fil="#FFB000"
      />

      <div id="defis-liste" className="champ">
        <ul className="defi-panneaux">
          {defisMeta.map((d) => (
            <li key={d.id} className="defi-panneau">
              <a
                href={`#defi-${d.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(`defi-${d.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                <Vignette photo={defiPhotos[d.id]} largeur={1000} decoratif className="defi-panneau-img" />
                <span className="defi-panneau-num" data-compte>{d.jours}</span>
                <span className="defi-panneau-corps">
                  <span className="defi-panneau-offre">{d.offre}</span>
                  <strong>{d.titre}</strong>
                  <em>{d.texte}</em>
                  <span className="defi-panneau-lien">Voir le défi <Icone nom="fleche-droite" taille={15} /></span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {defisMeta.map((d, k) => {
        const faits = suivi[d.id] || [];
        const total = toutes[d.id].length;
        return (
          <div key={d.id} id={`defi-${d.id}`} className="scroll-mt-24">
            <Bloc numero={`0${k + 1}`} titre={`Défi ${d.jours} jours · ${d.offre}`} fil={d.fil} className="champ">
              <Vu className="mb-10 block">
                <CadreDecoupe variante="vague-haut" className="shadow-[0_20px_48px_rgba(0,0,0,0.22)]">
                  <PhotoCadre photo={defiPhotos[d.id]} ratio="21 / 7" ratioMobile="4 / 3" voile>
                    <div className={`defi-banniere-num ${k % 2 ? "defi-banniere-num--droite" : ""}`} aria-hidden="true">
                      {d.jours}
                      <span>jours</span>
                    </div>
                  </PhotoCadre>
                </CadreDecoupe>
              </Vu>
              <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
                <Vu className="flex flex-col items-start gap-5 lg:col-span-5">
                  <h2 className="display-l" style={{ color: d.fil }}>
                    {d.titre}
                  </h2>
                  <p className="text-dim">{d.texte}</p>

                  <ul className="flex flex-wrap gap-8">
                    {d.stats.map(([n, l]) => (
                      <li key={l} className="flex flex-col gap-1">
                        <span data-compte className="block font-display text-2xl font-extrabold">{n}</span>
                        <span className="label">{l}</span>
                      </li>
                    ))}
                  </ul>

                  {d.phases.length > 0 && (
                    <div className="flex flex-col gap-3">
                      <p className="label">Les 4 phases</p>
                      <ol className="flex flex-wrap gap-2">
                        {d.phases.map((p, i) => (
                          <li
                            key={p}
                            className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold"
                            style={{ borderColor: d.fil }}
                          >
                            <span className="label" style={{ color: d.fil }}>
                              Phase {i + 1}
                            </span>{" "}
                            {p}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  <div className="flex flex-col gap-3 rounded-[18px] border border-paper/12 bg-ink-2 p-5">
                    <p className="label">Ton suivi local</p>
                    <p className="text-dim">
                      Coche les missions réalisées : {faits.length} / {total}. Ta progression reste dans cet onglet,
                      rien n’est envoyé ni stocké sur un serveur.
                    </p>
                    <div className="h-2 overflow-hidden rounded-full bg-paper/12">
                      <div
                        className="h-full rounded-full transition-[width] duration-500"
                        style={{ width: `${(faits.length / total) * 100}%`, background: d.fil }}
                      />
                    </div>
                  </div>

                  {d.offre === "Gratuit" ? (
                    <BoutonPeint to="/quiz" icone={<Icone nom="fleche-droite" taille={16} />}>
                      Commencer gratuitement
                    </BoutonPeint>
                  ) : (
                    <BoutonPeint to="/boutique" icone={<Icone nom="fleche-droite" taille={16} />}>
                      Trouver mon accompagnement au défi {d.jours} jours
                    </BoutonPeint>
                  )}
                </Vu>

                <div className="lg:col-span-7">
                  <p className="label">Timeline des missions</p>
                  <ol className="mt-4 grid gap-px overflow-hidden rounded-[18px] border border-paper/12 bg-paper/12 sm:grid-cols-2">
                    {(toutes[d.id].length > 12 ? toutes[d.id].slice(0, 12) : toutes[d.id]).map((m, i) => (
                      <li key={m + i} className="bg-ink-2 sm:[&:last-child:nth-child(odd)]:col-span-2">
                        <button
                          type="button"
                          onClick={() => basculer(d.id, i)}
                          aria-pressed={faits.includes(i)}
                          className="flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-ink-3"
                        >
                          <span
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-display text-xs font-extrabold transition-colors"
                            style={{
                              border: `1px solid ${d.fil}`,
                              background: faits.includes(i) ? d.fil : "transparent",
                              color: faits.includes(i) ? "#FFF0D9" : d.fil,
                            }}
                          >
                            {faits.includes(i) ? <Icone nom="validation" taille={14} /> : i + 1}
                          </span>
                          <span className={`pt-0.5 ${faits.includes(i) ? "text-dim-2 line-through" : "text-paper/90"}`}>{m}</span>
                        </button>
                      </li>
                    ))}
                  </ol>
                  {toutes[d.id].length > 12 && <SuiteTimeline id={d.id} fil={d.fil} suivi={faits} onToggle={basculer} />}
                </div>
              </div>
            </Bloc>
          </div>
        );
      })}

      <Bloc id="defis-communautaires" numero="04" titre="Défis communautaires" fil="#FFB000" className="champ">
        <Vu className="flex flex-col gap-4">
          <h2 className="display-l">
            Quatre hashtags, <span className="livre font-normal text-or">un même mouvement</span>
          </h2>
          <p className="text-dim">
            Partage ton parcours avec les autres héros. Publie ou garde pour toi : c’est toi qui choisis.
          </p>
        </Vu>
        <ul className="pile-cartes">
          {hashtags.map((h, i) => (
            <li key={h.tag} className="pile-carte" style={{ "--n": i } as React.CSSProperties}>
              <div className={`pile-carte-in pile-carte-in--${i % 4}${i % 2 ? " pile-carte-in--miroir" : ""}`}>
                <div className="pile-carte-photo">
                  <Vignette photo={hashtagPhotos[h.tag]} largeur={900} decoratif />
                </div>
                <div className="pile-carte-corps">
                  <span className="pile-carte-num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="pile-tag"><Hash size={18} />{h.tag.replace("#", "")}</p>
                    <h3>{h.titre}</h3>
                    <p className="pile-texte">{h.texte}</p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Bloc>
    </>
  );
}

/** Missions au-delà de la 12e, dépliables, avec le même suivi cochable. */
function SuiteTimeline({
  id,
  fil,
  suivi,
  onToggle,
}: {
  id: string;
  fil: string;
  suivi: number[];
  onToggle: (id: string, i: number) => void;
}) {
  const [ouvert, setOuvert] = useState(false);
  const reste = toutes[id].slice(12);
  if (!ouvert)
    return (
      <BoutonPeint onClick={() => setOuvert(true)} variante="craie" className="mt-4" icone={<ChevronDown size={16} />}>
        Voir les {toutes[id].length} missions
      </BoutonPeint>
    );
  return (
    <>
      <ol className="mt-4 grid gap-px overflow-hidden rounded-[18px] border border-paper/12 bg-paper/12 sm:grid-cols-2">
        {reste.map((m, k) => {
          const i = k + 12;
          return (
            <li key={m + i} className="bg-ink-2 sm:[&:last-child:nth-child(odd)]:col-span-2">
              <button
                type="button"
                onClick={() => onToggle(id, i)}
                aria-pressed={suivi.includes(i)}
                className="flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-ink-3"
              >
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-display text-xs font-extrabold"
                  style={{ border: `1px solid ${fil}`, background: suivi.includes(i) ? fil : "transparent", color: suivi.includes(i) ? "#FFF0D9" : fil }}
                >
                  {suivi.includes(i) ? <Icone nom="validation" taille={14} /> : i + 1}
                </span>
                <span className={`pt-0.5 ${suivi.includes(i) ? "text-dim-2 line-through" : "text-paper/90"}`}>{m}</span>
              </button>
            </li>
          );
        })}
      </ol>
      <BoutonPeint onClick={() => setOuvert(false)} variante="craie" className="mt-4" icone={<ChevronDown size={16} className="rotate-180" />}>
        Replier
      </BoutonPeint>
    </>
  );
}
