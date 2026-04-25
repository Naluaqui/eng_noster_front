import { BrainCircuit, LogIn, MessagesSquare, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

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

export function LandingHero() {
  return (
    <section className="landing-hero" aria-labelledby="landing-title">
      <header className="hero-topbar">
        <a className="brand-mark" href="/" aria-label="Noster">
          <span className="brand-mark__symbol">N</span>
          <span>NOSTER</span>
        </a>
        <Link className="hero-login hero-login--compact" to="/app/reunioes">
          <LogIn size={18} aria-hidden="true" />
          Login
        </Link>
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
          <h1 id="landing-title">
            Enxergue
            <span>além do que foi dito</span>
          </h1>
          <p className="hero-lead">
            Uma engenharia de decisão que cruza histórico visual e inteligência multi-dimensional,
            transformando sinais e trade-offs em dashboards 360º.
          </p>

          <div className="hero-actions" aria-label="Ações principais">
            <a className="hero-secondary-action" href="#produto">
              Ver experiência
            </a>
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
        <span>Insights</span>
        <span>Personas</span>
        <span>
          <Sparkles size={14} />
          IA
        </span>
      </div>
    </section>
  );
}
