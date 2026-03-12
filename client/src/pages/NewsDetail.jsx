import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import SEO from '../components/SEO';

export default function NewsDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    fetch(`/api/articles/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then((data) => setArticle(data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  if (loading) {
    return (
      <section className="section">
        <div className="container text-center">
          <div className="spinner" aria-label="Chargement" />
        </div>
      </section>
    );
  }

  if (notFound || !article) {
    return (
      <>
        <SEO title="Article non trouvé" noindex={true} />
        <section className="section">
          <div className="container text-center">
            <h1>Article non trouvé</h1>
            <p>Cet article n'existe pas ou a été supprimé.</p>
            <Link to="/actualites" className="btn btn--primary">
              Retour aux actualités
            </Link>
          </div>
        </section>
      </>
    );
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    datePublished: article.published_at,
    image: article.cover_image || undefined,
    author: {
      '@type': 'Organization',
      name: 'G&T Paysage',
    },
  };

  return (
    <>
      <SEO
        title={article.title}
        description={article.excerpt}
        image={article.cover_image}
        canonical={`/actualites/${slug}`}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <article className="article">
        {article.cover_image && (
          <div className="article__cover">
            <img
              src={article.cover_image}
              alt={article.title}
            />
          </div>
        )}

        <div className="container article__body">
          <Link to="/actualites" className="article__back">
            &larr; Retour aux actualités
          </Link>

          <h1 className="article__title">{article.title}</h1>

          {article.published_at && (
            <time className="article__date" dateTime={article.published_at}>
              {formatDate(article.published_at)}
            </time>
          )}

          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
      </article>
    </>
  );
}
