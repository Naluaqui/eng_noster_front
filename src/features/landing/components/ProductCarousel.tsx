'use client';

import {
  Banknote,
  BrainCircuit,
  Building2,
  ChartNoAxesCombined,
  ChevronLeft,
  ChevronRight,
  Handshake,
  HeartPulse,
  Megaphone,
  Scale,
  Telescope,
  TriangleAlert,
  UserRound,
} from 'lucide-react';
import { useState } from 'react';
import { landingSlides } from '../data/landingSlides';

const slideIcons = {
  problem: TriangleAlert,
  solution: BrainCircuit,
  benefits: ChartNoAxesCombined,
};

const businessMinds = [
  {
    name: 'Cliente',
    description: 'Dores, objeções e expectativas que aparecem no discurso.',
    Icon: UserRound,
  },
  {
    name: 'Vendedor',
    description: 'Oportunidades de conversão, abordagem e timing comercial.',
    Icon: Handshake,
  },
  {
    name: 'Empresa',
    description: 'Coerência, posicionamento e alinhamento com a proposta.',
    Icon: Building2,
  },
  {
    name: 'Razão',
    description: 'Lógica, consistência e clareza dos argumentos.',
    Icon: Scale,
  },
  {
    name: 'Emoção',
    description: 'Sentimentos, tensões e sinais subjetivos da conversa.',
    Icon: HeartPulse,
  },
  {
    name: 'Financeiro',
    description: 'Impacto econômico, restrições e viabilidade.',
    Icon: Banknote,
  },
  {
    name: 'Marketing',
    description: 'Narrativa, percepção de valor e mensagens que conectam.',
    Icon: Megaphone,
  },
  {
    name: 'Estrategista',
    description: 'Visão macro, riscos sistêmicos e próximos passos.',
    Icon: Telescope,
  },
];

export function ProductCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = landingSlides[activeIndex];
  const SlideIcon = slideIcons[activeSlide.icon];

  const goToSlide = (index: number) => {
    const nextIndex = (index + landingSlides.length) % landingSlides.length;
    setActiveIndex(nextIndex);
  };

  return (
    <section className="product-section" id="produto" aria-labelledby="product-title">
      <div className="minds-intro">
        <span>Multi-perspectiva</span>
        <h2 id="product-title">Mentes de negócio</h2>
        <p>
          Uma camada de inteligência estratégica aplicada às suas conversas. O NOSTER vai além da
          transcrição: ele simula diferentes mentes de negócio, do financeiro ao cliente, para
          mapear riscos, intenções e oportunidades em cada reunião.
        </p>
      </div>

      <div className="minds-statement">
        <strong>O NOSTER não responde como uma única IA.</strong>
        <p>
          Ele simula múltiplas mentes estratégicas, criando uma análise rica e multidimensional.
        </p>
      </div>

      <div className="minds-timeline" aria-label="Mentes estratégicas do Noster">
        {businessMinds.map(({ name, description, Icon }) => (
          <article className="mind-card" key={name}>
            <div className="mind-card__icon" aria-hidden="true">
              <Icon size={24} />
            </div>
            <div>
              <h3>{name}</h3>
              <p>{description}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="minds-result">
        <span>Resultado</span>
        <strong>Nenhuma perspectiva perdida. Nenhuma decisão cega.</strong>
      </div>

      <div className="carousel-return" aria-labelledby="carousel-title">
        <div className="section-heading">
          <span></span>
          <h2 id="carousel-title">O produto em três lâminas.</h2>
        </div>

        <div className="carousel-shell" data-accent={activeSlide.accent}>
          <div className="carousel-panel" aria-live="polite">
            <div className="carousel-art" aria-hidden="true">
              <div className="carousel-art__icon">
                <SlideIcon size={40} />
              </div>
              <div className="carousel-art__bars">
                <span />
                <span />
                <span />
              </div>
              <div className="carousel-art__burst" />
            </div>

            <div className="carousel-copy">
              <div className="carousel-icon" aria-hidden="true">
                <SlideIcon size={34} />
              </div>

              <p className="carousel-eyebrow">{activeSlide.eyebrow}</p>
              <h3>{activeSlide.title}</h3>
              <p>{activeSlide.description}</p>

              <ul className="carousel-points">
                {activeSlide.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="carousel-controls" aria-label="Controles do carrossel">
            <button
              type="button"
              onClick={() => goToSlide(activeIndex - 1)}
              aria-label="Slide anterior"
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button>

            <div className="carousel-dots" aria-label="Selecionar slide">
              {landingSlides.map((slide, index) => (
                <button
                  type="button"
                  className={index === activeIndex ? 'is-active' : undefined}
                  onClick={() => goToSlide(index)}
                  aria-label={`Ir para ${slide.eyebrow}`}
                  aria-current={index === activeIndex ? 'true' : undefined}
                  key={slide.eyebrow}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => goToSlide(activeIndex + 1)}
              aria-label="Próximo slide"
            >
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
