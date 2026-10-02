import { type PointerEvent, type ReactNode, useRef } from "react";
import { TransitionLink } from "../app/SiteLayout";

type ButtonProps = {
  variant?: "primary" | "secondary" | "text";
  children: ReactNode;
  to?: string;
  href?: string;
  download?: string;
  onClick?: () => void;
  arrow?: boolean;
  arrowUp?: boolean;
  arrowDown?: boolean;
  onDark?: boolean;
  active?: boolean;
  className?: string;
};

const MAGNET_PX = 10;

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3.5 12.5 12.5 3.5M5 3.5h7.5V11" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function canMagnet() {
  return (
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export default function Button({
  variant = "primary",
  children,
  to,
  href,
  download,
  onClick,
  arrow = true,
  arrowUp = false,
  arrowDown = false,
  onDark = false,
  active = false,
  className = "",
}: ButtonProps) {
  const ref = useRef<HTMLElement>(null);

  const setFill = (event: PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el || event.pointerType === "touch") return;
    const rect = el.getBoundingClientRect();
    const x = Math.min(rect.width, Math.max(0, event.clientX - rect.left));
    const y = Math.min(rect.height, Math.max(0, event.clientY - rect.top));
    const radius = Math.hypot(
      Math.max(x, rect.width - x),
      Math.max(y, rect.height - y),
    );
    el.style.setProperty("--fx", `${x}px`);
    el.style.setProperty("--fy", `${y}px`);
    el.style.setProperty("--fr", `${radius * 2}px`);
  };

  const handleMove = (event: PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el || event.pointerType !== "mouse" || !canMagnet()) return;
    const rect = el.getBoundingClientRect();
    const dx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    const clamp = (n: number) => Math.max(-1, Math.min(1, n)) * MAGNET_PX;
    el.style.translate = `${clamp(dx)}px ${clamp(dy)}px`;
  };

  const handleLeave = (event: PointerEvent<HTMLElement>) => {
    setFill(event);
    if (ref.current) ref.current.style.translate = "";
  };

  const classes = [
    "btn",
    `btn--${variant}`,
    onDark ? "btn--on-dark" : "",
    active ? "is-active" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const inner = (
    <>
      <span className="btn-fill" aria-hidden="true" />
      <span className="btn-label">
        <span className="btn-label-a">{children}</span>
        <span className="btn-label-b" aria-hidden="true">
          {children}
        </span>
      </span>
      {arrow && (
        <span
          className={`btn-arrow${arrowUp ? " btn-arrow--up" : ""}${
            arrowDown ? " btn-arrow--down" : ""
          }`}
          aria-hidden="true"
        >
          <span className="btn-arrow-a">
            <ArrowIcon />
          </span>
          <span className="btn-arrow-b">
            <ArrowIcon />
          </span>
        </span>
      )}
    </>
  );

  const shared = {
    className: classes,
    onPointerEnter: setFill,
    onPointerMove: handleMove,
    onPointerLeave: handleLeave,
  };

  if (to) {
    return (
      <TransitionLink to={to} ref={ref as never} {...shared}>
        {inner}
      </TransitionLink>
    );
  }
  if (href) {
    return (
      <a
        href={href}
        ref={ref as never}
        {...(download !== undefined
          ? { download }
          : { target: "_blank", rel: "noopener noreferrer" })}
        {...shared}
      >
        {inner}
      </a>
    );
  }
  return (
    <button type="button" ref={ref as never} onClick={onClick} {...shared}>
      {inner}
    </button>
  );
}
