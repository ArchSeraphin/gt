import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/', label: 'Accueil' },
  { to: '/a-propos', label: 'À propos' },
  { to: '/services', label: 'Services' },
  { to: '/realisations', label: 'Réalisations' },
  { to: '/actualites', label: 'Actualités' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 50);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const solid = !isHome || scrolled || menuOpen;

  return (
    <header className={`header ${solid ? 'header--solid' : 'header--transparent'}`}>
      <div className="header__inner">
        <Link to="/" className="header__logo" onClick={closeMenu}>
          <img src="/img/logo/logo.png" alt="G&T Paysage" />
          <span className="header__logo-text">G&amp;T Paysage</span>
        </Link>

        <nav className={`nav${menuOpen ? ' nav--open' : ''}`}>
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`nav__link${pathname === to ? ' nav__link--active' : ''}`}
              onClick={closeMenu}
            >
              {label}
            </Link>
          ))}
          <Link to="/contact" className="btn btn--accent btn--sm nav__cta" onClick={closeMenu}>
            Devis gratuit
          </Link>
        </nav>

        <button
          type="button"
          className={`hamburger${menuOpen ? ' hamburger--open' : ''}`}
          aria-label="Menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span className="hamburger__line" />
          <span className="hamburger__line" />
          <span className="hamburger__line" />
        </button>
      </div>
    </header>
  );
}
