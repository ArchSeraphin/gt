import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';

export default function Analytics() {
  const [measurementId, setMeasurementId] = useState('');
  const [savedId, setSavedId] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/settings', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          const ga = Array.isArray(data) ? data.find((s) => s.key === 'ga_measurement_id') : null;
          if (ga?.value) { setMeasurementId(ga.value); setSavedId(ga.value); }
        }
      } catch { setError('Impossible de charger les paramètres'); }
      finally { setLoading(false); }
    })();
  }, []);

  const isValidId = /^G-[A-Z0-9]+$/.test(measurementId);
  const isConfigured = /^G-[A-Z0-9]+$/.test(savedId);

  const handleSave = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!isValidId) { setError('Format invalide. Le Measurement ID doit commencer par "G-".'); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ key: 'ga_measurement_id', value: measurementId })
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Erreur sauvegarde');
      setSavedId(measurementId);
      setSuccess('Measurement ID sauvegardé.');
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  if (loading) return <AdminLayout><div className="loading-screen"><div className="spinner" /></div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="admin-topbar">
        <h1>Analytics</h1>
      </div>

      <div className="admin-card">
        <h2>Configuration Google Analytics</h2>

        <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '1rem 0' }}>
          <span style={{
            width: '10px', height: '10px', borderRadius: '50%', display: 'inline-block',
            background: isConfigured ? '#28a745' : '#ccc'
          }} />
          {isConfigured ? `Google Analytics actif (${savedId})` : 'Google Analytics non configuré'}
        </p>

        {error && <div className="alert alert--error">{error}</div>}
        {success && <div className="alert alert--success">{success}</div>}

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label htmlFor="ga_id" className="form-label">Measurement ID</label>
            <input
              id="ga_id" type="text" className="form-input"
              value={measurementId}
              onChange={(e) => { setMeasurementId(e.target.value.toUpperCase()); setSuccess(''); }}
              placeholder="G-XXXXXXXXXX"
              style={{ maxWidth: '300px' }}
            />
            <small className="text-muted" style={{ display: 'block', marginTop: '0.3rem' }}>
              Format : G- suivi de lettres majuscules et chiffres (ex: G-ABC123DEF4)
            </small>
          </div>

          <button type="submit" className="btn btn--primary" disabled={saving || !measurementId}>
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
