import SEO from '../components/SEO';

export default function MentionsLegales() {
  return (
    <>
      <SEO
        title="Mentions légales"
        noindex={true}
      />

      {/* Page header */}
      <section className="page-header">
        <div className="container">
          <h1 className="page-header__title">Mentions légales</h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="legal-content">
            <h2>Éditeur du site</h2>
            <p>
              <strong>G&T Paysage</strong>
              <br />
              82 chemin de la perdrix
              <br />
              38300 Serezin-de-la-Tour
              <br />
              Email&nbsp;:{' '}
              <a href="mailto:contact@gtpaysage38.fr">contact@gtpaysage38.fr</a>
            </p>
            <p>
              Responsables de la publication&nbsp;: Pierre-Edouard Gauthier &amp; Thomas
              Teyssier
            </p>

            <h2>Hébergement</h2>
            <p>[À compléter]</p>

            <h2>Propriété intellectuelle</h2>
            <p>
              L'ensemble du contenu de ce site (textes, images, vidéos, logos, graphismes)
              est la propriété exclusive de G&T Paysage ou de ses partenaires, sauf mention
              contraire. Toute reproduction, représentation, modification, publication ou
              adaptation de tout ou partie des éléments du site est interdite sans
              l'autorisation écrite préalable de G&T Paysage.
            </p>

            <h2>Protection des données personnelles (RGPD)</h2>
            <p>
              Conformément au Règlement Général sur la Protection des Données (RGPD), nous
              vous informons que les données personnelles collectées via le formulaire de
              contact (nom, email, téléphone, message) sont utilisées uniquement pour
              répondre à votre demande.
            </p>
            <p>
              Ces données ne sont en aucun cas vendues, échangées ou transmises à des tiers
              à des fins commerciales.
            </p>
            <p>
              Conformément à la loi, vous disposez d'un droit d'accès, de modification, de
              rectification et de suppression de vos données personnelles. Pour exercer ce
              droit, contactez-nous à l'adresse&nbsp;:{' '}
              <a href="mailto:contact@gtpaysage38.fr">contact@gtpaysage38.fr</a>
            </p>

            <h2>Cookies</h2>
            <p>
              Ce site utilise des cookies à des fins de mesure d'audience (cookies
              analytiques). Ces cookies permettent de comprendre comment les visiteurs
              interagissent avec le site, afin d'en améliorer le contenu et
              l'ergonomie.
            </p>
            <p>
              Lors de votre première visite, un bandeau vous informe de l'utilisation de ces
              cookies et vous permet d'accepter ou de refuser leur dépôt. Vous pouvez
              modifier vos préférences à tout moment depuis les paramètres de votre
              navigateur.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
