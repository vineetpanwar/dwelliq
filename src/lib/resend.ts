import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY!);

export const FROM_EMAIL = "Dwelliq <alerts@dwelliq.co>";

export function buildWelcomeEmail(email: string) {
  const html = `
    <div style="font-family: 'Georgia', serif; max-width: 540px; margin: 0 auto; padding: 40px 24px; background: #FDFAF6; color: #0A0908;">
      <p style="font-size: 11px; font-family: monospace; letter-spacing: 0.15em; text-transform: uppercase; color: #C9974A; margin: 0 0 24px;">dwelliq · price alerts</p>
      <h1 style="font-size: 36px; font-weight: 300; line-height: 1.15; margin: 0 0 16px;">You're on the list.</h1>
      <p style="font-size: 15px; color: #5C5550; line-height: 1.7; margin: 0 0 24px;">
        We'll notify you the moment any of your recommended pieces drops in price or goes out of stock — before anyone else.
      </p>
      <div style="border-top: 1px solid #CCC8C0; margin: 32px 0; padding-top: 24px;">
        <p style="font-size: 12px; color: #5C5550; margin: 0;">
          You signed up at <a href="https://dwelliq.co" style="color: #C9974A;">dwelliq.co</a>.
          To unsubscribe, reply to this email with "unsubscribe".
        </p>
      </div>
    </div>
  `;
  return { to: email, subject: "You're on the Dwelliq price alert list", html };
}
