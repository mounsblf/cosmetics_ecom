import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { ArchMotif } from "@/components/decor/ArchMotif";

const COFFRETS = [
  {
    size: "Petit",
    tagline: "Le coffret découverte",
    description: "Une sélection essentielle pour s'initier au rituel.",
    price: "dès 32 €",
    tint: "bg-terracotta/15 text-terracotta",
  },
  {
    size: "Moyen",
    tagline: "Le coffret signature",
    description: "L'équilibre parfait pour une routine complète.",
    price: "dès 55 €",
    tint: "bg-olive/12 text-olive",
  },
  {
    size: "Grand",
    tagline: "Le coffret prestige",
    description: "L'expérience intégrale, à offrir ou à s'offrir.",
    price: "dès 89 €",
    tint: "bg-gold/15 text-[#a9852a]",
  },
];

const VALUES = [
  {
    title: "100 % naturel",
    text: "Des formules propres, sans ingrédients superflus.",
    icon: (
      <path d="M12 21c5-2 8-6 8-11V5l-8-2-8 2v5c0 5 3 9 8 11Z M9 12l2 2 4-4" />
    ),
  },
  {
    title: "Argan & Ghassoul",
    text: "Des trésors marocains sélectionnés avec exigence.",
    icon: <path d="M12 3c3 4 5 7 5 10a5 5 0 1 1-10 0c0-3 2-6 5-10Z" />,
  },
  {
    title: "Fait au Maroc",
    text: "Une fabrication locale, artisanale et responsable.",
    icon: (
      <path d="M4 20h16 M6 20V9l6-4 6 4v11 M10 20v-5h4v5" />
    ),
  },
];

export default function Home() {
  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden">
        <ArchMotif className="pointer-events-none absolute -right-10 top-4 h-[110%] w-auto text-terracotta/20 md:right-10" />
        <Container className="relative py-24 md:py-32">
          <div className="max-w-2xl">
            <p className="eyebrow text-terracotta">Cosmétiques naturels · Maroc</p>
            <h1 className="mt-6 text-5xl leading-[1.05] text-charcoal md:text-7xl">
              La beauté,
              <br />à l&apos;état naturel.
            </h1>
            <p className="mt-7 max-w-lg text-lg leading-relaxed text-charcoal/70">
              Des soins sensoriels puisés dans les richesses du Maroc — argan,
              ghassoul et plantes — pensés avec la sobriété d&apos;un rituel
              essentiel.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <ButtonLink href="/produits" size="lg">
                Découvrir la boutique
              </ButtonLink>
              <ButtonLink href="/coffrets" size="lg" variant="secondary">
                Nos coffrets
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      {/* ---------------- Coffrets ---------------- */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="flex flex-col items-end justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow text-olive">Nos coffrets</p>
              <h2 className="mt-4 text-4xl text-charcoal md:text-5xl">
                Trois formats, un même rituel
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-charcoal/60">
              Des sélections composées avec soin, du format découverte au
              coffret prestige.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {COFFRETS.map((c) => (
              <article
                key={c.size}
                className="group flex flex-col overflow-hidden rounded-2xl border border-charcoal/10 bg-white transition-colors hover:border-charcoal/25"
              >
                <div
                  className={`relative flex aspect-[4/5] items-center justify-center ${c.tint}`}
                >
                  <ArchMotif className="h-2/3 w-auto opacity-40" />
                  <span className="eyebrow absolute left-5 top-5 font-sans">
                    {c.size}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-2xl text-charcoal">{c.tagline}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal/60">
                    {c.description}
                  </p>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-sm font-medium text-charcoal">
                      {c.price}
                    </span>
                    <span className="text-sm text-olive transition-transform group-hover:translate-x-1">
                      Découvrir →
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------- Valeurs ---------------- */}
      <section className="border-y border-charcoal/10 bg-white/50 py-20 md:py-24">
        <Container>
          <div className="grid gap-12 md:grid-cols-3">
            {VALUES.map((v) => (
              <div key={v.title} className="flex flex-col items-start">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 text-olive"
                  aria-hidden="true"
                >
                  {v.icon}
                </svg>
                <h3 className="mt-5 text-xl text-charcoal">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/60">
                  {v.text}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------- Bandeau CTA ---------------- */}
      <section className="py-24 md:py-32">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <span className="mx-auto mb-8 block h-10 w-px bg-gold" />
            <h2 className="text-4xl text-charcoal md:text-5xl">
              Un rituel qui vous ressemble
            </h2>
            <p className="mx-auto mt-5 max-w-md text-charcoal/70">
              Composez votre routine parmi nos soins à l&apos;unité ou laissez-vous
              guider par un coffret.
            </p>
            <div className="mt-9">
              <ButtonLink href="/produits" size="lg">
                Explorer les soins
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
