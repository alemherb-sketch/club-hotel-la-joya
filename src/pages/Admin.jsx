import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import {
  Shield, Users, Clock, Activity, LogOut, LogIn,
  Search, Filter, ChevronDown, Circle, Monitor
} from 'lucide-react';

export default function Admin() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('online');
  const [sessions, setSessions] = useState([]);
  const [activities, setActivities] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [filterModule, setFilterModule] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSessions();
    fetchActivities();
    fetchOnlineUsers();

    // Actualizar cada 30 segundos
    const interval = setInterval(() => {
      fetchOnlineUsers();
      fetchActivities();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchOnlineUsers = async () => {
    const { data } = await supabase
      .from('sessions')
      .select('*')
      .is('logout_at', null)
      .order('login_at', { ascending: false });
    if (data) setOnlineUsers(data);
  };

  const fetchSessions = async () => {
    const { data } = await supabase
      .from('sessions')
      .select('*')
      .order('login_at', { ascending: false })
      .limit(50);
    if (data) setSessions(data);
  };

  const fetchActivities = async () => {
    const { data } = await supabase
      .from('activity_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    if (data) setActivities(data);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' }) + ' ' +
      d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
  };

  const getDuration = (loginAt, logoutAt) => {
    if (!loginAt) return '—';
    const start = new Date(loginAt);
    const end = logoutAt ? new Date(logoutAt) : new Date();
    const diff = Math.floor((end - start) / 1000);
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'login': return { icon: '🟢', color: '#10b981' };
      case 'logout': return { icon: '🔴', color: '#ef4444' };
      case 'check_in': return { icon: '🔑', color: '#3b82f6' };
      case 'check_out': return { icon: '🚪', color: '#f59e0b' };
      case 'pos_sale': return { icon: '🛒', color: '#8b5cf6' };
      case 'room_status': return { icon: '🏨', color: '#06b6d4' };
      default: return { icon: '📋', color: '#6b7280' };
    }
  };

  const getModuleBadgeColor = (module) => {
    switch (module) {
      case 'Recepción': return { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa' };
      case 'POS': return { bg: 'rgba(139,92,246,0.15)', color: '#a78bfa' };
      case 'Caja': return { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24' };
      case 'Sistema': return { bg: 'rgba(16,185,129,0.15)', color: '#34d399' };
      default: return { bg: 'rgba(107,114,128,0.15)', color: '#9ca3af' };
    }
  };

  const filteredActivities = activities.filter(a => {
    const matchModule = filterModule === 'Todos' || a.module === filterModule;
    const matchSearch = !searchTerm ||
      a.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchModule && matchSearch;
  });

  const cardStyle = {
    background: 'var(--surface)',
    borderRadius: '16px',
    border: '1px solid var(--border)',
    padding: '1.5rem',
    transition: 'box-shadow 0.2s'
  };

  const tabStyle = (active) => ({
    padding: '0.6rem 1.2rem',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: active ? 'var(--primary)' : 'var(--surface-hover)',
    color: active ? 'white' : 'var(--text-muted)',
    transition: 'all 0.2s'
  });

  if (user?.role !== 'admin') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '1rem' }}>
        <Shield size={64} style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
        <h2 style={{ color: 'var(--text-main)', margin: 0 }}>Acceso Restringido</h2>
        <p style={{ color: 'var(--text-muted)' }}>Solo los administradores pueden acceder a este panel.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div style={{ ...cardStyle, background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.05))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={22} style={{ color: '#10b981' }} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>En Línea Ahora</p>
              <p style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)' }}>{onlineUsers.length}</p>
            </div>
          </div>
        </div>

        <div style={{ ...cardStyle, background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(59,130,246,0.05))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={22} style={{ color: '#3b82f6' }} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sesiones Hoy</p>
              <p style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {sessions.filter(s => new Date(s.login_at).toDateString() === new Date().toDateString()).length}
              </p>
            </div>
          </div>
        </div>

        <div style={{ ...cardStyle, background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(139,92,246,0.05))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={22} style={{ color: '#8b5cf6' }} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Acciones Hoy</p>
              <p style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {activities.filter(a => new Date(a.created_at).toDateString() === new Date().toDateString()).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button onClick={() => setActiveTab('online')} style={tabStyle(activeTab === 'online')}>
          <Circle size={10} style={{ fill: activeTab === 'online' ? 'white' : '#10b981', color: activeTab === 'online' ? 'white' : '#10b981' }} />
          En Línea ({onlineUsers.length})
        </button>
        <button onClick={() => setActiveTab('sessions')} style={tabStyle(activeTab === 'sessions')}>
          <Clock size={16} />
          Historial de Sesiones
        </button>
        <button onClick={() => setActiveTab('activity')} style={tabStyle(activeTab === 'activity')}>
          <Activity size={16} />
          Registro de Actividad
        </button>
      </div>

      {/* Online Users */}
      {activeTab === 'online' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {onlineUsers.length === 0 ? (
            <div style={{ ...cardStyle, textAlign: 'center', gridColumn: '1 / -1', padding: '3rem' }}>
              <Monitor size={48} style={{ color: 'var(--text-muted)', opacity: 0.3, marginBottom: '1rem' }} />
              <p style={{ color: 'var(--text-muted)' }}>No hay usuarios conectados en este momento</p>
            </div>
          ) : onlineUsers.map(s => (
            <div key={s.id} style={{ ...cardStyle, position: 'relative', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                background: 'linear-gradient(90deg, #10b981, #059669)'
              }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '14px',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 700, fontSize: '1.1rem',
                  position: 'relative'
                }}>
                  {s.user_name?.[0] || '?'}
                  <div style={{
                    position: 'absolute', bottom: '-2px', right: '-2px',
                    width: '14px', height: '14px', borderRadius: '50%',
                    background: '#10b981', border: '2px solid var(--surface)',
                    animation: 'pulse 2s infinite'
                  }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>{s.user_name}</p>
                  <p style={{ margin: '0.15rem 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {s.user_role === 'admin' ? '🛡️ Administrador' : s.user_role === 'recepcionista' ? '🔑 Recepcionista' : '💰 Cajero'}
                  </p>
                </div>
              </div>
              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>Conectado: {formatDate(s.login_at)}</span>
                <span style={{ color: '#10b981', fontWeight: 500 }}>{getDuration(s.login_at, null)} activo</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sessions History */}
      {activeTab === 'sessions' && (
        <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Usuario</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rol</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Conexión</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Desconexión</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Duración</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s, i) => (
                  <tr key={s.id} style={{ borderBottom: i < sessions.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '0.85rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600, fontSize: '0.8rem' }}>
                          {s.user_name?.[0] || '?'}
                        </div>
                        <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{s.user_name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', color: 'var(--text-muted)' }}>{s.user_role}</td>
                    <td style={{ padding: '0.85rem 1.25rem', color: 'var(--text-main)' }}>{formatDate(s.login_at)}</td>
                    <td style={{ padding: '0.85rem 1.25rem', color: s.logout_at ? 'var(--text-main)' : 'var(--text-muted)' }}>{s.logout_at ? formatDate(s.logout_at) : '—'}</td>
                    <td style={{ padding: '0.85rem 1.25rem', color: 'var(--text-main)', fontWeight: 500 }}>{getDuration(s.login_at, s.logout_at)}</td>
                    <td style={{ padding: '0.85rem 1.25rem', textAlign: 'center' }}>
                      <span style={{
                        padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 500,
                        background: s.logout_at ? 'rgba(107,114,128,0.15)' : 'rgba(16,185,129,0.15)',
                        color: s.logout_at ? '#9ca3af' : '#10b981'
                      }}>
                        {s.logout_at ? 'Cerrada' : '● Activa'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Activity Log */}
      {activeTab === 'activity' && (
        <div>
          {/* Filters */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '0.5rem 1rem' }}>
              <Search size={16} style={{ color: 'var(--text-muted)' }} />
              <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Buscar por usuario o descripción..." style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--text-main)', fontSize: '0.85rem' }} />
            </div>
            {['Todos', 'Recepción', 'POS', 'Caja', 'Sistema'].map(mod => (
              <button key={mod} onClick={() => setFilterModule(mod)} style={{
                padding: '0.5rem 1rem', borderRadius: '10px', border: '1px solid var(--border)',
                background: filterModule === mod ? 'var(--primary)' : 'var(--surface)',
                color: filterModule === mod ? 'white' : 'var(--text-muted)',
                cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500
              }}>{mod}</button>
            ))}
          </div>

          {/* Timeline */}
          <div style={{ ...cardStyle }}>
            {filteredActivities.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <Activity size={48} style={{ color: 'var(--text-muted)', opacity: 0.3, marginBottom: '1rem' }} />
                <p style={{ color: 'var(--text-muted)' }}>No hay actividad registrada</p>
              </div>
            ) : filteredActivities.map((a, i) => {
              const actionInfo = getActionIcon(a.action);
              const moduleBadge = getModuleBadgeColor(a.module);
              return (
                <div key={a.id} style={{
                  display: 'flex', gap: '1rem', padding: '0.85rem 0',
                  borderBottom: i < filteredActivities.length - 1 ? '1px solid var(--border)' : 'none'
                }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: `${actionInfo.color}20`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1rem', flexShrink: 0
                  }}>
                    {actionInfo.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.85rem' }}>{a.user_name}</span>
                      <span style={{
                        padding: '0.15rem 0.5rem', borderRadius: '6px', fontSize: '0.7rem',
                        background: moduleBadge.bg, color: moduleBadge.color, fontWeight: 500
                      }}>{a.module}</span>
                    </div>
                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{a.description}</p>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', flexShrink: 0 }}>{formatDate(a.created_at)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
