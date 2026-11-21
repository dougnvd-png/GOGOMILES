import type { Metadata } from 'next';
import Link from 'next/link';
import {
  CircleAlert,
  CircleCheck,
  Database,
  KeyRound,
  Mail,
  Palette,
  type LucideIcon,
} from 'lucide-react';

import { PageHeader } from '@/components/platform/page-header';
import { AppearanceSwitch } from '@/components/settings/appearance-switch';
import { SendTestEmailButton } from '@/components/settings/send-test-email-button';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { appConfig } from '@/config/app';
import {
  isAuthConfigured,
  isDatabaseConfigured,
  isEmailConfigured,
} from '@/lib/env';
import { brandColor, themeFontLabels, themeStyleLabels } from '@/lib/theme';
import { cn } from '@/lib/utils';

export const metadata: Metadata = { title: 'Configurações' };

interface Service {
  name: string;
  icon: LucideIcon;
  connected: boolean;
  connectedText: string;
  pendingText: string;
  request: string;
}

const services: Service[] = [
  {
    name: 'Login',
    icon: KeyRound,
    connected: isAuthConfigured(),
    connectedText: 'As pessoas entram com a própria conta, pelo Clerk.',
    pendingText: 'Sem login, qualquer pessoa abre o painel.',
    request: 'Conecte o Clerk seguindo o README.',
  },
  {
    name: 'Banco de dados',
    icon: Database,
    connected: isDatabaseConfigured(),
    connectedText: 'Os dados ficam guardados no seu banco, no Supabase.',
    pendingText: 'As ofertas são de exemplo e somem ao reiniciar.',
    request: 'Conecte o Supabase seguindo o README.',
  },
  {
    name: 'E-mail',
    icon: Mail,
    connected: isEmailConfigured(),
    connectedText: 'O sistema consegue enviar e-mails, pelo Resend.',
    pendingText: 'Nenhum e-mail é enviado.',
    request: 'Conecte o Resend seguindo o README.',
  },
];

const projectDetails = [
  { label: 'Nome', value: appConfig.name },
  { label: 'Frase', value: appConfig.tagline },
  {
    label: 'E-mail de contato',
    value: appConfig.contactEmail || 'Não definido',
  },
  { label: 'Estilo', value: themeStyleLabels[appConfig.theme.style] },
  { label: 'Fonte', value: themeFontLabels[appConfig.theme.font] },
];

const ServiceStatus = ({ connected }: { connected: boolean }) => {
  const Icon = connected ? CircleCheck : CircleAlert;
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        connected
          ? 'border-success/25 bg-success/10 text-success'
          : 'border-warning/25 bg-warning/10 text-warning',
      )}
    >
      <Icon aria-hidden className="size-3.5" />
      {connected ? 'Conectado' : 'Pendente'}
    </span>
  );
};

export default function SettingsPage() {
  const connectedCount = services.filter((service) => service.connected).length;

  return (
    <>
      <PageHeader
        eyebrow="Projeto"
        title="Configurações"
        description="Os dados do projeto, a aparência e os serviços conectados."
      />
      <div className="grid gap-4 lg:grid-cols-12">
        <Card className="gap-4 lg:col-span-7">
          <CardHeader>
            <CardTitle>Serviços conectados</CardTitle>
            <CardDescription>
              {connectedCount} de {services.length} conectados. O painel funciona
              em modo demonstração até você conectar cada serviço.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-3">
              {services.map((service) => (
                <li
                  key={service.name}
                  className="bg-muted/40 flex items-start gap-3 rounded-xl border p-4"
                >
                  <span
                    aria-hidden
                    className="bg-brand-soft text-brand-ink grid size-9 shrink-0 place-items-center rounded-lg"
                  >
                    <service.icon className="size-4" />
                  </span>
                  <div className="grid min-w-0 flex-1 gap-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-medium">{service.name}</p>
                      <ServiceStatus connected={service.connected} />
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {service.connected
                        ? service.connectedText
                        : service.pendingText}
                    </p>
                    {!service.connected && (
                      <p className="text-sm">
                        Peça à sua IA:{' '}
                        <span className="text-brand-ink font-medium">
                          “{service.request}”
                        </span>
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            {isEmailConfigured() && (
              <div className="mt-4 border-t pt-4">
                <SendTestEmailButton />
              </div>
            )}
          </CardContent>
        </Card>
        <div className="grid content-start gap-4 lg:col-span-5">
          <Card className="gap-4">
            <CardHeader>
              <CardTitle>Projeto</CardTitle>
              <CardDescription>
                Para alterar, edite o arquivo src/config/app.ts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-3 text-sm">
                {projectDetails.map(({ label, value }) => (
                  <div key={label} className="flex justify-between gap-6">
                    <dt className="text-muted-foreground shrink-0">{label}</dt>
                    <dd className="text-right font-medium">{value}</dd>
                  </div>
                ))}
                <div className="flex justify-between gap-6">
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
          <Card className="gap-4">
            <CardHeader>
              <CardTitle>Aparência</CardTitle>
              <CardDescription>
                Vale para este navegador. O modo inicial vem do tema do projeto.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between gap-4">
                <Label htmlFor="dark-mode">Modo escuro</Label>
                <AppearanceSwitch id="dark-mode" />
              </div>
              <Button asChild variant="outline" className="mt-4 w-full">
                <Link href="/app/design-system">
                  <Palette aria-hidden />
                  Ver o design system
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
