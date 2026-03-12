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
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          const gaSetting = Array.isArray(data)
            ? data.find((s) => s.key === 'ga_measurement_id')
            : null;
          if (gaSetting?.value) {
            setMeasurementId(gaSetting.value);
            setSavedId(gaSetting.value);
          }
        }
      } catch {
        setError('Impossible de charger les paramètres');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const isValidId = /^G-[A-Z0-9]+$/.test(measurementId);
  const isConfigured = /^G-[A-Z0-9]+$/.test(savedId);

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!isValidId) {
      setError('Format invalide. Le Measurement ID doit commencer par "G-" suivi de lettres majuscules et chiffres.');
      return;
    }

    setSaving(true);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ key: 'ga_measurement_id', value: measurementId })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Erreur lors de la sauvegarde');
      }

      setSavedId(measurementId);
      setSuccess('Measurement ID sauvegardé avec succès.');
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
        <h1>Analytics</h1>
      </div>

      <div className="admin-card">
        <h2>Configuration Google Analytics</h2>

        <div className="admin-analytics-status">
          <span
            className={`admin-status-dot ${isConfigured ? 'admin-status-active' : 'admin-status-inactive'}`}
          />
          <span>
            {isConfigured
              ? `Google Analytics actif (${savedId})`
              : 'Google Analytics non configuré'}
          </span>
        </div>

        {error && <div className="admin-error">{error}</div>}
        {success && <div className="admin-success">{success}</div>}

        <form onSubmit={handleSave} className="admin-form">
          <div className="admin-field">
            <label htmlFor="ga_id">Measurement ID</label>
            <input
              id="ga_id"
              type="text"
              value={measurementId}
              onChange={(e) => {
                setMeasurementId(e.target.value.toUpperCase());
                setSuccess('');
              }}
              placeholder="G-XXXXXXXXXX"
            />
            <small className="admin-field-hint">
              Format attendu : G- suivi de lettres majuscules et chiffres (ex: G-ABC123DEF4)
            </small>
          </div>

          <div className="admin-form-actions">
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={saving || !measurementId}
            >
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
