import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Button from "./Button";
import ImageSlot from "./ImageSlot";
import ScrollFillText from "./ScrollFillText";

// Clear this string to remove the "Visit Ivory" button.
const IVORY_URL = "https://instagram.com/YOUR-IVORY-HANDLE";

const COLLAGE_W = 640;
const COLLAGE_H = 720;
const BADGE_TEXT = "IVORY · HAND-PAINTED · SMALL BATCH ·";

type Shape = "round" | "arch" | "circle";

// Positions are in a 640x720 design space; they scale as percentages.
// `src` swaps in a real photo. `parallax` is the [from, to] vertical shift in px.
const PHOTOS: {
  label: string;
  src?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rot: number;
  rotMobile: number;
  shape: Shape;
  parallax: [number, number];
}[] = [
  { label: "Add photo: stall", x: 0, y: 30, w: 280, h: 360, rot: -3, rotMobile: -1.5, shape: "round", parallax: [-30, 10] },
  { label: "Add photo: totes", x: 262, y: 0, w: 240, h: 240, rot: 4, rotMobile: 2, shape: "round", parallax: [10, -20] },
  { label: "Add photo: totes", x: 175, y: 300, w: 300, h: 220, rot: -2, rotMobile: -1, shape: "round", parallax: [-10, 30] },
  { label: "Add photo: process", x: 420, y: 190, w: 220, h: 300, rot: 3, rotMobile: 1.5, shape: "arch", parallax: [40, -10] },
  { label: "Add photo: stall", x: 20, y: 480, w: 200, h: 200, rot: 0, rotMobile: 0, shape: "circle", parallax: [-20, 50] },
  { label: "Add photo: details", x: 370, y: 510, w: 260, h: 200, rot: -4, rotMobile: -2, shape: "round", parallax: [20, -30] },
];

function useIsMobile() {
  const [mobile, setMobile] = useState(
    () => window.matchMedia("(max-width: 700px)").matches,
  );
  useEffect(() => {
    const query = window.matchMedia("(max-width: 700px)");
    const update = () => setMobile(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return mobile;
}

function CollageItem({
  photo,
  index,
  zIndex,
  progress,
  entered,
  reduced,
  mobile,
  constraints,
  onFront,
}: {
  photo: (typeof PHOTOS)[number];
  index: number;
  zIndex: number;
  progress: MotionValue<number>;
  entered: boolean;
  reduced: boolean;
  mobile: boolean;
  constraints: React.RefObject<HTMLDivElement | null>;
  onFront: () => void;
}) {
  const y = useTransform(progress, [0, 1], photo.parallax);
  const style = {
    "--l": `${(photo.x / COLLAGE_W) * 100}%`,
    "--t": `${(photo.y / COLLAGE_H) * 100}%`,
    "--w": `${(photo.w / COLLAGE_W) * 100}%`,
    "--h": `${(photo.h / COLLAGE_H) * 100}%`,
    "--ar": `${photo.w} / ${photo.h}`,
    "--rot": `${photo.rot}deg`,
    "--rot-m": `${photo.rotMobile}deg`,
    "--z": zIndex,
  } as React.CSSProperties;

  return (
    <motion.div
      className="collage-item"
      style={{ ...style, y: reduced || mobile ? 0 : y }}
    >
      <motion.div
        className="collage-drag"
        drag={!mobile}
        dragConstraints={constraints}
        dragElastic={0.2}
        dragMomentum
        onPointerDown={onFront}
        style={mobile ? undefined : { touchAction: "none" }}
      >
        <div className="collage-tilt">
          <motion.div
            className={`collage-photo collage-photo--${photo.shape}`}
            initial={reduced ? false : { scale: 0.88, rotate: 8, opacity: 0 }}
            animate={
              entered || reduced
                ? { scale: 1, rotate: 0, opacity: 1 }
                : { scale: 0.88, rotate: 8, opacity: 0 }
            }
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 13,
              delay: index * 0.1,
            }}
          >
            <ImageSlot src={photo.src} label={photo.label} />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Badge({ entered, reduced }: { entered: boolean; reduced: boolean }) {
  const spinRef = useRef<HTMLDivElement>(null);
  const hovering = useRef(false);

  useEffect(() => {
    const node = spinRef.current;
    if (!node || reduced) return;
    let angle = 0;
    let speed = 360 / 20;
    let last = performance.now();
    let raf = 0;
    const loop = (now: number) => {
      const dt = Math.min(now - last, 64);
      last = now;
      const target = hovering.current ? 360 / 4 : 360 / 20;
      speed += (target - speed) * (1 - Math.exp(-dt / 250));
      angle = (angle + (speed * dt) / 1000) % 360;
      node.style.rotate = `${angle}deg`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  return (
    <motion.div
      className="collage-badge"
      initial={reduced ? false : { scale: 0, opacity: 0 }}
      animate={
        entered || reduced
          ? { scale: 1, opacity: 1 }
          : { scale: 0, opacity: 0 }
      }
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 13,
        delay: PHOTOS.length * 0.1,
      }}
    >
      <div
        ref={spinRef}
        className="collage-badge-spin"
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") hovering.current = true;
        }}
        onPointerLeave={() => {
          hovering.current = false;
        }}
      >
        <svg viewBox="0 0 110 110" aria-hidden="true">
          <defs>
            <path
              id="badge-circle"
              d="M 55,55 m -41,0 a 41,41 0 1,1 82,0 a 41,41 0 1,1 -82,0"
            />
          </defs>
          <text className="badge-text" textLength="256" lengthAdjust="spacing">
            <textPath href="#badge-circle">{BADGE_TEXT}</textPath>
          </text>
        </svg>
        <span className="badge-star" aria-hidden="true">
          ✦
        </span>
      </div>
    </motion.div>
  );
}

export default function TinyVenturesSection() {
  const reduced = !!useReducedMotion();
  const mobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const collageRef = useRef<HTMLDivElement>(null);
  const zTop = useRef(10);
  const [entered, setEntered] = useState(false);
  const [zOrder, setZOrder] = useState(PHOTOS.map((_, i) => i + 1));

  const { scrollYProgress } = useScroll({
    target: collageRef,
    offset: ["start end", "end start"],
  });

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const bringToFront = (index: number) =>
    setZOrder((order) => {
      if (order[index] === zTop.current) return order;
      const next = [...order];
      next[index] = ++zTop.current;
      return next;
    });

  return (
    <section
      ref={sectionRef}
      className="tiny-section"
      aria-labelledby="tiny-title"
    >
      <div className="tiny-layout">
        <div className="tiny-collage-wrap">
          <div className="collage-stage">
            <Badge entered={entered} reduced={reduced} />
            <div ref={collageRef} className="collage">
              {PHOTOS.map((photo, index) => (
                <CollageItem
                  key={index}
                  photo={photo}
                  index={index}
                  zIndex={zOrder[index]}
                  progress={scrollYProgress}
                  entered={entered}
                  reduced={reduced}
                  mobile={mobile}
                  constraints={collageRef}
                  onFront={() => bringToFront(index)}
                />
              ))}
            </div>
          </div>
          <p className="collage-hint">Drag to rearrange</p>
        </div>

        <div className="tiny-copy">
          <div className="accent-label">Side quest</div>
          <h2 id="tiny-title" className="tiny-title">
            <span>Tiny</span>
            <span>Ventures</span>
          </h2>
          <div className="tiny-story">
            <ScrollFillText text="I’ve always loved painting, so in 2024, a casual idea turned into something a little more real." />
            <ScrollFillText
              highlight="Ivory"
              highlightStyle="block"
              text="I co-founded Ivory, a small business where we hand-paint tote bags and turn everyday things into something a little more personal. What started as a love for painting became a way to experiment, make things with our hands, and actually put our work out into the world."
            />
            <ScrollFillText
              highlight="side quest"
              text="It’s small, handmade, and very much a side quest, but it taught me a lot about sourcing the fabrics and materials, making, selling, figuring things out as we go, and building something from scratch."
            />
          </div>
          {IVORY_URL && (
            <div className="tiny-cta">
              <Button variant="secondary" href={IVORY_URL}>
                Visit Ivory
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
