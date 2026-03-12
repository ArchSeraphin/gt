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

    const fetchArticle = async () => {
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
          } else {
            setError('Article introuvable');
          }
        }
      } catch {
        setError('Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, isEdit]);

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      credentials: 'include',
      body: formData
    });

    if (!res.ok) throw new Error('Erreur lors de l\'upload');
    const data = await res.json();
    return data.url;
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file);
      setCoverImage(url);
    } catch {
      setError('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploading(false);
    }
  };

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
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
      } catch {
        setError('Erreur lors de l\'upload de l\'image');
      }
    };
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image', 'blockquote', 'code-block']
      ],
      handlers: {
        image: imageHandler
      }
    }
  }), []);

  const formats = [
    'header', 'bold', 'italic', 'underline',
    'list', 'bullet', 'link', 'image', 'blockquote', 'code-block'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    const sanitizedContent = DOMPurify.sanitize(content);

    const payload = {
      title,
      excerpt,
      cover_image: coverImage,
      content: sanitizedContent,
      published
    };

    try {
      const url = isEdit ? `/api/admin/articles/${id}` : '/api/admin/articles';
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
        <h1>{isEdit ? 'Modifier l\'article' : 'Nouvel article'}</h1>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <form onSubmit={handleSubmit} className="admin-card admin-form">
        <div className="admin-field">
          <label htmlFor="title">Titre</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre de l'article"
            required
          />
        </div>

        <div className="admin-field">
          <label htmlFor="excerpt">Extrait</label>
          <textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Court résumé de l'article"
            rows={3}
          />
        </div>

        <div className="admin-field">
          <label>Image de couverture</label>
          <div className="admin-upload-area">
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
              disabled={uploading}
            />
            {uploading && <span className="admin-uploading">Upload en cours...</span>}
          </div>
          {coverImage && (
            <div className="admin-image-preview">
              <img src={coverImage} alt="Couverture" />
            </div>
          )}
        </div>

        <div className="admin-field">
          <label>Contenu</label>
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            formats={formats}
            placeholder="Rédigez votre article ici..."
          />
        </div>

        <div className="admin-field admin-field-checkbox">
          <label>
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            Publié
          </label>
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
