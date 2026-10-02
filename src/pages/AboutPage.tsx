import CuriositySection from "../components/CuriositySection";
import StopMotionSection from "../components/StopMotionSection";
import TinyVenturesSection from "../components/TinyVenturesSection";
import PhotoSlideshow from "../components/PhotoSlideshow";
import ScrollFillText from "../components/ScrollFillText";

const TITLE = "HI THERE!";

function AnimatedTitle({ text }: { text: string }) {
  let index = 0;
  return (
    <h1 className="about-title" aria-label={text}>
      {text.split(" ").map((word, wordIndex) => (
        <span key={wordIndex}>
          {wordIndex > 0 && " "}
          <span className="title-word" aria-hidden="true">
            {[...word].map((char, charIndex) => (
              <span
                className="title-mask"
                key={charIndex}
                style={{ "--i": index++ } as React.CSSProperties}
              >
                <span
                  className={`title-letter${char === "!" ? " is-wave" : ""}`}
                >
                  {char}
                </span>
              </span>
            ))}
          </span>
        </span>
      ))}
    </h1>
  );
}

export default function AboutPage() {
  return (
    <main className="about-page">
      <section className="about-intro">
        <AnimatedTitle text={TITLE} />
        <div className="about-columns">
          <div className="about-photo">
            <PhotoSlideshow />
            <p className="about-caption">
              Everything that kills me makes me feel alive.
              <br />
              Allergic to cats.
            </p>
          </div>
          <div className="about-copy">
            <ScrollFillText
              className="about-lead"
              to="#000000"
              text="I’m Siddhikka, a UX design student at MIT Institute of Design, Pune."
            />
            <ScrollFillText text="I’ve always been curious about why people do the things they do. The little habits, the workarounds, the decisions we make without thinking, and the moments where something just doesn’t feel right." />
            <ScrollFillText text="That curiosity shapes how I approach design. I like observing before jumping to solutions, asking questions before making assumptions, and digging a little deeper to understand what’s really happening. I’m interested in the people behind the problem just as much as the problem itself." />
            <ScrollFillText text="For me, UX isn’t just about designing screens. It’s about understanding behaviours, finding patterns in messy information, and turning those insights into experiences that feel simple, thoughtful, and human." />
            <ScrollFillText
              className="about-closing"
              to="#000000"
              highlight="a good question"
              text="I don’t always start with the answer. I’d rather start with a good question."
            />
          </div>
        </div>
      </section>
      <CuriositySection />
      <StopMotionSection />
      <TinyVenturesSection />
    </main>
  );
}
