import { useState } from 'react';
import { MOCK_GUESTS } from '../mockData';
import { Search, UserPlus, FileEdit, Trash2, X } from 'lucide-react';

export default function Huespedes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'new', 'edit', 'delete'
  const [selectedGuest, setSelectedGuest] = useState(null);

  const filteredGuests = MOCK_GUESTS.filter(g => 
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    g.docNumber.includes(searchTerm)
  );

  const handleAction = (type, guest = null) => {
    setModalType(type);
    setSelectedGuest(guest);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedGuest(null);
  };

  return (
    <div style={{ animation: 'modal-enter 0.4s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div className="search-bar" style={{ display: 'flex', alignItems: 'center', background: 'var(--surface)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', width: '300px' }}>
          <Search size={18} style={{ marginRight: '0.5rem', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o documento..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--text-main)' }} 
          />
        </div>
        <button className="btn btn-primary" onClick={() => handleAction('new')}>
          <UserPlus size={18} /> Nuevo Huésped
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nombre Completo</th>
              <th>Documento</th>
              <th>Habitación</th>
              <th>Check-in</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredGuests.map(guest => (
              <tr key={guest.id}>
                <td style={{ fontWeight: 500 }}>{guest.name}</td>
                <td>{guest.docType}: {guest.docNumber}</td>
                <td>{guest.room !== '---' ? `Hab ${guest.room}` : '---'}</td>
                <td>{guest.checkIn}</td>
                <td>
                  <span className={`badge ${guest.status === 'Alojado' ? 'badge-success' : 'badge-warning'}`}>
                    {guest.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} title="Editar" onClick={() => handleAction('edit', guest)}>
                      <FileEdit size={18} />
                    </button>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--status-occupied)' }} title="Eliminar" onClick={() => handleAction('delete', guest)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredGuests.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No se encontraron huéspedes con ese criterio de búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content glass" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {modalType === 'new' && 'Registrar Nuevo Huésped'}
                {modalType === 'edit' && 'Editar Huésped'}
                {modalType === 'delete' && 'Confirmar Eliminación'}
              </h2>
              <button className="close-button" onClick={closeModal}><X size={20} /></button>
            </div>
            <div className="modal-body">
              {modalType === 'delete' ? (
                <div>
                  <p>¿Estás seguro que deseas eliminar a <strong>{selectedGuest?.name}</strong> del registro?</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>Esta acción no se puede deshacer.</p>
                  <div className="flex-end mt-4 gap-2">
                    <button className="btn btn-outline" onClick={closeModal}>Cancelar</button>
                    <button className="btn" style={{ background: 'var(--status-occupied)', color: 'white' }} onClick={() => { alert('Huésped eliminado (Mock)'); closeModal(); }}>Sí, eliminar</button>
                  </div>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); alert(`Huésped ${modalType === 'new' ? 'registrado' : 'actualizado'} con éxito (Mock)`); closeModal(); }}>
                  <div className="form-group">
                    <label className="form-label">Nombre Completo</label>
                    <input type="text" className="form-input" defaultValue={selectedGuest?.name || ''} required />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Documento</label>
                      <input type="text" className="form-input" defaultValue={selectedGuest?.docNumber || ''} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Habitación</label>
                      <input type="text" className="form-input" defaultValue={selectedGuest?.room !== '---' ? selectedGuest?.room : ''} placeholder="Ej: 101" />
                    </div>
                  </div>
                  <div className="flex-end mt-4 gap-2">
                    <button type="button" className="btn btn-outline" onClick={closeModal}>Cancelar</button>
                    <button type="submit" className="btn btn-primary">Guardar</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
