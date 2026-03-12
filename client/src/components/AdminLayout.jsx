import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

export default function AdminLayout({ children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/connexion');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo">
          G&amp;T Paysage
        </div>

        <nav className="admin-sidebar__nav">
          <NavLink to="/admin/tableau-de-bord" end>
            &#x25A6; Tableau de bord
          </NavLink>
          <NavLink to="/admin/articles/nouveau">
            &#x270E; Nouvel article
          </NavLink>
          <NavLink to="/admin/realisations/nouveau">
            &#x2726; Nouvelle réalisation
          </NavLink>
          <NavLink to="/admin/analytics">
            &#x25C8; Analytics
          </NavLink>
          <button onClick={handleLogout} style={{ width: '100%', textAlign: 'left', marginTop: 'auto' }}>
            &#x2192; Déconnexion
          </button>
        </nav>
      </aside>

      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
