import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import DOMPurify from 'dompurify';
import 'react-quill/dist/quill.snow.css';
import AdminLayout from '../../components/AdminLayout';

export default function ArticleEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const quillRef = useRef(null);
  const isEdit = Boolean(id);

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const res = await fetch('/api/admin/articles', { credentials: 'include' });
        if (res.ok) {
          const articles = await res.json();
          const article = articles.find((a) => String(a.id) === String(id));
          if (article) {
            setTitle(article.title || '');
            setExcerpt(article.excerpt || '');
            setCoverImage(article.cover_image || '');
            setContent(article.content || '');
            setPublished(Boolean(article.published));
          } else { setError('Article introuvable'); }
        }
      } catch { setError('Erreur de chargement'); }
      finally { setLoading(false); }
    })();
  }, [id, isEdit]);

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', credentials: 'include', body: formData });
    if (!res.ok) throw new Error('Erreur upload');
    return (await res.json()).url;
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try { setCoverImage(await uploadImage(file)); }
    catch { setError('Erreur upload image'); }
    finally { setUploading(false); }
  };

  const imageHandler = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const url = await uploadImage(file);
        const quill = quillRef.current?.getEditor();
        if (quill) {
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, 'image', url);
          quill.setSelection(range.index + 1);
        }
      } catch { setError('Erreur upload image'); }
    };
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image', 'blockquote']
      ],
      handlers: { image: imageHandler }
    }
  }), []);

  const formats = ['header', 'bold', 'italic', 'underline', 'list', 'bullet', 'link', 'image', 'blockquote'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const res = await fetch(isEdit ? `/api/admin/articles/${id}` : '/api/admin/articles', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title, excerpt, cover_image: coverImage, content: DOMPurify.sanitize(content), published })
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
        <h1>{isEdit ? 'Modifier l\'article' : 'Nouvel article'}</h1>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      <form onSubmit={handleSubmit} className="admin-card">
        <div className="form-group">
          <label htmlFor="title" className="form-label">Titre</label>
          <input id="title" type="text" className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre de l'article" required />
        </div>

        <div className="form-group">
          <label htmlFor="excerpt" className="form-label">Extrait</label>
          <textarea id="excerpt" className="form-textarea" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Court résumé" rows={3} />
        </div>

        <div className="form-group">
          <label className="form-label">Image de couverture</label>
          <input type="file" accept="image/*" onChange={handleCoverUpload} disabled={uploading} />
          {uploading && <p className="text-muted">Upload en cours...</p>}
          {coverImage && <img src={coverImage} alt="Couverture" style={{ marginTop: '0.5rem', maxWidth: '300px', borderRadius: '8px' }} />}
        </div>

        <div className="form-group">
          <label className="form-label">Contenu</label>
          <ReactQuill ref={quillRef} theme="snow" value={content} onChange={setContent} modules={modules} formats={formats} placeholder="Rédigez votre article ici..." />
        </div>

        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input type="checkbox" id="published" checked={published} onChange={(e) => setPublished(e.target.checked)} />
          <label htmlFor="published" className="form-label" style={{ marginBottom: 0 }}>Publié</label>
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
