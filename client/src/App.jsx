import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import Header from './components/Header';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';

import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Contact from './pages/Contact';
import Realisations from './pages/Realisations';
import MentionsLegales from './pages/MentionsLegales';
import NotFound from './pages/NotFound';

import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ArticleEditor from './pages/admin/ArticleEditor';
import RealisationEditor from './pages/admin/RealisationEditor';
import Analytics from './pages/admin/Analytics';

// Auth Context
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' });
      if (res.ok) {
        setAdmin({ authenticated: true });
      } else {
        setAdmin(null);
      }
    } catch {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { checkAuth(); }, [checkAuth]);

  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur de connexion');
    setAdmin({ authenticated: true });
    return data;
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!admin) return <Navigate to="/admin/connexion" replace />;
  return children;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// Google Analytics
function GoogleAnalytics() {
  const [gaId, setGaId] = useState(null);
  const [consent, setConsent] = useState(localStorage.getItem('cookie_consent') === 'accepted');

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        const value = data.ga_measurement_id;
        if (value && /^G-[A-Z0-9]+$/.test(value)) {
          setGaId(value);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handler = () => setConsent(localStorage.getItem('cookie_consent') === 'accepted');
    window.addEventListener('cookie_consent_update', handler);
    return () => window.removeEventListener('cookie_consent_update', handler);
  }, []);

  useEffect(() => {
    if (!gaId || !consent) return;
    if (document.querySelector(`script[src*="${gaId}"]`)) return;

    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    script.async = true;
    document.head.appendChild(script);

    const inline = document.createElement('script');
    inline.textContent = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${gaId}');`;
    document.head.appendChild(inline);
  }, [gaId, consent]);

  return null;
}

// Schema.org
const schemaOrg = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'G&T Paysage',
  url: 'https://gtpaysage38.fr',
  logo: 'https://gtpaysage38.fr/img/logo/logo.png',
  image: 'https://gtpaysage38.fr/img/og-default.jpg',
  description: 'Paysagiste, élagueur à Bourgoin-Jallieu (38). Création et entretien de jardins, élagage, aménagement extérieur.',
  email: 'contact@gtpaysage38.fr',
  telephone: ['06 29 42 91 89', '06 12 87 88 23'],
  address: {
    '@type': 'PostalAddress',
    streetAddress: '82, chemin de la perdrix',
    addressLocality: 'Serezin-de-la-Tour',
    postalCode: '38300',
    addressCountry: 'FR',
    addressRegion: 'Rhône-Alpes'
  },
  areaServed: {
    '@type': 'GeoCircle',
    geoMidpoint: { '@type': 'GeoCoordinates', latitude: 45.585, longitude: 5.273 },
    geoRadius: '30000'
  },
  priceRange: '€€'
};

function PublicLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Helmet>
          <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>
        </Helmet>
        <GoogleAnalytics />
        <ScrollToTop />
        <Routes>
          {/* Public */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/a-propos" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
          <Route path="/actualites" element={<PublicLayout><News /></PublicLayout>} />
          <Route path="/actualites/:slug" element={<PublicLayout><NewsDetail /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
          <Route path="/realisations" element={<PublicLayout><Realisations /></PublicLayout>} />
          <Route path="/mentions-legales" element={<PublicLayout><MentionsLegales /></PublicLayout>} />

          {/* Admin */}
          <Route path="/admin/connexion" element={<Login />} />
          <Route path="/admin/tableau-de-bord" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/articles/nouveau" element={<ProtectedRoute><ArticleEditor /></ProtectedRoute>} />
          <Route path="/admin/articles/:id/modifier" element={<ProtectedRoute><ArticleEditor /></ProtectedRoute>} />
          <Route path="/admin/realisations/nouveau" element={<ProtectedRoute><RealisationEditor /></ProtectedRoute>} />
          <Route path="/admin/realisations/:id/modifier" element={<ProtectedRoute><RealisationEditor /></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />

          {/* 404 */}
          <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
        </Routes>
        <CookieBanner />
      </BrowserRouter>
    </AuthProvider>
  );
}
