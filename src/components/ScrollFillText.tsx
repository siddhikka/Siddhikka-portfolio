import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { type ReactNode, useEffect, useRef, useState } from "react";

const GREY = "#e6e6e6";

function Word({
  word,
  progress,
  range,
  to,
}: {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
  to: string;
}) {
  const color = useTransform(progress, range, [GREY, to]);
  return <motion.span style={{ color }}>{word}</motion.span>;
}

function Mark({
  children,
  instant,
  block,
}: {
  children: ReactNode;
  instant: boolean;
  block: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [on, setOn] = useState(instant);

  useEffect(() => {
    const node = ref.current;
    if (!node || instant) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setOn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.8 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [instant]);

  return (
    <span
      ref={ref}
      className={`mark${block ? " mark--block" : ""}${on ? " is-on" : ""}`}
    >
      {children}
    </span>
  );
}

export default function ScrollFillText({
  text,
  highlight,
  highlightStyle = "underline",
  to = "#2b2b2b",
  className = "",
}: {
  text: string;
  highlight?: string;
  highlightStyle?: "underline" | "block";
  to?: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = !!useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.88", "end 0.55"],
  });

  const at = highlight ? text.indexOf(highlight) : -1;
  const raw =
    at < 0
      ? [{ text, mark: false }]
      : [
          { text: text.slice(0, at), mark: false },
          { text: highlight!, mark: true },
          { text: text.slice(at + highlight!.length), mark: false },
        ];
  const segments = raw
    .filter((segment) => segment.text.trim())
    .map((segment) => ({
      words: segment.text.trim().split(/\s+/),
      mark: segment.mark,
      lead: /^\s/.test(segment.text),
      trail: /\s$/.test(segment.text),
    }));

  const total = segments.reduce((sum, s) => sum + s.words.length, 0);
  let index = 0;

  const renderWords = (words: string[]) =>
    words.map((word, i) => {
      const n = index++;
      const range: [number, number] = [n / total, Math.min(1, (n + 1) / total)];
      return (
        <span key={`${word}-${n}`}>
          {i > 0 && " "}
          {reduced ? (
            <span style={{ color: to }}>{word}</span>
          ) : (
            <Word word={word} progress={scrollYProgress} range={range} to={to} />
          )}
        </span>
      );
    });

  return (
    <p ref={ref} className={className}>
      {segments.map((segment, i) => (
        <span key={i}>
          {segment.lead && " "}
          {segment.mark ? (
            <Mark instant={reduced} block={highlightStyle === "block"}>
              {renderWords(segment.words)}
            </Mark>
          ) : (
            renderWords(segment.words)
          )}
          {segment.trail && " "}
        </span>
      ))}
    </p>
  );
}
