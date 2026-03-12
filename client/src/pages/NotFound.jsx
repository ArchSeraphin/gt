import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function NotFound() {
  return (
    <>
      <SEO title="Page non trouvée" noindex={true} />

      <section className="section not-found">
        <div className="container text-center">
          <h1 className="not-found__code">404</h1>
          <p className="not-found__message">Page non trouvée</p>
          <p className="not-found__text">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          <Link to="/" className="btn btn--primary">
            Retour à l'accueil
          </Link>
        </div>
      </section>
    </>
  );
}
