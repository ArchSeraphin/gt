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

    const fetchRealisation = async () => {
      try {
        const res = await fetch('/api/admin/realisations', { credentials: 'include' });
        if (res.ok) {
          const items = await res.json();
          const item = items.find((r) => String(r.id) === String(id));
          if (item) {
            setName(item.name || '');
            setImageUrl(item.image_url || '');
            setText(item.text || '');
            setSortOrder(item.sort_order ?? 0);
          } else {
            setError('Réalisation introuvable');
          }
        }
      } catch {
        setError('Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchRealisation();
  }, [id, isEdit]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (!res.ok) throw new Error('Erreur lors de l\'upload');
      const data = await res.json();
      setImageUrl(data.url);
    } catch {
      setError('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    const payload = {
      name,
      image_url: imageUrl,
      text,
      sort_order: Number(sortOrder)
    };

    try {
      const url = isEdit ? `/api/admin/realisations/${id}` : '/api/admin/realisations';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Erreur lors de la sauvegarde');
      }

      navigate('/admin/tableau-de-bord');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <p className="admin-loading">Chargement...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-topbar">
        <h1>{isEdit ? 'Modifier la réalisation' : 'Nouvelle réalisation'}</h1>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <form onSubmit={handleSubmit} className="admin-card admin-form">
        <div className="admin-field">
          <label htmlFor="name">Nom</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom de la réalisation"
            required
          />
        </div>

        <div className="admin-field">
          <label>Image</label>
          <div className="admin-upload-area">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
            />
            {uploading && <span className="admin-uploading">Upload en cours...</span>}
          </div>
          {imageUrl && (
            <div className="admin-image-preview">
              <img src={imageUrl} alt={name} />
            </div>
          )}
        </div>

        <div className="admin-field">
          <label htmlFor="text">Texte</label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Description de la réalisation"
            rows={6}
          />
        </div>

        <div className="admin-field">
          <label htmlFor="sort_order">Ordre</label>
          <input
            id="sort_order"
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            min={0}
          />
        </div>

        <div className="admin-form-actions">
          <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-outline"
            onClick={() => navigate('/admin/tableau-de-bord')}
          >
            Annuler
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
