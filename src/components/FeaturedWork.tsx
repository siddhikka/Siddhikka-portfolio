import Button from "./Button";
import {
  CardGrid,
  ProjectCard,
  projects,
  SectionHeader,
} from "./PortfolioComponents";

export default function FeaturedWork() {
  return (
    <section className="featured-work">
      <SectionHeader label="Featured work" title="From Research to Design" />
      <CardGrid>
        {projects.map((project, index) => (
          <ProjectCard project={project} index={index} key={project.path} />
        ))}
      </CardGrid>
      <div className="featured-cta">
        <Button to="/work">See more work</Button>
      </div>
    </section>
  );
}
