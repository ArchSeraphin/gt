import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function CookieBanner() {
  const [visible, setVisible] = useState(
    () => localStorage.getItem('cookie_consent') === null
  );

  if (!visible) return null;

  const handleConsent = (value) => {
    localStorage.setItem('cookie_consent', value);
    window.dispatchEvent(new CustomEvent('cookie_consent_update'));
    setVisible(false);
  };

  return (
    <div className="cookie-banner" role="dialog" aria-label="Consentement aux cookies">
      <div className="cookie-banner__inner container">
        <p className="cookie-banner__text">
          Ce site utilise des cookies pour améliorer votre expérience et analyser
          le trafic. En continuant, vous acceptez notre utilisation des cookies.{' '}
          <Link to="/mentions-legales" className="cookie-banner__link">
            En savoir plus
          </Link>
        </p>
        <div className="cookie-banner__actions">
          <button
            type="button"
            className="btn btn--primary cookie-banner__btn"
            onClick={() => handleConsent('accepted')}
          >
            Accepter
          </button>
          <button
            type="button"
            className="btn btn--outline cookie-banner__btn"
            onClick={() => handleConsent('refused')}
          >
            Refuser
          </button>
        </div>
      </div>
    </div>
  );
}
