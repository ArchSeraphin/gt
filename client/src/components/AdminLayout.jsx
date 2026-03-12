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
        <div className="admin-sidebar-header">
          <span className="admin-logo">G&T Paysage</span>
        </div>

        <nav className="admin-nav">
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
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={handleLogout}>
            &#x2192; Déconnexion
          </button>
        </div>
      </aside>

      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
