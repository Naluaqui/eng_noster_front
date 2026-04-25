type LoadingStateProps = {
  label?: string;
};

export function LoadingState({ label = 'Carregando...' }: LoadingStateProps) {
  return <p className="feedback-state">{label}</p>;
}
