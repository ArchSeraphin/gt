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
  'Création de jardins',
  'Entretien paysager',
  'Aménagement extérieur',
  'Élagage & abattage',
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          {/* Column 1 — About */}
          <div>
            <h3 className="footer__title">G&amp;T Paysage</h3>
            <p>
              Entreprise paysagiste basée en Isère, spécialisée dans la création
              et l'entretien d'espaces verts. Nous transformons vos extérieurs en
              lieux de vie uniques.
            </p>
            <div className="footer__social">
              <a
                href="https://facebook.com"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="17.5" cy="6.5" r="1.5" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2 — Navigation */}
          <div>
            <h3 className="footer__title">Navigation</h3>
            <ul className="footer__list">
              {NAV_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Services */}
          <div>
            <h3 className="footer__title">Services</h3>
            <ul className="footer__list">
              {SERVICES_LINKS.map((label) => (
                <li key={label}>
                  <Link to="/services">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Contact */}
          <div>
            <h3 className="footer__title">Contact</h3>
            <div className="footer__contact-item">
              <span>82, chemin de la perdrix<br />38300 Serezin-de-la-Tour</span>
            </div>
            <div className="footer__contact-item">
              <a href="tel:+33629429189">06 29 42 91 89</a>
            </div>
            <div className="footer__contact-item">
              <a href="tel:+33612878823">06 12 87 88 23</a>
            </div>
            <div className="footer__contact-item">
              <a href="mailto:contact@gtpaysage38.fr">contact@gtpaysage38.fr</a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container">
          &copy; {new Date().getFullYear()} G&amp;T Paysage &mdash; Tous droits réservés
          {' '}&bull;{' '}
          <Link to="/mentions-legales">Mentions légales</Link>
        </div>
      </div>
    </footer>
  );
}
