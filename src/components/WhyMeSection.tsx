import { useEffect, useRef, useState } from "react";

type WhyItem = {
  title: string;
  description: string;
  keywords: string[];
};

const whyItems: WhyItem[] = [
  {
    title: "User-Centered Thinking",
    description:
      "Every design decision is rooted in real user needs. I use HTA, SUS, and cognitive load analysis to validate, not assume.",
    keywords: ["HTA", "SUS", "Cognitive Load"],
  },
  {
    title: "Cross-Functional Collaboration",
    description:
      "I thrive in iterative feedback loops—working alongside developers, stakeholders, and researchers to ship cohesive products.",
    keywords: ["Developers", "Stakeholders", "Researchers"],
  },
  {
    title: "Information Architecture",
    description:
      "I transform complex data into structured, scannable systems—reducing cognitive load and improving information accessibility.",
    keywords: ["Structure", "Scannable", "Accessible"],
  },
  {
    title: "Data-Informed Decisions",
    description:
      "From NASA-TLX workload metrics to AQI correlation dashboards—I ground creative choices in quantitative evidence.",
    keywords: ["NASA-TLX", "AQI Dashboards", "Evidence"],
  },
];

function WhyRow({
  item,
  index,
  isOpen,
  onOpen,
}: {
  item: WhyItem;
  index: number;
  isOpen: boolean;
  onOpen: () => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-40% 0px -40% 0px" },
    );

    observer.observe(row);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={rowRef}
      className={`why-row ${isOpen ? "is-open" : ""} ${
        isRevealed ? "is-revealed" : ""
      }`}
      onMouseEnter={onOpen}
      onClick={onOpen}
    >
      <span className="why-index">{String(index + 1).padStart(2, "0")}</span>
      <div className="why-content">
        <div className="why-title">
          <h3>{item.title}</h3>
          <span aria-hidden="true">{item.title}</span>
        </div>
        <div className="why-description-wrap">
          <p>{item.description}</p>
        </div>
      </div>
      <div className="why-keywords">
        {item.keywords.map((keyword, keywordIndex) => (
          <span
            key={keyword}
            style={{ "--keyword-index": keywordIndex } as React.CSSProperties}
          >
            {keyword}
          </span>
        ))}
      </div>
      <span className="why-toggle" aria-hidden="true">
        +
      </span>
    </div>
  );
}

export default function WhyMeSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="why-section">
      <header className="editorial-header">
        <div className="accent-label">Why me</div>
        <h2>What I bring to the table</h2>
      </header>
      <div className="why-list">
        {whyItems.map((item, index) => (
          <WhyRow
            item={item}
            index={index}
            isOpen={openIndex === index}
            onOpen={() => setOpenIndex(index)}
            key={item.title}
          />
        ))}
      </div>
    </section>
  );
}
