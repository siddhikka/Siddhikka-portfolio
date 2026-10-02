import { useEffect, useState } from "react";

let hasPlayedIntro = false;

const TIMINGS = {
  total: "7.2s",
  photoDelay: "5.2s",
  headingDelay: "5.56s",
  tickerDelay: "6.4s",
} as const;

const skills = ["Design systems", "UX strategy", "Web design", "Research"];

function SkillsTicker() {
  const tickerItems = [...skills, ...skills, ...skills, ...skills];

  return (
    <div className="ticker" aria-label={skills.join(", ")}>
      <div className="ticker-track">
        {[0, 1].map((group) => (
          <div className="ticker-group" aria-hidden={group === 1} key={group}>
            {tickerItems.map((skill, index) => (
              <span className="ticker-item" key={`${group}-${index}`}>
                <span>{skill}</span>
                <span className="ticker-dot" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HeroIntro() {
  const [skipIntro] = useState(() => hasPlayedIntro);

  useEffect(() => {
    hasPlayedIntro = true;
  }, []);

  return (
    <div
      id="top"
      className={`portfolio${skipIntro ? " intro-skip" : ""}`}
      style={
        {
          "--intro-duration": TIMINGS.total,
          "--photo-delay": TIMINGS.photoDelay,
          "--heading-delay": TIMINGS.headingDelay,
          "--ticker-delay": TIMINGS.tickerDelay,
        } as React.CSSProperties
      }
    >
      <section className="hero" aria-labelledby="intro-heading">
        <div className="intro-name" aria-hidden="true">
          <span className="intro-name-base">Siddhikka</span>
          <span className="intro-name-fill">Siddhikka</span>
        </div>

        <h1 id="intro-heading" className="hero-heading">
          {[
            "Hey, I'm Siddhikka.",
            "I'm interested in the",
            "space between people and",
            "the things they use.",
          ].map((line, index) => (
            <span className="heading-mask" key={line}>
              <span style={{ "--line": index } as React.CSSProperties}>{line}</span>
            </span>
          ))}
        </h1>

        <div
          className="photo-placeholder"
          role="img"
          aria-label="Photo placeholder"
        >
          <span>Add photo</span>
        </div>

        <SkillsTicker />
      </section>
    </div>
  );
}
