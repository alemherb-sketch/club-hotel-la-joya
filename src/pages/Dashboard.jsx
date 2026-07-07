import { MOCK_STATS } from '../mockData';
import { BedDouble, Users, Wallet, CheckSquare } from 'lucide-react';

export default function Dashboard() {
  return (
    <div style={{ animation: 'modal-enter 0.4s ease-out' }}>
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span>Ocupación Actual</span>
            <div className="stat-icon primary"><BedDouble size={20} /></div>
          </div>
          <div className="stat-value">{MOCK_STATS.occupancyRate}%</div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            <span style={{ color: 'var(--status-available)', fontWeight: 500 }}>+5%</span> vs ayer
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span>Hab. Disponibles</span>
            <div className="stat-icon info"><CheckSquare size={20} /></div>
          </div>
          <div className="stat-value">{MOCK_STATS.availableRooms}</div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            De 10 habitaciones totales
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span>Check-ins Hoy</span>
            <div className="stat-icon accent"><Users size={20} /></div>
          </div>
          <div className="stat-value">{MOCK_STATS.checkInsToday}</div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            2 pendientes de llegada
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span>Ingresos (S/.)</span>
            <div className="stat-icon primary"><Wallet size={20} /></div>
          </div>
          <div className="stat-value">S/. {MOCK_STATS.revenueToday.toFixed(2)}</div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Cierre de caja en curso
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 400px', background: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)' }}>
          <h3 style={{ marginBottom: '1rem' }}>Llegadas Recientes</h3>
          <ul style={{ listStyle: 'none' }}>
            {['Juan Pérez - Hab 101', 'María Torres - Hab 201', 'Carlos Ruiz - Hab 203'].map((guest, i) => (
              <li key={i} style={{ padding: '0.75rem 0', borderBottom: i !== 2 ? '1px solid var(--border-color)' : 'none', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 500 }}>{guest}</span>
                <span className="room-status-badge status-occupied">Check-in OK</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div style={{ flex: '1 1 400px', background: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)' }}>
           <h3 style={{ marginBottom: '1rem' }}>Estado del Hotel</h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             <div>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                 <span>Ocupadas (4)</span>
                 <span>40%</span>
               </div>
               <div style={{ width: '100%', height: '8px', background: 'var(--bg-color)', borderRadius: '4px', overflow: 'hidden' }}>
                 <div style={{ width: '40%', height: '100%', background: 'var(--status-occupied)' }}></div>
               </div>
             </div>
             <div>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                 <span>Disponibles (4)</span>
                 <span>40%</span>
               </div>
               <div style={{ width: '100%', height: '8px', background: 'var(--bg-color)', borderRadius: '4px', overflow: 'hidden' }}>
                 <div style={{ width: '40%', height: '100%', background: 'var(--status-available)' }}></div>
               </div>
             </div>
             <div>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                 <span>Limpieza/Mantenimiento (2)</span>
                 <span>20%</span>
               </div>
               <div style={{ width: '100%', height: '8px', background: 'var(--bg-color)', borderRadius: '4px', overflow: 'hidden' }}>
                 <div style={{ width: '20%', height: '100%', background: 'var(--status-cleaning)' }}></div>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
