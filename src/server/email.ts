import 'server-only';

import { Resend } from 'resend';

import { appConfig } from '@/config/app';
import { env } from '@/lib/env';

interface EmailMessage {
  to: string;
  subject: string;
  html: string;
}

const defaultSender = 'onboarding@resend.dev';

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

export const sendEmail = async ({ to, subject, html }: EmailMessage) => {
  if (!env.RESEND_API_KEY) {
    return { sent: false as const, reason: 'not_configured' as const };
  }
  const resend = new Resend(env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: `${appConfig.name} <${env.EMAIL_FROM ?? defaultSender}>`,
    to,
    subject,
    html,
  });
  return error
    ? { sent: false as const, reason: 'failed' as const }
    : { sent: true as const };
};

export const messageEmail = (title: string, body: string) => `
  <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; color: #111827;">
    <p style="font-size: 14px; color: #6b7280; margin: 0 0 16px;">${escapeHtml(appConfig.name)}</p>
    <h1 style="font-size: 22px; margin: 0 0 12px;">${escapeHtml(title)}</h1>
    <p style="font-size: 16px; line-height: 1.6; margin: 0;">${escapeHtml(body)}</p>
  </div>
`;
