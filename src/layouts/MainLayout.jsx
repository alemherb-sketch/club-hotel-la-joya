import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Key, Users, Receipt, Building2, Bell, Search, Store } from 'lucide-react';

export default function MainLayout() {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard': return 'Dashboard';
      case '/recepcion': return 'Recepción';
      case '/huespedes': return 'Huéspedes';
      case '/caja': return 'Caja / Facturación';
      case '/pos': return 'Punto de Venta (POS)';
      default: return 'Club Hotel La Joya';
    }
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
        </nav>
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
              <div className="avatar">A</div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>Admin</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Recepción</span>
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
