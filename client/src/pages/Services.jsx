import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import ScrollReveal from '../components/ScrollReveal';

const services = [
  {
    title: 'Conception & Création de jardins',
    image: '/img/service-creation.jpg',
    items: [
      'Conception et aménagement de jardin personnalisé',
      'Aménagement de massifs fleuris',
      'Plantation sur mesure et engazonnement',
      'Murets en pierres, petite maçonnerie paysagère',
      'Dallage, carrelage, terrasse, cour, allée',
      'Clôture, escalier, structure bois, enrochement',
    ],
  },
  {
    title: 'Entretien de jardins',
    image: '/img/service-entretien.jpg',
    items: [
      'Nettoyage massifs, cours, allées',
      'Taille, abattage, ramassage de feuilles',
      'Création et entretien de potager',
      'Tonte, débroussaillage, désherbage',
      'Taille de haies et arbustes',
      'Taille fruitière',
    ],
  },
  {
    title: 'Aménagements & Équipements',
    image: '/img/service-amenagement.jpg',
    items: [
      'Arrosage automatique',
      'Éclairage extérieur',
      'Clôtures',
      'Terrain de pétanque',
      'Gabions',
      'Mobilier de jardin (pergolas, jardinières)',
    ],
  },
];

export default function Services() {
  return (
    <>
      <SEO
        title="Nos services"
        description="Découvrez les services de G&T Paysage : création de jardins, entretien, élagage, arrosage automatique, clôtures et aménagements extérieurs près de Bourgoin-Jallieu."
        canonical="/services"
      />

      {/* Page header */}
      <section className="page-header">
        <div className="container">
          <h1 className="page-header__title">Nos services</h1>
        </div>
      </section>

      {/* Service sections */}
      {services.map((service, index) => (
        <ScrollReveal key={service.title}>
          <section
            className={`section services-detail${index % 2 !== 0 ? ' services-detail--reverse' : ''}`}
          >
            <div className="container services-detail__grid">
              <div className="services-detail__image">
                <img src={service.image} alt={service.title} loading="lazy" />
              </div>
              <div className="services-detail__content">
                <h2>{service.title}</h2>
                <ul className="services-detail__list">
                  {service.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </ScrollReveal>
      ))}

      {/* Tax deduction CTA */}
      <ScrollReveal>
        <section className="section cta-section">
          <div className="container text-center">
            <h2 className="cta-section__title">Services à la personne</h2>
            <p className="cta-section__text">
              G&T Paysage est agréé <strong>services à la personne</strong>. Vous pouvez
              bénéficier d'un <strong>crédit d'impôt de 50&nbsp;%</strong> sur les
              prestations d'entretien de jardin. Profitez-en&nbsp;!
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
