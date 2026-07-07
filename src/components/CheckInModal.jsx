import { useState } from 'react';
import { X, FileText, Printer, Search } from 'lucide-react';

export default function CheckInModal({ room, onClose, onUpdateRoom }) {
  const [docType, setDocType] = useState('DNI');
  const [docNumber, setDocNumber] = useState('');
  const [guestName, setGuestName] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [ticketGenerated, setTicketGenerated] = useState(false);

  const isAvailable = room.status === 'disponible';

  const handleGenerateTicket = (e) => {
    e.preventDefault();
    setTicketGenerated(true);
    setTimeout(() => {
      alert(`Ticket generado correctamente para Habitación ${room.number}. Guardado como PDF.`);
      onUpdateRoom({ ...room, status: 'ocupada', guest: guestName || 'Huésped Nuevo' });
      onClose();
    }, 1500);
  };

  const handleSearchDocument = async () => {
    if (!docNumber) return;
    setIsSearching(true);
    
    const cleanedNumber = docNumber.trim();
    let currentDocType = docType;
    
    // Auto-detect based on length
    if (cleanedNumber.length === 8) {
      currentDocType = 'DNI';
      setDocType('DNI');
    } else if (cleanedNumber.length === 11) {
      currentDocType = 'RUC';
      setDocType('RUC');
    } else {
      alert('El documento debe tener 8 dígitos (DNI) o 11 dígitos (RUC) para la búsqueda automática.');
      setIsSearching(false);
      return;
    }

    // Múltiples APIs de respaldo — si una falla, se prueba la siguiente
    const apiSources = currentDocType === 'DNI' ? [
      {
        name: 'apis.net.pe (v1)',
        url: `https://api.apis.net.pe/v1/dni?numero=${cleanedNumber}`,
        headers: {},
        extract: (data) => `${data.nombres} ${data.apellidoPaterno} ${data.apellidoMaterno}`
      },
      {
        name: 'apis.net.pe (cors)',
        url: `https://corsproxy.io/?${encodeURIComponent(`https://api.apis.net.pe/v1/dni?numero=${cleanedNumber}`)}`,
        headers: {},
        extract: (data) => `${data.nombres} ${data.apellidoPaterno} ${data.apellidoMaterno}`
      },
      {
        name: 'dniruc.com',
        url: `https://dniruc.apisperu.com/api/v1/dni/${cleanedNumber}?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImRlbW9AZGVtby5jb20ifQ.demo`,
        headers: {},
        extract: (data) => `${data.nombres} ${data.apellidoPaterno} ${data.apellidoMaterno}`
      }
    ] : [
      {
        name: 'apis.net.pe (v1)',
        url: `https://api.apis.net.pe/v1/ruc?numero=${cleanedNumber}`,
        headers: {},
        extract: (data) => data.nombre || data.razonSocial || data.nombreOrazonSocial
      },
      {
        name: 'apis.net.pe (cors)',
        url: `https://corsproxy.io/?${encodeURIComponent(`https://api.apis.net.pe/v1/ruc?numero=${cleanedNumber}`)}`,
        headers: {},
        extract: (data) => data.nombre || data.razonSocial || data.nombreOrazonSocial
      }
    ];

    let found = false;

    for (const source of apiSources) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos máximo por API

        const response = await fetch(source.url, {
          headers: source.headers,
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          if (data && !data.error) {
            const name = source.extract(data);
            if (name && name.trim() && name.trim() !== 'undefined undefined undefined') {
              setGuestName(name.trim());
              found = true;
              break;
            }
          }
        }
      } catch (err) {
        console.warn(`API ${source.name} falló:`, err.message);
        // Continuar con la siguiente API
      }
    }

    if (!found) {
      // Si ninguna API respondió, permitir ingreso manual
      alert('No se pudo consultar el documento en este momento. Por favor, ingresa el nombre manualmente.');
    }
    
    setIsSearching(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {isAvailable ? `Check-in: Hab ${room.number}` : `Detalles: Hab ${room.number}`}
          </h2>
          <button className="close-button" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="modal-body">
          {!isAvailable ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
                Huésped: <strong>{room.guest || 'Mantenimiento/Limpieza'}</strong>
              </div>
              <div style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Estado actual: <strong>{room.status.toUpperCase()}</strong></div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
                {room.status === 'ocupada' && (
                  <>
                    <button className="btn btn-outline" style={{ width: '100%', maxWidth: '300px' }} onClick={onClose}>
                      <FileText size={18} /> Ver Detalles de Reserva
                    </button>
                    <button className="btn btn-primary" style={{ width: '100%', maxWidth: '300px' }} onClick={() => {
                      onUpdateRoom({ ...room, status: 'limpieza', guest: null });
                    }}>
                      Realizar Check-out (Pasar a Limpieza)
                    </button>
                  </>
                )}
                {(room.status === 'limpieza' || room.status === 'mantenimiento') && (
                  <button className="btn btn-primary" style={{ width: '100%', maxWidth: '300px' }} onClick={() => {
                    onUpdateRoom({ ...room, status: 'disponible', guest: null });
                  }}>
                    Marcar como Disponible
                  </button>
                )}
                {room.status === 'disponible' && (
                  <button className="btn btn-outline" style={{ width: '100%', maxWidth: '300px' }} onClick={() => {
                    onUpdateRoom({ ...room, status: 'mantenimiento', guest: null });
                  }}>
                    Bloquear por Mantenimiento
                  </button>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleGenerateTicket}>
              <div className="form-group">
                <label className="form-label">Tipo de Documento</label>
                <select 
                  className="form-select" 
                  value={docType} 
                  onChange={(e) => setDocType(e.target.value)}
                >
                  <option value="DNI">DNI</option>
                  <option value="RUC">RUC</option>
                  <option value="CE">Carnet de Extranjería (CE)</option>
                  <option value="Pasaporte">Pasaporte (Exonerado IGV)</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Número de Documento</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Ej: 71234567" 
                      value={docNumber}
                      onChange={e => setDocNumber(e.target.value)}
                      required 
                      style={{ flex: 1 }}
                    />
                    <button 
                      type="button" 
                      className="btn btn-primary" 
                      onClick={handleSearchDocument}
                      disabled={isSearching}
                      style={{ padding: '0.5rem 1rem' }}
                    >
                      {isSearching ? '...' : <Search size={18} />}
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Nombres / Razón Social</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Nombre completo" 
                    value={guestName}
                    onChange={e => setGuestName(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Tarifa (S/.)</label>
                  <input type="number" className="form-input" defaultValue={150} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Tipo de Comprobante</label>
                  <select className="form-select">
                    <option value="boleta">Boleta de Venta</option>
                    {docType === 'RUC' && <option value="factura">Factura</option>}
                    <option value="ticket">Ticket Interno</option>
                  </select>
                </div>
              </div>

              {docType === 'Pasaporte' && (
                <div style={{ background: '#ecfdf5', padding: '0.75rem', borderRadius: 'var(--radius-md)', color: 'var(--primary-dark)', fontSize: '0.875rem', marginBottom: '1rem', border: '1px solid var(--primary-light)' }}>
                  * Huésped aplica para exoneración de IGV (Art. 33). Solicitar Tarjeta Andina de Migración (TAM).
                </div>
              )}

              <div className="flex-end mt-4 gap-2">
                <button type="button" className="btn btn-outline" onClick={onClose}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={ticketGenerated}>
                  {ticketGenerated ? 'Generando...' : <><Printer size={18} /> Check-in & Ticket</>}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
