import {
  type ComponentProps,
  createContext,
  type MouseEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import SiteFooter from "../components/SiteFooter";
import { scrollToTop } from "./scroll";

type TransitionPhase = "idle" | "exit" | "enter";

type TransitionContextValue = {
  go: (to: string) => void;
};

const TransitionContext = createContext<TransitionContextValue | null>(null);

export function useSiteNavigate() {
  const context = useContext(TransitionContext);
  if (!context) throw new Error("useSiteNavigate must be used inside SiteLayout");
  return context.go;
}

type TransitionLinkProps = Omit<ComponentProps<typeof Link>, "to"> & {
  to: string;
};

export function TransitionLink({ to, onClick, ...rest }: TransitionLinkProps) {
  const go = useSiteNavigate();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    go(to);
  };

  return <Link to={to} onClick={handleClick} {...rest} />;
}

export default function SiteLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const timers = useRef<number[]>([]);

  useEffect(
    () => () => {
      timers.current.forEach(window.clearTimeout);
    },
    [],
  );

  const go = useCallback(
    (to: string) => {
      const [rawPath, hash] = to.split("#");
      const path = rawPath || location.pathname;
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const scrollToHash = () =>
        document
          .getElementById(hash)
          ?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });

      if (path === location.pathname) {
        if (hash) scrollToHash();
        else scrollToTop();
        return;
      }
      if (phase !== "idle") return;

      const finish = () => {
        navigate(path);
        window.scrollTo(0, 0);
        if (hash) timers.current.push(window.setTimeout(scrollToHash, 120));
      };

      if (reduceMotion) {
        finish();
        return;
      }

      setPhase("exit");
      timers.current.push(
        window.setTimeout(() => {
          finish();
          setPhase("enter");
          timers.current.push(
            window.setTimeout(() => setPhase("idle"), 420),
          );
        }, 250),
      );
    },
    [location.pathname, navigate, phase],
  );

  const value = useMemo(() => ({ go }), [go]);

  return (
    <TransitionContext.Provider value={value}>
      <Navbar />
      <div className={`route-stage route-${phase}`} key={location.pathname}>
        <Outlet />
        <SiteFooter />
      </div>
      <div className={`page-wipe page-wipe-${phase}`} aria-hidden="true" />
    </TransitionContext.Provider>
  );
}
