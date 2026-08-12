import { useState, useEffect } from 'react';
import './Navbar.css';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Stack', href: '#stack' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__container">
        <a href="#home" className="navbar__logo handwritten">ZAID.</a>
        
        <div className="navbar__links desktop-only">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="navbar__link handwritten">
              {link.name}
            </a>
          ))}
        </div>

        <button 
          className="navbar__mobile-toggle handwritten mobile-only"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? 'CLOSE' : 'MENU'}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="navbar__mobile-menu mobile-only">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="navbar__mobile-link handwritten"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
