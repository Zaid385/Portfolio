import type { Project } from '../data/projects';
import { Button } from './Button';
import { Doodle } from './Doodle';
import './ProjectCard.css';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <div className={`project-card ${project.featured ? 'project-card--featured' : ''}`}>
      <div className="project-card__number handwritten">
        0{index + 1}
      </div>
      
      <div className="project-card__content">
        <h3 className="project-card__title">
          {project.title}
          {project.featured && (
             <Doodle category="misc" name="misc-15" className="project-card__featured-doodle" />
          )}
        </h3>
        <p className="project-card__subtitle handwritten">{project.subtitle}</p>
        
        <div className="project-card__description">
          {project.description.map((desc, i) => (
            <p key={i}>{desc}</p>
          ))}
        </div>
        
        <div className="project-card__tech">
          {project.technologies.map(tech => (
            <span key={tech} className="project-card__tag handwritten">{tech}</span>
          ))}
        </div>
        
        <div className="project-card__actions">
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noreferrer" tabIndex={-1}>
              <Button variant="primary" className="btn-small">Live Demo</Button>
            </a>
          )}
          {project.github && (
            <a href={project.github} target="_blank" rel="noreferrer" tabIndex={-1}>
              <Button variant="secondary" className="btn-small">GitHub</Button>
            </a>
          )}
        </div>
      </div>
      
      {project.doodleAnnotation && (
        <div className="project-card__annotation">
          <Doodle category="arrows" name="arrow-10" className="project-card__annotation-arrow" />
          <span className="handwritten">{project.doodleAnnotation}</span>
        </div>
      )}
    </div>
  );
}
