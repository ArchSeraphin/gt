import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SEO from '../components/SEO';
import ScrollReveal from '../components/ScrollReveal';

const PER_PAGE = 9;

export default function News() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const [articles, setArticles] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/articles?page=${page}&limit=${PER_PAGE}`)
      .then((r) => r.json())
      .then((data) => {
        setArticles(Array.isArray(data) ? data : data.data || []);
        if (data.totalPages) setTotalPages(data.totalPages);
        else if (data.total) setTotalPages(Math.ceil(data.total / PER_PAGE));
      })
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, [page]);

  const goToPage = (p) => {
    setSearchParams({ page: String(p) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  return (
    <>
      <SEO
        title="Actualités"
        description="Retrouvez les actualités de G&T Paysage : conseils jardin, nouveaux projets et événements autour de Bourgoin-Jallieu."
        canonical="/actualites"
      />

      {/* Page header */}
      <section className="page-header">
        <div className="container">
          <h1 className="page-header__title">Actualités</h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {loading ? (
            <div className="text-center">
              <div className="spinner" aria-label="Chargement" />
            </div>
          ) : articles.length === 0 ? (
            <p className="text-center text-muted">Aucun article pour le moment.</p>
          ) : (
            <>
              <div className="news-grid">
                {articles.map((article, i) => (
                  <ScrollReveal key={article.id || article._id || i} delay={i * 100}>
                    <Link
                      to={`/actualites/${article.slug}`}
                      className="news-card"
                    >
                      {article.cover_image && (
                        <div className="news-card__image">
                          <img
                            src={article.cover_image}
                            alt={article.title}
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className="news-card__body">
                        <h2 className="news-card__title">{article.title}</h2>
                        {article.published_at && (
                          <time className="news-card__date" dateTime={article.published_at}>
                            {formatDate(article.published_at)}
                          </time>
                        )}
                        {article.excerpt && (
                          <p className="news-card__excerpt">{article.excerpt}</p>
                        )}
                      </div>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <nav className="pagination" aria-label="Pagination des articles">
                  <button
                    className="pagination__btn"
                    disabled={page <= 1}
                    onClick={() => goToPage(page - 1)}
                    aria-label="Page précédente"
                  >
                    &laquo; Précédent
                  </button>
                  <span className="pagination__info">
                    Page {page} sur {totalPages}
                  </span>
                  <button
                    className="pagination__btn"
                    disabled={page >= totalPages}
                    onClick={() => goToPage(page + 1)}
                    aria-label="Page suivante"
                  >
                    Suivant &raquo;
                  </button>
                </nav>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
