import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Key, Users, Receipt, Building2, Bell, Search, Store, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard': return 'Dashboard';
      case '/recepcion': return 'Recepción';
      case '/huespedes': return 'Huéspedes';
      case '/caja': return 'Caja / Facturación';
      case '/pos': return 'Punto de Venta (POS)';
      case '/admin': return 'Panel de Administración';
      default: return 'Club Hotel La Joya';
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <Building2 className="brand-icon" />
          <span className="brand-title">La Joya</span>
        </div>
        
        <nav className="nav-menu">
          <NavLink to="/dashboard" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/recepcion" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <Key size={20} />
            <span>Recepción</span>
          </NavLink>
          <NavLink to="/pos" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <Store size={20} />
            <span>Punto de Venta</span>
          </NavLink>
          <NavLink to="/huespedes" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <Users size={20} />
            <span>Huéspedes</span>
          </NavLink>
          <NavLink to="/caja" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <Receipt size={20} />
            <span>Caja & Facturación</span>
          </NavLink>

          {user?.role === 'admin' && (
            <>
              <div style={{ height: '1px', background: 'var(--border)', margin: '0.75rem 0' }} />
              <NavLink to="/admin" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                <Shield size={20} />
                <span>Administración</span>
              </NavLink>
            </>
          )}
        </nav>

        {/* Logout button at bottom of sidebar */}
        <div style={{ marginTop: 'auto', padding: '1rem' }}>
          <button onClick={handleLogout} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.75rem 1rem', borderRadius: '10px',
            border: '1px solid rgba(239,68,68,0.2)',
            background: 'rgba(239,68,68,0.08)',
            color: '#f87171', cursor: 'pointer', fontSize: '0.85rem',
            transition: 'all 0.2s'
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
          >
            <LogOut size={18} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <h1 className="page-title">{getPageTitle()}</h1>
          
          <div className="topbar-actions">
            <div className="search-bar" style={{ display: 'flex', alignItems: 'center', background: 'var(--surface-hover)', padding: '0.5rem 1rem', borderRadius: '999px', color: 'var(--text-muted)' }}>
              <Search size={18} style={{ marginRight: '0.5rem' }} />
              <input type="text" placeholder="Buscar huésped, habitación..." style={{ border: 'none', background: 'transparent', outline: 'none', width: '200px' }} />
            </div>
            
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', color: 'var(--text-muted)' }}>
              <Bell size={24} />
              <span style={{ position: 'absolute', top: 0, right: 0, width: '10px', height: '10px', background: 'var(--status-occupied)', borderRadius: '50%' }}></span>
            </button>
            
            <div className="user-profile">
              <div className="avatar">{user?.avatar || user?.name?.[0] || 'U'}</div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>{user?.name || 'Usuario'}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {user?.role === 'admin' ? 'Administrador' : user?.role === 'recepcionista' ? 'Recepción' : 'Cajero'}
                </span>
              </div>
            </div>
          </div>
        </header>
        
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
