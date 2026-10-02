import { useReducedMotion } from "framer-motion";
import { type PointerEvent, useEffect, useRef, useState } from "react";
import { scrollToTop } from "../app/scroll";
import Button from "./Button";
import StickerPlayground from "./StickerPlayground";

const EMAIL = "thoratsiddhikka@gmail.com";
const TAGLINE = "Made with breakdowns and a lot of caffeine ☕";
const HINT_CHAOS = "Drag the stickers. Double-click to tidy up.";
const HINT_TIDY = "Double-click to mess it up again";

const SOCIALS = [
  { label: "LinkedIn", href: "https://www.linkedin.com" },
  { label: "Instagram", href: "https://www.instagram.com" },
  { label: "Behance", href: "https://www.behance.net" },
];

const INTERACTIVE = "a, button, .sticker, [data-cursor]";
const IGNORE_TIDY_TOGGLE = "a, button, .sticker";

export default function SiteFooter() {
  const reduced = !!useReducedMotion();
  const footerRef = useRef<HTMLElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const lastPointerType = useRef("mouse");
  const lastTap = useRef({ time: 0, x: 0, y: 0 });
  const downAt = useRef({ x: 0, y: 0, ok: false });
  const copyTimer = useRef(0);
  const [tidy, setTidy] = useState(reduced);
  const [copied, setCopied] = useState(false);
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    setCoarse(window.matchMedia("(pointer: coarse)").matches);
    return () => window.clearTimeout(copyTimer.current);
  }, []);

  useEffect(() => {
    if (reduced) setTidy(true);
  }, [reduced]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      return;
    }
    setCopied(true);
    window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopied(false), 2000);
  };

  const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
    lastPointerType.current = event.pointerType;
    downAt.current = {
      x: event.clientX,
      y: event.clientY,
      ok: !(event.target as HTMLElement).closest(IGNORE_TIDY_TOGGLE),
    };
  };

  const handlePointerUp = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "touch" || reduced || !downAt.current.ok) return;
    const moved = Math.hypot(
      event.clientX - downAt.current.x,
      event.clientY - downAt.current.y,
    );
    if (moved > 10) return;
    const now = performance.now();
    const tap = lastTap.current;
    if (now - tap.time < 350 && Math.hypot(event.clientX - tap.x, event.clientY - tap.y) < 40) {
      setTidy((value) => !value);
      lastTap.current = { time: 0, x: 0, y: 0 };
    } else {
      lastTap.current = { time: now, x: event.clientX, y: event.clientY };
    }
  };

  const handleDoubleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (reduced || lastPointerType.current === "touch") return;
    if ((event.target as HTMLElement).closest(IGNORE_TIDY_TOGGLE)) return;
    setTidy((value) => !value);
  };

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    const dot = dotRef.current;
    const footer = footerRef.current;
    if (!dot || !footer || event.pointerType !== "mouse") return;
    const rect = footer.getBoundingClientRect();
    dot.style.transform = `translate(${event.clientX - rect.left}px, ${
      event.clientY - rect.top
    }px) translate(-50%, -50%)`;
    dot.classList.add("is-visible");
    dot.classList.toggle(
      "is-grown",
      !!(event.target as HTMLElement).closest(INTERACTIVE),
    );
  };

  const hint = tidy && !reduced ? HINT_TIDY : HINT_CHAOS;

  return (
    <footer
      id="contact"
      ref={footerRef}
      className="site-footer"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => dotRef.current?.classList.remove("is-visible")}
      onDoubleClick={handleDoubleClick}
    >
      <div className="footer-main">
        <div className="footer-top">
          <div className="footer-lead">
            <h2 className="footer-headline" aria-label="Say hi">
              <span aria-hidden="true">SAY</span>
              <span className="footer-hi" data-cursor aria-hidden="true">
                HI
              </span>
            </h2>
            <div className="footer-email-row">
              <a className="footer-email" href={`mailto:${EMAIL}`}>
                {EMAIL}
              </a>
              <Button
                variant="secondary"
                onDark
                arrow={false}
                onClick={copyEmail}
              >
                {copied ? "Copied ✓" : "Copy"}
              </Button>
            </div>
            <p className="footer-hint" aria-live="polite">
              {coarse ? hint.replace("click", "tap") : hint}
            </p>
          </div>
          <ul className="footer-socials">
            {SOCIALS.map((social) => (
              <li key={social.label}>
                <Button
                  variant="text"
                  onDark
                  href={social.href}
                  className="footer-social"
                >
                  {social.label.toUpperCase()}
                </Button>
              </li>
            ))}
          </ul>
        </div>
        <StickerPlayground tidy={tidy} reduced={reduced} />
      </div>

      <div className="footer-bar">
        <span className="footer-copyright">© 2026 Siddhikka</span>
        <span className="footer-tagline">{TAGLINE}</span>
        <Button
          variant="secondary"
          onDark
          arrowUp
          onClick={() => scrollToTop(600)}
        >
          Back to top
        </Button>
      </div>
      <div ref={dotRef} className="footer-cursor" aria-hidden="true" />
    </footer>
  );
}
