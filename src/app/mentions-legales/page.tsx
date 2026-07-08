import type { Metadata } from "next";
import { TextPage } from "@/components/ui/TextPage";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site Nūr.",
};

export default function MentionsLegalesPage() {
  return (
    <TextPage eyebrow="Informations" title="Mentions légales">
      <p>
        <em>
          Document à compléter avec les informations légales définitives
          avant le lancement commercial.
        </em>
      </p>

      <h2>Éditeur du site</h2>
      <p>
        [Nom de la société ou de l&apos;auto-entrepreneur]
        <br />
        [Adresse]
        <br />
        [N° SIRET / RCS]
        <br />
        Contact :{" "}
        <a href="mailto:mounir.boulifa1@gmail.com">mounir.boulifa1@gmail.com</a>
      </p>

      <h2>Directeur de la publication</h2>
      <p>[Nom du responsable]</p>

      <h2>Hébergement</h2>
      <p>
        Vercel Inc. — 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis —{" "}
        <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">
          vercel.com
        </a>
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L&apos;ensemble des contenus du site (textes, visuels, logo) est la
        propriété exclusive de l&apos;éditeur. Toute reproduction sans
        autorisation préalable est interdite.
      </p>
    </TextPage>
  );
}
