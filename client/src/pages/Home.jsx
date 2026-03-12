import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import ScrollReveal from '../components/ScrollReveal';

export default function Home() {
  const [realisations, setRealisations] = useState([]);
  const [loadingReal, setLoadingReal] = useState(true);

  useEffect(() => {
    fetch('/api/realisations?limit=3')
      .then((r) => r.json())
      .then((data) => setRealisations(Array.isArray(data) ? data : data.data || []))
      .catch(() => setRealisations([]))
      .finally(() => setLoadingReal(false));
  }, []);

  return (
    <>
      <SEO
        title={null}
        description="G&T Paysage, paysagiste proche de Bourgoin-Jallieu. Création, entretien de jardins, élagage, arrosage et aménagements extérieurs. Devis gratuit."
        canonical="/"
      />

      {/* Hero */}
      <section className="hero">
        <div className="hero__bg">
          <img src="/img/hero-home.jpg" alt="Jardin aménagé par G&T Paysage" />
        </div>
        <div className="hero__overlay" />
        <div className="hero__content container">
          <h1>G&T Paysage</h1>
          <p className="hero__tagline">Votre jardin, notre savoir-faire&nbsp;!</p>
          <div className="hero__actions">
            <Link to="/services" className="btn btn--primary btn--lg">
              Découvrir nos services
            </Link>
            <Link to="/contact" className="btn btn--accent btn--lg">
              Demander un devis
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <ScrollReveal>
        <section className="stats-bar">
          <div className="container stats-bar__grid">
            <div>
              <span className="stats-bar__number">20+</span>
              <span className="stats-bar__label">ans d'amitié</span>
            </div>
            <div>
              <span className="stats-bar__number">100%</span>
              <span className="stats-bar__label">Sur mesure</span>
            </div>
            <div>
              <span className="stats-bar__number">&hearts;</span>
              <span className="stats-bar__label">Respect de la biodiversité</span>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* About preview */}
      <ScrollReveal>
        <section className="section about-preview">
          <div className="container">
            <h2 className="section__title">Qui sommes-nous&nbsp;?</h2>
            <p className="about-preview__text">
              Pierre-Edouard et Thomas, amis depuis plus de 20 ans, partagent la même
              passion pour les espaces verts. Ensemble, ils ont fondé G&T Paysage pour
              mettre leur savoir-faire au service de vos projets de jardin, dans le respect
              de la nature et de la biodiversité.
            </p>
            <Link to="/a-propos" className="btn btn--outline">
              En savoir plus
            </Link>
          </div>
        </section>
      </ScrollReveal>

      {/* Services preview */}
      <section className="section services-preview">
        <div className="container">
          <ScrollReveal>
            <h2 className="section__title">Nos services</h2>
          </ScrollReveal>
          <div className="features-grid">
            <ScrollReveal delay={0}>
              <div className="feature-card">
                <span className="feature-card__icon" aria-hidden="true">&#127793;</span>
                <h3 className="feature-card__title">Création de jardins</h3>
                <p className="feature-card__text">
                  Conception sur mesure, plantation, engazonnement, terrasses et allées pour
                  donner vie à votre jardin idéal.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={150}>
              <div className="feature-card">
                <span className="feature-card__icon" aria-hidden="true">&#9986;</span>
                <h3 className="feature-card__title">Entretien</h3>
                <p className="feature-card__text">
                  Tonte, taille de haies, débroussaillage, nettoyage de massifs et entretien
                  régulier pour un jardin impeccable toute l'année.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <div className="feature-card">
                <span className="feature-card__icon" aria-hidden="true">&#127795;</span>
                <h3 className="feature-card__title">Élagage &amp; Abattage</h3>
                <p className="feature-card__text">
                  Taille et abattage d'arbres en toute sécurité, élagage raisonné dans le
                  respect du végétal.
                </p>
              </div>
            </ScrollReveal>
          </div>
          <div className="text-center" style={{ marginTop: '2rem' }}>
            <Link to="/services" className="btn btn--primary">
              Tous nos services
            </Link>
          </div>
        </div>
      </section>

      {/* Realisations preview */}
      <ScrollReveal>
        <section className="section realisations-preview">
          <div className="container">
            <h2 className="section__title">Nos dernières réalisations</h2>
            {loadingReal ? (
              <div className="spinner" aria-label="Chargement" />
            ) : realisations.length > 0 ? (
              <div className="gallery-grid">
                {realisations.map((r) => (
                  <div className="gallery-item" key={r.id || r._id}>
                    <img
                      src={r.cover_image || r.image}
                      alt={r.name || r.title || 'Réalisation G&T Paysage'}
                      loading="lazy"
                    />
                    {(r.name || r.title) && (
                      <div className="gallery-item__overlay">
                        <span>{r.name || r.title}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted">Nos réalisations arrivent bientôt.</p>
            )}
            <div className="text-center" style={{ marginTop: '2rem' }}>
              <Link to="/realisations" className="btn btn--outline">
                Voir toutes nos réalisations
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* CTA */}
      <ScrollReveal>
        <section className="section cta-section">
          <div className="container text-center">
            <h2 className="cta-section__title">Un projet en tête&nbsp;?</h2>
            <p className="cta-section__text">
              Parlons-en ensemble. Nous vous proposons un devis gratuit et personnalisé.
            </p>
            <Link to="/contact" className="btn btn--primary btn--lg">
              Demander un devis gratuit
            </Link>
          </div>
        </section>
      </ScrollReveal>
    </>
  );
}
