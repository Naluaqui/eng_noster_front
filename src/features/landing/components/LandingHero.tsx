'use client';

import { Fragment, type PointerEvent } from 'react';
import { BrainCircuit, MessagesSquare, Sparkles } from 'lucide-react';
import { GoogleLoginButton } from '@/features/auth/components/GoogleLoginButton';
import { publicRoutes } from '@/shared/constants/routes';

const decisionSteps = ['capturar', 'estruturar', 'decidir'];
const decisionLenses = [
  'Cliente',
  'Vendedor',
  'Empresa',
  'Razão',
  'Emoção',
  'Financeiro',
  'Marketing',
  'Estrategista',
];
const signalTags = [
  'risco',
  'impacto',
  'tempo',
  'custo',
  'objeções',
  'intenção',
  'oportunidade',
  'próximo passo',
];

const runawayHeadline = [
  { text: 'Enxergue', accent: false },
  { text: 'além do que foi dito', accent: true },
];

function resetRunawayLetters(container: HTMLElement) {
  container.querySelectorAll<HTMLElement>('.runaway-title__letter').forEach((letter) => {
    letter.style.setProperty('--escape-x', '0px');
    letter.style.setProperty('--escape-y', '0px');
    letter.style.setProperty('--escape-rotate', '0deg');
  });
}

function handleRunawayPointerMove(event: PointerEvent<HTMLHeadingElement>) {
  const letters = event.currentTarget.querySelectorAll<HTMLElement>('.runaway-title__letter');
  const escapeRadius = 112;

  letters.forEach((letter) => {
    const rect = letter.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = centerX - event.clientX;
    const distanceY = centerY - event.clientY;
    const distance = Math.hypot(distanceX, distanceY) || 1;

    if (distance > escapeRadius) {
      letter.style.setProperty('--escape-x', '0px');
      letter.style.setProperty('--escape-y', '0px');
      letter.style.setProperty('--escape-rotate', '0deg');
      return;
    }

    const force = (escapeRadius - distance) / escapeRadius;
    const directionX = distanceX / distance;
    const directionY = distanceY / distance;
    const escapeX = directionX * force * 58;
    const escapeY = directionY * force * 42;
    const escapeRotate = directionX * force * 12;

    letter.style.setProperty('--escape-x', `${escapeX.toFixed(2)}px`);
    letter.style.setProperty('--escape-y', `${escapeY.toFixed(2)}px`);
    letter.style.setProperty('--escape-rotate', `${escapeRotate.toFixed(2)}deg`);
  });
}

function RunawayHeadline() {
  return (
    <h1
      id="landing-title"
      className="runaway-title"
      aria-label="Enxergue além do que foi dito"
      onPointerMove={handleRunawayPointerMove}
      onPointerLeave={(event) => resetRunawayLetters(event.currentTarget)}
    >
      {runawayHeadline.map((line) => (
        <span
          className={`runaway-title__line${line.accent ? ' runaway-title__line--accent' : ''}`}
          aria-hidden="true"
          key={line.text}
        >
          {line.text.split(' ').map((word, wordIndex) => (
            <Fragment key={`${line.text}-${wordIndex}`}>
              {wordIndex > 0 ? <span className="runaway-title__space" aria-hidden="true" /> : null}
              <span className="runaway-title__word">
                {[...word].map((letter, letterIndex) => (
                  <span
                    className="runaway-title__letter"
                    key={`${line.text}-${wordIndex}-${letterIndex}`}
                  >
                    {letter}
                  </span>
                ))}
              </span>
            </Fragment>
          ))}
        </span>
      ))}
    </h1>
  );
}

export function LandingHero() {
  return (
    <section className="landing-hero" aria-labelledby="landing-title">
      <header className="hero-topbar">
        <a className="brand-mark" href={publicRoutes.landing} aria-label="Noster">
          <span className="brand-mark__symbol">N</span>
          <span>NOSTER</span>
        </a>
        <GoogleLoginButton compact />
      </header>

      <div className="hero-watermark" aria-hidden="true">
        Noster
      </div>

      <div className="hero-stage">
        <div className="hero-copy">
          <span className="hero-kicker">
            <BrainCircuit size={18} aria-hidden="true" />
            Engenharia de decisão com IA
          </span>
          <RunawayHeadline />
          <p className="hero-lead">
            Uma engenharia de decisão que cruza histórico visual e inteligência multi-dimensional,
            transformando sinais e trade-offs em dashboards 360º.
          </p>

          <div className="hero-actions" aria-label="Ações principais">
            <button
              type="button"
              className="hero-secondary-action"
              onClick={() => {
                document.getElementById('multi-perspectiva')?.scrollIntoView({
                  behavior: 'smooth',
                });
              }}
            >
              Ver experiência
            </button>
          </div>
        </div>

        <div className="decision-board" aria-label="Resumo visual do Noster">
          <article className="board-panel board-panel--poster">
            <div className="poster-heading">
              <span>AI workflow</span>
              <strong>THE BEST WAY TO DECIDE</strong>
            </div>
            <div className="poster-symbol" aria-hidden="true">
              <MessagesSquare size={38} />
            </div>
            <div className="poster-steps">
              {decisionSteps.map((step) => (
                <span key={step}>{step}</span>
              ))}
            </div>
          </article>

          <article className="board-panel board-panel--burst" aria-label="IA multi-persona">
            <div className="persona-map">
              <i />
              <i />
              <i />
              <i />
              <strong>IA</strong>
              {decisionLenses.map((lens) => (
                <span key={lens}>{lens}</span>
              ))}
            </div>
          </article>

          <article className="board-panel board-panel--signals">
            <span>Sinais</span>
            <div>
              {signalTags.map((tag) => (
                <strong key={tag}>{tag}</strong>
              ))}
            </div>
          </article>
        </div>
      </div>

      <div className="hero-marquee" aria-hidden="true">
        <span>Reuniões</span>
        <span>Gestão de decisões</span>
        <span>Persuasão</span>
        <span>Personas</span>
        <span>
          <Sparkles size={14} />
          IA
        </span>
      </div>
    </section>
  );
}
