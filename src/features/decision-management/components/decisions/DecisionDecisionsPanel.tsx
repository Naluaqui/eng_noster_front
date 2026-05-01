'use client';

import type { CSSProperties } from 'react';
import { useMemo, useState } from 'react';
import type { Meeting } from '@/features/meetings/types/meeting';
import type {
  DecisionImpactFlowData,
  DecisionWavePoint,
  DecisionWaveSeriesKey,
} from '../../types/decision-management';
import { DecisionImpactFlow } from './DecisionImpactFlow';
import { DecisionMeetingsTable } from './DecisionMeetingsTable';

type ChartPoint = DecisionWavePoint & {
  x: number;
  y: number;
};

const chartConfig = {
  width: 860,
  height: 300,
  padding: {
    top: 26,
    right: 24,
    bottom: 44,
    left: 170,
  },
};

function getSeriesValue(point: DecisionWavePoint, seriesKey: DecisionWaveSeriesKey) {
  return seriesKey === 'priority' ? point.priorityIntensity : point.pressureIntensity;
}

function getX(index: number, total: number) {
  const plotWidth = chartConfig.width - chartConfig.padding.left - chartConfig.padding.right;

  if (total <= 1) {
    return chartConfig.padding.left;
  }

  return chartConfig.padding.left + (index / (total - 1)) * plotWidth;
}

function getY(value: number) {
  const plotHeight = chartConfig.height - chartConfig.padding.top - chartConfig.padding.bottom;

  return chartConfig.padding.top + (1 - value / 100) * plotHeight;
}

function createSmoothPath(points: ChartPoint[]) {
  if (points.length === 0) {
    return '';
  }

  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y}`;
  }

  const commands = [`M ${points[0].x} ${points[0].y}`];

  for (let index = 1; index < points.length; index += 1) {
    const previousPrevious = points[index - 2] ?? points[index - 1];
    const previous = points[index - 1];
    const current = points[index];
    const next = points[index + 1] ?? current;

    const controlPointOneX = previous.x + (current.x - previousPrevious.x) / 6;
    const controlPointOneY = previous.y + (current.y - previousPrevious.y) / 6;
    const controlPointTwoX = current.x - (next.x - previous.x) / 6;
    const controlPointTwoY = current.y - (next.y - previous.y) / 6;

    commands.push(
      `C ${controlPointOneX} ${controlPointOneY}, ${controlPointTwoX} ${controlPointTwoY}, ${current.x} ${current.y}`,
    );
  }

  return commands.join(' ');
}

function createAreaPath(points: ChartPoint[]) {
  if (!points.length) {
    return '';
  }

  const linePath = createSmoothPath(points);
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  const baseY = chartConfig.height - chartConfig.padding.bottom;

  return `${linePath} L ${lastPoint.x} ${baseY} L ${firstPoint.x} ${baseY} Z`;
}

function getTooltipPositionClass(index: number, total: number) {
  if (index <= 1) {
    return 'is-start';
  }

  if (index >= total - 2) {
    return 'is-end';
  }

  return 'is-center';
}

type DecisionDecisionsPanelProps = {
  meetings: Meeting[];
  decisionImpactFlows: Record<string, DecisionImpactFlowData>;
  decisionPriorityWaves: DecisionWavePoint[];
};

export function DecisionDecisionsPanel({
  meetings,
  decisionImpactFlows,
  decisionPriorityWaves,
}: DecisionDecisionsPanelProps) {
  const [selectedMeetingId, setSelectedMeetingId] = useState(meetings[0]?.id ?? '');

  const selectedMeeting = useMemo(
    () => meetings.find((meeting) => meeting.id === selectedMeetingId) ?? meetings[0],
    [meetings, selectedMeetingId],
  );

  const selectedFlow = selectedMeeting ? decisionImpactFlows[selectedMeeting.id] : undefined;

  const latestDecisionWavePoint = decisionPriorityWaves[decisionPriorityWaves.length - 1];

  const getSeriesPoints = (seriesKey: DecisionWaveSeriesKey): ChartPoint[] =>
    decisionPriorityWaves.map((point, index) => ({
      ...point,
      x: getX(index, decisionPriorityWaves.length),
      y: getY(getSeriesValue(point, seriesKey)),
    }));

  const priorityPoints = getSeriesPoints('priority');
  const pressurePoints = getSeriesPoints('pressure');

  const priorityPath = createSmoothPath(priorityPoints);
  const pressurePath = createSmoothPath(pressurePoints);

  const priorityAreaPath = createAreaPath(priorityPoints);
  const pressureAreaPath = createAreaPath(pressurePoints);

  return (
    <section className="decision-decisions-panel" aria-label="Painel de decisões">
      <article
        className="decision-priority-wave-card"
        aria-labelledby="decision-priority-wave-title"
      >
        <header>
          <div>
            <span>Análise de decisão</span>

            <h2 id="decision-priority-wave-title">
              Prioridade Executiva <strong>e Produto Sob Pressão</strong>
            </h2>

            <p>
              Empresário entende onde focar primeiro, qual é a maior dor agora e quais produtos
              estão subindo ou apanhando do mercado.
            </p>
          </div>

          <ul className="decision-priority-wave-card__legend">
            <li className="is-priority">
              <i />
              <span>Prioridade Executiva</span>
              <strong>{latestDecisionWavePoint.focusArea}</strong>
              <small>{latestDecisionWavePoint.biggestPain}</small>
            </li>

            <li className="is-pressure">
              <i />
              <span>Produto Sob Pressão</span>
              <strong>Em baixa: {latestDecisionWavePoint.weakProduct}</strong>
              <small>Em alta: {latestDecisionWavePoint.topProduct}</small>
            </li>
          </ul>
        </header>

        <div className="decision-priority-wave-card__visual">
          <svg
            viewBox={`0 0 ${chartConfig.width} ${chartConfig.height}`}
            role="img"
            aria-label="Ondas de prioridade executiva e produto sob pressão"
          >
            <defs>
              <linearGradient id="priorityAreaGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.03" />
              </linearGradient>

              <linearGradient id="pressureAreaGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#2d8cff" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#2d8cff" stopOpacity="0.03" />
              </linearGradient>
            </defs>

            {[
              { label: 'Atenção crítica', value: 88 },
              { label: 'Atenção alta', value: 66 },
              { label: 'Atenção moderada', value: 44 },
            ].map((tick) => {
              const y = getY(tick.value);

              return (
                <g key={tick.label}>
                  <line
                    className="decision-wave-grid"
                    x1={chartConfig.padding.left}
                    x2={chartConfig.width - chartConfig.padding.right}
                    y1={y}
                    y2={y}
                  />

                  <text className="decision-wave-axis" x={24} y={y + 4} textAnchor="start">
                    {tick.label}
                  </text>
                </g>
              );
            })}

            <g className="decision-wave decision-wave--pressure">
              <path className="decision-wave-area" d={pressureAreaPath} />
              <path className="decision-wave-line" d={pressurePath} />
              <path className="decision-wave-hitbox" d={pressurePath} />

              {pressurePoints.map((point) => (
                <circle
                  className="decision-wave-point"
                  cx={point.x}
                  cy={point.y}
                  r="5"
                  key={`pressure-${point.label}`}
                />
              ))}
            </g>

            <g className="decision-wave decision-wave--priority">
              <path className="decision-wave-area" d={priorityAreaPath} />
              <path className="decision-wave-line" d={priorityPath} />
              <path className="decision-wave-hitbox" d={priorityPath} />

              {priorityPoints.map((point) => (
                <circle
                  className="decision-wave-point"
                  cx={point.x}
                  cy={point.y}
                  r="5.5"
                  key={`priority-${point.label}`}
                />
              ))}
            </g>

            {decisionPriorityWaves.map((point, index) => {
              const x = getX(index, decisionPriorityWaves.length);

              return (
                <text
                  className="decision-wave-month"
                  x={x}
                  y={chartConfig.height - 12}
                  textAnchor="middle"
                  key={`month-${point.label}`}
                >
                  {point.label}
                </text>
              );
            })}
          </svg>

          <div className="decision-wave-point-overlays">
            {decisionPriorityWaves.map((point, index) => {
              const x = getX(index, decisionPriorityWaves.length);
              const y = getY(point.priorityIntensity);
              const tooltipPositionClass = getTooltipPositionClass(
                index,
                decisionPriorityWaves.length,
              );

              return (
                <button
                  className={`decision-wave-point-trigger ${tooltipPositionClass}`}
                  key={`priority-trigger-${point.label}`}
                  type="button"
                  aria-label={`Abrir leitura executiva de ${point.label}`}
                  style={
                    {
                      '--x': `${(x / chartConfig.width) * 100}%`,
                      '--y': `${(y / chartConfig.height) * 100}%`,
                    } as CSSProperties
                  }
                >
                  <span className="decision-wave-tooltip">
                    <strong>{point.label}</strong>

                    <span>
                      <em>Onde focar</em>
                      <b>{point.focusArea}</b>
                    </span>

                    <span>
                      <em>Maior dor agora</em>
                      <b>{point.biggestPain}</b>
                    </span>

                    <span>
                      <em>Ação recomendada</em>
                      <b>{point.recommendedAction}</b>
                    </span>
                  </span>
                </button>
              );
            })}

            {decisionPriorityWaves.map((point, index) => {
              const x = getX(index, decisionPriorityWaves.length);
              const y = getY(point.pressureIntensity);
              const tooltipPositionClass = getTooltipPositionClass(
                index,
                decisionPriorityWaves.length,
              );

              return (
                <button
                  className={`decision-wave-point-trigger decision-wave-point-trigger--pressure ${tooltipPositionClass}`}
                  key={`pressure-trigger-${point.label}`}
                  type="button"
                  aria-label={`Abrir leitura de produto de ${point.label}`}
                  style={
                    {
                      '--x': `${(x / chartConfig.width) * 100}%`,
                      '--y': `${(y / chartConfig.height) * 100}%`,
                    } as CSSProperties
                  }
                >
                  <span className="decision-wave-tooltip">
                    <strong>{point.label}</strong>

                    <span>
                      <em>Produto em alta</em>
                      <b>{point.topProduct}</b>
                    </span>

                    <span>
                      <em>Produto em baixa</em>
                      <b>{point.weakProduct}</b>
                    </span>

                    <span>
                      <em>Leitura de mercado</em>
                      <b>{point.marketReading}</b>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </article>

      <DecisionMeetingsTable
        meetings={meetings}
        selectedMeetingId={selectedMeetingId}
        onOpenMeeting={setSelectedMeetingId}
      />

      {selectedMeeting && selectedFlow ? (
        <DecisionImpactFlow flow={selectedFlow} meeting={selectedMeeting} />
      ) : null}
    </section>
  );
}
