import { useEffect } from "react";
import {
  CardGrid,
  ExplorationCard,
  explorations,
  ProjectCard,
  projects,
  SectionHeader,
} from "../components/PortfolioComponents";

export default function WorkPage() {
  useEffect(() => {
    if (sessionStorage.getItem("scroll-to-explorations")) {
      sessionStorage.removeItem("scroll-to-explorations");
      document.getElementById("explorations")?.scrollIntoView();
    }
  }, []);

  return (
    <main className="work-page">
      <section className="work-section">
        <SectionHeader
          label="Featured work"
          title="More Research, More Design"
        />
        <CardGrid>
          {projects.map((project, index) => (
            <ProjectCard project={project} index={index} key={project.path} />
          ))}
        </CardGrid>
      </section>

      <section id="explorations" className="work-section explorations-section">
        <SectionHeader label="Supporting work" title="My Explorations" />
        <CardGrid exploration>
          {explorations.map((project, index) => (
            <ExplorationCard
              project={project}
              index={index}
              key={project.path}
            />
          ))}
        </CardGrid>
      </section>
    </main>
  );
}
