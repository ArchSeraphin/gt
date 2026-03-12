import { Link } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/', label: 'Accueil' },
  { to: '/a-propos', label: 'À propos' },
  { to: '/services', label: 'Services' },
  { to: '/realisations', label: 'Réalisations' },
  { to: '/actualites', label: 'Actualités' },
  { to: '/contact', label: 'Contact' },
];

const SERVICES_LINKS = [
  { to: '/services#creation', label: 'Création de jardins' },
  { to: '/services#entretien', label: 'Entretien paysager' },
  { to: '/services#amenagement', label: 'Aménagement extérieur' },
  { to: '/services#cloture', label: 'Clôtures & portails' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          {/* Column 1 — About */}
          <div className="footer__col">
            <h3 className="footer__heading">G&amp;T Paysage</h3>
            <p className="footer__text">
              Entreprise paysagiste basée en Isère, spécialisée dans la création
              et l'entretien d'espaces verts. Nous transformons vos extérieurs en
              lieux de vie uniques.
            </p>
            <div className="footer__social">
              <a
                href="#"
                className="footer__social-link"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="#"
                className="footer__social-link"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="17.5" cy="6.5" r="1.5" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2 — Navigation */}
          <div className="footer__col">
            <h3 className="footer__heading">Navigation</h3>
            <ul className="footer__list">
              {NAV_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="footer__link">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Services */}
          <div className="footer__col">
            <h3 className="footer__heading">Services</h3>
            <ul className="footer__list">
              {SERVICES_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="footer__link">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Contact */}
          <div className="footer__col">
            <h3 className="footer__heading">Contact</h3>
            <address className="footer__address">
              <p>82, chemin de la perdrix<br />38300 Serezin-de-la-Tour</p>
              <p>
                Pierre-Edouard&nbsp;:{' '}
                <a href="tel:+33629429189" className="footer__link">06 29 42 91 89</a>
              </p>
              <p>
                Thomas&nbsp;:{' '}
                <a href="tel:+33612878823" className="footer__link">06 12 87 88 23</a>
              </p>
              <p>
                <a href="mailto:contact@gtpaysage38.fr" className="footer__link">
                  contact@gtpaysage38.fr
                </a>
              </p>
            </address>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>&copy; 2024 G&amp;T Paysage &mdash; Tous droits réservés</p>
          <Link to="/mentions-legales" className="footer__link">
            Mentions légales
          </Link>
        </div>
      </div>
    </footer>
  );
}
