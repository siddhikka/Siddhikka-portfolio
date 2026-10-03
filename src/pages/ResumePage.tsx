import type { ReactNode } from "react";
import Button from "../components/Button";

const NAME = "Siddhikka Thorat";
const ROLE = "Product and User Experience Designer";
const EMAIL = "thoratsiddhikka@gmail.com";
const BEHANCE_URL = "https://www.behance.net/siddhikkathorat";
const RESUME_FILE = "/Siddhikka2026Resume.pdf";
const RESUME_DOWNLOAD_NAME = "Siddhikka-Thorat-Resume.pdf";

function DownloadButton() {
  return (
    <Button
      variant="primary"
      href={RESUME_FILE}
      download={RESUME_DOWNLOAD_NAME}
      arrowDown
    >
      Download resume
    </Button>
  );
}

function ResumeSection({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <section className="resume-section">
      <h2 className="resume-label">{label}</h2>
      <div className="resume-content">{children}</div>
    </section>
  );
}

function ResumeItem({
  title,
  date,
  meta,
  children,
}: {
  title: string;
  date?: string;
  meta?: string[];
  children?: ReactNode;
}) {
  return (
    <div className="resume-item">
      <div className="resume-item-head">
        <h3>{title}</h3>
        {date && <span className="resume-date">{date}</span>}
      </div>
      {meta?.map((line) => (
        <p className="resume-meta" key={line}>
          {line}
        </p>
      ))}
      {children}
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="resume-bullets">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

const skills = [
  {
    label: "Design",
    text: "User Research, Usability Testing, Qualitative Data Analysis, Information Architecture, Empathetic Design, Human-Centered Design, Conversational UI, Wireframing, Prototyping, Storyboarding, Survey Design.",
  },
  {
    label: "Tools",
    text: "Figma, Figjam, Miro, Framer, Adobe Illustrator, Anti-gravity, Claude, Android Studio, Xcode, HTML/CSS.",
  },
  {
    label: "Practices",
    text: "Analytical Thinking, Structured Problem Solving, Attention to Detail, Group Communication & Collaboration, Agile collaboration · Stakeholder communication.",
  },
];

const courses = [
  { title: "Claude Platform 101", provider: "Anthropic Claude Academy" },
  {
    title: "UI/UX Design Beginner to Expert",
    provider: "Figma Megacourse, Udemy",
  },
  { title: "Elements of AI", provider: "University of Helsinki" },
];

export default function ResumePage() {
  return (
    <main className="resume-page">
      <div className="resume-container">
        <header className="resume-header">
          <div className="resume-header-text">
            <div className="accent-label">Resume</div>
            <h1>{NAME}</h1>
            <p className="resume-role">{ROLE}</p>
            <p className="resume-contact">
              Pune, India · <a href={`mailto:${EMAIL}`}>{EMAIL}</a> ·{" "}
              <a href={BEHANCE_URL} target="_blank" rel="noopener noreferrer">
                Behance
              </a>
            </p>
          </div>
          <div className="resume-header-cta">
            <DownloadButton />
          </div>
        </header>

        <ResumeSection label="Summary">
          <p>
            UX Design student specializing in user research, usability testing,
            wireframing, prototyping, and human-centered design. Experienced in
            conducting qualitative research and translating insights into
            functional, user-centered solutions.
          </p>
        </ResumeSection>

        <ResumeSection label="Education">
          <div className="resume-list">
            <ResumeItem
              title="MIT Institute of Design"
              date="2023 – Present"
              meta={[
                "Bachelor’s in User Experience Design, Pune",
                "SGPA: 8.4 (Semester 6) · CGPA: 8.11",
              ]}
            />
            <ResumeItem
              title="MES Garware College of Commerce"
              meta={["Junior College"]}
            />
            <ResumeItem
              title="Paranjape Vidya Mandir"
              meta={["Secondary Highschool"]}
            />
          </div>
        </ResumeSection>

        <ResumeSection label="Internships">
          <div className="resume-list resume-list--wide">
            <ResumeItem
              title="Fyntrest"
              date="15 May – 15 July 2026"
              meta={["UX UI Design Intern"]}
            >
              <Bullets
                items={[
                  "Expanded Fyntrest’s landing page into a complete B2C website, designing key pages, user flows, and responsive interfaces for a cohesive brand experience.",
                  "Designed an internal support platform that streamlines cross-team communication, inventory management, and operational workflows through a centralized digital interface.",
                  "Designed a finance tracking and budgeting app that helps users build better money habits through intuitive expense management and personalized insights.",
                ]}
              />
            </ResumeItem>
            <ResumeItem
              title="Absolute’i Brand Building Studio"
              date="16 June – 16 July 2025"
              meta={["UX Design Intern"]}
            >
              <Bullets
                items={[
                  "Led the redesign of internal documentation systems by applying user centered design principles to improve information accessibility, comprehension, and decision making for internal teams and clients.",
                  "Transformed complex brand and strategy data into structured information architectures across competitor analysis, brand timeline, brand DNA, and nomenclature frameworks.",
                  "Conducted iterative design refinements through feedback loops and collaborative reviews, improving usability, clarity, and consistency across documentation workflows.",
                  "Designed scalable layout and typographic systems that enhanced information hierarchy, reduced cognitive load, and supported efficient communication of strategic insights.",
                ]}
              />
            </ResumeItem>
          </div>
        </ResumeSection>

        <ResumeSection label="Skills">
          <dl className="resume-skills">
            {skills.map((skill) => (
              <div key={skill.label}>
                <dt>{skill.label}:</dt> <dd>{skill.text}</dd>
              </div>
            ))}
          </dl>
        </ResumeSection>

        <ResumeSection label="Courses & Certifications">
          <ul className="resume-courses">
            {courses.map((course) => (
              <li key={course.title}>
                <span className="resume-course-title">{course.title}</span>
                <span className="resume-meta">{course.provider}</span>
              </li>
            ))}
          </ul>
        </ResumeSection>

        <ResumeSection label="Languages">
          <p>English · Hindi · Marathi</p>
        </ResumeSection>

        <div className="resume-cta">
          <DownloadButton />
        </div>
      </div>
    </main>
  );
}
