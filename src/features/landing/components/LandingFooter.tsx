import { publicRoutes } from '@/shared/constants/routes';

export function LandingFooter() {
  return (
    <footer className="landing-footer">
      <div className="footer-brand">
        <a className="footer-brand__mark" href={publicRoutes.landing} aria-label="Noster">
          <span>N</span>
          <strong>Noster</strong>
        </a>
        <p>Engenharia de decisão com IA para transformar conversas em direção estratégica.</p>
      </div>

      <nav className="footer-column" aria-label="Links principais">
        <h2>Produto</h2>
        <a href={publicRoutes.landing}>Início</a>
        <a href="#produto">Mentes de negócio</a>
        <a href="#carousel-title">Carrossel</a>
      </nav>

      <nav className="footer-column" aria-label="Legal e empresa">
        <h2>Empresa</h2>
        <a href={publicRoutes.landing}>Sobre</a>
        <a href={publicRoutes.landing}>Privacidade</a>
        <a href={publicRoutes.landing}>Termos</a>
      </nav>

      <address className="footer-column">
        <h2>Contato</h2>
        <a href="mailto:contato@noster.ai">contato@noster.ai</a>
        <span>Brasil</span>
      </address>

      <div className="footer-column footer-social">
        <h2>Social</h2>
        <div>
          <a href={publicRoutes.landing} aria-label="Noster no LinkedIn">
            in
          </a>
          <a href={publicRoutes.landing} aria-label="Noster no Instagram">
            ig
          </a>
          <a href={publicRoutes.landing} aria-label="Noster no GitHub">
            gh
          </a>
          <a href="mailto:contato@noster.ai" aria-label="Enviar email para Noster">
            @
          </a>
        </div>
      </div>

      <p className="footer-copyright">© 2026 Noster by Flux. Todos os direitos reservados.</p>
    </footer>
  );
}
