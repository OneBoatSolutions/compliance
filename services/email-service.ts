export interface PasswordResetEmailPayload {
  to: string;
  name: string;
  resetLink: string;
}

export async function sendPasswordResetEmail(payload: PasswordResetEmailPayload): Promise<void> {
  if (process.env.NODE_ENV === "test") {
    return;
  }

  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.info(`[email-service] Password reset for ${payload.to}: ${payload.resetLink}`);
    return;
  }

  // Production: integrate with configured mailer when available.
}
