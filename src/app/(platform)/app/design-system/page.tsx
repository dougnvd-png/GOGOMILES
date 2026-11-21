import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import {
  CircleAlert,
  Inbox,
  Info,
  ListChecks,
  Plus,
  Timer,
  Trash2,
} from 'lucide-react';

import { AreaChart } from '@/components/charts/area-chart';
import { BarChart } from '@/components/charts/bar-chart';
import { chartColors } from '@/components/charts/chart-theme';
import { DonutChart } from '@/components/charts/donut-chart';
import { Sparkline } from '@/components/charts/sparkline';
import { MetricCard } from '@/components/dashboard/metric-card';
import { Trend } from '@/components/dashboard/trend';
import { EmptyState } from '@/components/empty-state';
import { OfferStatusBadge } from '@/components/offers/offer-status-badge';
import { PageHeader } from '@/components/platform/page-header';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { appConfig } from '@/config/app';
import { offerStatuses } from '@/lib/offers';
import {
  brandColor,
  themeFontLabels,
  themeModeLabels,
  themeStyleLabels,
} from '@/lib/theme';
import { cn } from '@/lib/utils';

export const metadata: Metadata = { title: 'Design system' };

const identity = [
  { label: 'Nome', value: appConfig.name },
  { label: 'Estilo', value: themeStyleLabels[appConfig.theme.style] },
  { label: 'Modo inicial', value: themeModeLabels[appConfig.theme.mode] },
  { label: 'Fonte', value: themeFontLabels[appConfig.theme.font] },
];

const colors = [
  { name: 'Marca', use: 'Ação principal e item ativo', swatch: 'bg-primary' },
  { name: 'Marca suave', use: 'Fundo de ícone', swatch: 'bg-brand-soft' },
  { name: 'Destaque', use: 'Segunda cor do degradê', swatch: 'bg-brand-accent' },
  { name: 'Fundo', use: 'Página', swatch: 'bg-background' },
  { name: 'Superfície', use: 'Cards e painéis', swatch: 'bg-card' },
  { name: 'Neutro', use: 'Áreas de apoio', swatch: 'bg-muted' },
  { name: 'Sucesso', use: 'Concluído e conectado', swatch: 'bg-success' },
  { name: 'Atenção', use: 'Pendente e prazo perto', swatch: 'bg-warning' },
  { name: 'Erro', use: 'Falha e exclusão', swatch: 'bg-destructive' },
  { name: 'Gráfico 1', use: 'Série principal', swatch: 'bg-chart-1' },
  { name: 'Gráfico 2', use: 'Segunda série', swatch: 'bg-chart-2' },
  { name: 'Gráfico 3', use: 'Terceira série', swatch: 'bg-chart-3' },
];

const typeScale = [
  {
    label: 'Título de página',
    className: 'font-heading text-3xl font-semibold sm:text-4xl',
    sample: appConfig.name,
  },
  {
    label: 'Título de seção',
    className: 'font-heading text-2xl font-semibold',
    sample: 'O que precisa da sua atenção',
  },
  {
    label: 'Título de card',
    className: 'text-base font-medium',
    sample: 'Atividade recente',
  },
  {
    label: 'Texto',
    className: 'text-sm',
    sample: appConfig.tagline,
  },
  {
    label: 'Texto de apoio',
    className: 'text-muted-foreground text-sm',
    sample: 'Atualizado há 5 minutos',
  },
  {
    label: 'Número',
    className: 'text-3xl font-semibold tracking-tight tabular-nums',
    sample: '1.248',
  },
];

const sampleWeek = [
  { label: 'Seg', criados: 4, concluidos: 2 },
  { label: 'Ter', criados: 6, concluidos: 5 },
  { label: 'Qua', criados: 5, concluidos: 4 },
  { label: 'Qui', criados: 8, concluidos: 6 },
  { label: 'Sex', criados: 7, concluidos: 8 },
  { label: 'Sáb', criados: 3, concluidos: 4 },
  { label: 'Dom', criados: 2, concluidos: 2 },
];

const sampleSeries = [
  { key: 'criados', label: 'Criados', color: chartColors.primary },
  { key: 'concluidos', label: 'Concluídos', color: chartColors.accent },
];

const sampleSlices = [
  { key: 'open', label: 'Abertos', value: 9, color: chartColors.open },
  {
    key: 'progress',
    label: 'Em andamento',
    value: 6,
    color: chartColors.progress,
  },
  { key: 'done', label: 'Concluídos', value: 20, color: chartColors.done },
];

const sampleTotal = sampleSlices.reduce((sum, slice) => sum + slice.value, 0);

interface SectionProps {
  id: string;
  title: string;
  description: string;
  children: ReactNode;
}

const Section = ({ id, title, description, children }: SectionProps) => (
  <section aria-labelledby={id} className="grid gap-4">
    <div className="grid gap-1">
      <h2 id={id} className="text-xl font-semibold">
        {title}
      </h2>
      <p className="text-muted-foreground max-w-2xl text-sm">{description}</p>
    </div>
    {children}
  </section>
);

const Sample = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="grid gap-2">
    <p className="text-muted-foreground text-xs font-medium">{label}</p>
    <div className="flex flex-wrap items-center gap-2">{children}</div>
  </div>
);

export default function DesignSystemPage() {
  return (
    <>
      <PageHeader
        eyebrow="Projeto"
        title="Design system"
        description="As cores, a tipografia e os componentes padrão deste projeto. Toda tela nova é montada com o que está aqui. As regras completas ficam no arquivo DESIGN.md."
      />
      <div className="grid gap-10">
        <Section
          id="ds-identidade"
          title="Identidade"
          description="Vem do tema em src/config/app.ts. Trocar a cor ali muda o projeto inteiro."
        >
          <Card>
            <CardContent className="flex flex-wrap items-center gap-6">
              <span
                aria-hidden
                className="brand-surface brand-glow grid size-16 shrink-0 place-items-center rounded-2xl text-2xl font-bold"
              >
                {appConfig.name.charAt(0).toUpperCase()}
              </span>
              <dl className="grid flex-1 grid-cols-2 gap-x-8 gap-y-3 text-sm sm:grid-cols-5">
                {identity.map(({ label, value }) => (
                  <div key={label} className="grid gap-0.5">
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="font-medium">{value}</dd>
                  </div>
                ))}
                <div className="grid gap-0.5">
                  <dt className="text-muted-foreground">Cor</dt>
                  <dd className="flex items-center gap-2 font-medium tabular-nums">
                    <span
                      aria-hidden
                      className="size-4 rounded-full border"
                      style={{ backgroundColor: brandColor }}
                    />
                    {brandColor}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </Section>

        <Section
          id="ds-cores"
          title="Cores"
          description="Use sempre pelo nome, nunca por um valor fixo. Assim o modo claro, o escuro e a troca de cor continuam funcionando."
        >
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {colors.map(({ name, use, swatch }) => (
              <li key={name} className="surface grid gap-2 rounded-xl p-3">
                <span
                  aria-hidden
                  className={cn('h-14 rounded-lg border', swatch)}
                />
                <div className="grid gap-0.5">
                  <p className="text-sm font-medium">{name}</p>
                  <p className="text-muted-foreground text-xs">{use}</p>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        <Section
          id="ds-tipografia"
          title="Tipografia"
          description="Poucos tamanhos, sempre os mesmos. Números usam algarismos alinhados para não pular quando mudam."
        >
          <Card>
            <CardContent className="grid gap-5">
              {typeScale.map(({ label, className, sample }) => (
                <div
                  key={label}
                  className="grid gap-1 sm:grid-cols-[10rem_1fr] sm:items-baseline sm:gap-6"
                >
                  <p className="text-muted-foreground text-xs font-medium">
                    {label}
                  </p>
                  <p className={className}>{sample}</p>
                </div>
              ))}
              <div className="grid gap-1 sm:grid-cols-[10rem_1fr] sm:items-baseline sm:gap-6">
                <p className="text-muted-foreground text-xs font-medium">
                  Rótulo
                </p>
                <p className="eyebrow">Visão geral</p>
              </div>
            </CardContent>
          </Card>
        </Section>

        <Section
          id="ds-botoes"
          title="Botões"
          description="Um botão principal por tela. Os demais ficam em contorno ou discretos."
        >
          <Card>
            <CardContent className="grid gap-5">
              <Sample label="Tipos">
                <Button>Principal</Button>
                <Button variant="secondary">Secundário</Button>
                <Button variant="outline">Contorno</Button>
                <Button variant="ghost">Discreto</Button>
                <Button variant="destructive">
                  <Trash2 aria-hidden />
                  Excluir
                </Button>
                <Button variant="link">Link</Button>
              </Sample>
              <Sample label="Tamanhos e ícone">
                <Button size="sm">Pequeno</Button>
                <Button>Padrão</Button>
                <Button size="lg">Grande</Button>
                <Button>
                  <Plus aria-hidden />
                  Nova oferta
                </Button>
                <Button size="icon" variant="outline" aria-label="Adicionar">
                  <Plus aria-hidden />
                </Button>
                <Button disabled>Indisponível</Button>
              </Sample>
            </CardContent>
          </Card>
        </Section>

        <Section
          id="ds-selos"
          title="Selos e situações"
          description="Situação sempre com cor e texto juntos. Variação sempre com seta e número."
        >
          <Card>
            <CardContent className="grid gap-5">
              <Sample label="Situações">
                {offerStatuses.map((status) => (
                  <OfferStatusBadge key={status} status={status} />
                ))}
              </Sample>
              <Sample label="Selos">
                <Badge>Novo</Badge>
                <Badge variant="secondary">Rascunho</Badge>
                <Badge variant="outline">Opcional</Badge>
                <Badge variant="destructive">Atrasado</Badge>
              </Sample>
              <Sample label="Variação contra o período anterior">
                <Trend change={12} />
                <Trend change={-8} />
                <Trend change={0} />
                <Trend change={-15} lowerIsBetter />
              </Sample>
            </CardContent>
          </Card>
        </Section>

        <Section
          id="ds-campos"
          title="Campos"
          description="Todo campo tem rótulo visível. A ajuda fica logo abaixo, em uma linha."
        >
          <Card>
            <CardContent className="grid gap-5 md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="ds-nome">Nome</FieldLabel>
                <Input id="ds-nome" placeholder="Como aparece na lista" />
                <FieldDescription>Até 80 caracteres.</FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="ds-situacao">Situação</FieldLabel>
                <Select defaultValue="open">
                  <SelectTrigger id="ds-situacao" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Aberto</SelectItem>
                    <SelectItem value="in_progress">Em andamento</SelectItem>
                    <SelectItem value="done">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field className="md:col-span-2">
                <FieldLabel htmlFor="ds-observacao">Observação</FieldLabel>
                <Textarea
                  id="ds-observacao"
                  placeholder="Detalhes que ajudam quem for abrir depois"
                />
              </Field>
              <div className="flex items-center gap-3">
                <Checkbox id="ds-avisar" defaultChecked />
                <Label htmlFor="ds-avisar">Avisar quando o prazo chegar</Label>
              </div>
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="ds-ativo">Ativo</Label>
                <Switch id="ds-ativo" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </Section>

        <Section
          id="ds-superficies"
          title="Superfícies"
          description="Quatro classes resolvem quase toda tela e se adaptam sozinhas ao estilo limpo, degradê ou vidro."
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="surface grid gap-1 rounded-2xl p-5">
              <p className="font-medium">surface</p>
              <p className="text-muted-foreground text-sm">
                Painel com a aparência de card.
              </p>
            </div>
            <div className="surface surface-interactive grid gap-1 rounded-2xl p-5">
              <p className="font-medium">surface-interactive</p>
              <p className="text-muted-foreground text-sm">
                Painel clicável. Passe o cursor.
              </p>
            </div>
            <div className="brand-surface brand-glow grid gap-1 rounded-2xl p-5">
              <p className="font-medium">brand-surface</p>
              <p className="text-sm opacity-85">
                Destaque com a cor da marca.
              </p>
            </div>
            <div className="surface grid gap-1 rounded-2xl p-5">
              <p className="brand-text text-2xl font-semibold">brand-text</p>
              <p className="text-muted-foreground text-sm">
                Trecho de título em destaque.
              </p>
            </div>
          </div>
        </Section>

        <Section
          id="ds-numeros"
          title="Números e gráficos"
          description="Os valores abaixo são de exemplo. Nas telas, todo número vem de um cálculo sobre os dados."
        >
          <div className="grid gap-4 lg:grid-cols-12">
            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-12">
              <MetricCard
                label="Itens concluídos"
                value="27"
                icon={ListChecks}
                detail={
                  <>
                    <Trend change={12} />
                    <span>contra a semana anterior</span>
                  </>
                }
                visual={
                  <Sparkline
                    values={sampleWeek.map((day) => day.concluidos)}
                    className="w-full"
                  />
                }
              />
              <MetricCard
                label="Tempo médio"
                value="2,4 dias"
                icon={Timer}
                detail={
                  <>
                    <Trend change={-9} lowerIsBetter />
                    <span>contra a semana anterior</span>
                  </>
                }
                visual={
                  <Sparkline
                    values={sampleWeek.map((day) => day.criados)}
                    className="w-full"
                  />
                }
              />
            </div>
            <Card className="lg:col-span-7">
              <CardHeader>
                <CardTitle>Área</CardTitle>
                <CardDescription>Evolução ao longo do tempo.</CardDescription>
              </CardHeader>
              <CardContent>
                <AreaChart data={sampleWeek} series={sampleSeries} />
              </CardContent>
            </Card>
            <Card className="lg:col-span-5">
              <CardHeader>
                <CardTitle>Rosca</CardTitle>
                <CardDescription>Partes de um total.</CardDescription>
              </CardHeader>
              <CardContent>
                <DonutChart slices={sampleSlices}>
                  <span className="text-3xl font-semibold tabular-nums">
                    {sampleTotal}
                  </span>
                  <span className="text-muted-foreground text-xs">ofertas</span>
                </DonutChart>
              </CardContent>
            </Card>
            <Card className="lg:col-span-12">
              <CardHeader>
                <CardTitle>Barras</CardTitle>
                <CardDescription>
                  Comparação entre categorias. A maior fica em destaque.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  label="Criados"
                  data={sampleWeek.map((day) => ({
                    label: day.label,
                    value: day.criados,
                  }))}
                />
              </CardContent>
            </Card>
          </div>
        </Section>

        <Section
          id="ds-estados"
          title="Avisos e estados"
          description="Toda tela trata quatro situações: carregando, vazia, com erro e com dados."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="grid content-start gap-4">
              <Alert>
                <Info aria-hidden />
                <AlertTitle>Modo demonstração</AlertTitle>
                <AlertDescription>
                  As ofertas são de exemplo e voltam ao reiniciar.
                </AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <CircleAlert aria-hidden />
                <AlertTitle>Não foi possível salvar</AlertTitle>
                <AlertDescription>
                  Confira os campos e tente de novo.
                </AlertDescription>
              </Alert>
              <Card>
                <CardContent className="grid gap-4">
                  <div className="grid gap-2">
                    <div className="flex justify-between text-sm">
                      <span>Progresso</span>
                      <span className="text-muted-foreground tabular-nums">
                        60%
                      </span>
                    </div>
                    <Progress value={60} aria-label="Progresso de exemplo" />
                  </div>
                  <div className="grid gap-2" aria-hidden>
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardContent>
                <EmptyState
                  icon={Inbox}
                  title="Nenhum item por aqui"
                  description="Quando você criar o primeiro, ele aparece nesta lista."
                  action={
                    <Button>
                      <Plus aria-hidden />
                      Nova oferta
                    </Button>
                  }
                />
              </CardContent>
            </Card>
          </div>
        </Section>
      </div>
    </>
  );
}
