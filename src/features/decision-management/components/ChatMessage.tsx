import type { DecisionMessage } from '../types/decision';

type ChatMessageProps = {
  message: DecisionMessage;
};

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <article className={`chat-message chat-message--${message.role}`}>
      {message.persona ? <span>{message.persona}</span> : null}
      <p>{message.content}</p>
    </article>
  );
}
