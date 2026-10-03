import { useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useParams } from "react-router";
import { useSiteNavigate } from "../app/SiteLayout";
import Button from "../components/Button";
import ProjectVideo from "../components/ProjectVideo";
import {
  explorations,
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

  const go = useSiteNavigate();
  const project: Project | undefined = (
    isExploration ? explorations : projects
  ).find((p) => p.slug === projectId || p.path === location.pathname);
  const slides = project?.slides ?? [];

  const heading =
    project?.title ??
    (isExploration
      ? `Exploration ${(params.explorationId ?? "1").padStart(2, "0")}`
      : titleFromSlug(projectId || "Project"));

  useEffect(() => {
    const previous = document.title;
    document.title = `${heading} | ${SITE_NAME}`;
    return () => {
      document.title = previous;
    };
  }, [heading]);

  useEffect(() => {
    if (!isExploration) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") go("/work#explorations");
    };
    const onPop = () =>
      sessionStorage.setItem("scroll-to-explorations", "1");
    window.addEventListener("keydown", onKey);
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("popstate", onPop);
    };
  }, [isExploration, go]);

  const backTo = isExploration ? "/work#explorations" : "/work";
  const backLabel = isExploration ? "Back to explorations" : "Back";
  const footerLabel = isExploration
    ? "Back to explorations"
    : "Back to projects";

  const legacyRedirects: Record<string, string> = {
    "project-1": "/work/samsung-iris",
    "project-2": "/work/digital-gifting-experiences",
    "project-3": "/work/financial-decisions",
    "project-4": "/work/india-post",
    "project-5": "/work/lenskart",
  };
  const legacyExplorations: Record<string, string> = {
    "1": "/explorations/multivariate-urban-signals",
    "2": "/explorations/tubbin",
  };
  if (isExploration && legacyExplorations[params.explorationId ?? ""]) {
    return (
      <Navigate to={legacyExplorations[params.explorationId ?? ""]} replace />
    );
  }
  if (!isExploration && legacyRedirects[projectId]) {
    return <Navigate to={legacyRedirects[projectId]} replace />;
  }

  return (
    <main className="detail-page">
      <div className="detail-back">
        <Button variant="secondary" to={backTo} arrow={false}>
          ← {backLabel}
        </Button>
      </div>
      <div className="detail-label">
        <span className="section-dot" />
        {isExploration ? "Exploration" : "Featured work"}
      </div>
      <h1>{heading}</h1>

      {slides.length > 0 ? (
        <>
          {slides.length > 1 && <SlideCounter total={slides.length} />}
          <div className="detail-slides">
            {project?.video && (
              <ProjectVideo video={project.video} label={heading} />
            )}
            {slides.map((slide, index) => (
              <SlideImage slide={slide} index={index} key={slide.src} />
            ))}
          </div>
          <div className="detail-footer">
            <Button variant="secondary" to={backTo} arrow={false}>
              ← {footerLabel}
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
