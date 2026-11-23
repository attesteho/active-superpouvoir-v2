import { useState, type FormEvent, type ReactNode } from "react";
import {
  AlertCircle,
  ChevronDown,
  CreditCard,
  LockKeyhole,
  MapPin,
  Minus,
  Package,
  Plus,
  RefreshCcw,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";
import { Bloc, EntetePage } from "../components/Page";
import { VisuelProduit } from "../components/VisuelProduit";
import { BoutonPeint } from "../components/BoutonPeint";
import { Icone } from "../components/Icone";
import { Link, useRoute } from "../lib/router";
import { useCart, type CartItem } from "../lib/cart";
import { fcfa, marque } from "../data/site";

const LAST_ORDER_KEY = "fabrique-derniere-commande-v1";

type StepId = "coordonnees" | "livraison" | "paiement";
type DeliveryId = "standard" | "express";
type PaymentId = "mobile" | "virement" | "livraison";

type FormState = {
  nom: string;
  email: string;
  telephone: string;
  pays: string;
  ville: string;
  adresse: string;
  complement: string;
  livraison: DeliveryId;
  paiement: PaymentId;
};

type OrderRecord = FormState & {
  reference: string;
  items: CartItem[];
  subtotal: number;
  frais: number;
  total: number;
  createdAt: string;
};

const steps: Array<{ id: StepId; index: string; label: string; note: string }> = [
  { id: "coordonnees", index: "01", label: "Coordonnées", note: "Qui recevra la commande" },
  { id: "livraison", index: "02", label: "Livraison", note: "Où et quand la recevoir" },
  { id: "paiement", index: "03", label: "Paiement", note: "Une intention, pas de transaction" },
];

const initialForm: FormState = {
  nom: "",
  email: "",
  telephone: "",
  pays: "Côte d’Ivoire",
  ville: "",
  adresse: "",
  complement: "",
  livraison: "standard",
  paiement: "mobile",
};

function fraisLivraison(livraison: DeliveryId) {
  return livraison === "express" ? 2500 : 0;
}

function genererReference() {
  const date = new Date();
  const partieDate = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const aleatoire = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `FH-${partieDate}-${aleatoire}`;
}

function PanierVide({ message = "Ton panier est encore vide." }: { message?: string }) {
  return (
    <div className="empty-commerce">
      <span className="empty-commerce-mark" aria-hidden="true"><ShoppingBag size={25} /></span>
      <p className="label">L’établi t’attend</p>
      <h2>Choisis une première pièce.</h2>
      <p>{message} Parcours la bibliothèque, ouvre un ouvrage et ajoute-le à ton chemin.</p>
      <BoutonPeint to="/bibliotheque" variante="or" className="mt-2" icone={<Icone nom="fleche-droite" taille={16} />}>Explorer la bibliothèque</BoutonPeint>
    </div>
  );
}

function Stepper({ current }: { current: StepId }) {
  const activeIndex = steps.findIndex((step) => step.id === current);
  return (
    <ol className="checkout-stepper" aria-label="Progression de la commande">
      {steps.map((step, index) => {
        const active = step.id === current;
        const done = index < activeIndex;
        return (
          <li key={step.id} className={`checkout-step ${active ? "is-active" : ""} ${done ? "is-done" : ""}`}>
            <span className="checkout-step-number">{done ? <Icone nom="validation" taille={15} /> : step.index}</span>
            <span className="checkout-step-copy"><strong>{step.label}</strong><small>{step.note}</small></span>
          </li>
        );
      })}
    </ol>
  );
}

function QuantityControl({ item, onChange }: { item: CartItem; onChange: (quantity: number) => void }) {
  return (
    <div className="quantity-control" aria-label={`Quantité de ${item.produit.nom}`}>
      <button type="button" onClick={() => onChange(item.quantite - 1)} aria-label={`Retirer une unité de ${item.produit.nom}`}><Minus size={14} /></button>
      <span aria-live="polite">{item.quantite}</span>
      <button type="button" onClick={() => onChange(item.quantite + 1)} aria-label={`Ajouter une unité de ${item.produit.nom}`}><Plus size={14} /></button>
    </div>
  );
}

function Summary({ items, subtotal, livraison = "standard", editable = false }: { items: CartItem[]; subtotal: number; livraison?: DeliveryId; editable?: boolean }) {
  const frais = fraisLivraison(livraison);
  const total = subtotal + frais;
  return (
    <aside className="order-summary" aria-label="Récapitulatif de la commande">
      <div className="order-summary-top">
        <div><p className="label">Le récapitulatif</p><h2>Ton établi</h2></div>
        <span className="summary-count">{items.reduce((sum, item) => sum + item.quantite, 0)} pièce(s)</span>
      </div>
      <ul className="summary-items">
        {items.map((item) => (
          <li key={item.produit.slug} className="summary-item">
            <div className="summary-item-art overflow-hidden rounded-md"><VisuelProduit produit={item.produit} largeur={54} /></div>
            <div className="summary-item-copy"><strong>{item.produit.nom}</strong><span>{item.quantite} × {fcfa(item.produit.fcfa)}</span></div>
            <span className="summary-item-total">{fcfa(item.produit.fcfa * item.quantite)}</span>
          </li>
        ))}
      </ul>
      <dl className="summary-totals">
        <div><dt>Sous-total</dt><dd>{fcfa(subtotal)}</dd></div>
        <div><dt>Livraison</dt><dd>{frais ? fcfa(frais) : "Offerte"}</dd></div>
        <div className="summary-grand-total"><dt>Total indicatif</dt><dd>{fcfa(total)}</dd></div>
      </dl>
      {editable && <p className="summary-note"><ShieldCheck size={15} /> Les prix sont affichés en FCFA. Aucun paiement réel n’est déclenché ici.</p>}
    </aside>
  );
}

function Field({ label, name, value, onChange, error, type = "text", placeholder, autoComplete }: { label: string; name: string; value: string; onChange: (value: string) => void; error?: string; type?: string; placeholder?: string; autoComplete?: string }) {
  const errorId = `${name}-error`;
  return (
    <label className="checkout-field">
      <span>{label}</span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
      />
      {error && <small id={errorId} className="field-error"><AlertCircle size={13} /> {error}</small>}
    </label>
  );
}

function Choice({ name, value, selected, onChange, title, description, price, icon }: { name: string; value: string; selected: boolean; onChange: () => void; title: string; description: string; price: string; icon: ReactNode }) {
  return (
    <label className={`choice-card ${selected ? "is-selected" : ""}`}>
      <input type="radio" name={name} value={value} checked={selected} onChange={onChange} />
      <span className="choice-card-icon" aria-hidden="true">{icon}</span>
      <span className="choice-card-copy"><strong>{title}</strong><small>{description}</small></span>
      <span className="choice-card-price">{price}</span>
      <span className="choice-card-check" aria-hidden="true"><Icone nom="validation" taille={14} /></span>
    </label>
  );
}

function StepActions({ back, next, nextLabel = "Continuer" }: { back?: () => void; next: () => void; nextLabel?: string }) {
  return (
    <div className="checkout-actions">
      {back ? <BoutonPeint variante="craie" onClick={back} icone={<Icone nom="fleche-gauche" taille={16} />}>Retour</BoutonPeint> : <BoutonPeint to="/panier" variante="craie" icone={<Icone nom="fleche-gauche" taille={16} />}>Panier</BoutonPeint>}
      <BoutonPeint variante="or" onClick={next} icone={<Icone nom="fleche-droite" taille={16} />}>{nextLabel}</BoutonPeint>
    </div>
  );
}

export function PanierPage() {
  const { items, total, updateQuantity, remove } = useCart();
  return (
    <>
      <EntetePage surtitre="Le panier de l’atelier" lignes={[<>Les pièces qui</>, <span key="s" className="livre font-normal text-or">vont t’accompagner.</span>]} intro="Prends le temps de vérifier ton choix. La commande est une simulation de parcours : aucune transaction n’est déclenchée sur ce site." fil="#FFB000" />
      <Bloc numero="01" titre="Ta sélection" fil="#FFB000" className="champ">
        {items.length === 0 ? <PanierVide /> : (
          <div className="cart-page-grid">
            <div className="cart-list">
              <div className="cart-list-head"><span>Pièce</span><span>Quantité</span><span>Total</span></div>
              <ul>
                {items.map((item) => (
                  <li key={item.produit.slug} className="cart-row">
                    <div className="cart-row-art overflow-hidden rounded-md"><VisuelProduit produit={item.produit} largeur={86} /></div>
                    <div className="cart-row-copy"><span className="label" style={{ color: item.produit.fil }}>{item.produit.type}</span><h2>{item.produit.nom}</h2><p>{item.produit.format} · {fcfa(item.produit.fcfa)}</p><button type="button" className="text-action" onClick={() => remove(item.produit.slug)}><Trash2 size={14} /> Retirer</button></div>
                    <QuantityControl item={item} onChange={(quantity) => updateQuantity(item.produit.slug, quantity)} />
                    <strong className="cart-row-total">{fcfa(item.produit.fcfa * item.quantite)}</strong>
                  </li>
                ))}
              </ul>
            </div>
            <div className="cart-page-aside"><Summary items={items} subtotal={total} editable /><BoutonPeint to="/commande" variante="or" icone={<Icone nom="fleche-droite" taille={16} />}>Passer à la commande</BoutonPeint><Link to="/bibliotheque" className="back-catalogue"><Icone nom="fleche-gauche" taille={15} /> Continuer dans la bibliothèque</Link></div>
          </div>
        )}
      </Bloc>
    </>
  );
}

export function CommandePage() {
  const { items, total, clear } = useCart();
  const { aller } = useRoute();
  const [step, setStep] = useState<StepId>("coordonnees");
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [openSummary, setOpenSummary] = useState(false);

  const frais = fraisLivraison(form.livraison);
  const update = (name: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [name]: value } as FormState));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const validate = (current: StepId) => {
    const nextErrors: Record<string, string> = {};
    if (current === "coordonnees") {
      if (form.nom.trim().length < 2) nextErrors.nom = "Indique ton nom complet.";
      if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = "Vérifie ton adresse email.";
      if (form.telephone.replace(/\D/g, "").length < 8) nextErrors.telephone = "Ajoute un numéro joignable.";
      if (!form.ville.trim()) nextErrors.ville = "Indique ta ville.";
      if (form.adresse.trim().length < 5) nextErrors.adresse = "Ajoute une adresse ou un point de retrait.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const goNext = () => {
    if (!validate(step)) return;
    const currentIndex = steps.findIndex((item) => item.id === step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1].id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const placeOrder = async () => {
    if (!validate("paiement")) return;
    setSubmitting(true);
    const order: OrderRecord = {
      ...form,
      reference: genererReference(),
      items,
      subtotal: total,
      frais,
      total: total + frais,
      createdAt: new Date().toISOString(),
    };

    const envoi = fetch("/api/order.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nom: order.nom,
        email: order.email,
        telephone: order.telephone,
        pays: order.pays,
        ville: order.ville,
        adresse: order.adresse,
        complement: order.complement,
        livraison: order.livraison,
        paiement: order.paiement,
        reference: order.reference,
        items: order.items.map((item) => ({
          nom: item.produit.nom,
          format: item.produit.format,
          quantite: item.quantite,
          fcfa: item.produit.fcfa,
        })),
        subtotal: order.subtotal,
        frais: order.frais,
        total: order.total,
      }),
    });
    const delaiMinimum = new Promise((resolve) => window.setTimeout(resolve, 850));
    await Promise.allSettled([envoi, delaiMinimum]);

    try { window.localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order)); } catch { /* confirmation tout de même accessible */ }
    clear();
    setSubmitting(false);
    aller("/confirmation");
  };

  if (!items.length) return <><EntetePage surtitre="Commande" lignes={[<>Ton panier est</>, <span key="s" className="livre font-normal text-or">à compléter.</span>]} intro="Il n’y a encore aucune pièce à préparer." fil="#FFB000" /><Bloc className="champ"><PanierVide message="Ajoute au moins un ouvrage avant de commencer la commande." /></Bloc></>;

  return (
    <>
      <EntetePage surtitre="Atelier de commande" lignes={[<>On prépare</>, <span key="s" className="livre font-normal text-or">ton chemin.</span>]} intro="Un parcours simple, comme une fiche d’atelier : tes coordonnées, la livraison, puis une intention de paiement. Rien n’est débité." fil="#FFB000" />
      <Bloc numero="01" titre="Le parcours" fil="#FFB000" className="champ">
        <div className="checkout-mobile-summary">
          <button type="button" onClick={() => setOpenSummary((value) => !value)} aria-expanded={openSummary}><span><ShoppingBag size={16} /> Récapitulatif · {fcfa(total + frais)}</span><ChevronDown size={17} className={openSummary ? "rotate-180" : ""} /></button>
          {openSummary && <Summary items={items} subtotal={total} livraison={form.livraison} editable />}
        </div>
        <Stepper current={step} />
        <div className="checkout-layout">
          <form className="checkout-form" onSubmit={(event: FormEvent) => event.preventDefault()}>
            {step === "coordonnees" && <section className="checkout-panel" aria-labelledby="coordonnees-title"><div className="checkout-panel-heading"><span className="panel-kicker">Étape 01 · Coordonnées</span><h2 id="coordonnees-title">À qui l’atelier doit-il écrire&nbsp;?</h2><p>Ces informations servent uniquement à préparer la confirmation de commande simulée.</p></div><div className="checkout-fields"><Field label="Nom complet" name="nom" value={form.nom} onChange={(value) => update("nom", value)} error={errors.nom} placeholder="Nadine Zoro" autoComplete="name" /><Field label="Adresse email" name="email" value={form.email} onChange={(value) => update("email", value)} error={errors.email} type="email" placeholder="toi@exemple.com" autoComplete="email" /><Field label="Téléphone" name="telephone" value={form.telephone} onChange={(value) => update("telephone", value)} error={errors.telephone} type="tel" placeholder="+225 07 00 00 00 00" autoComplete="tel" /><label className="checkout-field"><span>Pays</span><select value={form.pays} onChange={(event) => update("pays", event.target.value)}><option>Côte d’Ivoire</option><option>Sénégal</option><option>France</option><option>Autre</option></select></label><Field label="Ville" name="ville" value={form.ville} onChange={(value) => update("ville", value)} error={errors.ville} placeholder="Abidjan" autoComplete="address-level2" /><label className="checkout-field checkout-field-wide"><span>Adresse ou point de retrait</span><textarea name="adresse" value={form.adresse} onChange={(event) => update("adresse", event.target.value)} aria-invalid={Boolean(errors.adresse)} placeholder="Quartier, rue, repère…" rows={3} autoComplete="street-address" />{errors.adresse && <small className="field-error"><AlertCircle size={13} /> {errors.adresse}</small>}</label><Field label="Complément (facultatif)" name="complement" value={form.complement} onChange={(value) => update("complement", value)} placeholder="Immeuble, étage, précision…" /></div><StepActions next={goNext} /></section>}
            {step === "livraison" && <section className="checkout-panel" aria-labelledby="livraison-title"><div className="checkout-panel-heading"><span className="panel-kicker">Étape 02 · Livraison</span><h2 id="livraison-title">Comment les pièces arrivent-elles&nbsp;?</h2><p>Les délais et frais ci-dessous sont une présentation front pour donner une forme au parcours.</p></div><div className="choice-list"><Choice name="livraison" value="standard" selected={form.livraison === "standard"} onChange={() => update("livraison", "standard")} title="Standard · 3 à 7 jours" description="Préparation douce, livraison offerte" price="Offerte" icon={<Package size={19} />} /><Choice name="livraison" value="express" selected={form.livraison === "express"} onChange={() => update("livraison", "express")} title="Express · 1 à 3 jours" description="Pour commencer sans attendre" price="2 500 FCFA" icon={<Truck size={19} />} /></div><div className="address-proof"><MapPin size={18} /><div><strong>{form.ville || "Ta ville"}</strong><span>{form.adresse || "L’adresse renseignée à l’étape précédente"}</span></div><button type="button" className="text-action" onClick={() => setStep("coordonnees")}>Modifier</button></div><StepActions back={() => setStep("coordonnees")} next={goNext} /></section>}
            {step === "paiement" && <section className="checkout-panel" aria-labelledby="paiement-title"><div className="checkout-panel-heading"><span className="panel-kicker">Étape 03 · Paiement simulé</span><h2 id="paiement-title">Comment souhaites-tu régler&nbsp;?</h2><p>Cette étape ne collecte aucune donnée bancaire. Elle montre simplement le futur choix de paiement.</p></div><div className="choice-list"><Choice name="paiement" value="mobile" selected={form.paiement === "mobile"} onChange={() => update("paiement", "mobile")} title="Mobile Money" description="Orange Money, MTN MoMo, Wave" price="À confirmer" icon={<CreditCard size={19} />} /><Choice name="paiement" value="virement" selected={form.paiement === "virement"} onChange={() => update("paiement", "virement")} title="Virement bancaire" description="Les coordonnées seraient envoyées par email" price="À confirmer" icon={<RefreshCcw size={19} />} /><Choice name="paiement" value="livraison" selected={form.paiement === "livraison"} onChange={() => update("paiement", "livraison")} title="À la livraison" description="Paiement remis au moment de la réception" price="À confirmer" icon={<Package size={19} />} /></div><div className="payment-safe"><LockKeyhole size={17} /><span>Aucun paiement réel n’est pris ici. Ta demande sera transmise à l’atelier, qui te recontactera pour finaliser le règlement.</span></div><StepActions back={() => setStep("livraison")} next={placeOrder} nextLabel={submitting ? "Préparation…" : "Valider la commande"} /></section>}
          </form>
          <div className="checkout-desktop-summary"><Summary items={items} subtotal={total} livraison={form.livraison} editable /></div>
        </div>
      </Bloc>
    </>
  );
}

export function ConfirmationPage() {
  const [order] = useState<OrderRecord | null>(() => {
    try { return JSON.parse(window.localStorage.getItem(LAST_ORDER_KEY) || "null") as OrderRecord | null; } catch { return null; }
  });

  if (!order) return <><EntetePage surtitre="Confirmation" lignes={[<>Aucune commande</>, <span key="s" className="livre font-normal text-or">à afficher.</span>]} intro="Le dernier récapitulatif n’est plus disponible sur cet appareil." fil="#FFB000" /><Bloc className="champ"><PanierVide message="Retourne dans la bibliothèque pour choisir une pièce." /></Bloc></>;

  const messageWhatsapp = [
    `Bonjour Nadine, je viens de passer la commande ${order.reference}.`,
    ``,
    ...order.items.map((item) => `• ${item.quantite} × ${item.produit.nom}`),
    ``,
    `Total : ${fcfa(order.total)}`,
    `Nom : ${order.nom}`,
    `Téléphone : ${order.telephone}`,
    `Ville : ${order.ville}`,
  ].join("\n");
  const lienWhatsapp = `https://wa.me/${marque.whatsapp}?text=${encodeURIComponent(messageWhatsapp)}`;

  return (
    <>
      <EntetePage surtitre="Commande préparée" lignes={[<>Ton chemin</>, <span key="s" className="livre font-normal text-or">peut commencer.</span>]} intro="Ta commande a été transmise à l’atelier par e-mail. Pour accélérer le traitement, tu peux aussi la confirmer directement sur WhatsApp." fil="#FFB000" />
      <Bloc numero="01" titre="Confirmation" fil="#FFB000" className="champ">
        <div className="confirmation-shell">
          <div className="confirmation-seal"><Icone nom="validation" taille={34} /></div>
          <p className="label">Demande enregistrée</p>
          <h2>Merci, {order.nom.split(" ")[0]}.</h2>
          <p className="confirmation-lead">Ta commande <strong>{order.reference}</strong> a bien été préparée dans ce prototype.</p>
          <div className="confirmation-meta"><div><span>Mail client</span><strong>{order.email}</strong></div><div><span>Livraison</span><strong>{order.ville} · {order.livraison === "express" ? "Express" : "Standard"}</strong></div><div><span>Total indicatif</span><strong>{fcfa(order.total)}</strong></div></div>
          <div className="confirmation-items"><p className="label">Pièces du chemin</p><ul>{order.items.map((item) => <li key={item.produit.slug}><span>{item.quantite} × {item.produit.nom}</span><strong>{fcfa(item.produit.fcfa * item.quantite)}</strong></li>)}</ul></div>
          <div className="confirmation-actions">
            <BoutonPeint href={lienWhatsapp} target="_blank" rel="noreferrer" variante="or" icone={<Icone nom="discussion" taille={16} />}>Confirmer sur WhatsApp</BoutonPeint>
            <BoutonPeint to="/bibliotheque" variante="craie" icone={<Icone nom="fleche-droite" taille={16} />}>Retour à la bibliothèque</BoutonPeint>
            <BoutonPeint to="/" variante="craie">Revenir à l’accueil</BoutonPeint>
          </div>
        </div>
      </Bloc>
    </>
  );
}
