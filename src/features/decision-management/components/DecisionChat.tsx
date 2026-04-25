import { decisionMessages } from '../data/decisionMessages';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';
import { PerspectiveSelector } from './PerspectiveSelector';

export function DecisionChat() {
  return (
    <main className="feature-page">
      <header className="feature-page__header">
        <div>
          <span>Gestão de decisões</span>
          <h2>Chat estratégico</h2>
        </div>
      </header>

      <PerspectiveSelector />

      <section className="decision-chat" aria-label="Histórico de decisões">
        {decisionMessages.map((message) => (
          <ChatMessage message={message} key={message.id} />
        ))}
      </section>

      <ChatInput />
    </main>
  );
}
