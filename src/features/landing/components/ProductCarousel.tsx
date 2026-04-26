'use client';

import {
  BrainCircuit,
  ChartNoAxesCombined,
  ChevronLeft,
  ChevronRight,
  TriangleAlert,
} from 'lucide-react';
import { useState } from 'react';
import { landingSlides } from '../data/landingSlides';

const slideIcons = {
  problem: TriangleAlert,
  solution: BrainCircuit,
  benefits: ChartNoAxesCombined,
};

export function ProductCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = landingSlides[activeIndex];
  const SlideIcon = slideIcons[activeSlide.icon];

  const goToSlide = (index: number) => {
    const nextIndex = (index + landingSlides.length) % landingSlides.length;
    setActiveIndex(nextIndex);
  };

  return (
    <section className="product-carousel-section" id="produto" aria-labelledby="carousel-title">
      <div className="carousel-return" aria-labelledby="carousel-title">
        <div className="section-heading">
          <span></span>
          <h2 id="carousel-title">O produto em três lâminas.</h2>
        </div>

        <div className="carousel-shell" data-accent={activeSlide.accent}>
          <div className="carousel-panel" aria-live="polite">
            <div className="carousel-art" aria-hidden="true">
              <div className="carousel-art__icon">
                <SlideIcon size={40} />
              </div>
              <div className="carousel-art__bars">
                <span />
                <span />
                <span />
              </div>
              <div className="carousel-art__burst" />
            </div>

            <div className="carousel-copy">
              <div className="carousel-icon" aria-hidden="true">
                <SlideIcon size={34} />
              </div>

              <p className="carousel-eyebrow">{activeSlide.eyebrow}</p>
              <h3>{activeSlide.title}</h3>
              <p>{activeSlide.description}</p>

              <ul className="carousel-points">
                {activeSlide.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="carousel-controls" aria-label="Controles do carrossel">
            <button
              type="button"
              onClick={() => goToSlide(activeIndex - 1)}
              aria-label="Slide anterior"
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button>

            <div className="carousel-dots" aria-label="Selecionar slide">
              {landingSlides.map((slide, index) => (
                <button
                  type="button"
                  className={index === activeIndex ? 'is-active' : undefined}
                  onClick={() => goToSlide(index)}
                  aria-label={`Ir para ${slide.eyebrow}`}
                  aria-current={index === activeIndex ? 'true' : undefined}
                  key={slide.eyebrow}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => goToSlide(activeIndex + 1)}
              aria-label="Próximo slide"
            >
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
