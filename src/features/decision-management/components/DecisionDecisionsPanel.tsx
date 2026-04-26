'use client';

import { useMemo, useState } from 'react';
import { meetings } from '@/features/meetings/data/meetings';
import { decisionImpactFlows } from '../data/decisionImpactFlows';
import { DecisionImpactFlow } from './DecisionImpactFlow';
import { DecisionMeetingsTable } from './DecisionMeetingsTable';

const decisionPoints = [
  { label: 'Jan', value: '42k', x: 48, y: 154 },
  { label: 'Mar', value: '78k', x: 168, y: 112 },
  { label: 'Mai', value: '91k', x: 302, y: 82 },
  { label: 'Jul', value: '63k', x: 444, y: 130 },
  { label: 'Set', value: '104k', x: 572, y: 64 },
] as const;

export function DecisionDecisionsPanel() {
  const [selectedMeetingId, setSelectedMeetingId] = useState(meetings[0]?.id ?? '');
  const selectedMeeting = useMemo(
    () => meetings.find((meeting) => meeting.id === selectedMeetingId) ?? meetings[0],
    [selectedMeetingId],
  );
  const selectedFlow = selectedMeeting ? decisionImpactFlows[selectedMeeting.id] : undefined;

  return (
    <section className="decision-decisions-panel" aria-label="Painel de decisões">
      <article className="decision-inspiring-chart-card" aria-labelledby="decision-inspiring-chart-title">
        <header>
          <h2 id="decision-inspiring-chart-title">
            Some cool and <strong>inspiring words</strong>
            <span>goes here.</span>
          </h2>
        </header>

        <div className="decision-inspiring-chart-card__visual" aria-hidden="true">
          <svg viewBox="0 0 640 220" role="img">
            <defs>
              <linearGradient id="decisionAreaPrimary" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#37dff0" stopOpacity="0.94" />
                <stop offset="54%" stopColor="#1a8fff" stopOpacity="0.74" />
                <stop offset="100%" stopColor="#865cff" stopOpacity="0.22" />
              </linearGradient>
              <linearGradient id="decisionAreaSecondary" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#b9fbff" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#4db5ff" stopOpacity="0.2" />
              </linearGradient>
              <filter id="decisionPointGlow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <path
              className="decision-inspiring-chart-card__back-area"
              d="M0 172 C52 112 96 118 144 150 C208 194 246 62 314 86 C374 108 396 166 456 130 C532 84 584 110 640 70 L640 220 L0 220 Z"
              fill="url(#decisionAreaSecondary)"
            />
            <path
              className="decision-inspiring-chart-card__front-area"
              d="M0 178 C44 86 96 76 150 136 C198 188 260 146 302 74 C348 -6 426 8 454 86 C486 176 536 154 576 108 C604 76 622 68 640 76 L640 220 L0 220 Z"
              fill="url(#decisionAreaPrimary)"
            />
            <path
              className="decision-inspiring-chart-card__line"
              d="M0 178 C44 86 96 76 150 136 C198 188 260 146 302 74 C348 -6 426 8 454 86 C486 176 536 154 576 108 C604 76 622 68 640 76"
              fill="none"
            />

            {decisionPoints.map((point) => (
              <g key={point.label}>
                <line x1={point.x} x2={point.x} y1={point.y + 10} y2="198" />
                <circle cx={point.x} cy={point.y} r="10" filter="url(#decisionPointGlow)" />
                <circle cx={point.x} cy={point.y} r="4" />
              </g>
            ))}
          </svg>

          <ul>
            {decisionPoints.map((point) => (
              <li key={point.label}>
                <strong>{point.value}</strong>
                <span>{point.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </article>

      <DecisionMeetingsTable selectedMeetingId={selectedMeetingId} onOpenMeeting={setSelectedMeetingId} />

      {selectedMeeting && selectedFlow ? <DecisionImpactFlow flow={selectedFlow} meeting={selectedMeeting} /> : null}
    </section>
  );
}
