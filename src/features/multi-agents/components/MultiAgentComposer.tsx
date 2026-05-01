import { ArrowUp, Paperclip, Sparkles } from 'lucide-react';

export function MultiAgentComposer() {
  return (
    <form className="multi-agent-composer">
      <label>
        <span className="sr-only">Mensagem para os agentes</span>
        <textarea
          name="message"
          placeholder="Peça uma análise, compare perspectivas ou descreva a decisão..."
        />
      </label>

      <footer>
        <button type="button">
          <Paperclip size={15} aria-hidden="true" />
          Anexar
        </button>
        <button type="button">
          <Sparkles size={15} aria-hidden="true" />
          Agentes
        </button>
        <button type="submit" aria-label="Enviar mensagem">
          <ArrowUp size={17} aria-hidden="true" />
        </button>
      </footer>
    </form>
  );
}
