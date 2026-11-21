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
    title: 'Ache voos baratos em milhas e',
    highlight: 'não perca a oportunidade',
    subtitle:
      'O GO GO MILES reúne em um só lugar as promoções de passagens em milhas que você encontra: rota, programa, cabine, datas, milhas, taxas e o link para resgatar.',
    primaryAction: { label: 'Começar agora', href: '/app' },
    secondaryAction: { label: 'Ver como funciona', href: '#como-funciona' },
    note: 'Abra o painel e experimente com ofertas de exemplo.',
  },
  highlights: [
    {
      icon: Plane,
      title: 'Todas as ofertas juntas',
      description: 'Guarde cada promoção com os dados que importam na emissão.',
    },
    {
      icon: MonitorSmartphone,
      title: 'No computador e no celular',
      description: 'Direto no navegador, sem instalar nada.',
    },
    {
      icon: ShieldCheck,
      title: 'Cada cliente vê só o seu',
      description: 'Login individual e buscas separadas por pessoa.',
    },
  ],
  benefits: {
    eyebrow: 'Benefícios',
    title: 'Menos tempo procurando, mais tempo viajando',
    subtitle:
      'Organize as oportunidades de voo em milhas e decida com calma qual vale a emissão.',
    items: [
      {
        icon: ClipboardList,
        title: 'Cadastro direto ao ponto',
        description:
          'Registre rota, programa, cabine, milhas e taxas em poucos segundos, com o link para resgatar.',
        visual: 'list',
      },
      {
        icon: Search,
        title: 'Encontre rápido',
        description:
          'Busque pela rota, filtre por programa, cabine ou situação e ordene pelas menores milhas.',
        visual: 'search',
      },
      {
        icon: CalendarDays,
        title: 'Embarques à vista',
        description:
          'Veja primeiro as viagens com data mais próxima e receba aviso quando o embarque se aproxima.',
        visual: 'alert',
      },
      {
        icon: BellRing,
        title: 'Acompanhe cada oferta',
        description:
          'Marque como nova, em análise ou emitida e veja o que já virou passagem.',
        visual: 'chart',
      },
      {
        icon: Users,
        title: 'Cada um com o seu acesso',
        description:
          'Cada cliente entra com a própria conta e vê apenas as suas buscas e informações.',
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
    title: 'Três passos até a emissão',
    subtitle: 'Do primeiro acesso à passagem emitida.',
    items: [
      {
        title: 'Crie a sua conta',
        description: 'Entre com o seu e-mail e acesse o seu painel.',
      },
      {
        title: 'Cadastre as ofertas',
        description:
          'Guarde os voos em promoção com programa, cabine, milhas, taxas e datas.',
      },
      {
        title: 'Compare e emita',
        description:
          'Veja quais valem mais a pena, abra o link do programa e marque como emitida.',
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
          'Não. Ele organiza as ofertas e leva você ao site do programa de milhas, onde a emissão é feita.',
      },
      {
        question: 'As ofertas aparecem sozinhas?',
        answer:
          'Nesta primeira versão, você cadastra as ofertas que encontra. A busca automática em fontes autorizadas é um próximo passo.',
      },
      {
        question: 'Outras pessoas veem as minhas buscas?',
        answer:
          'Não. Cada conta acessa somente os próprios dados, buscas e informações.',
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
    subtitle: 'Crie a sua conta e cadastre a primeira oferta em poucos minutos.',
    action: { label: 'Entrar no painel', href: '/app' },
  },
};
