'use client';

import { useEffect, useRef } from 'react';
import { businessMinds } from '../data/businessMinds';

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

export function BusinessMindsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let frameId = 0;

    const updateRevealProgress = () => {
      frameId = 0;

      const section = sectionRef.current;

      if (!section) {
        return;
      }

      const timeline = section.querySelector<HTMLElement>('.minds-timeline');
      const revealItems = section.querySelectorAll<HTMLElement>('.mind-card, .minds-result');

      revealItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const rawProgress = clamp(
          (window.innerHeight * 0.82 - rect.top) / (window.innerHeight * 0.28),
          0,
          1,
        );
        const progress = easeOutCubic(rawProgress);
        const offset = (1 - progress) * 2.4;

        item.style.opacity = `${progress}`;
        item.style.transform = `translate3d(0, ${offset.toFixed(2)}rem, 0)`;
        item.style.filter = `blur(${((1 - progress) * 6).toFixed(2)}px)`;
      });

      if (!timeline) {
        return;
      }

      const timelineRect = timeline.getBoundingClientRect();
      const viewportAnchor = window.innerHeight * 0.56;
      const lineHead = clamp(viewportAnchor - timelineRect.top, 0, timelineRect.height);
      const lineProgress = timelineRect.height > 0 ? lineHead / timelineRect.height : 0;

      timeline.style.setProperty('--minds-line-progress', lineProgress.toFixed(3));
    };

    const scheduleUpdate = () => {
      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(updateRevealProgress);
    };

    scheduleUpdate();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="business-minds-section"
      aria-labelledby="business-minds-title"
    >
      <div className="minds-intro" id="multi-perspectiva">
        <span>Multi-perspectiva</span>
        <h2 id="business-minds-title">Mentes de negócio</h2>
        <p>
          Uma camada de inteligência estratégica aplicada às suas conversas. O NOSTER vai além da
          transcrição: ele simula diferentes mentes de negócio, do financeiro ao cliente, para
          mapear riscos, intenções e oportunidades em cada reunião.
        </p>
      </div>

      <div className="minds-statement">
        <strong>O NOSTER não responde como uma única IA.</strong>
        <p>
          Ele simula múltiplas mentes estratégicas, criando uma análise rica e multidimensional.
        </p>
      </div>

      <div className="minds-timeline" aria-label="Mentes estratégicas do Noster">
        {businessMinds.map(({ name, description, Icon }) => (
          <article className="mind-card" key={name}>
            <div className="mind-card__icon" aria-hidden="true">
              <Icon size={24} />
            </div>
            <div>
              <h3>{name}</h3>
              <p>{description}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="minds-result">
        <span>Resultado</span>
        <strong>Nenhuma perspectiva perdida. Nenhuma decisão cega.</strong>
      </div>
    </section>
  );
}
