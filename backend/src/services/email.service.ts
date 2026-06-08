import { logger } from '../config/logger';

export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export class EmailService {
  async send(msg: EmailMessage): Promise<void> {
    // Stub: wire to SendGrid / Resend / SMTP in production
    logger.info({ to: msg.to, subject: msg.subject }, 'Email sent (stub)');
  }

  async sendPasswordReset(to: string, token: string): Promise<void> {
    const link = `${process.env.FRONTEND_URL ?? 'http://localhost:5173'}/reset-password?token=${token}`;
    await this.send({
      to,
      subject: 'Reset your RoyaltyFlux password',
      text: `Click the link to reset your password: ${link}`,
      html: `<p>Click <a href="${link}">here</a> to reset your password. Link expires in 1 hour.</p>`,
    });
  }
}

export const emailService = new EmailService();
