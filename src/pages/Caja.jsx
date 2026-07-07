import { useState } from 'react';
import { MOCK_TRANSACTIONS } from '../mockData';
import { ArrowDownRight, ArrowUpRight, FileText, Lock } from 'lucide-react';

export default function Caja() {
  const [filter, setFilter] = useState('todos');

  const filteredTransactions = MOCK_TRANSACTIONS.filter(t => filter === 'todos' || t.type === filter);
  
  const totalIngresos = MOCK_TRANSACTIONS.filter(t => t.type === 'ingreso').reduce((acc, curr) => acc + curr.amount, 0);
  const totalEgresos = MOCK_TRANSACTIONS.filter(t => t.type === 'egreso').reduce((acc, curr) => acc + curr.amount, 0);
  const balanceFinal = totalIngresos - totalEgresos;

  return (
    <div style={{ animation: 'modal-enter 0.4s ease-out' }}>
      
      {/* Resumen de Caja */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: '#ecfdf5', color: '#10b981', borderRadius: '50%' }}>
            <ArrowUpRight size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Ingresos Totales</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>S/. {totalIngresos.toFixed(2)}</div>
          </div>
        </div>

        <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: '#fee2e2', color: '#ef4444', borderRadius: '50%' }}>
            <ArrowDownRight size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Egresos (Gastos)</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>S/. {totalEgresos.toFixed(2)}</div>
          </div>
        </div>

        <div style={{ background: 'var(--primary)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', color: 'white', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.2)', borderRadius: '50%' }}>
            <FileText size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Balance Actual (Caja)</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>S/. {balanceFinal.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Controles y Tabla */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className={`btn ${filter === 'todos' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter('todos')}>Todos</button>
          <button className={`btn ${filter === 'ingreso' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter('ingreso')}>Ingresos</button>
          <button className={`btn ${filter === 'egreso' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter('egreso')}>Egresos</button>
        </div>
        <button className="btn" style={{ background: 'var(--status-occupied)', color: 'white' }} onClick={() => alert('Turno cerrado y cuadre de caja (Z) generado con éxito. (Simulación)')}>
          <Lock size={18} /> Cerrar Turno (Caja)
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Hora</th>
              <th>Concepto</th>
              <th>Método</th>
              <th>Usuario</th>
              <th>Monto (S/.)</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map(trx => (
              <tr key={trx.id}>
                <td style={{ color: 'var(--text-muted)' }}>{trx.id}</td>
                <td>{trx.time}</td>
                <td style={{ fontWeight: 500 }}>{trx.concept}</td>
                <td>{trx.method}</td>
                <td>{trx.user}</td>
                <td style={{ fontWeight: 600, color: trx.type === 'ingreso' ? 'var(--status-available)' : 'var(--status-occupied)' }}>
                  {trx.type === 'ingreso' ? '+' : '-'} {trx.amount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
