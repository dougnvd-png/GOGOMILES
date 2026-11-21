'use server';

import { currentUser } from '@clerk/nextjs/server';

import { appConfig } from '@/config/app';
import { isAuthConfigured } from '@/lib/env';
import { failed, succeeded, type ActionResult } from '@/lib/result';
import { currentUserId } from '@/server/auth';
import { messageEmail, sendEmail } from '@/server/email';
import { allowAttempt } from '@/server/rate-limit';

const testEmailLimit = 3;
const testEmailWindowMs = 10 * 60 * 1000;

const recipientAddress = async () => {
  if (!isAuthConfigured()) {
    return appConfig.contactEmail;
  }
  const user = await currentUser();
  return user?.primaryEmailAddress?.emailAddress ?? '';
};

export const sendTestEmail = async (): Promise<ActionResult> => {
  const userId = await currentUserId();
  if (!userId) {
    return failed('Entre na sua conta para continuar.');
  }
  if (!allowAttempt(`test-email:${userId}`, testEmailLimit, testEmailWindowMs)) {
    return failed('Muitos testes seguidos. Aguarde alguns minutos.');
  }
  const to = await recipientAddress();
  if (!to) {
    return failed(
      'Defina contactEmail em src/config/app.ts ou entre com uma conta.',
    );
  }
  const result = await sendEmail({
    to,
    subject: `Teste de e-mail de ${appConfig.name}`,
    html: messageEmail(
      'Seu e-mail está funcionando',
      'Esta é uma mensagem de teste enviada pelo painel de configurações.',
    ),
  });
  if (!result.sent) {
    return failed(
      result.reason === 'not_configured'
        ? 'Configure a chave do Resend para enviar e-mails.'
        : 'O envio falhou. Confira a chave e o remetente no Resend.',
    );
  }
  return succeeded('E-mail de teste enviado para o seu endereço.');
};
