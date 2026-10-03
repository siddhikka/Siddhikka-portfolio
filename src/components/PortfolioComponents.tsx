import {
  type PointerEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { TransitionLink } from "../app/SiteLayout";
import samsungIrisCover from "../assets/projects/samsung-iris-cover.png";
import samsungIrisPresentation from "../assets/projects/samsung-iris-presentation.png";

import digitalGiftingCover from "../assets/projects/digital-gifting-cover.png";
import digitalGiftingPresentation from "../assets/projects/digital-gifting-presentation.png";

import financialDecisionsCover from "../assets/projects/financial-decisions-cover.png";
import financialDecisionsPresentation from "../assets/projects/financial-decisions-presentation.jpg";

import indiaPostCover from "../assets/projects/india-post-cover.png";
import indiaPostPresentation from "../assets/projects/india-post-presentation.png";

import lenskartCover from "../assets/projects/lenskart-cover.png";
import lenskartPresentation from "../assets/projects/lenskart-presentation.png";

import urbanSignalsCover from "../assets/projects/urban-signals-cover.png";
import urbanSignalsPresentation from "../assets/projects/urban-signals-presentation.png";

import tubbinCover from "../assets/projects/tubbin-cover.png";
import tubbinFrame from "../assets/projects/tubbin-frame.png";
import tubbinPresentation from "../assets/projects/tubbin-presentation.png";
import type { VideoSpec } from "./ProjectVideo";

import parkinsonsDiseaseCover from "../assets/projects/parkinsons-disease-cover.png";
import parkinsonsDiseasePresentation from "../assets/projects/parkinsons-disease-presentation.png";

import goosebumpsCover from "../assets/projects/goosebumps-cover.png";
import goosebumpsPresentation from "../assets/projects/goosebumps-presentation.png";

export type Slide = { src: string; width: number; height: number };

export type Project = {
  number: string;
  title: string;
  description: string;
  tag: string;
  path: string;
  slug?: string;
  cover?: string;
  slides?: Slide[];
  video?: VideoSpec;
};

const placeholderProjects: Project[] = Array.from({ length: 6 }, (_, index) => ({
  number: String(index + 1).padStart(2, "0"),
  title: `Project ${String(index + 1).padStart(2, "0")}`,
  description: "Short one-line description",
  tag: "Research / Design",
  path: `/work/project-${index + 1}`,
}));

const samsungIris: Project = {
  ...placeholderProjects[0],
  title: "Samsung Iris",
  description:
    "Seamless browsing with an AI agent for planning, search, and task management.",
  slug: "samsung-iris",
  path: "/work/samsung-iris",
  cover: samsungIrisCover,
  slides: [{ src: samsungIrisPresentation, width: 1920, height: 17280 }],
};

const digitalGifting: Project = {
  ...placeholderProjects[1],
  title: "Digital Gifting Experiences",
  description: "Advance UX Research and Modern day gifting Solutions",
  slug: "digital-gifting-experiences",
  path: "/work/digital-gifting-experiences",
  cover: digitalGiftingCover,
  slides: [{ src: digitalGiftingPresentation, width: 1926, height: 32381 }],
};

const financialDecisions: Project = {
  ...placeholderProjects[2],
  title: "Financial Decisions",
  description: "Psychological Behavioral Case Study",
  slug: "financial-decisions",
  path: "/work/financial-decisions",
  cover: financialDecisionsCover,
  slides: [{ src: financialDecisionsPresentation, width: 1254, height: 32768 }],
};

const indiaPost: Project = {
  ...placeholderProjects[3],
  title: "India Post",
  description: "Cognitive Workload Assessment and Redesign",
  slug: "india-post",
  path: "/work/india-post",
  cover: indiaPostCover,
  slides: [{ src: indiaPostPresentation, width: 1281, height: 32768 }],
};

const lenskart: Project = {
  ...placeholderProjects[4],
  title: "Lenskart",
  description: "Integrated AI Voice Assistant",
  slug: "lenskart",
  path: "/work/lenskart",
  cover: lenskartCover,
  slides: [{ src: lenskartPresentation, width: 1920, height: 14601 }],
};

export const projects: Project[] = [
  samsungIris,
  digitalGifting,
  financialDecisions,
  indiaPost,
  lenskart,
  {
    ...placeholderProjects[5],
    title: "parkinsons disease",
    description: "design for special needs",
    slug: "parkinsons-disease",
    path: "/work/parkinsons-disease",
    cover: parkinsonsDiseaseCover,
    slides: [{ src: parkinsonsDiseasePresentation, width: 1920, height: 24344 }],
  },
];

const placeholderExplorations: Project[] = Array.from(
  { length: 3 },
  (_, index) => ({
    number: String(index + 1).padStart(2, "0"),
    title: `Exploration ${String(index + 1).padStart(2, "0")}`,
    description: "Short one-line description",
    tag: "Independent study",
    path: `/explorations/${index + 1}`,
  }),
);

const urbanSignals: Project = {
  ...placeholderExplorations[0],
  title: "Multivariate Urban Signals",
  description: "Data Visualization of Urban Signals and their Correlations",
  slug: "multivariate-urban-signals",
  path: "/explorations/multivariate-urban-signals",
  cover: urbanSignalsCover,
  slides: [{ src: urbanSignalsPresentation, width: 1920, height: 8757 }],
};

const tubbin: Project = {
  ...placeholderExplorations[1],
  title: "Tubbin'",
  description: "Design Management & Case Studies",
  slug: "tubbin",
  path: "/explorations/tubbin",
  cover: tubbinCover,
  video: {
    src: "/videos/tubbin.mp4",
    poster: tubbinFrame,
    width: 1920,
    height: 1080,
  },
  slides: [{ src: tubbinPresentation, width: 1920, height: 17649 }],
};

const goosebumps: Project = {
  ...placeholderExplorations[2],
  title: "Goosebumps",
  description: "Interactive Game Design | Semantics & Semiotics",
  slug: "goosebumps",
  path: "/explorations/goosebumps",
  cover: goosebumpsCover,
  slides: [{ src: goosebumpsPresentation, width: 1920, height: 12127 }],
};

export const explorations: Project[] = [
  urbanSignals,
  tubbin,
  goosebumps,
];

function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

export function SectionHeader({
  label,
  title,
}: {
  label: string;
  title: string;
}) {
  const { ref, isVisible } = useInView<HTMLDivElement>();

  return (
    <header
      ref={ref}
      className={`section-header ${isVisible ? "is-visible" : ""}`}
    >
      <div className="section-label">
        <span className="section-dot" />
        {label}
      </div>
      <div className="section-title-mask">
        <h2>{title}</h2>
      </div>
    </header>
  );
}

function Card({
  project,
  exploration = false,
  index,
}: {
  project: Project;
  exploration?: boolean;
  index: number;
}) {
  const imageRef = useRef<HTMLDivElement>(null);

  const followPointer = (event: PointerEvent<HTMLDivElement>) => {
    const image = imageRef.current;
    if (!image) return;
    const bounds = image.getBoundingClientRect();
    image.style.setProperty("--cursor-x", `${event.clientX - bounds.left}px`);
    image.style.setProperty("--cursor-y", `${event.clientY - bounds.top}px`);
  };

  return (
    <TransitionLink
      to={project.path}
      className={`project-card ${exploration ? "exploration-card" : ""}`}
    >
      <article style={{ "--card-index": index } as React.CSSProperties}>
        <div
          ref={imageRef}
          className="card-image-mask"
          onPointerMove={followPointer}
        >
          <div className="card-image">
            {project.cover ? (
              <img src={project.cover} alt={project.title} />
            ) : (
              <span>Project image</span>
            )}
          </div>
          <span className="view-chip">View</span>
        </div>
        <div className="card-copy">
          <div className="card-title-row">
            <div className="card-title">
              <span className="card-number">{project.number}</span>
              <h3>{project.title}</h3>
              <span className="card-arrow">→</span>
            </div>
            <span className="card-tag">{project.tag}</span>
          </div>
          <p>{project.description}</p>
        </div>
      </article>
    </TransitionLink>
  );
}

export function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return <Card project={project} index={index} />;
}

export function ExplorationCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return <Card project={project} index={index} exploration />;
}

export function CardGrid({
  children,
  exploration = false,
}: {
  children: ReactNode;
  exploration?: boolean;
}) {
  const { ref, isVisible } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`card-grid ${exploration ? "exploration-grid" : ""} ${
        isVisible ? "is-visible" : ""
      }`}
    >
      {children}
    </div>
  );
}
