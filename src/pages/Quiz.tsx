import { useEffect, useMemo, useRef, useState } from "react";
import { RotateCcw, Copy, Sparkles } from "lucide-react";
import { BandeKente, Etoile, Vu } from "../components/Atelier";
import { EntetePage } from "../components/Page";
import { CadreDecoupe } from "../components/CadreDecoupe";
import { BoutonPeint } from "../components/BoutonPeint";
import { Icone } from "../components/Icone";
import { photos } from "../data/media";
import { Link } from "../lib/router";
import { mouvementReduit } from "../lib/motion";
import { kitProduit } from "../data/site";
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
          arrierePlan="/images/02-quiz-introduction.webp"
          surtitre="Quiz superpouvoir · gratuit, sans inscription"
          lignes={[<>Découvre ton</>, <span key="s" className="livre font-normal text-or">superpouvoir</span>]}
          intro="Réponds à 10 questions simples et découvre quel type de héros tu es vraiment. Pas de bonnes ou mauvaises réponses — juste toi."
        />
        <div className="champ">
          <div className="ombre grid overflow-hidden rounded-[28px] border border-paper/10 bg-ink-2 lg:grid-cols-12">
            <div className="flex flex-col items-start gap-6 p-8 sm:p-10 lg:col-span-7 lg:p-14">
              <ul className="flex flex-wrap gap-8">
                {[["10", "questions"], ["3", "minutes"], ["8", "profils héros"]].map(([n, l]) => (
                  <li key={l} className="flex flex-col gap-1">
                    <span data-compte className="block font-display text-3xl font-extrabold text-or">{n}</span>
                    <span className="label">{l}</span>
                  </li>
                ))}
              </ul>
              <p className="text-dim">
                Chaque réponse tisse huit fils à la fois. À la fin, le fil dominant révèle ton archétype — avec ses
                forces, ses zones d’ombre, sa mission et les ressources faites pour toi.
              </p>
              <BoutonPeint onClick={() => setPhase("questions")} icone={<Icone nom="fleche-droite" taille={17} />}>
                C’est parti
              </BoutonPeint>
            </div>
            <div className="flex flex-col gap-4 border-t border-paper/10 p-8 sm:p-10 lg:col-span-5 lg:border-l lg:border-t-0 lg:p-14">
              <p className="label">Les huit fils</p>
              <ul className="grid grid-cols-2 gap-3">
                {ORDRE.map((c) => (
                  <li key={c} className="flex items-center gap-2 rounded-full border border-paper/10 bg-ink px-3 py-2 text-sm font-semibold">
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
      <div className="fond-tisse flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 text-center">
        <Etoile taille={54} className="anim-tourne" />
        <p className="livre text-4xl text-or">Tissage de ton profil…</p>
        <div className="w-full max-w-xs">
          <BandeKente hauteur={10} />
        </div>
        <p className="font-body text-[11.5px] font-bold uppercase tracking-[0.08em] text-ink/60" role="status">
          Croisement de tes dix réponses
        </p>
      </div>
    );
  }

  /* ————————————————— RÉSULTAT ————————————————— */
  if (phase === "resultat") {
    return (
      <div style={{ ["--fil" as string]: profil.primaryColor }}>
        <header className="relative isolate overflow-hidden px-6 pb-14 pt-10 sm:px-10 sm:pt-14 lg:px-16" style={{ background: `${profil.primaryColor}1a` }}>
          <img
            src="/images/04-resultat-profil.webp"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover"
            style={{ objectPosition: "center" }}
          />
          <BandeKente hauteur={6} />
          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="flex flex-col items-start gap-4 lg:col-span-8">
              <p className="label flex items-center gap-2">
                <Etoile taille={13} fil={profil.primaryColor} /> Ton profil dominant
              </p>
              <h1 className="display-xl uppercase" style={{ color: "var(--fil)" }}>{profil.type}</h1>
              <span className="block h-1.5 w-16 rounded-full" style={{ background: profil.primaryColor }} aria-hidden="true" />
              <p className="font-display text-lg font-extrabold uppercase text-paper/80">{profil.archetype}</p>
              <p className="livre text-2xl text-or">{profil.tagline}</p>
              <div className="mt-2 flex flex-wrap gap-3">
                <BoutonPeint onClick={copier} icone={copie ? <Icone nom="validation" taille={16} /> : <Copy size={16} />}>
                  {copie ? "Profil copié" : "Copier mon profil"}
                </BoutonPeint>
                <BoutonPeint variante="craie" onClick={recommencer} icone={<RotateCcw size={16} />}>
                  Refaire le quiz
                </BoutonPeint>
              </div>
            </div>

            <div className="lg:col-span-4">
              <CadreDecoupe variante="vague-bas-douce" className="mb-6 max-w-[300px] shadow-[0_18px_40px_rgba(0,0,0,0.22)]">
                <img
                  src={photos.quizEntete.src}
                  alt={photos.quizEntete.alt}
                  className="h-56 w-full object-cover"
                  style={{ objectPosition: photos.quizEntete.pos || "50% 50%" }}
                  loading="lazy"
                  decoding="async"
                />
              </CadreDecoupe>
              <p className="label">Tes fils dominants</p>
              <ul className="mt-4 space-y-4">
                {classement.slice(0, 4).map((c) => (
                  <li key={c.cle}>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-semibold">{profils[c.cle].type}</span>
                      <span className="text-dim-2">{c.part}%</span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-paper/10">
                      <div className="h-full rounded-full transition-[width] duration-1000" style={{ width: `${c.part}%`, background: profils[c.cle].primaryColor }} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </header>

        <div className="champ">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="flex flex-col gap-10 lg:col-span-7">
              <Vu className="flex flex-col gap-4">
                {profil.description.split("\n\n").map((p, i) => (
                  <p key={i} className="text-dim">
                    {p}
                  </p>
                ))}
              </Vu>

              <Vu className="flex flex-col gap-3">
                <h2 className="display-m">Ta mission</h2>
                <p className="livre border-l-4 pl-5 text-2xl" style={{ borderColor: profil.primaryColor }}>
                  {profil.mission}
                </p>
              </Vu>

              <Vu className="flex flex-col gap-3">
                <h2 className="display-m">Ton chemin</h2>
                <p className="text-dim">{profil.idealPath}</p>
              </Vu>
            </div>

            <aside className="space-y-8 lg:col-span-5">
              <Vu>
                <div className="rounded-[20px] border border-paper/10 bg-ink-2 p-6 sm:p-8">
                  <h2 className="label">Tes superpouvoirs</h2>
                  <ul className="mt-4 space-y-3">
                    {profil.superpowers.map((s) => (
                      <li key={s.label} className="flex items-start gap-3 font-semibold">
                        <Etoile taille={14} fil={profil.primaryColor} className="mt-1 shrink-0" />
                        {s.label}
                      </li>
                    ))}
                  </ul>
                </div>
              </Vu>

              <Vu delay={90}>
                <div className="rounded-[20px] border border-paper/10 bg-ink-2 p-6 sm:p-8">
                  <h2 className="label">Tes zones d’ombre</h2>
                  <ul className="mt-4 space-y-3">
                    {profil.shadows.map((s) => (
                      <li key={s.text} className="border-l-2 border-paper/25 pl-3 text-dim">
                        {s.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </Vu>

              <Vu delay={140}>
                <div className="rounded-[20px] border border-paper/10 bg-ink-2 p-6 sm:p-8">
                  <h2 className="label">Ils portent le même fil</h2>
                  <ul className="mt-4 space-y-3">
                    {profil.famousHeroes.map((h) => (
                      <li key={h.name}>
                        <span className="font-display font-extrabold">{h.name}</span>
                        <span className="block text-dim-2">{h.role}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Vu>
            </aside>
          </div>

          <Vu className="mt-16">
            <h2 className="display-m">Tes affirmations</h2>
            <ul className="grid gap-5 sm:grid-cols-3">
              {profil.affirmations.map((a) => (
                <li key={a.text} className="flex flex-col justify-between gap-4 rounded-[20px] bg-paper p-6 text-ink">
                  <span className="label" style={{ color: "rgba(255,244,227,.55)" }}>
                    {a.domain}
                  </span>
                  <p className="livre text-xl">{a.text}</p>
                </li>
              ))}
            </ul>
          </Vu>

          <Vu className="mt-16">
            <h2 className="display-m">Les ressources faites pour toi</h2>
            <ul className="grid gap-4 sm:grid-cols-2">
              {profil.resources.map((r) => (
                <li key={r.label} className="rounded-[18px] border border-paper/10 bg-ink-2 p-5">
                  <p className="font-display font-extrabold">{r.label}</p>
                  <p className="text-dim-2">{r.subtitle}</p>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <BoutonPeint to="/boutique" variante="or" icone={<Icone nom="fleche-droite" taille={16} />}>
                Voir la bibliothèque
              </BoutonPeint>
              <BoutonPeint to={`/boutique/${kitProduit.slug}`} variante="craie">
                Commander le kit
              </BoutonPeint>
              <BoutonPeint to="/cartes" variante="craie" icone={<Sparkles size={16} />}>
                Tirer une carte
              </BoutonPeint>
            </div>
          </Vu>
        </div>
      </div>
    );
  }

  /* ————————————————— QUESTIONS ————————————————— */
  return (
    <div ref={zone} className="champ relative isolate overflow-hidden">
      <img
        src="/images/03-quiz-questions.webp"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover"
        style={{ objectPosition: "center" }}
      />
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="inline-flex items-center gap-2 text-dim-2 transition-colors hover:text-or">
              <Icone nom="fleche-gauche" taille={15} /> Quitter le quiz
            </Link>
            <p className="label" aria-live="polite">
              Question {index + 1} / {questions.length}
            </p>
          </div>

          <div className="flex gap-1.5" aria-hidden="true">
            {questions.map((_, i) => (
              <span
                key={i}
                className="h-1.5 flex-1 rounded-full transition-colors duration-500"
                style={{ background: i < index ? "#F3781E" : i === index ? "#F3781E" : "rgba(50,16,68,.1)" }}
              />
            ))}
          </div>
        </div>

        <div key={index} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <p className="label text-or">{q.theme}</p>
            <h1 className="font-display text-2xl font-extrabold sm:text-3xl">{q.text}</h1>
            <p className="text-dim-2">{q.context}</p>
          </div>

          <ul
            className="space-y-3"
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
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-sm font-extrabold transition-colors"
                      style={{ border: "1px solid #F3781E", background: actif ? "#F3781E" : "transparent", color: actif ? "#FFF8EC" : "#F3781E" }}
                    >
                      {o.label}
                    </span>
                    <span className="pt-1 font-semibold text-paper/90">{o.text}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex items-center justify-between">
          <BoutonPeint
            onClick={() => setIndex(Math.max(0, index - 1))}
            disabled={index === 0}
            variante="craie"
            icone={<Icone nom="fleche-gauche" taille={16} />}
          >
            Précédent
          </BoutonPeint>
          <BoutonPeint onClick={suivant} disabled={!repondu} variante="or" icone={<Icone nom="fleche-droite" taille={16} />}>
            {index === questions.length - 1 ? "Voir mon profil" : "Suivant"}
          </BoutonPeint>
        </div>
      </div>
    </div>
  );
}
