import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import ScrollReveal from '../components/ScrollReveal';

export default function About() {
  return (
    <>
      <SEO
        title="À propos"
        description="Découvrez l'histoire de G&T Paysage : deux amis passionnés par les espaces verts, au service de vos jardins près de Bourgoin-Jallieu."
        canonical="/a-propos"
      />

      {/* Page header */}
      <section className="page-header">
        <div className="container">
          <h1 className="page-header__title">Notre histoire</h1>
        </div>
      </section>

      {/* Story */}
      <ScrollReveal>
        <section className="section about-story">
          <div className="container about-story__grid">
            <div className="about-story__image">
              <img
                src="/img/about-story.jpg"
                alt="Pierre-Edouard et Thomas, fondateurs de G&T Paysage"
                loading="lazy"
              />
            </div>
            <div className="about-story__content">
              <h2>Deux amis, une passion commune</h2>
              <p>
                Pierre-Edouard et Thomas se connaissent depuis plus de 20 ans. Leur amitié
                s'est construite autour d'une passion partagée pour la nature et les espaces
                verts.
              </p>
              <p>
                Après des années d'expérience dans le métier de paysagiste, ils décident de
                s'associer et de créer <strong>G&T Paysage</strong>. Leur ambition&nbsp;:
                proposer des projets sur mesure, à l'écoute de chaque client, dans le respect
                de la biodiversité et de l'environnement.
              </p>
              <p>
                Basés à Serezin-de-la-Tour, près de Bourgoin-Jallieu, ils interviennent dans
                tout le Nord-Isère pour transformer vos extérieurs en véritables espaces de
                vie.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Team */}
      <section className="section about-team">
        <div className="container">
          <ScrollReveal>
            <h2 className="section__title">L'équipe</h2>
          </ScrollReveal>
          <div className="team-grid">
            <ScrollReveal delay={0}>
              <div className="team-card">
                <div className="team-card__image">
                  <img
                    src="/img/team-pe.jpg"
                    alt="Pierre-Edouard Gauthier"
                    loading="lazy"
                  />
                </div>
                <h3 className="team-card__name">Pierre-Edouard Gauthier</h3>
                <p className="team-card__role">Co-fondateur</p>
                <p className="team-card__bio">
                  Fort de plusieurs années d'expérience en tant qu'ouvrier paysagiste,
                  Pierre-Edouard a développé un savoir-faire solide sur le terrain. Son envie
                  d'indépendance et sa passion pour le métier l'ont naturellement conduit à
                  co-fonder G&T Paysage.
                </p>
                <a href="tel:0629429189" className="team-card__phone">
                  06 29 42 91 89
                </a>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={150}>
              <div className="team-card">
                <div className="team-card__image">
                  <img
                    src="/img/team-thomas.jpg"
                    alt="Thomas Teyssier"
                    loading="lazy"
                  />
                </div>
                <h3 className="team-card__name">Thomas Teyssier</h3>
                <p className="team-card__role">Co-fondateur</p>
                <p className="team-card__bio">
                  Animé par le désir d'indépendance et une vraie passion pour l'aménagement
                  paysager, Thomas apporte son énergie et sa créativité à chaque projet.
                  Ensemble avec Pierre-Edouard, ils forment un duo complémentaire au service
                  de vos jardins.
                </p>
                <a href="tel:0612878823" className="team-card__phone">
                  06 12 87 88 23
                </a>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <ScrollReveal>
        <section className="section about-values">
          <div className="container">
            <h2 className="section__title">Nos valeurs</h2>
            <div className="features-grid">
              <div className="feature-card">
                <span className="feature-card__icon" aria-hidden="true">&#128205;</span>
                <h3 className="feature-card__title">Proximité</h3>
                <p className="feature-card__text">
                  Entreprise locale basée près de Bourgoin-Jallieu, nous privilégions la
                  relation de confiance et l'écoute de vos besoins.
                </p>
              </div>
              <div className="feature-card">
                <span className="feature-card__icon" aria-hidden="true">&#128170;</span>
                <h3 className="feature-card__title">Savoir-faire</h3>
                <p className="feature-card__text">
                  Plus de 20 ans d'expérience cumulée dans le paysagisme, au service de
                  réalisations de qualité.
                </p>
              </div>
              <div className="feature-card">
                <span className="feature-card__icon" aria-hidden="true">&#127807;</span>
                <h3 className="feature-card__title">Respect de la nature</h3>
                <p className="feature-card__text">
                  Chaque projet est pensé dans le respect de la biodiversité et de
                  l'environnement, pour des jardins durables.
                </p>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* CTA */}
      <ScrollReveal>
        <section className="section cta-section">
          <div className="container text-center">
            <h2 className="cta-section__title">Envie de nous rencontrer&nbsp;?</h2>
            <Link to="/contact" className="btn btn--primary btn--lg">
              Contactez-nous
            </Link>
          </div>
        </section>
      </ScrollReveal>
    </>
  );
}
