import { Doodle } from './Doodle';
import './SectionHeader.css';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  doodleCategory: 'arrows' | 'boxes' | 'circles' | 'lines' | 'misc';
  doodleName: string;
}

export function SectionHeader({ title, subtitle, doodleCategory, doodleName }: SectionHeaderProps) {
  return (
    <div className="section-header">
      <h2 className="section-header__title">
        {title}
        <Doodle 
          category={doodleCategory} 
          name={doodleName} 
          className="section-header__doodle" 
        />
      </h2>
      {subtitle && <p className="section-header__subtitle handwritten">{subtitle}</p>}
    </div>
  );
}
