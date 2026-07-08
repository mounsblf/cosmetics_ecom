import type { Metadata } from "next";
import { TextPage } from "@/components/ui/TextPage";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
  description: "Conditions générales de vente de la boutique Nūr.",
};

export default function CgvPage() {
  return (
    <TextPage eyebrow="Informations" title="Conditions générales de vente">
      <p>
        <em>
          Version du 4 juillet 2026 — document à compléter avec les
          informations légales de la société avant le lancement commercial.
        </em>
      </p>

      <h2>Article 1 — Objet</h2>
      <p>
        Les présentes conditions régissent les ventes conclues sur le site
        Nūr (ci-après « le Site ») entre [Nom de la société / de
        l&apos;auto-entrepreneur] (ci-après « le Vendeur ») et toute personne
        effectuant un achat (ci-après « le Client »).
      </p>

      <h2>Article 2 — Produits</h2>
      <p>
        Les produits proposés sont des cosmétiques naturels présentés sur le
        Site avec leur descriptif et leur prix. Les photographies et visuels
        n&apos;ont pas de valeur contractuelle.
      </p>

      <h2>Article 3 — Prix</h2>
      <p>
        Les prix sont indiqués en euros, toutes taxes comprises (TTC), hors
        éventuels frais de livraison indiqués avant validation. Le Vendeur se
        réserve le droit de modifier ses prix à tout moment ; les produits
        sont facturés au tarif en vigueur au moment de la commande.
      </p>

      <h2>Article 4 — Commande et paiement</h2>
      <p>
        Le paiement s&apos;effectue en ligne par carte bancaire via la
        plateforme sécurisée <strong>Stripe</strong>. Aucune donnée bancaire
        n&apos;est collectée ni conservée par le Site. La commande est
        considérée comme définitive après confirmation du paiement.
      </p>

      <h2>Article 5 — Livraison</h2>
      <p>
        Les livraisons sont effectuées dans l&apos;Union européenne, à
        l&apos;adresse indiquée lors de la commande. Voir la page{" "}
        <a href="/livraison">Livraison & retours</a> pour les délais.
      </p>

      <h2>Article 6 — Droit de rétractation</h2>
      <p>
        Le Client dispose d&apos;un délai de 14 jours à compter de la
        réception pour se rétracter, pour tout produit non ouvert et non
        utilisé. Les frais de retour restent à la charge du Client. Le
        remboursement intervient sous 14 jours après réception du retour.
      </p>

      <h2>Article 7 — Garanties</h2>
      <p>
        Les produits bénéficient des garanties légales de conformité et des
        vices cachés prévues par le droit applicable.
      </p>

      <h2>Article 8 — Données personnelles</h2>
      <p>
        Les données collectées sont traitées conformément à la{" "}
        <a href="/confidentialite">politique de confidentialité</a>.
      </p>

      <h2>Article 9 — Droit applicable</h2>
      <p>
        Les présentes conditions sont soumises au droit français. En cas de
        litige, une solution amiable sera recherchée avant toute action
        judiciaire.
      </p>
    </TextPage>
  );
}
