import {
  BellRing,
  ClipboardList,
  MonitorSmartphone,
  Search,
  ShieldCheck,
  Users,
  Zap,
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
    eyebrow: 'Um jeito novo de organizar',
    title: 'Tudo o que você precisa acompanhar,',
    highlight: 'em um só lugar',
    subtitle:
      'Cadastre, encontre e acompanhe cada item do seu trabalho sem depender de planilhas soltas ou mensagens perdidas.',
    primaryAction: { label: 'Começar agora', href: '/app' },
    secondaryAction: { label: 'Ver como funciona', href: '#como-funciona' },
    note: 'Abra o painel e experimente com dados de exemplo.',
  },
  highlights: [
    {
      icon: Zap,
      title: 'Pronto em minutos',
      description: 'Cadastre o primeiro item logo ao entrar.',
    },
    {
      icon: MonitorSmartphone,
      title: 'No computador e no celular',
      description: 'Direto no navegador, sem instalar nada.',
    },
    {
      icon: ShieldCheck,
      title: 'Cada conta vê só o que é dela',
      description: 'Login individual e dados separados por pessoa.',
    },
  ],
  benefits: {
    eyebrow: 'Benefícios',
    title: 'Feito para o seu dia a dia',
    subtitle:
      'Menos tempo procurando informação, mais tempo cuidando do que importa.',
    items: [
      {
        icon: ClipboardList,
        title: 'Cadastro simples',
        description:
          'Registre um novo item em segundos, com as informações que você realmente usa.',
        visual: 'list',
      },
      {
        icon: Search,
        title: 'Encontre rápido',
        description:
          'Busque pelo nome, filtre pela situação e ordene do jeito que fizer sentido.',
        visual: 'search',
      },
      {
        icon: BellRing,
        title: 'Prazos à vista',
        description:
          'Veja o que vence primeiro e receba avisos antes de o prazo passar.',
        visual: 'alert',
      },
      {
        icon: Zap,
        title: 'Números do período',
        description:
          'Acompanhe quantos itens entraram, quantos foram concluídos e como isso mudou.',
        visual: 'chart',
      },
      {
        icon: Users,
        title: 'Cada um com o seu acesso',
        description:
          'Cada pessoa entra com a própria conta e vê apenas o que é dela.',
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
    title: 'Três passos para sair do improviso',
    subtitle: 'Do primeiro acesso ao acompanhamento diário.',
    items: [
      {
        title: 'Crie a sua conta',
        description: 'Entre com o seu e-mail e acesse o seu painel.',
      },
      {
        title: 'Cadastre os seus itens',
        description:
          'Adicione o que você precisa acompanhar, com categoria e prazo.',
      },
      {
        title: 'Acompanhe tudo',
        description:
          'Veja os números do período e saiba o que está pendente, em andamento e pronto.',
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
        question: 'Preciso instalar alguma coisa?',
        answer:
          'Não. Tudo funciona direto no navegador, no computador ou no celular.',
      },
      {
        question: 'Outras pessoas veem os meus dados?',
        answer: 'Não. Cada conta acessa somente as próprias informações.',
      },
      {
        question: 'Consigo usar com a minha equipe?',
        answer:
          'Sim. Cada pessoa cria a própria conta e acompanha o que é dela.',
      },
      {
        question: 'Como tiro dúvidas?',
        answer: 'Fale com a gente pelo contato no fim desta página.',
      },
    ],
  },
  finalCall: {
    title: 'Pronto para organizar o seu trabalho?',
    subtitle: 'Crie a sua conta e cadastre o primeiro item em poucos minutos.',
    action: { label: 'Entrar no painel', href: '/app' },
  },
};
