type AppHeaderProps = {
  title?: string;
};

export function AppHeader({ title = 'Noster' }: AppHeaderProps) {
  return (
    <header className="app-header">
      <div>
        <span>Engenharia de decisão com IA</span>
        <h1>{title}</h1>
      </div>
    </header>
  );
}
