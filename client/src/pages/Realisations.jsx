import { useEffect, useState, useCallback } from 'react';
import SEO from '../components/SEO';
import ScrollReveal from '../components/ScrollReveal';

export default function Realisations() {
  const [realisations, setRealisations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    fetch('/api/realisations')
      .then((r) => r.json())
      .then((data) => setRealisations(Array.isArray(data) ? data : data.data || []))
      .catch(() => setRealisations([]))
      .finally(() => setLoading(false));
  }, []);

  const openLightbox = (index) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  const goPrev = useCallback(() => {
    setSelectedIndex((prev) =>
      prev !== null ? (prev - 1 + realisations.length) % realisations.length : null
    );
  }, [realisations.length]);

  const goNext = useCallback(() => {
    setSelectedIndex((prev) =>
      prev !== null ? (prev + 1) % realisations.length : null
    );
  }, [realisations.length]);

  // Keyboard navigation
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'ArrowRight') goNext();
    };

    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [selectedIndex, goPrev, goNext]);

  const current = selectedIndex !== null ? realisations[selectedIndex] : null;

  return (
    <>
      <SEO
        title="Nos réalisations"
        description="Découvrez les réalisations de G&T Paysage : créations de jardins, aménagements paysagers et entretien d'espaces verts près de Bourgoin-Jallieu."
        canonical="/realisations"
      />

      {/* Page header */}
      <section className="page-header">
        <div className="container">
          <h1 className="page-header__title">Nos réalisations</h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {loading ? (
            <div className="text-center">
              <div className="spinner" aria-label="Chargement" />
            </div>
          ) : realisations.length === 0 ? (
            <p className="text-center text-muted">
              Nos réalisations arrivent bientôt.
            </p>
          ) : (
            <div className="gallery-grid">
              {realisations.map((item, index) => (
                <ScrollReveal key={item.id || item._id || index} delay={(index % 3) * 100}>
                  <button
                    type="button"
                    className="gallery-item"
                    onClick={() => openLightbox(index)}
                    aria-label={`Voir ${item.name || item.title || 'la réalisation'}`}
                  >
                    <img
                      src={item.cover_image || item.image}
                      alt={item.name || item.title || 'Réalisation G&T Paysage'}
                      loading="lazy"
                    />
                    {(item.name || item.title) && (
                      <div className="gallery-item__overlay">
                        <span>{item.name || item.title}</span>
                      </div>
                    )}
                  </button>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {current && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Visionneuse d'images"
          onClick={closeLightbox}
        >
          <div className="lightbox__content" onClick={(e) => e.stopPropagation()}>
            <button
              className="lightbox__close"
              onClick={closeLightbox}
              aria-label="Fermer"
            >
              &times;
            </button>

            <button
              className="lightbox__prev"
              onClick={goPrev}
              aria-label="Image précédente"
            >
              &#8249;
            </button>

            <img
              src={current.cover_image || current.image}
              alt={current.name || current.title || 'Réalisation G&T Paysage'}
              className="lightbox__image"
            />

            <button
              className="lightbox__next"
              onClick={goNext}
              aria-label="Image suivante"
            >
              &#8250;
            </button>

            {(current.name || current.title) && (
              <div className="lightbox__caption">
                {current.name || current.title}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
