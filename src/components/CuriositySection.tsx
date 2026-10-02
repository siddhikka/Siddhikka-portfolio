import { useReducedMotion } from "framer-motion";
import { type PointerEvent, useEffect, useRef, useState } from "react";
import ActivityCard, { type Activity } from "./ActivityCard";
import Button from "./Button";

const SPEED_PX_PER_S = 50;
const EASE_TAU_MS = 130;
const HOLD_MS = 250;

const LETTERBOXD_ID = "YOUR-LETTERBOXD-ID";
const LETTERBOXD_URL = `https://letterboxd.com/${LETTERBOXD_ID}`;

const ACTIVITIES: Activity[] = [
  {
    number: "01",
    title: "Visiting design studios",
    description: "Peeking into how other designers think, sketch and make.",
    tags: ["Studios", "Process"],
    tone: "wash",
    tilt: -2,
  },
  {
    number: "02",
    title: "Attending design conferences",
    description:
      "Soaking up talks, meeting designers and coming home with way too many notes.",
    tags: ["Conferences", "Talks"],
    tone: "grey",
    tilt: 1,
    icon: "microphone",
  },
  {
    number: "03",
    title: "Letters and zines",
    description:
      "Hand-written letters and little zines for my friends. If you’re close to me, you’ve probably got one.",
    tags: ["Letters", "Zines"],
    tone: "dark",
    tilt: 0,
  },
  {
    number: "04",
    title: "Watching movies",
    description: "Always logging what I watch.",
    tags: ["Film", "Letterboxd"],
    tone: "lavender",
    tilt: 2,
  },
  {
    number: "05",
    title: "Trekking and travelling",
    description: "Chasing trails, new places and a good view at the top.",
    tags: ["Trekking", "Travel"],
    tone: "white",
    tilt: -1,
    icon: "mountain",
  },
  {
    number: "06",
    title: "Cooking and game nights",
    description: "Feed my friends first, then beat them at board games.",
    tags: ["Cooking", "Game nights"],
    tone: "grey",
    tilt: 1,
  },
];

function PauseIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className={`pause-icon${filled ? " is-filled" : ""}`}
      viewBox="0 0 12 12"
      aria-hidden="true"
    >
      <rect x="2.5" y="2" width="2.5" height="8" rx="0.6" />
      <rect x="7" y="2" width="2.5" height="8" rx="0.6" />
    </svg>
  );
}

function CardSet({ inert = false }: { inert?: boolean }) {
  return (
    <div className="activity-set" aria-hidden={inert || undefined} inert={inert}>
      {ACTIVITIES.map((activity) => (
        <ActivityCard activity={activity} key={activity.number}>
          {activity.number === "04" && (
            <div className="activity-extra">
              <a className="activity-handle" href={LETTERBOXD_URL}>
                @{LETTERBOXD_ID}
              </a>
              <Button variant="secondary" href={LETTERBOXD_URL}>
                Open Letterboxd
              </Button>
            </div>
          )}
        </ActivityCard>
      ))}
    </div>
  );
}

export default function CuriositySection() {
  const reduced = !!useReducedMotion();
  const [paused, setPausedState] = useState(false);
  const pausedRef = useRef(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const holdTimer = useRef(0);

  const setPaused = (value: boolean) => {
    pausedRef.current = value;
    setPausedState(value);
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track || reduced) return;
    let offset = 0;
    let speed = SPEED_PX_PER_S;
    let last = performance.now();
    let raf = 0;

    const loop = (now: number) => {
      const dt = Math.min(now - last, 64);
      last = now;
      const target = pausedRef.current ? 0 : SPEED_PX_PER_S;
      speed += (target - speed) * (1 - Math.exp(-dt / EASE_TAU_MS));
      offset += (speed * dt) / 1000;
      const setWidth = track.offsetWidth / 2;
      if (setWidth > 0 && offset >= setWidth) offset -= setWidth;
      track.style.transform = `translate3d(${-offset}px, 0, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  useEffect(() => () => window.clearTimeout(holdTimer.current), []);

  const handleEnter = (event: PointerEvent) => {
    if (event.pointerType === "mouse") setPaused(true);
  };
  const handleLeave = (event: PointerEvent) => {
    if (event.pointerType === "mouse") setPaused(false);
    else release();
  };
  const handleDown = (event: PointerEvent) => {
    if (event.pointerType !== "touch") return;
    window.clearTimeout(holdTimer.current);
    holdTimer.current = window.setTimeout(() => setPaused(true), HOLD_MS);
  };
  const release = () => {
    window.clearTimeout(holdTimer.current);
    setPaused(false);
  };

  return (
    <section className="curious-section" aria-labelledby="curious-title">
      <header className="curious-header">
        <div>
          <div className="accent-label">Beyond the screen</div>
          <h2 id="curious-title">Things That Keep Me Curious</h2>
        </div>
        {!reduced && (
          <div className="curious-hint" aria-live="polite">
            <PauseIcon filled={paused} />
            <span>{paused ? "Paused" : "Hover to pause"}</span>
          </div>
        )}
      </header>

      <div
        className={`activity-viewport${reduced ? " is-manual" : ""}`}
        onPointerEnter={handleEnter}
        onPointerLeave={handleLeave}
        onPointerDown={handleDown}
        onPointerUp={release}
        onPointerCancel={release}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <div ref={trackRef} className="activity-track">
          <CardSet />
          {!reduced && <CardSet inert />}
        </div>
      </div>
    </section>
  );
}
