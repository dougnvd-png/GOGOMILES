'use client';

import { useTransition } from 'react';
import { Send } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { sendTestEmail } from '@/server/actions/email';

export const SendTestEmailButton = () => {
  const [isPending, startTransition] = useTransition();

  const handleSend = () => {
    startTransition(async () => {
      const result = await sendTestEmail();
      if (result.ok) {
        toast.success(result.message);
        return;
      }
      toast.error(result.error);
    });
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={handleSend}
    >
      <Send />
      {isPending ? 'Enviando…' : 'Enviar e-mail de teste'}
    </Button>
  );
};
