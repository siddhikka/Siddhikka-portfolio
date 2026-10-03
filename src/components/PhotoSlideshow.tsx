import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import photo1 from "../assets/about/photo-1.jpg";
import photo2 from "../assets/about/photo-2.jpg";
import photo3 from "../assets/about/photo-3.jpg";
import photo4 from "../assets/about/photo-4.jpg";
import photo5 from "../assets/about/photo-5.jpg";
import ImageSlot from "./ImageSlot";

const INTERVAL_MS = 3500;

const SLIDES: { src: string; label: string }[] = [
  photo1,
  photo2,
  photo3,
  photo4,
  photo5,
].map((src, index) => ({ src, label: `Photo ${index + 1}` }));

const pad = (n: number) => String(n).padStart(2, "0");

export default function PhotoSlideshow() {
  const reduced = !!useReducedMotion();
  const [state, setState] = useState({ current: 0, prev: -1, step: 0 });

  useEffect(() => {
    let id = 0;
    function stop() {
      window.clearInterval(id);
    }
    function start() {
      stop();
      if (document.hidden) return;
      id = window.setInterval(() => {
        setState((s) => ({
          current: (s.current + 1) % SLIDES.length,
          prev: s.current,
          step: s.step + 1,
        }));
      }, INTERVAL_MS);
    }
    function onVisibility() {
      if (document.hidden) stop();
      else start();
    }
    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const tilt = state.step % 2 === 1 ? "-2deg" : "2deg";

  return (
    <div
      className={`slideshow${reduced ? " is-reduced" : ""}`}
      role="img"
      aria-label="Photo slideshow"
    >
      {SLIDES.map((slide, index) => {
        const isCurrent = index === state.current;
        const isPrev = index === state.prev;
        return (
          <div
            key={slide.label}
            className={`slide${isCurrent ? " is-current" : ""}${
              isCurrent && state.step === 0 ? " is-first" : ""
            }${isPrev ? " is-prev" : ""}`}
            style={isCurrent ? ({ "--tilt": tilt } as React.CSSProperties) : undefined}
          >
            <ImageSlot src={slide.src} label={slide.label} />
          </div>
        );
      })}
      <span className="slide-counter">
        {pad(state.current + 1)} / {pad(SLIDES.length)}
      </span>
    </div>
  );
}
