import type { Metadata } from "next";
import { TextPage } from "@/components/ui/TextPage";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Comment Nūr collecte et protège vos données personnelles (RGPD).",
};

export default function ConfidentialitePage() {
  return (
    <TextPage eyebrow="Informations" title="Politique de confidentialité">
      <p>
        Nous collectons le strict nécessaire pour traiter vos commandes, dans
        le respect du Règlement général sur la protection des données (RGPD).
      </p>

      <h2>Données collectées</h2>
      <ul>
        <li>
          <strong>Commande</strong> : e-mail, adresse de livraison, articles
          commandés et montant — nécessaires à l&apos;exécution du contrat.
        </li>
        <li>
          <strong>Paiement</strong> : traité exclusivement par Stripe ; aucune
          donnée bancaire ne transite par notre site.
        </li>
        <li>
          <strong>Panier</strong> : stocké localement dans votre navigateur
          (localStorage), jamais transmis à des tiers.
        </li>
      </ul>

      <h2>Sous-traitants</h2>
      <ul>
        <li>Stripe (paiement sécurisé) — États-Unis / UE.</li>
        <li>MongoDB Atlas (base de données) — hébergement UE possible.</li>
        <li>Resend (envoi d&apos;e-mails transactionnels).</li>
        <li>Vercel (hébergement du site).</li>
      </ul>

      <h2>Durée de conservation</h2>
      <p>
        Les données de commande sont conservées pendant la durée légale
        applicable aux documents commerciaux et comptables.
      </p>

      <h2>Vos droits</h2>
      <p>
        Vous disposez d&apos;un droit d&apos;accès, de rectification, de
        suppression et de portabilité de vos données. Pour l&apos;exercer,
        contactez-nous :{" "}
        <a href="mailto:mounir.boulifa1@gmail.com">mounir.boulifa1@gmail.com</a>.
      </p>

      <h2>Cookies</h2>
      <p>
        Le site n&apos;utilise pas de cookies publicitaires ni de traceurs
        tiers. Seuls des cookies techniques strictement nécessaires au
        fonctionnement (session administrateur) sont utilisés.
      </p>
    </TextPage>
  );
}
