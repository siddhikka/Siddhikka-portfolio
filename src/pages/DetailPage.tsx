import { useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useParams } from "react-router";
import Button from "../components/Button";
import {
  projects,
  type Project,
  type Slide,
} from "../components/PortfolioComponents";

const SITE_NAME = "Siddhikka";

function titleFromSlug(slug: string) {
  const projectNumber = slug.match(/^project-(\d+)$/)?.[1];
  if (projectNumber) {
    return `Project ${projectNumber.padStart(2, "0")}`;
  }

  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function SlideImage({ slide, index }: { slide: Slide; index: number }) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (ref.current?.complete) setLoaded(true);
  }, []);

  return (
    <div
      className="slide-frame"
      data-slide={index}
      style={{ aspectRatio: `${slide.width} / ${slide.height}` }}
    >
      <img
        ref={ref}
        className={loaded ? "is-loaded" : ""}
        src={slide.src}
        width={slide.width}
        height={slide.height}
        alt={`Slide ${index + 1}`}
        decoding="async"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

function SlideCounter({ total }: { total: number }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const frames = document.querySelectorAll<HTMLElement>("[data-slide]");
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrent(Number((entry.target as HTMLElement).dataset.slide));
          }
        }),
      { rootMargin: "-50% 0px -50% 0px" },
    );
    frames.forEach((frame) => observer.observe(frame));
    return () => observer.disconnect();
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <span className="slide-counter-fixed">
      {pad(current + 1)} / {pad(total)}
    </span>
  );
}

export default function DetailPage() {
  const location = useLocation();
  const params = useParams();
  const isExploration = location.pathname.startsWith("/explorations");
  const projectId = params.projectId ?? "";

  const project: Project | undefined = isExploration
    ? undefined
    : projects.find((p) => p.slug === projectId || p.path === location.pathname);
  const slides = project?.slides ?? [];

  const heading = isExploration
    ? `Exploration ${(params.explorationId ?? "1").padStart(2, "0")}`
    : (project?.title ?? titleFromSlug(projectId || "Project"));

  useEffect(() => {
    const previous = document.title;
    document.title = `${heading} | ${SITE_NAME}`;
    return () => {
      document.title = previous;
    };
  }, [heading]);

  const legacyRedirects: Record<string, string> = {
    "project-1": "/work/samsung-iris",
    "project-2": "/work/digital-gifting-experiences",
    "project-3": "/work/financial-decisions",
    "project-4": "/work/india-post",
  };
  if (legacyRedirects[projectId]) {
    return <Navigate to={legacyRedirects[projectId]} replace />;
  }

  return (
    <main className="detail-page">
      {!isExploration && (
        <div className="detail-back">
          <Button variant="secondary" to="/work" arrow={false}>
            ← Back
          </Button>
        </div>
      )}
      <div className="detail-label">
        <span className="section-dot" />
        {isExploration ? "Exploration" : "Featured work"}
      </div>
      <h1>{heading}</h1>

      {slides.length > 0 ? (
        <>
          {slides.length > 1 && <SlideCounter total={slides.length} />}
          <div className="detail-slides">
            {slides.map((slide, index) => (
              <SlideImage slide={slide} index={index} key={slide.src} />
            ))}
          </div>
          <div className="detail-footer">
            <Button variant="primary" to="/work" arrow={false}>
              ← Back to projects
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="detail-image">
            <span>Project image</span>
          </div>
          <p>Details coming soon</p>
        </>
      )}
    </main>
  );
}
