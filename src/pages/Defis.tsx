import { useEffect, useState } from "react";
import { Check, ChevronDown, MoveRight, Hash } from "lucide-react";
import { EntetePage, Bloc } from "../components/Page";
import { Vu } from "../components/Atelier";
import { Link, useRoute } from "../lib/router";
import { defisMeta, hashtags, lienCommande } from "../data/site";
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

  return (
    <>
      <EntetePage
        photo={photos.defisEntete}
        surtitre="Les défis"
        lignes={[<>Passe de lecteur à</>, <span key="s" className="livre font-normal text-or">héros en action.</span>]}
        intro="Choisis ton défi et transforme-toi jour après jour. Du défi gratuit de 7 jours au parcours complet de 60 jours."
        fil="#FFB000"
      />

      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8 xl:px-14">
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
                  <span className="defi-panneau-lien">Voir le défi <MoveRight size={15} /></span>
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
            <Bloc numero={`0${k + 1}`} titre={`Défi ${d.jours} jours · ${d.offre}`} fil={d.fil}>
              <Vu className="mb-10">
<PhotoCadre photo={defiPhotos[d.id]} ratio="21 / 7" ratioMobile="4 / 3" voile>
<div className={`defi-banniere-num ${k % 2 ? "defi-banniere-num--droite" : ""}`} aria-hidden="true">{d.jours}<span>jours</span></div>
</PhotoCadre>
</Vu>
<div className="grid gap-10 lg:grid-cols-12">
                <Vu className="lg:col-span-5">
                  <h2 className="display-l" style={{ color: d.fil }}>
                    {d.titre}
                  </h2>
                  <p className="mt-5 text-[16.5px] text-dim">{d.texte}</p>

                  <ul className="mt-8 flex flex-wrap gap-8">
                    {d.stats.map(([n, l]) => (
                      <li key={l}>
                        <span data-compte className="block font-display text-[34px] font-extrabold leading-none">{n}</span>
                        <span className="label">{l}</span>
                      </li>
                    ))}
                  </ul>

                  {d.phases.length > 0 && (
                    <div className="mt-8">
                      <p className="label mb-3">Les 4 phases</p>
                      <ol className="space-y-2">
                        {d.phases.map((p, i) => (
                          <li key={p} className="flex items-center gap-3 border-l-2 pl-4 text-[15px]" style={{ borderColor: d.fil }}>
                            <span className="label">Phase {i + 1}</span> {p}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  <div className="mt-8 border border-paper/12 bg-ink-2 p-5">
                    <p className="label mb-2">Ton suivi local</p>
                    <p className="text-[14.5px] text-dim">
                      Coche les missions réalisées : {faits.length} / {total}. Ta progression reste dans cet onglet,
                      rien n’est envoyé ni stocké sur un serveur.
                    </p>
                    <div className="mt-3 h-1.5 w-full bg-paper/12">
                      <div className="h-1.5 transition-[width] duration-500" style={{ width: `${(faits.length / total) * 100}%`, background: d.fil }} />
                    </div>
                  </div>

                  {d.offre === "Gratuit" ? (
                    <Link to="/quiz" className="btn btn-or mt-7">
                      Commencer gratuitement <MoveRight size={16} />
                    </Link>
                  ) : (
                    <a href={lienCommande(`Défi ${d.jours} jours — ${d.titre}`)} className="btn btn-or mt-7">
                      Demander l’accès au défi {d.jours} jours
                    </a>
                  )}
                </Vu>

                <div className="lg:col-span-7">
                  <p className="label mb-4">Timeline des missions</p>
                  <ol className="grid gap-px overflow-hidden border border-paper/12 bg-paper/12 sm:grid-cols-2">
                    {(toutes[d.id].length > 12 ? toutes[d.id].slice(0, 12) : toutes[d.id]).map((m, i) => (
                      <li key={m + i} className="bg-ink-2 sm:[&:last-child:nth-child(odd)]:col-span-2">
                        <button
                          type="button"
                          onClick={() => basculer(d.id, i)}
                          aria-pressed={faits.includes(i)}
                          className="flex w-full items-start gap-4 p-4 text-left transition-colors hover:bg-ink-3"
                        >
                          <span
                            className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center font-display text-[12px] font-extrabold transition-colors"
                            style={{
                              border: `1px solid ${d.fil}`,
                              background: faits.includes(i) ? d.fil : "transparent",
                              color: faits.includes(i) ? "#FFF0D9" : d.fil,
                            }}
                          >
                            {faits.includes(i) ? <Check size={14} /> : i + 1}
                          </span>
                          <span className={`text-[14.5px] leading-snug ${faits.includes(i) ? "text-dim-2 line-through" : "text-paper/90"}`}>{m}</span>
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

      <Bloc numero="04" titre="Défis communautaires" fil="#FFB000">
        <Vu>
          <h2 className="display-l max-w-3xl">
            Quatre hashtags, <span className="livre font-normal text-or">un même mouvement</span>
          </h2>
          <p className="mt-5 max-w-2xl text-[16.5px] text-dim">
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
      <button type="button" onClick={() => setOuvert(true)} className="btn btn-craie mt-5">
        <ChevronDown size={16} /> Voir les {toutes[id].length} missions
      </button>
    );
  return (
    <>
      <ol className="mt-px grid gap-px overflow-hidden border border-t-0 border-paper/12 bg-paper/12 sm:grid-cols-2">
        {reste.map((m, k) => {
          const i = k + 12;
          return (
            <li key={m + i} className="bg-ink-2 sm:[&:last-child:nth-child(odd)]:col-span-2">
              <button
                type="button"
                onClick={() => onToggle(id, i)}
                aria-pressed={suivi.includes(i)}
                className="flex w-full items-start gap-4 p-4 text-left transition-colors hover:bg-ink-3"
              >
                <span
                  className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center font-display text-[12px] font-extrabold"
                  style={{ border: `1px solid ${fil}`, background: suivi.includes(i) ? fil : "transparent", color: suivi.includes(i) ? "#FFF0D9" : fil }}
                >
                  {suivi.includes(i) ? <Check size={14} /> : i + 1}
                </span>
                <span className={`text-[14.5px] leading-snug ${suivi.includes(i) ? "text-dim-2 line-through" : "text-paper/90"}`}>{m}</span>
              </button>
            </li>
          );
        })}
      </ol>
      <button type="button" onClick={() => setOuvert(false)} className="btn btn-craie mt-5">
        <ChevronDown size={16} className="rotate-180" /> Replier
      </button>
    </>
  );
}
