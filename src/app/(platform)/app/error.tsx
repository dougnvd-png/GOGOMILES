'use client';

import { useEffect } from 'react';
import { RotateCw, TriangleAlert } from 'lucide-react';

import { EmptyState } from '@/components/empty-state';
import { Button } from '@/components/ui/button';

interface PlatformErrorProps {
  error: unknown;
  retry: () => void;
}

export default function PlatformError({ error, retry }: PlatformErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="surface mx-auto mt-10 w-full max-w-lg">
      <EmptyState
        icon={TriangleAlert}
        title="Não foi possível carregar esta tela"
        description="Pode ser uma falha passageira. Tente de novo em alguns segundos."
        action={
          <Button type="button" variant="outline" onClick={retry}>
            <RotateCw />
            Tentar de novo
          </Button>
        }
      />
    </div>
  );
}
