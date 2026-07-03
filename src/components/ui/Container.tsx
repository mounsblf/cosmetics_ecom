import { cn } from "@/lib/utils";

/**
 * Conteneur centré à largeur maximale — garantit des marges cohérentes
 * sur tout le site (rythme « scandinave », beaucoup d'air).
 */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-6 md:px-10", className)}>
      {children}
    </div>
  );
}
