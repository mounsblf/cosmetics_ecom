/**
 * Envoie un email de test via sendOrderEmails (confirmation + notif proprio).
 * Le client de test = OWNER_EMAIL, pour que `onboarding@resend.dev` puisse livrer.
 *
 * Lancer : npm run test:email
 */
import { sendOrderEmails } from "../src/lib/email";

async function main() {
  const owner = process.env.OWNER_EMAIL;
  if (!process.env.RESEND_API_KEY) {
    console.error("❌ RESEND_API_KEY absent de .env.local");
    process.exit(1);
  }
  if (!owner) {
    console.error("❌ OWNER_EMAIL absent de .env.local");
    process.exit(1);
  }

  console.log(`→ Envoi d'un email de test à ${owner}…`);
  await sendOrderEmails({
    id: "test-" + Date.now(),
    customerEmail: owner, // pour que onboarding@resend.dev puisse livrer
    amountTotal: 87,
    items: [
      { name: "Huile d'Argan Pure", quantity: 1, unitPrice: 24 },
      { name: "Coffret Signature", quantity: 1, unitPrice: 55 },
      { name: "Baume à Lèvres Argan & Miel", quantity: 1, unitPrice: 8 },
    ],
  });
  console.log(
    "✅ Terminé. Vérifie ta boîte mail (et le dossier spam). " +
      "Si une erreur Resend est apparue ci-dessus, dis-le-moi.",
  );
  process.exit(0);
}

main();
