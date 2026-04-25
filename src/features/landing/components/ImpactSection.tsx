import { useEffect, useRef } from 'react';
import type { PointerEvent } from 'react';

export function ImpactSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const updateScrollEnergy = () => {
      const section = sectionRef.current;

      if (!section) {
        return;
      }

      const rect = section.getBoundingClientRect();
      const progress = Math.min(
        1,
        Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)),
      );

      section.style.setProperty('--scroll-shift', `${(progress - 0.5) * 18}%`);
      section.style.setProperty('--scroll-glow', `${0.26 + progress * 0.42}`);
    };

    updateScrollEnergy();
    window.addEventListener('scroll', updateScrollEnergy, { passive: true });
    window.addEventListener('resize', updateScrollEnergy);

    return () => {
      window.removeEventListener('scroll', updateScrollEnergy);
      window.removeEventListener('resize', updateScrollEnergy);
    };
  }, []);

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    event.currentTarget.style.setProperty('--pointer-x', `${x}%`);
    event.currentTarget.style.setProperty('--pointer-y', `${y}%`);
  };

  const handlePointerLeave = () => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    section.style.setProperty('--pointer-x', '50%');
    section.style.setProperty('--pointer-y', '50%');
  };

  return (
    <section
      ref={sectionRef}
      className="impact-section"
      aria-label="Frase de impacto"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <p>
        Decisões críticas não deveriam desaparecer entre atas, áudios e opiniões soltas.
        <strong>Noster transforma ruído em direção.</strong>
      </p>
    </section>
  );
}
