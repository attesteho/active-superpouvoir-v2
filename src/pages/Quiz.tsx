import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, MoveRight, RotateCcw, Copy, Check, Sparkles } from "lucide-react";
import { BandeKente, Etoile, Vu } from "../components/Atelier";
import { EntetePage } from "../components/Page";
import { photos } from "../data/media";
import { Link } from "../lib/router";
import { mouvementReduit } from "../lib/motion";
import { lienCommande } from "../data/site";
import questions from "../data/quiz.json";
import profils from "../data/profiles.json";

const ORDRE = ["createur", "connecteur", "gardien", "leader", "explorateur", "guerisseur", "architecte", "sage"] as const;
type Cle = (typeof ORDRE)[number];
type Profil = (typeof profils)[Cle];

export default function Quiz() {
  const [phase, setPhase] = useState<"intro" | "questions" | "tissage" | "resultat">("intro");
  const [index, setIndex] = useState(0);
  const [reponses, setReponses] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [copie, setCopie] = useState(false);
  const zone = useRef<HTMLDivElement>(null);

  // Reprise de la réponse donnée sur la page d'accueil.
  useEffect(() => {
    try {
      const depart = sessionStorage.getItem("atp-quiz-depart");
      if (depart !== null) {
        const i = Number(depart);
        sessionStorage.removeItem("atp-quiz-depart");
        if (i >= 0 && i < 4) {
          const r = Array(questions.length).fill(null) as (number | null)[];
          r[0] = i;
          setReponses(r);
          setIndex(1);
          setPhase("questions");
        }
      }
    } catch {
      /* stockage indisponible */
    }
  }, []);

  useEffect(() => {
    if (phase !== "tissage") return;
    const duree = mouvementReduit() ? 60 : 1500;
    const t = window.setTimeout(() => setPhase("resultat"), duree);
    return () => window.clearTimeout(t);
  }, [phase]);

  const scores = useMemo(() => {
    const t = Array(8).fill(0) as number[];
    reponses.forEach((r, qi) => {
      if (r === null) return;
      questions[qi].options[r].scores.forEach((s, k) => (t[k] += s));
    });
    return t;
  }, [reponses]);

  const classement = useMemo(() => {
    const total = scores.reduce((a, b) => a + b, 0) || 1;
    return ORDRE.map((cle, i) => ({ cle, score: scores[i], part: Math.round((scores[i] / total) * 100) })).sort(
      (a, b) => b.score - a.score
    );
  }, [scores]);

  const gagnant = classement[0];
  const profil = profils[gagnant.cle] as Profil;
  const q = questions[index];
  const repondu = reponses[index] !== null;

  const choisir = (i: number) => {
    const r = [...reponses];
    r[index] = i;
    setReponses(r);
  };

  const suivant = () => {
    if (index < questions.length - 1) {
      setIndex(index + 1);
      zone.current?.scrollIntoView({ block: "start", behavior: mouvementReduit() ? "auto" : "smooth" });
    } else setPhase("tissage");
  };

  const recommencer = () => {
    setReponses(Array(questions.length).fill(null));
    setIndex(0);
    setPhase("questions");
    setCopie(false);
  };

  const copier = async () => {
    const texte = `Mon profil de héros : ${profil.type} — ${profil.archetype}.\n${profil.tagline}\n\nQuiz « Active ton Superpouvoir ! » de Nadine Zoro.`;
    try {
      await navigator.clipboard.writeText(texte);
      setCopie(true);
      window.setTimeout(() => setCopie(false), 2600);
    } catch {
      setCopie(false);
    }
  };

  /* ————————————————— INTRODUCTION ————————————————— */
  if (phase === "intro") {
    return (
      <>
        <EntetePage
          photo={photos.quizEntete}
          surtitre="Quiz superpouvoir · gratuit, sans inscription"
          lignes={[<>Découvre ton</>, <span key="s" className="livre font-normal text-or">superpouvoir</span>]}
          intro="Réponds à 10 questions simples et découvre quel type de héros tu es vraiment. Pas de bonnes ou mauvaises réponses — juste toi."
        />
        <div className="mx-auto w-full max-w-[1400px] px-5 pb-24 sm:px-8 xl:px-14">
          <div className="grid gap-10 rounded-[26px] border border-paper/10 bg-ink-2 p-7 sm:p-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <ul className="flex flex-wrap gap-x-10 gap-y-4">
                {[["10", "questions"], ["3", "minutes"], ["8", "profils héros"]].map(([n, l]) => (
                  <li key={l}>
                    <span data-compte className="block font-display text-[46px] font-extrabold leading-none text-or">{n}</span>
                    <span className="label">{l}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 max-w-xl text-[16px] text-dim">
                Chaque réponse tisse huit fils à la fois. À la fin, le fil dominant révèle ton archétype — avec ses
                forces, ses zones d’ombre, sa mission et les ressources faites pour toi.
              </p>
              <button type="button" onClick={() => setPhase("questions")} className="btn btn-or mt-9">
                C’est parti <MoveRight size={17} strokeWidth={2.4} />
              </button>
            </div>
            <div className="lg:col-span-5">
              <p className="label mb-4">Les huit fils</p>
              <ul className="grid grid-cols-2 gap-2">
                {ORDRE.map((c) => (
                  <li key={c} className="flex items-center gap-2.5 rounded-full border border-paper/10 px-3 py-2.5 text-[13.5px]">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: profils[c].primaryColor }} />
                    {profils[c].type}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </>
    );
  }

  /*————————————————— TISSAGE ————————————————— */
  if (phase === "tissage") {
    return (
      <div className="flex min-h-[100svh] flex-col items-center justify-center gap-8 px-6 pt-[68px] text-center">
        <Etoile taille={54} className="anim-tourne" />
        <p className="livre text-[30px] text-or sm:text-[40px]">Tissage de ton profil…</p>
        <div className="w-full max-w-md">
          <BandeKente hauteur={10} />
        </div>
        <p className="label" role="status">
          Croisement de tes dix réponses
        </p>
      </div>
    );
  }

  /* ————————————————— RÉSULTAT ————————————————— */
  if (phase === "resultat") {
    return (
      <div style={{ ["--fil" as string]: profil.primaryColor }}>
        <header className="relative overflow-hidden pt-[68px]" style={{ background: `${profil.primaryColor}1a` }}>
          <BandeKente hauteur={6} />
          <div className="mx-auto grid w-full max-w-[1400px] gap-10 px-5 pb-16 pt-14 sm:px-8 lg:grid-cols-12 xl:px-14">
            <div className="lg:col-span-8">
              <p className="label mb-5 flex items-center gap-2">
                <Etoile taille={13} fil={profil.primaryColor} /> Ton profil dominant
              </p>
              <h1 className="display-xl uppercase">{profil.type}</h1>
              <span className="mt-4 block h-3 w-40 rounded-full" style={{ background: profil.primaryColor }} aria-hidden="true" />
              <p className="mt-3 font-display text-[20px] font-extrabold uppercase tracking-[0.12em] text-paper/80">{profil.archetype}</p>
              <p className="livre mt-7 max-w-2xl text-[26px] leading-[1.2] sm:text-[32px]">{profil.tagline}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button type="button" onClick={copier} className="btn btn-or">
                  {copie ? <Check size={16} /> : <Copy size={16} />} {copie ? "Profil copié" : "Copier mon profil"}
                </button>
                <button type="button" onClick={recommencer} className="btn btn-craie">
                  <RotateCcw size={16} /> Refaire le quiz
                </button>
              </div>
            </div>

            <div className="lg:col-span-4">
              <p className="label mb-4">Tes fils dominants</p>
              <ul className="space-y-3">
                {classement.slice(0, 4).map((c) => (
                  <li key={c.cle}>
                    <div className="flex items-baseline justify-between text-[13.5px]">
                      <span className="font-semibold">{profils[c.cle].type}</span>
                      <span className="text-dim-2">{c.part}%</span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full rounded-full bg-paper/10">
                      <div className="h-1.5 rounded-full transition-[width] duration-1000" style={{ width: `${c.part}%`, background: profils[c.cle].primaryColor }} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </header>

        <div className="mx-auto w-full max-w-[1400px] px-5 pb-24 sm:px-8 xl:px-14">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Vu>
                {profil.description.split("\n\n").map((p, i) => (
                  <p key={i} className="mb-5 text-[16.5px] leading-relaxed text-dim">
                    {p}
                  </p>
                ))}
              </Vu>

              <Vu>
                <h2 className="display-m mt-10">Ta mission</h2>
                <p className="livre mt-4 border-l-2 pl-6 text-[24px] leading-snug sm:text-[28px]" style={{ borderColor: profil.primaryColor }}>
                  {profil.mission}
                </p>
              </Vu>

              <Vu>
                <h2 className="display-m mt-12">Ton chemin</h2>
                <p className="mt-4 text-[16.5px] leading-relaxed text-dim">{profil.idealPath}</p>
              </Vu>
            </div>

            <aside className="space-y-8 lg:col-span-5">
              <Vu>
                <div className="rounded-[20px] border border-paper/10 bg-ink-2 p-6">
                  <h2 className="label mb-4">Tes superpouvoirs</h2>
                  <ul className="space-y-3">
                    {profil.superpowers.map((s) => (
                      <li key={s.label} className="flex items-start gap-3 text-[15px]">
                        <Etoile taille={14} fil={profil.primaryColor} className="mt-1 shrink-0" />
                        {s.label}
                      </li>
                    ))}
                  </ul>
                </div>
              </Vu>

              <Vu delay={90}>
                <div className="rounded-[20px] border border-paper/10 bg-ink-2 p-6">
                  <h2 className="label mb-4">Tes zones d’ombre</h2>
                  <ul className="space-y-3">
                    {profil.shadows.map((s) => (
                      <li key={s.text} className="border-l border-paper/25 pl-4 text-[14.5px] leading-snug text-dim">
                        {s.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </Vu>

              <Vu delay={140}>
                <div className="rounded-[20px] border border-paper/10 bg-ink-2 p-6">
                  <h2 className="label mb-4">Ils portent le même fil</h2>
                  <ul className="space-y-3">
                    {profil.famousHeroes.map((h) => (
                      <li key={h.name} className="text-[15px]">
                        <span className="font-display font-extrabold">{h.name}</span>
                        <span className="block text-[13px] text-dim-2">{h.role}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Vu>
            </aside>
          </div>

          <Vu>
            <h2 className="display-m mt-16">Tes affirmations</h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-3">
              {profil.affirmations.map((a) => (
                <li key={a.text} className="flex h-full flex-col justify-between rounded-[20px] bg-paper p-6 text-ink">
                  <span className="label" style={{ color: "rgba(29,23,16,.55)" }}>
                    {a.domain}
                  </span>
                  <p className="livre mt-4 text-[21px] leading-tight">{a.text}</p>
                </li>
              ))}
            </ul>
          </Vu>

          <Vu>
            <h2 className="display-m mt-16">Les ressources faites pour toi</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {profil.resources.map((r) => (
                <li key={r.label} className="rounded-[18px] border border-paper/10 bg-ink-2 p-6">
                  <p className="font-display text-[19px] font-extrabold">{r.label}</p>
                  <p className="mt-1.5 text-[14px] text-dim-2">{r.subtitle}</p>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/boutique" className="btn btn-or">
                Voir la bibliothèque <MoveRight size={16} />
              </Link>
              <a href={lienCommande(`Kit du Héros — profil ${profil.type}`)} className="btn btn-craie">
                Commander le kit
              </a>
              <Link to="/cartes" className="btn btn-craie">
                <Sparkles size={16} /> Tirer une carte
              </Link>
            </div>
          </Vu>
        </div>
      </div>
    );
  }

  /* ————————————————— QUESTIONS ————————————————— */
  return (
    <div ref={zone} className="min-h-[100svh] pt-[68px]">
      <div className="mx-auto w-full max-w-[900px] px-5 pb-24 pt-10 sm:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-[13px] text-dim-2 transition-colors hover:text-or">
            <ArrowLeft size={15} /> Quitter le quiz
          </Link>
          <p className="label" aria-live="polite">
            Question {index + 1} / {questions.length}
          </p>
        </div>

        <div className="mt-4 flex gap-1.5" aria-hidden="true">
          {questions.map((_, i) => (
            <span
              key={i}
              className="h-1 flex-1 rounded-full transition-colors duration-500"
              style={{ background: i < index ? "#F3781E" : i === index ? "#F3781E" : "rgba(50,16,68,.1)" }}
            />
          ))}
        </div>

        <div key={index} className="mt-12">
          <p className="label text-or">{q.theme}</p>
          <h1 className="mt-4 font-display text-[28px] font-extrabold leading-[1.05] sm:text-[40px]">{q.text}</h1>
          <p className="mt-4 text-[15px] text-dim-2">{q.context}</p>

          <ul
            className="mt-9 space-y-3"
            role="radiogroup"
            aria-label={q.text}
            onKeyDown={(e) => {
              const sens = ["ArrowDown", "ArrowRight"].includes(e.key) ? 1 : ["ArrowUp", "ArrowLeft"].includes(e.key) ? -1 : 0;
              if (!sens) return;
              e.preventDefault();
              const actuel = reponses[index] ?? (sens === 1 ? -1 : 0);
              const n = (actuel + sens + q.options.length) % q.options.length;
              choisir(n);
              (e.currentTarget.querySelectorAll("button")[n] as HTMLButtonElement | undefined)?.focus();
            }}
          >
            {q.options.map((o, i) => {
              const actif = reponses[index] === i;
              return (
                <li key={o.label}>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={actif}
                    onClick={() => choisir(i)}
                    className={`flex w-full items-start gap-4 rounded-[18px] border p-4 text-left transition-all duration-300 sm:p-5 ${
                      actif ? "border-orange bg-orange/10" : "border-paper/12 hover:border-paper/30 hover:bg-paper/[0.03]"
                    }`}
                  >
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-display text-[13px] font-extrabold transition-colors"
                      style={{ border: "1px solid #F3781E", background: actif ? "#F3781E" : "transparent", color: actif ? "#FFF8EC" : "#F3781E" }}
                    >
                      {o.label}
                    </span>
                    <span className="pt-1 text-[15.5px] leading-snug sm:text-[16.5px]">{o.text}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-10 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setIndex(Math.max(0, index - 1))}
            disabled={index === 0}
            className="btn btn-craie disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ArrowLeft size={16} /> Précédent
          </button>
          <button type="button" onClick={suivant} disabled={!repondu} className="btn btn-or disabled:cursor-not-allowed disabled:opacity-35">
            {index === questions.length - 1 ? "Voir mon profil" : "Suivant"} <MoveRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
