import { useState, useEffect } from 'react';
import type { SVGProps, FC } from 'react';

// The Doodle component imports an SVG dynamically based on category and name.
// e.g. <Doodle category="arrows" name="arrow-1" />

interface DoodleProps extends React.SVGProps<SVGSVGElement> {
  category: 'arrows' | 'boxes' | 'circles' | 'lines' | 'misc';
  name: string;
  className?: string;
}

export function Doodle({ category, name, className = '', ...props }: DoodleProps) {
  const [SvgIcon, setSvgIcon] = useState<FC<SVGProps<SVGSVGElement>> | null>(null);

  useEffect(() => {
    // Dynamic import of the SVG asset as a React component
    // Vite handles this nicely if we import with ?react, but we can also use normal img src if we don't need inline SVGs.
    // However, for stroke animations, inline is better. We'll use a dynamic fetch and inline insertion for full control.
    
    // Using simple fetch to get text content to render inline, this is a lightweight approach for a sketchbook feel
    const fetchSvg = async () => {
      try {
        // We use the new URL to resolve the asset path correctly in Vite
        const svgUrl = new URL(`../assets/doodles/${category}/${name}.svg`, import.meta.url).href;
        const res = await fetch(svgUrl);
        if (res.ok) {
          const text = await res.text();
          // We can parse the SVG text if we wanted, but returning it via dangerouslySetInnerHTML is easiest for arbitrary SVGs.
          setSvgIcon(() => (props: SVGProps<SVGSVGElement>) => (
             <span 
                className={`doodle-wrapper ${className}`} 
                dangerouslySetInnerHTML={{ __html: text }} 
                {...(props as any)} 
             />
          ));
        }
      } catch (err) {
        console.error('Failed to load doodle:', name, err);
      }
    };
    
    fetchSvg();
  }, [category, name]);

  if (!SvgIcon) return null;

  return <SvgIcon {...props} />;
}
