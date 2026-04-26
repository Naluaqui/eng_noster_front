const decisionManagementTabs = [
  { id: 'general', label: 'Geral' },
  { id: 'decisions', label: 'Decisões' },
] as const;

export type DecisionManagementTab = (typeof decisionManagementTabs)[number]['id'];

type DecisionManagementNavigationProps = {
  activeTab: DecisionManagementTab;
  onTabChange: (tab: DecisionManagementTab) => void;
};

export function DecisionManagementNavigation({ activeTab, onTabChange }: DecisionManagementNavigationProps) {
  return (
    <nav className="decision-management-navigation" aria-label="Navegação da gestão de decisão">
      <div className="decision-management-navigation__tabs" role="tablist" aria-label="Áreas da gestão de decisão">
        {decisionManagementTabs.map((tab) => (
          <button
            aria-controls={`decision-management-${tab.id}-panel`}
            aria-selected={activeTab === tab.id}
            className={activeTab === tab.id ? 'is-active' : undefined}
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            role="tab"
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
