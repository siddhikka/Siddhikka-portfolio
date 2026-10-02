import { useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import ImageSlot from "./ImageSlot";

const FRAME_MS = 450;
const LAST_FRAME_MS = 1000;

// Set `src` on a slot to swap in a real photo. Slots without a src are skipped
// once at least one image exists.
const SLOTS: { src?: string; label: string }[] = Array.from(
  { length: 5 },
  (_, index) => ({ src: undefined, label: `Add photo ${index + 1}` }),
);

const TITLE_LINES = ["Clumsy", "Little Love"];
const DESCRIPTION =
  "A little macramé stop-motion shoot, tied together one clumsy knot at a time.";

const pad = (n: number) => String(n).padStart(2, "0");
const spread = (max: number) => (Math.random() * 2 - 1) * max;
const nudge = () => (Math.random() < 0.5 ? -1 : 1) * (1 + Math.random());

export default function StopMotionSection() {
  const reduced = !!useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const lastPointer = useRef("mouse");
  const [entered, setEntered] = useState(false);
  const [inView, setInView] = useState(false);
  const [tabVisible, setTabVisible] = useState(!document.hidden);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [state, setState] = useState({ frame: 0, tick: 0 });

  const frames = useMemo(() => {
    const withImage = SLOTS.map((slot, i) => (slot.src ? i : -1)).filter(
      (i) => i >= 0,
    );
    return withImage.length ? withImage : SLOTS.map((_, i) => i);
  }, []);
  const count = frames.length;

  useEffect(() => {
    SLOTS.forEach((slot) => {
      if (!slot.src) return;
      const img = new Image();
      img.src = slot.src;
    });
  }, []);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setEntered(true);
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    const onVisibility = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const running = !reduced && inView && tabVisible && !hoverPaused;

  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(
      () =>
        setState((s) => ({
          frame: (s.frame + 1) % count,
          tick: s.tick + 1,
        })),
      state.frame === count - 1 ? LAST_FRAME_MS : FRAME_MS,
    );
    return () => window.clearTimeout(id);
  }, [running, state.frame, state.tick, count]);

  const totalLetters = TITLE_LINES.join("").replace(/ /g, "").length;
  const letterJitter = useMemo(
    () =>
      Array.from({ length: totalLetters }, () =>
        reduced || state.tick === 0
          ? { x: 0, y: 0, r: 0 }
          : { x: spread(2), y: spread(2), r: spread(1.5) },
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.tick, reduced, totalLetters],
  );
  const card = useMemo(
    () =>
      reduced || state.tick === 0
        ? { x: 0, y: 0, r: 0 }
        : { x: nudge(), y: nudge(), r: spread(0.6) },
    [state.tick, reduced],
  );

  const goTo = (frame: number) =>
    setState((s) => ({ frame, tick: s.tick + 1 }));

  let letterIndex = 0;
  const activeSlot = frames[state.frame];

  return (
    <section className="stopmotion-section" aria-labelledby="clumsy-title">
      <div
        ref={sectionRef}
        className={`stopmotion${entered ? " is-entered" : ""}`}
      >
        <div className="stopmotion-copy">
          <div className="accent-label sm-label">Macramé · Stop-motion</div>

          <h2 id="clumsy-title" className="sm-title" aria-label="Clumsy Little Love">
            {TITLE_LINES.map((line) => (
              <span className="sm-line" aria-hidden="true" key={line}>
                {line.split(" ").map((word, wordIndex) => (
                  <span key={wordIndex}>
                    {wordIndex > 0 && " "}
                    <span className="sm-word">
                      {[...word].map((char, charIndex) => {
                        const i = letterIndex++;
                        const j = letterJitter[i];
                        return (
                          <span className="sm-mask" key={charIndex}>
                            <span
                              className="sm-char"
                              style={
                                {
                                  "--i": i,
                                  "--lx": `${j.x}px`,
                                  "--ly": `${j.y}px`,
                                  "--lr": `${j.r}deg`,
                                } as React.CSSProperties
                              }
                            >
                              {char}
                            </span>
                          </span>
                        );
                      })}
                    </span>
                  </span>
                ))}
              </span>
            ))}
          </h2>

          <p className="sm-description">{DESCRIPTION}</p>

          <div className="sm-counter">
            <span className="sm-counter-text" aria-live="off">
              FRAME {pad(state.frame + 1)} / {pad(count)}
            </span>
            <div className="sm-ticks">
              {frames.map((_, i) => (
                <button
                  type="button"
                  key={i}
                  className={`sm-tick${i === state.frame ? " is-current" : ""}`}
                  aria-label={`Go to frame ${i + 1}`}
                  aria-current={i === state.frame}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="polaroid-drop">
          <div
            className="polaroid"
            style={
              {
                "--jx": `${card.x}px`,
                "--jy": `${card.y}px`,
                "--jr": `${card.r}deg`,
              } as React.CSSProperties
            }
            onPointerEnter={(e) => {
              lastPointer.current = e.pointerType;
              if (e.pointerType === "mouse" && !reduced) setHoverPaused(true);
            }}
            onPointerLeave={(e) => {
              if (e.pointerType === "mouse") setHoverPaused(false);
            }}
            onPointerDown={(e) => {
              lastPointer.current = e.pointerType;
            }}
            onClick={() => {
              if (lastPointer.current === "touch" && !reduced) {
                setHoverPaused((paused) => !paused);
              }
            }}
          >
            <span className="tape tape--left" aria-hidden="true" />
            <span className="tape tape--right" aria-hidden="true" />
            <div className="polaroid-photo">
              {SLOTS.map((slot, i) => (
                <div
                  className={`polaroid-slot${i === activeSlot ? " is-active" : ""}`}
                  key={slot.label}
                >
                  <ImageSlot src={slot.src} label={slot.label} />
                </div>
              ))}
              {hoverPaused && <span className="polaroid-paused">Paused</span>}
            </div>
            <p className="polaroid-caption">take {pad(state.frame + 1)}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
