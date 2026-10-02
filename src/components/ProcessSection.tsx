import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

const processSteps = [
  {
    title: "Discover",
    description:
      "Research users, understand pain points, and map the problem space through interviews, surveys, and data analysis.",
  },
  {
    title: "Define",
    description:
      "Synthesize findings into clear problem statements, user personas, and information architectures that guide design decisions.",
  },
  {
    title: "Design",
    description:
      "Wireframe, prototype, and iterate. From low-fidelity sketches to high-fidelity interactive prototypes tested with real users.",
  },
  {
    title: "Deliver",
    description:
      "Hand off polished designs with detailed specs, collaborate with developers, and measure impact through analytics and user feedback.",
  },
];

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

function ProcessCard({
  step,
  index,
  progress,
  reduced,
}: {
  step: (typeof processSteps)[number];
  index: number;
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  const enterStart = index === 0 ? 0 : (index - 1) * 0.3;
  const enterEnd = index === 0 ? 0 : enterStart + 0.3;
  const coverStart = index * 0.3;
  const coverEnd = coverStart + 0.3;
  const isLast = index === processSteps.length - 1;

  const y = useTransform(
    progress,
    [enterStart, Math.max(enterEnd, enterStart + 0.001)],
    ["100vh", "0vh"],
    { ease: easeOut },
  );
  const scale = useTransform(progress, [coverStart, coverEnd], [1, 0.95], {
    ease: easeOut,
  });

  const style =
    reduced || index === 0
      ? isLast
        ? {}
        : reduced
          ? {}
          : { scale }
      : isLast
        ? { y }
        : { y, scale };

  return (
    <motion.article
      className="process-card"
      style={{ ...style, zIndex: index + 1, top: index * 16 }}
    >
      <span className="process-number">
        {String(index + 1).padStart(2, "0")}
      </span>
      <h3>{step.title}</h3>
      <p>{step.description}</p>
    </motion.article>
  );
}

export default function ProcessSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduced = !!useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  return (
    <div className="process-outer">
      <div
        ref={sectionRef}
        className={`process-section${reduced ? " is-static" : ""}`}
      >
        <div className="process-frame">
          <div className="process-left">
            <div className="accent-label">How I work</div>
            <h2>
              <span>My</span>
              <span>Process</span>
            </h2>
          </div>
          <div className="process-stack">
            {processSteps.map((step, index) => (
              <ProcessCard
                key={step.title}
                step={step}
                index={index}
                progress={scrollYProgress}
                reduced={reduced}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
