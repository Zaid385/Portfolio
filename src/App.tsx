import { Button } from './components/Button';

export function App() {
  return (
    <div className="phase-1-test-container">
      <div>
        <h1 className="handwritten" style={{ fontSize: '3rem', marginBottom: '1rem', textAlign: 'center' }}>
          Phase 1: Foundation Check
        </h1>
        <p style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '600px' }}>
          Verify the dotted notebook background looks correct and the buttons feel incredibly tactile.
        </p>
      </div>

      <div className="button-row">
        <Button variant="primary">Primary Button</Button>
        <Button variant="secondary">Secondary Button</Button>
      </div>
    </div>
  );
}

export default App;
