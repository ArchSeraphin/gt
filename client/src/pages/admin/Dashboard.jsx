import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';

export default function Dashboard() {
  const [articles, setArticles] = useState([]);
  const [realisations, setRealisations] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [loadingRealisations, setLoadingRealisations] = useState(true);

  const fetchArticles = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/articles', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setArticles(data);
      }
    } catch {
      // silently fail
    } finally {
      setLoadingArticles(false);
    }
  }, []);

  const fetchRealisations = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/realisations', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setRealisations(data);
      }
    } catch {
      // silently fail
    } finally {
      setLoadingRealisations(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
    fetchRealisations();
  }, [fetchArticles, fetchRealisations]);

  const togglePublish = async (id) => {
    try {
      const res = await fetch(`/api/admin/articles/${id}/toggle`, {
        method: 'PATCH',
        credentials: 'include'
      });
      if (res.ok) fetchArticles();
    } catch {
      // silently fail
    }
  };

  const deleteArticle = async (id) => {
    if (!window.confirm('Supprimer cet article ? Cette action est irréversible.')) return;
    try {
      const res = await fetch(`/api/admin/articles/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) fetchArticles();
    } catch {
      // silently fail
    }
  };

  const deleteRealisation = async (id) => {
    if (!window.confirm('Supprimer cette réalisation ? Cette action est irréversible.')) return;
    try {
      const res = await fetch(`/api/admin/realisations/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) fetchRealisations();
    } catch {
      // silently fail
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <AdminLayout>
      <div className="admin-topbar">
        <h1>Tableau de bord</h1>
        <div className="admin-topbar-actions">
          <Link to="/admin/articles/nouveau" className="admin-btn admin-btn-primary">
            + Nouvel article
          </Link>
          <Link to="/admin/realisations/nouveau" className="admin-btn admin-btn-secondary">
            + Nouvelle réalisation
          </Link>
        </div>
      </div>

      {/* Articles Section */}
      <div className="admin-card">
        <h2>Articles</h2>
        {loadingArticles ? (
          <p className="admin-loading">Chargement...</p>
        ) : articles.length === 0 ? (
          <p className="admin-empty">Aucun article pour le moment.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Statut</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id}>
                    <td>{article.title}</td>
                    <td>
                      <span className={`admin-badge ${article.published ? 'admin-badge-published' : 'admin-badge-draft'}`}>
                        {article.published ? 'Publié' : 'Brouillon'}
                      </span>
                    </td>
                    <td>{formatDate(article.created_at)}</td>
                    <td className="admin-actions">
                      <Link to={`/admin/articles/${article.id}/modifier`} className="admin-btn admin-btn-sm">
                        Modifier
                      </Link>
                      <button
                        className="admin-btn admin-btn-sm admin-btn-outline"
                        onClick={() => togglePublish(article.id)}
                      >
                        {article.published ? 'Dépublier' : 'Publier'}
                      </button>
                      <button
                        className="admin-btn admin-btn-sm admin-btn-danger"
                        onClick={() => deleteArticle(article.id)}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Realisations Section */}
      <div className="admin-card">
        <h2>Réalisations</h2>
        {loadingRealisations ? (
          <p className="admin-loading">Chargement...</p>
        ) : realisations.length === 0 ? (
          <p className="admin-empty">Aucune réalisation pour le moment.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {realisations.map((real) => (
                  <tr key={real.id}>
                    <td>{real.name}</td>
                    <td>
                      {real.image_url ? (
                        <img src={real.image_url} alt={real.name} className="admin-thumbnail" />
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="admin-actions">
                      <Link to={`/admin/realisations/${real.id}/modifier`} className="admin-btn admin-btn-sm">
                        Modifier
                      </Link>
                      <button
                        className="admin-btn admin-btn-sm admin-btn-danger"
                        onClick={() => deleteRealisation(real.id)}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
