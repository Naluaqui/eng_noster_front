'use client';

import { useEffect, useRef } from 'react';

const impactText = [
  {
    text: 'Decisões críticas não deveriam desaparecer entre atas, áudios e opiniões soltas.',
    emphasis: false,
  },
  {
    text: 'Noster transforma ruído em direção.',
    emphasis: true,
  },
];

type ImpactLetter = {
  char: string;
  id: string;
  scatterX: number;
  scatterY: number;
  scatterRotate: number;
  scatterScale: number;
};

type ImpactWord = {
  id: string;
  letters: ImpactLetter[];
};

type ImpactLine = {
  id: string;
  emphasis: boolean;
  words: ImpactWord[];
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

function getScatterValues(letterIndex: number, wordIndex: number, lineIndex: number) {
  const angle = (((letterIndex * 137 + wordIndex * 29 + lineIndex * 47) % 360) * Math.PI) / 180;
  const distance = 42 + (letterIndex % 7) * 13 + lineIndex * 16;
  const direction = letterIndex % 2 === 0 ? 1 : -1;

  return {
    scatterX: Math.round(Math.cos(angle) * distance + ((wordIndex % 3) - 1) * 22),
    scatterY: Math.round(Math.sin(angle) * distance + ((letterIndex % 5) - 2) * 12),
    scatterRotate: (((letterIndex * 31) % 96) - 48) * direction,
    scatterScale: 0.78 + (letterIndex % 5) * 0.06,
  };
}

function buildImpactLines() {
  let letterCount = 0;

  return impactText.map((line, lineIndex): ImpactLine => {
    const words = line.text.split(' ').map((word, wordIndex): ImpactWord => {
      const letters = Array.from(word).map((char, charIndex): ImpactLetter => {
        const scatter = getScatterValues(letterCount, wordIndex, lineIndex);
        const letter: ImpactLetter = {
          char,
          id: `${lineIndex}-${wordIndex}-${charIndex}`,
          ...scatter,
        };

        letterCount += 1;

        return letter;
      });

      return {
        id: `${lineIndex}-${wordIndex}`,
        letters,
      };
    });

    return {
      id: `${lineIndex}-${line.text}`,
      emphasis: line.emphasis,
      words,
    };
  });
}

const impactLines = buildImpactLines();
const accessibleText = impactText.map((line) => line.text).join(' ');

function getLetterTransform(letter: Pick<ImpactLetter, 'scatterX' | 'scatterY' | 'scatterRotate' | 'scatterScale'>, progress: number) {
  const unresolved = 1 - progress;
  const x = letter.scatterX * unresolved;
  const y = letter.scatterY * unresolved;
  const rotation = letter.scatterRotate * unresolved;
  const scale = 1 + (letter.scatterScale - 1) * unresolved;

  return `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${rotation.toFixed(
    2,
  )}deg) scale(${scale.toFixed(3)})`;
}

export function ImpactSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let frameId = 0;

    const updateScrollProgress = () => {
      frameId = 0;

      const section = sectionRef.current;

      if (!section) {
        return;
      }

      const rect = section.getBoundingClientRect();
      const animationStart = window.innerHeight * 0.40;
      const animationEnd = window.innerHeight * -0.08;
      const rawProgress = clamp((animationStart - rect.top) / (animationStart - animationEnd), 0, 1);
      const progress = easeOutCubic(rawProgress);
      const letters = section.querySelectorAll<HTMLElement>('.impact-letter');

      section.style.setProperty('--impact-progress', progress.toFixed(3));

      letters.forEach((letter) => {
        const scatterX = Number(letter.dataset.scatterX);
        const scatterY = Number(letter.dataset.scatterY);
        const scatterRotate = Number(letter.dataset.scatterRotate);
        const scatterScale = Number(letter.dataset.scatterScale);

        letter.style.opacity = `${0.46 + progress * 0.54}`;
        letter.style.transform = getLetterTransform(
          {
            scatterX,
            scatterY,
            scatterRotate,
            scatterScale,
          },
          progress,
        );
      });
    };

    const scheduleUpdate = () => {
      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(updateScrollProgress);
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
    <section ref={sectionRef} className="impact-section" aria-label="Frase de impacto">
      <p className="impact-copy" aria-label={accessibleText}>
        {impactLines.map((line) => {
          const LineTag = line.emphasis ? 'strong' : 'span';

          return (
            <LineTag
              className={`impact-line${line.emphasis ? ' impact-line--emphasis' : ''}`}
              aria-hidden="true"
              key={line.id}
            >
              {line.words.map((word) => (
                <span className="impact-word" key={word.id}>
                  {word.letters.map((letter) => (
                    <span
                      className="impact-letter"
                      data-scatter-rotate={letter.scatterRotate}
                      data-scatter-scale={letter.scatterScale}
                      data-scatter-x={letter.scatterX}
                      data-scatter-y={letter.scatterY}
                      key={letter.id}
                      style={{
                        opacity: 0.46,
                        transform: getLetterTransform(letter, 0),
                      }}
                    >
                      {letter.char}
                    </span>
                  ))}
                </span>
              ))}
            </LineTag>
          );
        })}
      </p>
    </section>
  );
}
