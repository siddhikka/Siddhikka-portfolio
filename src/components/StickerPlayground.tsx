import Matter from "matter-js";
import { type PointerEvent, useEffect, useRef } from "react";

const { Engine, Bodies, Body, Composite, Constraint, Vector } = Matter;

type Shape = "pill" | "square" | "circle";
type Tone = "lavender" | "white" | "outline" | "grey";

const STICKERS: { label: string; shape: Shape; tone: Tone }[] = [
  { label: "Breakdowns", shape: "pill", tone: "lavender" },
  { label: "Caffeine", shape: "circle", tone: "white" },
  { label: "User research", shape: "pill", tone: "outline" },
  { label: "Prototype", shape: "square", tone: "grey" },
  { label: "v2_final_FINAL", shape: "pill", tone: "white" },
  { label: "Ship it", shape: "circle", tone: "lavender" },
  { label: "Coffee #4", shape: "square", tone: "outline" },
  { label: "HTA", shape: "circle", tone: "grey" },
  { label: "Sleep?", shape: "pill", tone: "lavender" },
];

const STEP = 1000 / 60;
const GRAVITY_SCALE = 0.001;
const ALL = 0xffffffff;

type Props = { tidy: boolean; reduced: boolean };

type Sim = {
  setTidy: (tidy: boolean) => void;
  startDrag: (index: number, event: PointerEvent<HTMLElement>) => void;
  moveDrag: (event: PointerEvent<HTMLElement>) => void;
  endDrag: () => void;
};

export default function StickerPlayground({ tidy, reduced }: Props) {
  const arenaRef = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLDivElement | null)[]>([]);
  const sim = useRef<Sim | null>(null);
  const tidyRef = useRef(tidy);

  useEffect(() => {
    const arena = arenaRef.current;
    if (!arena) return;
    const nodes = els.current as HTMLDivElement[];

    const engine = Engine.create({ gravity: { x: 0, y: 1.1, scale: GRAVITY_SCALE } });
    const world = engine.world;
    let W = arena.clientWidth;
    let H = arena.clientHeight;
    let walls: Matter.Body[] = [];
    let slots: { x: number; y: number }[] = [];
    let started = false;
    let visible = false;
    let raf = 0;
    let zTop = 10;
    let drag: { index: number; constraint: Matter.Constraint } | null = null;

    const sizes = nodes.map((n) => ({ w: n.offsetWidth, h: n.offsetHeight }));
    const bodies = STICKERS.map((s, i) => {
      const { w, h } = sizes[i];
      const opts = {
        restitution: 0.35,
        friction: 0.4,
        frictionAir: 0.012,
        density: 0.002,
      };
      if (s.shape === "circle") return Bodies.circle(0, 0, w / 2, opts);
      const radius = s.shape === "pill" ? h / 2 : Math.min(w, h) * 0.2;
      return Bodies.rectangle(0, 0, w, h, { ...opts, chamfer: { radius } });
    });
    Composite.add(world, bodies);

    const buildWalls = () => {
      if (walls.length) Composite.remove(world, walls);
      const t = 400;
      walls = [
        Bodies.rectangle(W / 2, H + t / 2, W + t * 2, t, { isStatic: true }),
        Bodies.rectangle(-t / 2, H / 2 - 5000, t, H + 10000, { isStatic: true }),
        Bodies.rectangle(W + t / 2, H / 2 - 5000, t, H + 10000, { isStatic: true }),
      ];
      Composite.add(world, walls);
    };

    const computeSlots = () => {
      const padX = W < 700 ? 20 : 60;
      const gap = 16;
      const rows: { idx: number[]; h: number }[] = [{ idx: [], h: 0 }];
      let x = padX;
      sizes.forEach((size, i) => {
        if (x + size.w > W - padX && rows[rows.length - 1].idx.length) {
          rows.push({ idx: [], h: 0 });
          x = padX;
        }
        const row = rows[rows.length - 1];
        row.idx.push(i);
        row.h = Math.max(row.h, size.h);
        x += size.w + gap;
      });
      const total = rows.reduce((sum, r) => sum + r.h, 0) + gap * (rows.length - 1);
      let y = H - 32 - total;
      slots = [];
      rows.forEach((row) => {
        let sx = padX;
        row.idx.forEach((i) => {
          slots[i] = { x: sx + sizes[i].w / 2, y: y + row.h / 2 };
          sx += sizes[i].w + gap;
        });
        y += row.h + gap;
      });
    };

    const sync = () => {
      bodies.forEach((b, i) => {
        nodes[i].style.transform = `translate3d(${b.position.x - sizes[i].w / 2}px, ${
          b.position.y - sizes[i].h / 2
        }px, 0) rotate(${b.angle}rad)`;
      });
    };

    const placeTidy = () => {
      bodies.forEach((b, i) => {
        Body.setPosition(b, slots[i]);
        Body.setAngle(b, 0);
      });
      sync();
    };

    const reveal = () => nodes.forEach((n) => n.classList.add("is-ready"));

    const applyMode = (isTidy: boolean) => {
      engine.gravity.scale = isTidy ? 0 : GRAVITY_SCALE;
      bodies.forEach((b) => {
        b.collisionFilter.mask = isTidy ? 0 : ALL;
        if (!started) return;
        if (isTidy) {
          Body.setVelocity(b, { x: b.velocity.x, y: b.velocity.y - 14 });
        } else {
          Body.setVelocity(b, { x: (Math.random() - 0.5) * 6, y: -4 });
          Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.2);
        }
      });
    };

    const start = () => {
      started = true;
      if (reduced) {
        placeTidy();
        reveal();
        return;
      }
      if (tidyRef.current) {
        applyMode(true);
        placeTidy();
      } else {
        bodies.forEach((b, i) => {
          Body.setPosition(b, {
            x: sizes[i].w / 2 + Math.random() * Math.max(1, W - sizes[i].w),
            y: -80 - i * 110,
          });
          Body.setAngle(b, (Math.random() - 0.5) * 0.6);
        });
      }
      sync();
      reveal();
    };

    const wrapAngle = (a: number) => ((((a + Math.PI) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) - Math.PI;

    let last = performance.now();
    let acc = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(now - last, 50);
      last = now;
      if (!started || !visible || reduced) return;
      acc += dt;
      let steps = 0;
      while (acc >= STEP && steps < 3) {
        if (tidyRef.current) {
          bodies.forEach((b, i) => {
            if (drag?.index === i) return;
            const slot = slots[i];
            Body.setVelocity(b, {
              x: b.velocity.x * 0.82 + (slot.x - b.position.x) * 0.06,
              y: b.velocity.y * 0.82 + (slot.y - b.position.y) * 0.06,
            });
            const a = wrapAngle(b.angle);
            Body.setAngle(b, a - a * 0.12);
            Body.setAngularVelocity(b, 0);
          });
        }
        Engine.update(engine, STEP);
        acc -= STEP;
        steps++;
      }
      if (steps === 0) return;
      acc = Math.min(acc, STEP);
      sync();
    };

    const toArena = (event: PointerEvent<HTMLElement>) => {
      const rect = arena.getBoundingClientRect();
      return {
        x: Math.min(W, Math.max(0, event.clientX - rect.left)),
        y: Math.min(H, Math.max(0, event.clientY - rect.top)),
      };
    };

    sim.current = {
      setTidy: (isTidy) => {
        tidyRef.current = isTidy;
        if (reduced) return;
        applyMode(isTidy);
      },
      startDrag: (index, event) => {
        if (!started || reduced) return;
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        const body = bodies[index];
        const p = toArena(event);
        const constraint = Constraint.create({
          pointA: p,
          bodyB: body,
          pointB: Vector.rotate(Vector.sub(p, body.position), -body.angle),
          stiffness: 0.18,
          damping: 0.08,
          length: 0,
        });
        Composite.add(world, constraint);
        drag = { index, constraint };
        nodes[index].classList.add("is-dragging");
        nodes[index].style.zIndex = String(++zTop);
      },
      moveDrag: (event) => {
        if (drag) drag.constraint.pointA = toArena(event);
      },
      endDrag: () => {
        if (!drag) return;
        const { index, constraint } = drag;
        Composite.remove(world, constraint);
        nodes[index].classList.remove("is-dragging");
        const b = bodies[index];
        const speed = Math.hypot(b.velocity.x, b.velocity.y);
        if (speed > 45) Body.setVelocity(b, Vector.mult(b.velocity, 45 / speed));
        drag = null;
      },
    };

    engine.gravity.scale = tidyRef.current ? 0 : GRAVITY_SCALE;
    bodies.forEach((b) => {
      b.collisionFilter.mask = tidyRef.current ? 0 : ALL;
    });
    buildWalls();
    computeSlots();

    const resizeObserver = new ResizeObserver(() => {
      W = arena.clientWidth;
      H = arena.clientHeight;
      buildWalls();
      computeSlots();
      if (!started) return;
      if (reduced) {
        placeTidy();
        return;
      }
      bodies.forEach((b, i) => {
        const x = Math.min(W - sizes[i].w / 2, Math.max(sizes[i].w / 2, b.position.x));
        const y = Math.min(H - sizes[i].h / 2, b.position.y);
        Body.setPosition(b, { x, y });
      });
    });
    resizeObserver.observe(arena);

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !started) start();
      },
      { threshold: 0.25 },
    );
    observer.observe(arena);

    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      resizeObserver.disconnect();
      Composite.clear(world, false);
      Engine.clear(engine);
      sim.current = null;
    };
  }, [reduced]);

  useEffect(() => {
    tidyRef.current = tidy;
    sim.current?.setTidy(tidy);
  }, [tidy]);

  return (
    <div ref={arenaRef} className="sticker-arena">
      {STICKERS.map((sticker, index) => (
        <div
          key={sticker.label}
          ref={(node) => {
            els.current[index] = node;
          }}
          className={`sticker sticker--${sticker.shape} sticker--${sticker.tone}`}
          onPointerDown={(event) => sim.current?.startDrag(index, event)}
          onPointerMove={(event) => sim.current?.moveDrag(event)}
          onPointerUp={() => sim.current?.endDrag()}
          onPointerCancel={() => sim.current?.endDrag()}
        >
          {sticker.label}
        </div>
      ))}
    </div>
  );
}
