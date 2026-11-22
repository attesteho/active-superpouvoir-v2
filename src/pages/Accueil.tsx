import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MoveRight, RotateCcw } from "lucide-react";
import { BandeKente, Defilement, Etoile, Etiquette, RailFils, Vu } from "../components/Atelier";
import { Livre } from "../components/Livre";
import { HeroAccueil } from "../components/HeroAccueil";
import { CarteDoute } from "../components/CarteDoute";
import { SuiteAccueil } from "../components/SuiteAccueil";
import { Link, useRoute } from "../lib/router";
import { mouvementReduit } from "../lib/motion";
import { affirmations, etapes, methode } from "../data/site";
import { FondPhoto, Vignette } from "../components/Photo";
import { PhotoLegendee } from "../components/Visuels";
import { etapePhotos, fonds, methodePhotos, photos } from "../data/media";
import cartes from "../data/cards.json";
import quiz from "../data/quiz.json";

gsap.registerPlugin(ScrollTrigger);

const POSTES = [
  { num: "00", label: "Affiche", id: "poste-00" },
  { num: "01", label: "Le fil", id: "poste-01" },
  { num: "02", label: "L’établi", id: "poste-02" },
  { num: "03", label: "Ton étape", id: "poste-03" },
  { num: "04", label: "La question", id: "poste-04" },
  { num: "05", label: "Les doutes", id: "poste-05" },
  { num: "06", label: "Les défis", id: "poste-06" },
  { num: "07", label: "Les voix", id: "poste-07" },
  { num: "08", label: "Le héros", id: "poste-08" },
  { num: "09", label: "Le kit", id: "poste-09" },
  { num: "10", label: "Le rituel", id: "poste-10" },
];

/* ————————————— 00 · L'AFFICHE ————————————— */
function Ouverture() {
  const racine = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = racine.current;
    if (!el) return;
    const t = window.setTimeout(() => el.classList.add("vu"), 100);
    if (mouvementReduit()) return () => window.clearTimeout(t);

    const stage = el.querySelector<HTMLElement>("[data-hero-stage]");
    if (!stage || window.matchMedia("(hover: none)").matches) return () => window.clearTimeout(t);
    let raf = 0;
    const move = (event: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const bounds = stage.getBoundingClientRect();
        stage.style.setProperty("--hero-x", String((event.clientX - bounds.left) / bounds.width - 0.5));
        stage.style.setProperty("--hero-y", String((event.clientY - bounds.top) / bounds.height - 0.5));
      });
    };
    const leave = () => {
      stage.style.setProperty("--hero-x", "0");
      stage.style.setProperty("--hero-y", "0");
    };
    stage.addEventListener("pointermove", move);
    stage.addEventListener("pointerleave", leave);
    return () => {
      window.clearTimeout(t);
      stage.removeEventListener("pointermove", move);
      stage.removeEventListener("pointerleave", leave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={racine} className="relative overflow-hidden">
      <HeroAccueil />
    </div>
  );
}

/* ————————————— 01 · LE FIL ————————————— */
function LeFil() {
  return (
    <section id="poste-01" className="affirmation-ribbon" aria-label="Le fil des affirmations">
      <p className="sr-only">{affirmations.join(" ")}</p>
      <div className="affirmation-ribbon-meta" aria-hidden="true">
        <span className="affirmation-ribbon-index">01 <span>/</span> 06 — LE FIL</span>
        <span className="affirmation-ribbon-caption">À garder près de soi</span>
      </div>
      <div className="affirmation-ribbon-viewport" aria-hidden="true">
        <Defilement
          vitesse={54}
          enfants={
            <span className="affirmation-ribbon-track">
              {affirmations.map((a) => (
                <span key={a} className="affirmation-ribbon-item">
                  <span className="affirmation-ribbon-quote">{a}</span>
                  <Etoile taille={14} fil="#FFB000" />
                </span>
              ))}
            </span>
          }
        />
      </div>
    </section>
  );
}

/* ————————————— 02 · L'ÉTABLI (épinglé) ————————————— */
function Etabli() {
  const zone = useRef<HTMLDivElement>(null);
  const [epingle, setEpingle] = useState(false);

  useLayoutEffect(() => {
    const el = zone.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      setEpingle(true);
      const boite = el.querySelector<HTMLElement>("[data-livre-boite]");
      const outils = gsap.utils.toArray<HTMLElement>("[data-outil]", el);
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top top", end: "+=1600", pin: true, scrub: 0.7, anticipatePin: 1 },
      });
      tl.fromTo(boite, { rotationY: 0, scale: 0.92 }, { rotationY: 18, scale: 1, duration: 1.1, ease: "none" }, 0)
        .fromTo(boite, { "--open": 0 }, { "--open": 1, duration: 1.2, ease: "power1.inOut" }, 0.45)
        .fromTo(outils, { opacity: 0, x: 40 }, { opacity: 1, x: 0, stagger: 0.26, duration: 0.6, ease: "power2.out" }, 0.85);
      return () => setEpingle(false);
    });
    return () => mm.revert();
  }, []);

  return (
    <div ref={zone} className="relative">
      <section
        id="poste-02"
        className="champ inverse relative overflow-hidden lg:flex lg:items-center"
      >
        <FondPhoto photo={fonds.etabli} parallaxe={false} />
        <div className="trame-lignes pointer-events-none absolute inset-0 opacity-[0.14]" aria-hidden="true" />
        <div className="relative z-10 mx-auto w-full max-w-[1320px]">
          <Etiquette num="02" label="L’établi" fond="#FFF0D9" encre="#321044" />

          <div className="grid items-center gap-10 pt-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-4">
              <h2 className="display-l uppercase">
                Le livre<br />n’est pas<br />
                <span className="text-jaune">un objet.</span>
              </h2>
              <p className="text-dim mt-2">
                Huit chapitres transformateurs, du Radar Personnel à l’Ikigai, en passant par la méthode CAP et le Chemin
                du Héros. On n’y lit pas son avenir : on y fabrique.
              </p>
              <Link to="/le-livre" className="btn btn-craie mt-7">
                Ouvrir le livre <MoveRight size={16} />
              </Link>
            </div>

            <div className="flex justify-center py-8 lg:col-span-4 lg:py-0">
              <div data-livre-boite style={{ "--open": epingle ? 0 : 0.6 } as React.CSSProperties}>
                <Livre largeur={epingle ? 290 : 240} inclinaison={-18} />
              </div>
            </div>

            <ol className="flex flex-col gap-5 lg:col-span-4">
              {methode.map((m) => (
                <li key={m.num} data-outil className="group flex items-center gap-4 border-b border-ink/25 pb-5 last:border-b-0 last:pb-0">
                  <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl sm:h-20 sm:w-20">
                    <Vignette photo={methodePhotos[m.num]} largeur={300} decoratif className="h-full w-full object-cover" />
                    <span className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-jaune font-display text-[12px] font-extrabold text-paper shadow-[0_2px_6px_rgba(50,16,68,0.3)]">{m.num}</span>
                  </span>

                  <div className="flex-1">
                    <p className="font-display text-[15px] font-extrabold uppercase sm:text-base">{m.nom}</p>
                    <p className="text-dim-2 mt-1">{m.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ————————————— 03 · LES ÉTAPES (horizontal) ————————————— */

function Etapes() {
  const zone = useRef<HTMLDivElement>(null);
  const piste = useRef<HTMLDivElement>(null);
  const [horizontal, setHorizontal] = useState(false);

  /* 1) on bascule la mise en page en horizontal… */
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      setHorizontal(true);
      return () => setHorizontal(false);
    });
    return () => mm.revert();
  }, []);

  /* 2) …puis, seulement après ce rendu, on mesure la piste et on crée l'épinglage :
     la distance et la hauteur de pin reposent ainsi sur les vraies dimensions des cartes. */
  useLayoutEffect(() => {
    if (!horizontal) return;
    const el = zone.current;
    const track = piste.current;
    if (!el || !track) return;
    const distance = () => track.scrollWidth - window.innerWidth + 110;
    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: { trigger: el, start: "top top", end: () => "+=" + distance(), pin: true, scrub: 0.6, invalidateOnRefresh: true },
    });
    ScrollTrigger.refresh();
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(track, { clearProps: "transform" });
    };
  }, [horizontal]);

  const accents = ["#F3781E", "#321044", "#2E7D8C", "#FF6F59"];

  return (
    <div ref={zone} id="poste-03" className="champ relative isolate overflow-hidden bg-ink-2">
      <div className="relative z-10 mx-auto mb-10 w-full max-w-[1320px]">
        <Etiquette num="03" label="À chacun son chemin" fond="#321044" encre="#FFF0D9" />
        <h2 className="display-l mt-3 uppercase text-paper">
          Choisis le parcours <span className="text-orange">qui te ressemble.</span>
        </h2>
      </div>

      <div
        ref={piste}
        className={`relative z-10 flex gap-6 lg:gap-8 ${horizontal ? "flex-row items-stretch" : "flex-col lg:flex-row lg:flex-wrap lg:items-stretch"}`}
      >
        {etapes.map((e, i) => {
          const accent = accents[i % accents.length];
          return (
            <article
              key={e.id}
              className="group relative flex w-full shrink-0 flex-col overflow-hidden rounded-[22px] bg-ink-2 shadow-[0_10px_30px_rgba(50,16,68,0.1)] transition-transform duration-300 hover:-translate-y-2 sm:w-[380px] lg:w-[320px] xl:w-[360px]"
            >
              <div className="relative aspect-[4/3] shrink-0 overflow-hidden">
                <Vignette photo={etapePhotos[e.id]} largeur={900} decoratif className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <span className="absolute left-4 top-4 rounded-full px-3 py-1 font-display text-[12px] font-bold uppercase tracking-wide text-ink-2" style={{ background: accent }}>{e.age}</span>
              </div>
              <div className="flex flex-1 flex-col justify-between gap-6 p-6">
                <div>
                  <h3 className="font-display text-xl font-extrabold uppercase text-paper">{e.nom}</h3>
                  <p className="mt-2 font-medium text-dim">{e.accroche}</p>
                </div>
                <div className="flex flex-col gap-3">
                  <ul className="flex flex-wrap gap-2">
                    {e.tags.map((t) => (
                      <li key={t} className="rounded-full px-3 py-1 font-body text-[11px] font-bold uppercase tracking-wide" style={{ background: `${accent}1A`, color: accent }}>
                        {t}
                      </li>
                    ))}
                  </ul>
                  <Link to={`/parcours/${e.id}`} className="inline-flex items-center gap-1.5 font-display text-sm font-extrabold uppercase text-paper">
                    Commencer <MoveRight size={16} className="transition-transform duration-300 group-hover:translate-x-2" />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

/* ————————————— 04 · LA PREMIÈRE QUESTION ————————————— */
function PremiereQuestion() {
  const { aller } = useRoute();
  const q = quiz[0];
  const [survol, setSurvol] = useState<number | null>(null);

  const choisir = (i: number) => {
    try {
      sessionStorage.setItem("atp-quiz-depart", String(i));
    } catch {
      /* stockage indisponible */
    }
    aller("/quiz");
  };

  return (
    <section id="poste-04" className="champ relative">
      <div className="relative mx-auto w-full max-w-[1320px]">
        <Etiquette num="04" label="La première question" />
        <div className="grid gap-12 pt-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Vu>
              <h2 className="display-l uppercase">
                Le quiz<br />commence<br />
                <span className="text-or">ici.</span>
              </h2>
              <p className="text-dim mt-2">
                Pas d’inscription, pas de bonne réponse. Réponds à cette première question : elle t’ouvre les neuf
                suivantes et ton profil de héros.
              </p>
              <ul className="mt-5 flex flex-wrap gap-2 font-mono text-xs font-bold uppercase tracking-wide">
                {["10 questions", "3 minutes", "8 profils"].map((x) => (
                  <li key={x} className="rounded-full border border-paper/20 px-3 py-1.5">
                    {x}
                  </li>
                ))}
              </ul>
              <PhotoLegendee photo={photos.questionQuiz} ratio="5 / 4" className="mt-6" />
            </Vu>
          </div>

          <div className="lg:col-span-7">
            <Vu delay={100}>
              <div className="overflow-hidden rounded-[22px] border border-paper/10 bg-ink-2 ombre">
                <div className="flex items-center justify-between bg-paper px-6 py-4 font-mono text-xs font-bold uppercase tracking-wide text-ink">
                  <span>Question 01 · {q.theme}</span>
                  <span className="text-ink">1 / 10</span>
                </div>
                <div className="p-6 sm:p-8">
                  <p className="font-display text-xl font-extrabold sm:text-2xl">{q.text}</p>
                  <p className="text-dim-2 mt-2">{q.context}</p>
                  <ul className="mt-6 space-y-2.5">
                    {q.options.map((o, i) => (
                      <li key={o.label}>
                        <button
                          type="button"
                          onClick={() => choisir(i)}
                          onMouseEnter={() => setSurvol(i)}
                          onMouseLeave={() => setSurvol(null)}
                          onFocus={() => setSurvol(i)}
                          onBlur={() => setSurvol(null)}
                          className="flex w-full items-center gap-4 rounded-2xl border border-paper/15 px-4 py-3.5 text-left transition-all duration-200 hover:translate-x-1.5"
                          style={{ background: survol === i ? "#FFB000" : "transparent", color: survol === i ? "#FFF0D9" : "#321044" }}
                        >
                          <span
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-sm font-extrabold transition-colors"
                            style={{ background: "#321044", color: "#FFF0D9" }}
                          >
                            {o.label}
                          </span>
                          <span className="text-[15px] font-medium leading-snug">{o.text}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Vu>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ————————————— 05 · LES DOUTES ————————————— */
function Doutes() {
  const choisies = [cartes[0], cartes[6], cartes[24]];
  return (
    <section id="poste-05" className="champ inverse relative overflow-hidden">
      <FondPhoto photo={fonds.doutes} mode="multiply" />
      <div className="trame-points pointer-events-none absolute inset-0 opacity-[0.12]" aria-hidden="true" />
      <div className="relative z-10 mx-auto w-full max-w-[1320px]">
        <Etiquette num="05" label="Les doutes se retournent" fond="#FFF0D9" encre="#321044" />
        <div className="grid gap-10 pt-8 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            <Vu>
              <h2 className="display-l uppercase text-ink">
                Retourne<br />le doute.
              </h2>
              <p className="text-dim mt-2">
                Trente cartes, une par blocage mental du chapitre V. Au recto, la phrase qui te freine. Au verso,
                l’affirmation et une action à faire aujourd’hui.
              </p>
              <p className="mt-5 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wide text-ink">
                <RotateCcw size={14} /> Clique une carte
              </p>
              <Link to="/cartes" className="btn btn-craie mt-6">
                Voir les 30 cartes <MoveRight size={16} />
              </Link>
              <PhotoLegendee photo={photos.doutesCartes} ratio="4 / 3" className="mt-8" />
            </Vu>
          </div>
          <div className="grid gap-6 pt-2 sm:grid-cols-3 lg:col-span-8 lg:pt-0">
            {choisies.map((c, i) => (
              <Vu key={c.id} delay={i * 110}>
                <CarteDoute carte={c} />
              </Vu>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Accueil() {
  useEffect(() => {
    if (!mouvementReduit()) ScrollTrigger.refresh();
  }, []);

  return (
    <>
      <RailAffiche />
      <Ouverture />
      <LeFil />
      <Etabli />
      <Etapes />
      <PremiereQuestion />
      <Doutes />
      <SuiteAccueil />
      <BandeKente hauteur={16} />
    </>
  );
}

function RailAffiche() {
  return <RailFils postes={POSTES} />;
}
