import { Resend } from "resend";

export interface PasswordResetEmailPayload {
  to: string;
  name?: string | null;
  resetLink: string;
}

function buildHtml(payload: PasswordResetEmailPayload) {
  const appName = "Cipherion";
  const name = payload.name || "";
  const resetLink = payload.resetLink;

  return `
  <html>
    <body style="font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color: #111827;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
              <tr>
                <td style="padding:24px;background:#111827;color:#fff;text-align:center;">
                  <h1 style="margin:0;font-size:20px;">${appName}</h1>
                </td>
              </tr>
              <tr>
                <td style="padding:24px;">
                  <p>Hi ${name},</p>
                  <p>We received a request to reset your password. Click the button below to choose a new password. This link will expire in 1 hour.</p>
                  <p style="text-align:center;margin:24px 0;">
                    <a href="${resetLink}" style="background:#111827;color:#fff;text-decoration:none;padding:12px 20px;border-radius:6px;display:inline-block;">Reset your password</a>
                  </p>
                  <p>If the button above does not work, copy and paste the following URL into your browser:</p>
                  <p style="word-break:break-all;color:#6b7280">${resetLink}</p>
                  <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;"/>
                  <p style="font-size:13px;color:#6b7280">If you did not request a password reset, you can safely ignore this email. If you believe an account has been compromised, contact support.</p>
                </td>
              </tr>
              <tr>
                <td style="padding:12px 24px;background:#f9fafb;color:#6b7280;font-size:12px;text-align:center;">© ${new Date().getFullYear()} ${appName}. All rights reserved.</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
}

export async function sendPasswordResetEmail(payload: PasswordResetEmailPayload): Promise<void> {
  // In tests, noop (tests mock this module as well)
  if (process.env.NODE_ENV === "test") {
    return;
  }

  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.info(`[email-service] Password reset for ${payload.to}: ${payload.resetLink}`);
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    // eslint-disable-next-line no-console
    console.warn("[email-service] Mailer not configured: RESEND_API_KEY or EMAIL_FROM missing");
    return;
  }

  try {
    const resend = new Resend(apiKey);

    const html = buildHtml(payload);

    await resend.emails.send({
      from,
      to: payload.to,
      subject: "Cipherion — Reset your password",
      html,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[email-service] Failed to send password reset email", err);
  }
}
