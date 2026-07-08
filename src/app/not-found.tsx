import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { ArchMotif } from "@/components/decor/ArchMotif";

export default function NotFound() {
  return (
    <Container className="py-28 text-center">
      <ArchMotif className="mx-auto h-16 w-auto text-terracotta/50" />
      <p className="eyebrow mt-8 text-terracotta">Erreur 404</p>
      <h1 className="mt-4 text-4xl text-charcoal md:text-5xl">
        Cette page n&apos;existe pas
      </h1>
      <p className="mx-auto mt-5 max-w-sm text-charcoal/60">
        Le lien est peut-être erroné, ou la page a été déplacée.
      </p>
      <div className="mt-9 flex justify-center gap-4">
        <ButtonLink href="/">Retour à l&apos;accueil</ButtonLink>
        <ButtonLink href="/produits" variant="secondary">
          Voir la boutique
        </ButtonLink>
      </div>
    </Container>
  );
}
