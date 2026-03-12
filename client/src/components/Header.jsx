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

  const closeMenu = () => setMenuOpen(false);

  const solid = !isHome || scrolled;

  return (
    <header className={`header header--fixed${solid ? ' header--solid' : ' header--transparent'}${menuOpen ? ' header--menu-open' : ''}`}>
      <div className="header__inner container">
        <Link to="/" className="header__logo" onClick={closeMenu}>
          <img src="/img/logo/logo.png" alt="G&T Paysage" className="header__logo-img" />
          <span className="header__logo-text">G&amp;T Paysage</span>
        </Link>

        <nav className={`header__nav${menuOpen ? ' header__nav--open' : ''}`}>
          <ul className="header__nav-list">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to} className="header__nav-item">
                <Link
                  to={to}
                  className={`header__nav-link${pathname === to ? ' header__nav-link--active' : ''}`}
                  onClick={closeMenu}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <Link to="/contact" className="btn btn--primary header__cta" onClick={closeMenu}>
            Contactez-nous
          </Link>
        </nav>

        <button
          type="button"
          className={`header__hamburger${menuOpen ? ' header__hamburger--open' : ''}`}
          aria-label="Menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span className="header__hamburger-line" />
          <span className="header__hamburger-line" />
          <span className="header__hamburger-line" />
        </button>
      </div>
    </header>
  );
}
