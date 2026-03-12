import { useState } from 'react';
import SEO from '../components/SEO';
import ScrollReveal from '../components/ScrollReveal';

const INITIAL_FORM = { name: '', email: '', phone: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Veuillez entrer votre nom.';
    if (!form.email.trim()) e.email = 'Veuillez entrer votre email.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Veuillez entrer un email valide.';
    if (!form.message.trim()) e.message = 'Veuillez entrer votre message.';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Erreur serveur');
      setStatus('success');
      setForm(INITIAL_FORM);
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <SEO
        title="Contact"
        description="Contactez G&T Paysage pour un devis gratuit. Paysagiste à Serezin-de-la-Tour, près de Bourgoin-Jallieu."
        canonical="/contact"
      />

      {/* Page header */}
      <section className="page-header">
        <div className="container">
          <h1 className="page-header__title">Contactez-nous</h1>
        </div>
      </section>

      <section className="section">
        <div className="container contact-grid">
          {/* Form */}
          <ScrollReveal>
            <div className="contact-form-wrapper">
              <h2>Demande de devis</h2>

              {status === 'success' && (
                <div className="alert alert--success">
                  Votre message a bien été envoyé&nbsp;! Nous vous répondrons dans les
                  meilleurs délais.
                </div>
              )}
              {status === 'error' && (
                <div className="alert alert--error">
                  Une erreur est survenue. Veuillez réessayer ou nous contacter par
                  téléphone.
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label htmlFor="name">Nom *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className={errors.name ? 'input--error' : ''}
                    required
                  />
                  {errors.name && <span className="form-error">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className={errors.email ? 'input--error' : ''}
                    required
                  />
                  {errors.email && <span className="form-error">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Téléphone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="6"
                    value={form.message}
                    onChange={handleChange}
                    className={errors.message ? 'input--error' : ''}
                    required
                  />
                  {errors.message && <span className="form-error">{errors.message}</span>}
                </div>

                <button
                  type="submit"
                  className="btn btn--primary btn--full"
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? (
                    <>
                      <span className="spinner spinner--sm" aria-hidden="true" /> Envoi en
                      cours...
                    </>
                  ) : (
                    'Envoyer'
                  )}
                </button>
              </form>
            </div>
          </ScrollReveal>

          {/* Contact info */}
          <ScrollReveal delay={150}>
            <div className="contact-info">
              <h2>Nos coordonnées</h2>

              <div className="contact-info__item">
                <h3>Adresse</h3>
                <p>
                  82 chemin de la perdrix
                  <br />
                  38300 Serezin-de-la-Tour
                </p>
              </div>

              <div className="contact-info__item">
                <h3>Téléphone</h3>
                <p>
                  Pierre-Edouard&nbsp;:{' '}
                  <a href="tel:0629429189">06 29 42 91 89</a>
                </p>
                <p>
                  Thomas&nbsp;:{' '}
                  <a href="tel:0612878823">06 12 87 88 23</a>
                </p>
              </div>

              <div className="contact-info__item">
                <h3>Email</h3>
                <p>
                  <a href="mailto:contact@gtpaysage38.fr">contact@gtpaysage38.fr</a>
                </p>
              </div>

              <div className="contact-info__item">
                <h3>Horaires</h3>
                <p>
                  Lundi - Vendredi : 8h00 - 18h00
                  <br />
                  Samedi : sur rendez-vous
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
