import { Container } from "./Container";

/**
 * Gabarit des pages de contenu (légales, à propos…).
 * Style typographique appliqué aux balises enfants via des sélecteurs.
 */
export function TextPage({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Container className="py-14 md:py-20">
      <header className="max-w-2xl">
        {eyebrow && <p className="eyebrow text-terracotta">{eyebrow}</p>}
        <h1 className="mt-4 text-4xl text-charcoal md:text-5xl">{title}</h1>
      </header>
      <div
        className="mt-10 max-w-2xl space-y-4 leading-relaxed text-charcoal/75
          [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-charcoal
          [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-medium [&_h3]:text-charcoal
          [&_a]:text-olive [&_a]:underline [&_a]:underline-offset-4
          [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1
          [&_strong]:text-charcoal"
      >
        {children}
      </div>
    </Container>
  );
}
