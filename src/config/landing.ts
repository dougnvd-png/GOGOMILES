import {
  BellRing,
  CalendarDays,
  ClipboardList,
  MonitorSmartphone,
  Plane,
  Search,
  ShieldCheck,
  Users,
  type LucideIcon,
} from 'lucide-react';

export interface LandingAction {
  label: string;
  href: string;
}

/** Mini ilustrações disponíveis para os cards de benefício. */
export type BenefitVisual =
  | 'list'
  | 'search'
  | 'chart'
  | 'access'
  | 'alert'
  | 'devices';

export interface LandingPlan {
  name: string;
  price: string;
  /** Texto pequeno ao lado do preço, como "por mês". */
  period: string;
  description: string;
  features: string[];
  action: LandingAction;
  /** Marca o plano recomendado. */
  featured?: boolean;
}

export interface LandingTestimonial {
  quote: string;
  name: string;
  role: string;
}

interface LandingContent {
  hero: {
    eyebrow: string;
    title: string;
    highlight: string;
    subtitle: string;
    primaryAction: LandingAction;
    secondaryAction: LandingAction;
    /** Frase curta abaixo dos botões. */
    note: string;
  };
  /** Faixa de três ou quatro destaques logo abaixo da prévia. */
  highlights: { icon: LucideIcon; title: string; description: string }[];
  benefits: {
    eyebrow: string;
    title: string;
    subtitle: string;
    /** De três a seis itens. Os dois primeiros ganham mais espaço. */
    items: {
      icon: LucideIcon;
      title: string;
      description: string;
      visual?: BenefitVisual;
    }[];
  };
  steps: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: { title: string; description: string }[];
  };
  /** Com a lista de planos vazia, a seção não aparece. */
  pricing: {
    eyebrow: string;
    title: string;
    subtitle: string;
    plans: LandingPlan[];
  };
  /** Com a lista vazia, a seção não aparece. Use somente depoimentos reais. */
  testimonials: {
    eyebrow: string;
    title: string;
    items: LandingTestimonial[];
  };
  faq: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: { question: string; answer: string }[];
  };
  finalCall: {
    title: string;
    subtitle: string;
    action: LandingAction;
  };
}

export const landingContent: LandingContent = {
  hero: {
    eyebrow: 'Passagens aéreas em milhas',
    title: 'Encontre voos baratos em milhas de forma',
    highlight: 'simples e personalizada',
    subtitle:
      'O GO GO MILES reúne promoções, preços em milhas por dia e bônus de transferência, e leva você ao site da companhia para emitir.',
    primaryAction: { label: 'Começar agora', href: '/app' },
    secondaryAction: { label: 'Ver como funciona', href: '#como-funciona' },
    note: 'Abra o painel e veja as promoções registradas.',
  },
  highlights: [
    {
      icon: Plane,
      title: 'Promoções em um só lugar',
      description: 'Voos em milhas, campanhas e bônus de transferência reunidos.',
    },
    {
      icon: MonitorSmartphone,
      title: 'No computador e no celular',
      description: 'Direto no navegador, sem instalar nada.',
    },
    {
      icon: ShieldCheck,
      title: 'Sem pedir a sua senha',
      description: 'Não guardamos o login das companhias. A compra é feita no site delas.',
    },
  ],
  benefits: {
    eyebrow: 'Benefícios',
    title: 'Menos tempo procurando, mais tempo viajando',
    subtitle: 'Veja onde está o bom preço e decida com calma.',
    items: [
      {
        icon: CalendarDays,
        title: 'Calendário de preços',
        description:
          'O menor valor em milhas de cada dia de uma rota, com cores que mostram se o preço é bom.',
        visual: 'list',
      },
      {
        icon: Search,
        title: 'Busca por aeroporto e mês',
        description:
          'Escolha de onde sai, o mês e o teto de milhas e veja os destinos que cabem.',
        visual: 'search',
      },
      {
        icon: BellRing,
        title: 'Destinos estrela com meta',
        description:
          'Marque para onde quer ir e veja quando o preço chega no valor que você definiu.',
        visual: 'alert',
      },
      {
        icon: ClipboardList,
        title: 'Radar de bônus',
        description:
          'Acompanhe as transferências bonificadas, o prazo de cada uma e quando vale transferir.',
        visual: 'chart',
      },
      {
        icon: Users,
        title: 'A sua carteira',
        description:
          'Informe os seus saldos à mão e use o simulador para saber se compensa usar milhas.',
        visual: 'access',
      },
      {
        icon: MonitorSmartphone,
        title: 'Funciona no celular',
        description: 'Abra no computador ou no telefone, sem instalar nada.',
        visual: 'devices',
      },
    ],
  },
  steps: {
    eyebrow: 'Como funciona',
    title: 'Três passos até a sua viagem',
    subtitle: 'Do primeiro acesso à escolha do voo.',
    items: [
      {
        title: 'Diga para onde quer ir',
        description: 'Marque destinos estrela, rotas e a meta de milhas.',
      },
      {
        title: 'Acompanhe os preços',
        description: 'Veja o calendário, as promoções e os bônus de transferência.',
      },
      {
        title: 'Emita no site oficial',
        description: 'Abra o link da companhia, confira o preço e conclua a compra lá.',
      },
    ],
  },
  pricing: {
    eyebrow: 'Planos',
    title: 'Escolha o plano que combina com você',
    subtitle: 'Sem fidelidade. Mude de plano quando quiser.',
    plans: [],
  },
  testimonials: {
    eyebrow: 'Depoimentos',
    title: 'Quem usa conta como é',
    items: [],
  },
  faq: {
    eyebrow: 'Dúvidas',
    title: 'Perguntas frequentes',
    subtitle: 'O que as pessoas costumam perguntar antes de começar.',
    items: [
      {
        question: 'O GO GO MILES emite a passagem para mim?',
        answer:
          'Não. Ele mostra as oportunidades e leva você ao site da companhia, onde a emissão é feita.',
      },
      {
        question: 'Os preços são em tempo real?',
        answer:
          'Não. Cada tela mostra a data e a hora da última atualização. O preço em milhas muda a qualquer momento, então confirme no site antes de transferir pontos.',
      },
      {
        question: 'Preciso informar a senha das companhias?',
        answer: 'Não. O sistema não pede nem guarda o seu login nos programas de milhas.',
      },
      {
        question: 'Preciso instalar alguma coisa?',
        answer:
          'Não. Tudo funciona direto no navegador, no computador ou no celular.',
      },
    ],
  },
  finalCall: {
    title: 'Pronto para encontrar o seu próximo voo?',
    subtitle: 'Abra o painel e veja as promoções de passagens em milhas.',
    action: { label: 'Entrar no painel', href: '/app' },
  },
};
