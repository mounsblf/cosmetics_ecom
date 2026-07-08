import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/adminAuth";

/** Toutes les pages sous /admin (hors /admin/login) exigent une session valide. */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = await cookies();
  if (!verifySessionToken(store.get(ADMIN_COOKIE)?.value)) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-[70vh]">
      <div className="border-b border-charcoal/10 bg-white/60">
        <Container className="flex h-12 items-center gap-6 text-sm">
          <span className="eyebrow text-olive">Admin</span>
          <Link href="/admin" className="text-charcoal/70 hover:text-charcoal">
            Commandes
          </Link>
          <Link
            href="/admin/produits"
            className="text-charcoal/70 hover:text-charcoal"
          >
            Produits
          </Link>
          <a
            href="/api/admin/logout"
            className="ml-auto text-charcoal/50 hover:text-terracotta"
          >
            Déconnexion
          </a>
        </Container>
      </div>
      {children}
    </div>
  );
}
