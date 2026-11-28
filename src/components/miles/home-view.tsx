import Link from 'next/link';
import { ArrowUpRight, Bell, Megaphone, Plane, Star, TrendingUp } from 'lucide-react';

import { MetricCard } from '@/components/dashboard/metric-card';
import { EmptyState } from '@/components/empty-state';
import {
  AirlineBadge,
  AirlineBadges,
  ExternalLink,
  LightDot,
  Plan,
  Tag,
  lightTextClass,
} from '@/components/miles/bits';
import { LastUpdated } from '@/components/miles/last-updated';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatLongDate, formatNumber } from '@/lib/format';
import {
  describeEnd,
  greetingFor,
  type BestPrice,
  type OpenCampaign,
  type OpenPromo,
  type StarStatus,
  type WatchStatus,
} from '@/lib/miles/home';
import { brDate, cityName, programLink, type RadarMeta } from '@/lib/miles/radar';

interface HomeViewProps {
  now: Date;
  firstName: string;
  meta: RadarMeta;
  promos: OpenPromo[];
  campaigns: OpenCampaign[];
  cheapest: BestPrice[];
  stars: StarStatus[];
  watches: WatchStatus[];
}

const endTone = (daysLeft: number | null) =>
  daysLeft !== null && daysLeft <= 0 ? 'bad' : daysLeft === 1 ? 'warn' : 'blue';

const shortCity = (code: string) => cityName(code).replace(/ \([A-Z]{3}\)$/, '');

const calendarHref = (origin: string, destination: string) =>
  `/app/calendario?origem=${encodeURIComponent(cityName(origin))}&destino=${encodeURIComponent(cityName(destination))}`;

const SeeAll = ({ href, label }: { href: string; label: string }) => (
  <Button asChild variant="ghost" size="sm" className="-mr-2">
    <Link href={href}>
      {label}
      <ArrowUpRight />
    </Link>
  </Button>
);

const PriceLine = ({ best }: { best: BestPrice }) => (
  <div className="flex flex-wrap items-center gap-2 text-sm">
    <AirlineBadge name={best.price.prog} />
    <span className={`flex items-center gap-1.5 font-bold tabular-nums ${lightTextClass(best.light)}`}>
      <LightDot value={best.light} />
      {formatNumber(best.price.milhas)} milhas
    </span>
    <span className="text-muted-foreground">em {brDate(best.day)}</span>
  </div>
);

export const HomeView = ({
  now,
  firstName,
  meta,
  promos,
  campaigns,
  cheapest,
  stars,
  watches,
}: HomeViewProps) => {
  const endingToday = promos.filter((entry) => entry.daysLeft !== null && entry.daysLeft <= 0).length;
  const lowest = cheapest[0];
  const inGoal = stars.filter((entry) => entry.withinGoal).length;

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid gap-2">
          <p className="eyebrow">{formatLongDate(now)}</p>
          <h1 className="text-3xl font-semibold text-balance sm:text-4xl">
            {greetingFor(now)}
            {firstName && (
              <>
                , <span className="brand-text">{firstName}</span>
              </>
            )}
          </h1>
          <p className="text-muted-foreground text-pretty">
            {endingToday > 0
              ? `${endingToday} ${endingToday === 1 ? 'bônus de transferência termina' : 'bônus de transferência terminam'} hoje.`
              : 'O que vale a pena olhar para a sua próxima viagem.'}
          </p>
          <LastUpdated
            entries={[
              { label: 'Radar de promoções', at: meta.ultimaVarredura },
              { label: 'Busca ao vivo nos sites', at: meta.aoVivo },
            ]}
          />
        </div>
        <Button asChild>
          <Link href="/app/planejar">Planejar viagem</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Bônus de transferência"
          value={formatNumber(promos.length)}
          icon={TrendingUp}
          detail={
            endingToday > 0 ? (
              <span className="text-destructive font-medium">{endingToday} terminam hoje</span>
            ) : (
              'ativos agora'
            )
          }
        />
        <MetricCard
          label="Menor preço saindo de casa"
          value={lowest ? formatNumber(lowest.price.milhas) : '—'}
          icon={Plane}
          detail={
            lowest
              ? `milhas, ${lowest.origin} → ${shortCity(lowest.destination)}`
              : 'sem preços futuros registrados'
          }
        />
        <MetricCard
          label="Destinos estrela na meta"
          value={stars.length ? `${inGoal} de ${stars.length}` : '—'}
          icon={Star}
          detail={stars.length ? 'com preço igual ou abaixo da meta' : 'nenhum destino marcado ainda'}
        />
        <MetricCard
          label="Campanhas no ar"
          value={formatNumber(campaigns.length)}
          icon={Megaphone}
          detail="das companhias e programas"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <Card className="gap-4 lg:col-span-7">
          <CardHeader>
            <CardTitle>Menores preços saindo de Goiânia e Brasília</CardTitle>
            <CardDescription>
              O menor valor em milhas já visto para cada destino, em datas futuras. Confirme no
              site da companhia: o preço pode mudar.
            </CardDescription>
            <CardAction>
              <SeeAll href="/app/calendario" label="Calendário" />
            </CardAction>
          </CardHeader>
          <CardContent className="grid gap-3">
            {cheapest.length === 0 ? (
              <EmptyState
                icon={Plane}
                title="Nenhum preço futuro registrado"
                description="Os preços aparecem aqui depois de uma nova busca."
                className="py-4"
              />
            ) : (
              cheapest.map((best) => (
                <Plan key={best.destination}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Link
                      href={calendarHref(best.origin, best.destination)}
                      className="font-medium underline-offset-4 hover:underline"
                    >
                      {shortCity(best.origin)} → {shortCity(best.destination)}
                    </Link>
                    <ExternalLink
                      href={
                        best.price.live && best.price.url
                          ? best.price.url
                          : programLink(best.price.prog, best.origin, best.destination, best.day)
                      }
                      className="text-sm"
                    >
                      abrir no site
                    </ExternalLink>
                  </div>
                  <PriceLine best={best} />
                  <p className="text-muted-foreground text-xs">{best.price.fonte}</p>
                </Plan>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="gap-4 lg:col-span-5">
          <CardHeader>
            <CardTitle>Bônus de transferência ativos</CardTitle>
            <CardDescription>
              Transferência não tem volta: confira o regulamento antes.
            </CardDescription>
            <CardAction>
              <SeeAll href="/app/radar" label="Radar" />
            </CardAction>
          </CardHeader>
          <CardContent className="grid gap-3">
            {promos.length === 0 ? (
              <EmptyState
                icon={TrendingUp}
                title="Nenhum bônus aberto"
                description="As próximas campanhas aparecem aqui."
                className="py-4"
              />
            ) : (
              promos.map(({ promo, daysLeft }) => (
                <Plan key={promo.id}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium">
                      {promo.de} → <AirlineBadges text={promo.para} />
                    </span>
                    <Tag tone={endTone(daysLeft)}>{describeEnd(daysLeft)}</Tag>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Até {promo.bonusMax ?? '?'}%{promo.veredito ? ` · ${promo.veredito}` : ''}
                    {promo.url && (
                      <>
                        {' · '}
                        <ExternalLink href={promo.url}>ver campanha</ExternalLink>
                      </>
                    )}
                  </p>
                </Plan>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="gap-4 lg:col-span-6">
          <CardHeader>
            <CardTitle>Meus destinos estrela</CardTitle>
            <CardDescription>O melhor preço de cada um em relação à sua meta.</CardDescription>
            <CardAction>
              <SeeAll href="/app/promo-brasil" label="Gerenciar" />
            </CardAction>
          </CardHeader>
          <CardContent className="grid gap-3">
            {stars.length === 0 ? (
              <EmptyState
                icon={Star}
                title="Nenhum destino estrela"
                description="Marque um destino em Promo Brasil para acompanhar o preço aqui."
                className="py-4"
              />
            ) : (
              stars.map(({ star, best, withinGoal }) => (
                <Plan key={star.key} highlight={withinGoal}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium">{star.nome}</span>
                    {withinGoal ? (
                      <Tag tone="ok">na meta</Tag>
                    ) : (
                      <Tag>{star.meta ? `meta ${formatNumber(star.meta)}` : 'sem meta'}</Tag>
                    )}
                  </div>
                  {best ? (
                    <PriceLine best={best} />
                  ) : (
                    <p className="text-muted-foreground text-sm">Nenhum preço registrado ainda.</p>
                  )}
                </Plan>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="gap-4 lg:col-span-6">
          <CardHeader>
            <CardTitle>Rotas vigiadas</CardTitle>
            <CardDescription>O menor preço visto em cada rota que você marcou.</CardDescription>
            <CardAction>
              <SeeAll href="/app/carteira" label="Gerenciar" />
            </CardAction>
          </CardHeader>
          <CardContent className="grid gap-3">
            {watches.length === 0 ? (
              <EmptyState
                icon={Bell}
                title="Nenhuma rota vigiada"
                description="Vigie uma rota pelo Calendário ou pela sua carteira."
                className="py-4"
              />
            ) : (
              watches.map(({ watch, best, withinGoal }) => (
                <Plan key={watch.key} highlight={withinGoal}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium">
                      {watch.origem} → {watch.destino}
                    </span>
                    {withinGoal && <Tag tone="ok">na meta</Tag>}
                  </div>
                  {best ? (
                    <PriceLine best={best} />
                  ) : (
                    <p className="text-muted-foreground text-sm">Nenhum preço registrado ainda.</p>
                  )}
                </Plan>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="gap-4 lg:col-span-12">
          <CardHeader>
            <CardTitle>Campanhas no ar</CardTitle>
            <CardDescription>Ofertas anunciadas pelas companhias e programas.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 lg:grid-cols-2">
            {campaigns.length === 0 && (
              <p className="text-muted-foreground text-sm">Nenhuma campanha registrada agora.</p>
            )}
            {campaigns.map(({ campaign, daysLeft }) => (
              <Plan key={campaign.id}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium">{campaign.titulo}</span>
                  <Tag tone={endTone(daysLeft)}>
                    {daysLeft === null ? 'no ar' : describeEnd(daysLeft)}
                  </Tag>
                </div>
                <p className="text-sm">{campaign.detalhe}</p>
                {campaign.url && (
                  <ExternalLink href={campaign.url} className="text-sm">
                    ver oferta
                  </ExternalLink>
                )}
              </Plan>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
