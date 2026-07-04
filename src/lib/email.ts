import { Resend } from "resend";
import { formatPrice } from "./format";

/**
 * Envoi d'emails transactionnels via Resend.
 * Les échecs sont journalisés mais ne remontent JAMAIS d'erreur :
 * un email raté ne doit pas faire échouer le traitement d'une commande.
 */

let _resend: Resend | null = null;
function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!_resend) _resend = new Resend(key);
  return _resend;
}

const FROM = process.env.EMAIL_FROM || "Nūr <onboarding@resend.dev>";
const OWNER_EMAIL = process.env.OWNER_EMAIL || "";

export interface OrderEmailData {
  id: string;
  customerEmail: string;
  amountTotal: number;
  items: Array<{ name: string; quantity: number; unitPrice: number }>;
}

function itemsRows(items: OrderEmailData["items"]): string {
  return items
    .map(
      (i) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #eee;color:#1A1A1A;">
          ${i.name} <span style="color:#999;">×${i.quantity}</span>
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #eee;text-align:right;color:#1A1A1A;">
          ${formatPrice(i.unitPrice * i.quantity)}
        </td>
      </tr>`,
    )
    .join("");
}

function shell(title: string, inner: string): string {
  return `
  <div style="background:#FBF9F6;padding:32px 0;font-family:Helvetica,Arial,sans-serif;">
    <div style="max-width:520px;margin:0 auto;background:#fff;border:1px solid #eee;border-radius:16px;overflow:hidden;">
      <div style="padding:28px 32px;border-bottom:1px solid #eee;">
        <span style="font-size:22px;color:#1A1A1A;">Nūr</span>
        <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#D4AF37;margin-left:4px;vertical-align:middle;"></span>
      </div>
      <div style="padding:32px;">
        <h1 style="margin:0 0 16px;font-size:22px;color:#1A1A1A;font-weight:normal;">${title}</h1>
        ${inner}
      </div>
      <div style="padding:20px 32px;background:#3B4436;color:#FBF9F6;font-size:12px;">
        Fait avec soin au Maroc · Nūr
      </div>
    </div>
  </div>`;
}

function summaryTable(order: OrderEmailData): string {
  return `
    <table style="width:100%;border-collapse:collapse;margin:8px 0 4px;">
      ${itemsRows(order.items)}
      <tr>
        <td style="padding:14px 0 0;font-weight:bold;color:#1A1A1A;">Total</td>
        <td style="padding:14px 0 0;text-align:right;font-weight:bold;color:#1A1A1A;">
          ${formatPrice(order.amountTotal)}
        </td>
      </tr>
    </table>
    <p style="color:#999;font-size:13px;margin-top:6px;">Livraison offerte</p>`;
}

/** Envoie la confirmation au client + la notification au propriétaire. */
export async function sendOrderEmails(order: OrderEmailData): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.warn("[email] RESEND_API_KEY absent — emails non envoyés");
    return;
  }

  // 1) Confirmation client
  if (order.customerEmail) {
    try {
      await resend.emails.send({
        from: FROM,
        to: order.customerEmail,
        subject: "Merci pour votre commande — Nūr",
        html: shell(
          "Merci pour votre commande",
          `<p style="color:#555;line-height:1.6;">
             Nous avons bien reçu votre commande et votre paiement.
             Vous recevrez un e-mail dès son expédition.
           </p>
           ${summaryTable(order)}
           <p style="color:#999;font-size:12px;margin-top:20px;">Référence : ${order.id}</p>`,
        ),
      });
    } catch (e) {
      console.error("[email] échec confirmation client", e);
    }
  }

  // 2) Notification propriétaire
  if (OWNER_EMAIL) {
    try {
      await resend.emails.send({
        from: FROM,
        to: OWNER_EMAIL,
        subject: `Nouvelle commande — ${formatPrice(order.amountTotal)}`,
        html: shell(
          "Nouvelle commande",
          `<p style="color:#555;line-height:1.6;">
             Client : <strong>${order.customerEmail || "—"}</strong>
           </p>
           ${summaryTable(order)}
           <p style="color:#999;font-size:12px;margin-top:20px;">Référence : ${order.id}</p>`,
        ),
      });
    } catch (e) {
      console.error("[email] échec notification propriétaire", e);
    }
  }
}
