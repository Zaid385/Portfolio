import { Doodle } from './Doodle';
import './Footer.css';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__container">
        <p className="footer__text handwritten">
          made with code, curiosity & probably too much coffee.
        </p>
        <Doodle category="misc" name="misc-2" className="footer__doodle" />
      </div>
    </footer>
  );
}
