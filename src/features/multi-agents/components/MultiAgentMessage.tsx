import { Bot, UserRound } from 'lucide-react';
import type { MultiAgentMessage as MultiAgentMessageType } from '../types/multiAgent';

type MultiAgentMessageProps = {
  message: MultiAgentMessageType;
};

export function MultiAgentMessage({ message }: MultiAgentMessageProps) {
  const isUser = message.role === 'user';

  return (
    <article className="multi-agent-message" data-role={message.role}>
      <div className="multi-agent-message__avatar" aria-hidden="true">
        {isUser ? <UserRound size={17} /> : <Bot size={17} />}
      </div>
      <div>
        <span>{isUser ? 'Voce' : formatAgentName(message.agent)}</span>
        <p>{message.content}</p>
        {message.attachments && message.attachments.length > 0 ? (
          <ul className="multi-agent-message__attachments" aria-label="Reunioes anexadas">
            {message.attachments.map((meeting) => (
              <li key={meeting.id}>
                <strong>{meeting.title}</strong>
                <small>
                  {meeting.date} as {meeting.time}
                </small>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}

export function MultiAgentTypingIndicator({ agent }: { agent: string }) {
  return (
    <article className="multi-agent-message multi-agent-message--typing" data-role="agent" aria-live="polite">
      <div className="multi-agent-message__avatar" aria-hidden="true">
        <Bot size={17} />
      </div>
      <div>
        <span>{formatAgentName(agent)} digitando...</span>
        <p className="multi-agent-message__typing-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </p>
      </div>
    </article>
  );
}

function formatAgentName(agent?: string) {
  if (!agent) {
    return 'Agente';
  }

  return `${agent.charAt(0).toUpperCase()}${agent.slice(1)}`;
}
