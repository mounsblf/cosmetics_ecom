import type { Metadata } from "next";
import { TextPage } from "@/components/ui/TextPage";

export const metadata: Metadata = {
  title: "Livraison & retours",
  description:
    "Livraison offerte dans l'Union européenne. Délais, suivi et retours.",
};

export default function LivraisonPage() {
  return (
    <TextPage eyebrow="Informations" title="Livraison & retours">
      <h2>Zones desservies</h2>
      <p>
        Nous livrons dans toute l&apos;<strong>Union européenne</strong>. La
        livraison est <strong>offerte</strong>, sans minimum d&apos;achat.
      </p>
      <h2>Délais indicatifs</h2>
      <ul>
        <li>Préparation de commande : 1 à 2 jours ouvrés.</li>
        <li>Livraison France métropolitaine : 2 à 4 jours ouvrés.</li>
        <li>Livraison reste de l&apos;UE : 3 à 7 jours ouvrés.</li>
      </ul>
      <h2>Droit de rétractation</h2>
      <p>
        Conformément au droit de l&apos;UE, vous disposez de{" "}
        <strong>14 jours</strong> à compter de la réception pour exercer votre
        droit de rétractation, pour tout produit non ouvert et non utilisé
        (hygiène oblige pour les cosmétiques). Contactez-nous avant tout
        renvoi : voir la page <a href="/contact">Contact</a>.
      </p>
      <h2>Produit endommagé</h2>
      <p>
        Si votre colis arrive endommagé, envoyez-nous une photo sous 48 h :
        nous vous renverrons le produit ou vous rembourserons intégralement.
      </p>
    </TextPage>
  );
}
