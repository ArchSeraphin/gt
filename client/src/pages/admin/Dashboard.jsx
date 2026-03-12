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
      if (res.ok) setArticles(await res.json());
    } catch { /* */ }
    finally { setLoadingArticles(false); }
  }, []);

  const fetchRealisations = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/realisations', { credentials: 'include' });
      if (res.ok) setRealisations(await res.json());
    } catch { /* */ }
    finally { setLoadingRealisations(false); }
  }, []);

  useEffect(() => { fetchArticles(); fetchRealisations(); }, [fetchArticles, fetchRealisations]);

  const togglePublish = async (id) => {
    const res = await fetch(`/api/admin/articles/${id}/toggle`, { method: 'PATCH', credentials: 'include' });
    if (res.ok) fetchArticles();
  };

  const deleteArticle = async (id) => {
    if (!window.confirm('Supprimer cet article ?')) return;
    const res = await fetch(`/api/admin/articles/${id}`, { method: 'DELETE', credentials: 'include' });
    if (res.ok) fetchArticles();
  };

  const deleteRealisation = async (id) => {
    if (!window.confirm('Supprimer cette réalisation ?')) return;
    const res = await fetch(`/api/admin/realisations/${id}`, { method: 'DELETE', credentials: 'include' });
    if (res.ok) fetchRealisations();
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  return (
    <AdminLayout>
      <div className="admin-topbar">
        <h1>Tableau de bord</h1>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/admin/articles/nouveau" className="btn btn--primary btn--sm">+ Nouvel article</Link>
          <Link to="/admin/realisations/nouveau" className="btn btn--accent btn--sm">+ Nouvelle réalisation</Link>
        </div>
      </div>

      <div className="admin-card">
        <h2>Articles</h2>
        {loadingArticles ? (
          <p>Chargement...</p>
        ) : articles.length === 0 ? (
          <p className="text-muted">Aucun article pour le moment.</p>
        ) : (
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
              {articles.map((a) => (
                <tr key={a.id}>
                  <td>{a.title}</td>
                  <td>
                    <span className={`badge ${a.published ? 'badge--success' : 'badge--warning'}`}>
                      {a.published ? 'Publié' : 'Brouillon'}
                    </span>
                  </td>
                  <td>{formatDate(a.created_at)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <Link to={`/admin/articles/${a.id}/modifier`} className="btn btn--ghost btn--sm">Modifier</Link>
                      <button className="btn btn--outline btn--sm" onClick={() => togglePublish(a.id)}>
                        {a.published ? 'Dépublier' : 'Publier'}
                      </button>
                      <button className="btn btn--sm" style={{ color: '#dc3545' }} onClick={() => deleteArticle(a.id)}>
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="admin-card">
        <h2>Réalisations</h2>
        {loadingRealisations ? (
          <p>Chargement...</p>
        ) : realisations.length === 0 ? (
          <p className="text-muted">Aucune réalisation pour le moment.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {realisations.map((r) => (
                <tr key={r.id}>
                  <td>{r.name}</td>
                  <td>
                    {r.image ? (
                      <img src={r.image} alt={r.name} style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                    ) : '—'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link to={`/admin/realisations/${r.id}/modifier`} className="btn btn--ghost btn--sm">Modifier</Link>
                      <button className="btn btn--sm" style={{ color: '#dc3545' }} onClick={() => deleteRealisation(r.id)}>
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
