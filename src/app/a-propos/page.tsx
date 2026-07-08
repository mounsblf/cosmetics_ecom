import type { Metadata } from "next";
import { TextPage } from "@/components/ui/TextPage";

export const metadata: Metadata = {
  title: "La Maison",
  description:
    "L'histoire de Nūr : des cosmétiques naturels d'inspiration marocaine, entre tradition et minimalisme.",
};

export default function AProposPage() {
  return (
    <TextPage eyebrow="La Maison" title="Notre histoire">
      <p>
        <strong>Nūr</strong> — « lumière » en arabe — est née d&apos;une
        conviction simple : les rituels de beauté marocains, transmis de
        génération en génération, n&apos;ont rien à envier aux cosmétiques
        modernes. Ils demandent seulement d&apos;être présentés avec la
        sobriété qu&apos;ils méritent.
      </p>
      <p>
        Nous puisons dans les trésors du Maroc — l&apos;huile d&apos;argan
        pressée à froid, le ghassoul de l&apos;Atlas, l&apos;eau de rose de la
        vallée du Dadès, la figue de barbarie du Sud — et nous les travaillons
        en formules courtes, naturelles et sensorielles.
      </p>
      <h2>Nos engagements</h2>
      <ul>
        <li>Des ingrédients naturels, sélectionnés avec exigence.</li>
        <li>Une fabrication artisanale et responsable au Maroc.</li>
        <li>Des formules courtes, sans superflu.</li>
        <li>Un packaging sobre, pensé pour durer.</li>
      </ul>
      <h2>Le rituel avant tout</h2>
      <p>
        Chaque produit est pensé comme une étape d&apos;un rituel : purifier,
        tonifier, nourrir. Nos coffrets Petit, Moyen et Grand composent ces
        rituels pour vous, du format découverte à l&apos;expérience intégrale.
      </p>
    </TextPage>
  );
}
