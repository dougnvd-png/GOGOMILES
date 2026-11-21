import { z } from 'zod';

import { formatNumber } from '@/lib/format';

/**
 * Situação de uma oferta. As chaves seguem as cores de situação do design
 * system: open = nova, in_progress = em análise, done = emitida.
 */
export const offerStatuses = ['open', 'in_progress', 'done'] as const;
export type OfferStatus = (typeof offerStatuses)[number];

export const offerStatusLabels: Record<OfferStatus, string> = {
  open: 'Nova',
  in_progress: 'Em análise',
  done: 'Emitida',
};

export const offerPrograms = [
  'Smiles',
  'LATAM Pass',
  'Azul Fidelidade',
  'TAP Miles&Go',
  'Outro',
] as const;
export type OfferProgram = (typeof offerPrograms)[number];

export const offerCabins = ['Econômica', 'Premium Economy', 'Executiva'] as const;
export type OfferCabin = (typeof offerCabins)[number];

export interface Offer {
  id: string;
  status: OfferStatus;
  origin: string;
  destination: string;
  program: string;
  cabin: string;
  /** Data da ida no formato AAAA-MM-DD, ou null quando as datas são flexíveis. */
  departDate: string | null;
  /** Data da volta no formato AAAA-MM-DD, ou null para só ida. */
  returnDate: string | null;
  miles: number;
  /** Taxas e impostos em centavos de real. */
  taxesCents: number;
  /** Endereço do site onde resgatar, ou null. */
  link: string | null;
  notes: string | null;
  /** Momento em que a situação passou a emitida, ou null enquanto não emitida. */
  issuedAt: string | null;
  createdAt: string;
}

export const offerPlaceMaxLength = 60;
export const offerNotesMaxLength = 300;
export const offerLinkMaxLength = 500;
export const offerMaxMiles = 2_000_000;
export const offerMaxTaxesCents = 10_000_000;

const place = (message: string) =>
  z
    .string()
    .trim()
    .min(2, message)
    .max(offerPlaceMaxLength, `Use até ${offerPlaceMaxLength} caracteres.`);

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Use até ${max} caracteres.`)
    .nullable()
    .transform((value) => (value ? value : null));

export const createOfferSchema = z
  .strictObject({
    origin: place('Escreva a origem. Ex.: São Paulo (GRU).'),
    destination: place('Escreva o destino. Ex.: Lisboa (LIS).'),
    program: z.enum(offerPrograms, 'Escolha o programa de milhas.'),
    cabin: z.enum(offerCabins, 'Escolha a cabine.'),
    departDate: z.iso.date('Escolha uma data de ida válida.').nullable(),
    returnDate: z.iso.date('Escolha uma data de volta válida.').nullable(),
    miles: z
      .number('Informe a quantidade de milhas.')
      .int('Use um número inteiro de milhas.')
      .min(1, 'Informe a quantidade de milhas.')
      .max(offerMaxMiles, 'Confira a quantidade de milhas.'),
    taxesCents: z
      .number('Informe as taxas em reais. Use 0 se não houver.')
      .int()
      .min(0, 'As taxas não podem ser negativas.')
      .max(offerMaxTaxesCents, 'Confira o valor das taxas.'),
    link: z
      .url({ protocol: /^https?$/, error: 'Use um endereço que comece com https://.' })
      .max(offerLinkMaxLength, `Use até ${offerLinkMaxLength} caracteres.`)
      .nullable(),
    notes: optionalText(offerNotesMaxLength),
  })
  .refine(
    (offer) =>
      !offer.departDate ||
      !offer.returnDate ||
      offer.returnDate >= offer.departDate,
    { path: ['returnDate'], error: 'A volta precisa ser depois da ida.' },
  );
export type CreateOfferInput = z.infer<typeof createOfferSchema>;

export const updateOfferStatusSchema = z.strictObject({
  id: z.uuid(),
  status: z.enum(offerStatuses),
});

export const deleteOfferSchema = z.strictObject({ id: z.uuid() });

const moneyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export const offerRoute = (offer: Pick<Offer, 'origin' | 'destination'>) =>
  `${offer.origin} → ${offer.destination}`;

export const formatMiles = (miles: number) => `${formatNumber(miles)} milhas`;

export const formatMoney = (cents: number) => moneyFormatter.format(cents / 100);
