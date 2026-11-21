import 'server-only';

import { revalidatePath } from 'next/cache';
import type { z } from 'zod';

import { platformHome } from '@/config/navigation';
import { failed, type ActionResult } from '@/lib/result';
import { currentUserId } from '@/server/auth';

interface OwnerActionOptions {
  /** Texto fixo para entrada inválida. Sem ele, a pessoa vê a primeira mensagem do schema. */
  invalidMessage?: string;
}

/**
 * Caminho único das ações do servidor: exige usuário, valida a entrada e
 * entrega ao handler somente dados já validados e o id do dono.
 * Erros inesperados viram uma mensagem genérica, sem detalhe interno.
 */
export const ownerAction =
  <Schema extends z.ZodType>(
    schema: Schema,
    handler: (
      input: z.output<Schema>,
      ownerId: string,
    ) => Promise<ActionResult>,
    { invalidMessage }: OwnerActionOptions = {},
  ) =>
  async (input: unknown): Promise<ActionResult> => {
    const ownerId = await currentUserId();
    if (!ownerId) {
      return failed('Entre na sua conta para continuar.');
    }
    const parsed = schema.safeParse(input);
    if (!parsed.success) {
      return failed(invalidMessage ?? parsed.error.issues[0].message);
    }
    try {
      const result = await handler(parsed.data, ownerId);
      if (result.ok) {
        revalidatePath(platformHome, 'layout');
      }
      return result;
    } catch (error) {
      console.error(
        'Ação do servidor falhou:',
        error instanceof Error ? error.name : 'erro desconhecido',
      );
      return failed('Não foi possível concluir agora. Tente novamente.');
    }
  };
