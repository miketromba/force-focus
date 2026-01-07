import { useState } from "react";
import promo1 from "../assets/promo-1.png";
import promo2 from "../assets/promo-2.png";
import promo3 from "../assets/promo-3.png";
import promo4 from "../assets/promo-4.png";
import promo5 from "../assets/promo-5.png";
import promo6 from "../assets/promo-6.png";

const slides = [
  { src: promo1, alt: "Set a new focus goal every morning" },
  { src: promo2, alt: "Lock distracting sites until you complete your goal" },
  { src: promo3, alt: "Configure which sites are allowed" },
  { src: promo4, alt: "Easily add websites to your allowed list" },
  { src: promo5, alt: "Automatically reset your goal every morning" },
  { src: promo6, alt: "Toggle focus mode on/off with a click" },
];

export function Showcase() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === slides.length - 1 ? 0 : c + 1));
  const goTo = (index: number) => setCurrent(index);

  return (
    <section className="mb-20">
      <h2 className="text-2xl font-semibold mb-8">See It In Action</h2>

      <div className="relative">
        {/* Main Image */}
        <div className="relative overflow-hidden rounded-xl border border-border shadow-2xl shadow-black/40">
          <img
            src={slides[current].src}
            alt={slides[current].alt}
            className="w-full h-auto block"
          />
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface/90 border border-border-light flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-elevated transition-all"
          aria-label="Previous slide"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface/90 border border-border-light flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-elevated transition-all"
          aria-label="Next slide"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Dots Navigation */}
      <div className="flex justify-center gap-2 mt-6">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              index === current
                ? "bg-primary w-8"
                : "bg-border-light hover:bg-text-muted"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
