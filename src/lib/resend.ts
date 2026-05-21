import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY!);

export const FROM_EMAIL = "Dwelliq <alerts@dwelliq.co>";
const BASE = "https://dwelliq-ten.vercel.app";

export function buildWelcomeEmail(email: string, unsubscribeUrl: string) {
  const html = `
    <div style="font-family: 'Georgia', serif; max-width: 540px; margin: 0 auto; padding: 40px 24px; background: #FDFAF6; color: #0A0908;">
      <p style="font-size: 11px; font-family: monospace; letter-spacing: 0.15em; text-transform: uppercase; color: #C9974A; margin: 0 0 24px;">dwelliq · price alerts</p>
      <h1 style="font-size: 36px; font-weight: 300; line-height: 1.15; margin: 0 0 16px;">You're on the list.</h1>
      <p style="font-size: 15px; color: #5C5550; line-height: 1.7; margin: 0 0 24px;">
        We'll notify you the moment any of your recommended pieces drops in price or goes out of stock — before anyone else.
      </p>
      <a href="${BASE}/design" style="display:inline-block;background:#C9974A;color:#1C1C1C;text-decoration:none;padding:14px 28px;border-radius:12px;font-size:14px;font-weight:600;margin-bottom:32px;">
        Start designing →
      </a>
      <div style="border-top: 1px solid #CCC8C0; margin: 32px 0 0; padding-top: 20px;">
        <p style="font-size: 11px; color: #9C948C; margin: 0; line-height: 1.6;">
          You signed up at <a href="${BASE}" style="color: #C9974A;">dwelliq.co</a>.
          &nbsp;·&nbsp;
          <a href="${unsubscribeUrl}" style="color: #9C948C;">Unsubscribe</a>
        </p>
      </div>
    </div>
  `;

  return {
    to: email,
    subject: "You're on the Dwelliq price alert list",
    html,
    headers: {
      "List-Unsubscribe":      `<${unsubscribeUrl}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  };
}
