import { Button } from './components/Button';
import { ScrollReveal } from './components/ScrollReveal';

export function App() {
  return (
    <div className="phase-1-test-container" style={{ minHeight: '300vh', justifyContent: 'flex-start', paddingTop: '10vh' }}>
      
      {/* Anchor Navigation Test */}
      <nav style={{ position: 'fixed', top: '1rem', right: '1rem', display: 'flex', gap: '1rem', zIndex: 100 }}>
        <a href="#top" tabIndex={-1}><Button variant="navigation">Top</Button></a>
        <a href="#middle" tabIndex={-1}><Button variant="navigation">Middle</Button></a>
        <a href="#bottom" tabIndex={-1}><Button variant="navigation">Bottom</Button></a>
      </nav>

      <div id="top" style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <ScrollReveal animation="fade-up">
          <h1 className="handwritten" style={{ fontSize: '3rem', marginBottom: '1rem', textAlign: 'center' }}>
            Phase 2: Animation & Smooth Scroll
          </h1>
          <p style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '600px' }}>
            Scroll down or click the navigation buttons to test buttery smooth anchor jumping and scroll-reveal animations!
          </p>
          <div className="button-row">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
          </div>
        </ScrollReveal>
      </div>

      <div id="middle" style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <ScrollReveal animation="scale-up" delay={200}>
          <div style={{ padding: '3rem', border: '3px solid var(--color-ink)', borderRadius: '4px 6px 3px 5px', background: 'var(--color-paper)', boxShadow: '4px 5px 0 0 var(--color-ink)' }}>
            <h2 className="handwritten" style={{ fontSize: '2.5rem' }}>I faded and scaled up!</h2>
            <p>This is triggered exactly when it enters the viewport.</p>
          </div>
        </ScrollReveal>
      </div>

      <div id="bottom" style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <ScrollReveal animation="fade-up">
          <h2 className="handwritten" style={{ fontSize: '3rem', color: 'var(--color-accent)' }}>End of Page</h2>
        </ScrollReveal>
      </div>

    </div>
  );
}

export default App;
