import { DecisionChat } from '@/features/decision-management/components/DecisionChat';
import { DecisionSummary } from '@/features/decision-management/components/DecisionSummary';

export default function DecisionsRoute() {
  return (
    <>
      <DecisionChat />
      <DecisionSummary />
    </>
  );
}
