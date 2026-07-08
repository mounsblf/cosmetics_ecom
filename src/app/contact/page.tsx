import type { Metadata } from "next";
import { TextPage } from "@/components/ui/TextPage";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez l'équipe Nūr : questions, commandes, partenariats.",
};

export default function ContactPage() {
  return (
    <TextPage eyebrow="Contact" title="Écrivez-nous">
      <p>
        Une question sur un produit, une commande ou un partenariat ? Nous
        répondons sous 24 à 48 h ouvrées.
      </p>
      <h2>Par e-mail</h2>
      <p>
        <a href="mailto:mounir.boulifa1@gmail.com">mounir.boulifa1@gmail.com</a>
      </p>
      <h2>Suivi de commande</h2>
      <p>
        Indiquez la référence de votre commande (présente dans votre e-mail de
        confirmation) pour un traitement plus rapide.
      </p>
    </TextPage>
  );
}
