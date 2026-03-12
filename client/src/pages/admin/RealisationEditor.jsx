import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';

export default function RealisationEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [text, setText] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const res = await fetch('/api/admin/realisations', { credentials: 'include' });
        if (res.ok) {
          const items = await res.json();
          const item = items.find((r) => String(r.id) === String(id));
          if (item) {
            setName(item.name || '');
            setImageUrl(item.image || '');
            setText(item.text || '');
            setSortOrder(item.sort_order ?? 0);
          } else { setError('Réalisation introuvable'); }
        }
      } catch { setError('Erreur de chargement'); }
      finally { setLoading(false); }
    })();
  }, [id, isEdit]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', credentials: 'include', body: formData });
      if (!res.ok) throw new Error('Erreur upload');
      setImageUrl((await res.json()).url);
    } catch { setError('Erreur upload image'); }
    finally { setUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const res = await fetch(isEdit ? `/api/admin/realisations/${id}` : '/api/admin/realisations', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, image: imageUrl, text, sort_order: Number(sortOrder) })
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Erreur sauvegarde');
      navigate('/admin/tableau-de-bord');
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  if (loading) return <AdminLayout><div className="loading-screen"><div className="spinner" /></div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="admin-topbar">
        <h1>{isEdit ? 'Modifier la réalisation' : 'Nouvelle réalisation'}</h1>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      <form onSubmit={handleSubmit} className="admin-card">
        <div className="form-group">
          <label htmlFor="name" className="form-label">Nom</label>
          <input id="name" type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom de la réalisation" required />
        </div>

        <div className="form-group">
          <label className="form-label">Image</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
          {uploading && <p className="text-muted">Upload en cours...</p>}
          {imageUrl && <img src={imageUrl} alt={name} style={{ marginTop: '0.5rem', maxWidth: '300px', borderRadius: '8px' }} />}
        </div>

        <div className="form-group">
          <label htmlFor="text" className="form-label">Description</label>
          <textarea id="text" className="form-textarea" value={text} onChange={(e) => setText(e.target.value)} placeholder="Description de la réalisation" rows={6} />
        </div>

        <div className="form-group">
          <label htmlFor="sort_order" className="form-label">Ordre d'affichage</label>
          <input id="sort_order" type="number" className="form-input" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} min={0} style={{ maxWidth: '120px' }} />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
          <button type="button" className="btn btn--outline" onClick={() => navigate('/admin/tableau-de-bord')}>
            Annuler
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
