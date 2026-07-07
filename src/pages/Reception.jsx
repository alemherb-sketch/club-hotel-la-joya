import { useState } from 'react';
import { MOCK_ROOMS, saveRoomsToStorage } from '../mockData';
import CheckInModal from '../components/CheckInModal';
import { Filter } from 'lucide-react';

export default function Reception() {
  const [rooms, setRooms] = useState(MOCK_ROOMS);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [filter, setFilter] = useState('all');

  const filteredRooms = rooms.filter(r => filter === 'all' || r.status === filter);

  const handleUpdateRoom = (updatedRoom) => {
    // Actualizar globalmente para persistencia
    const newRooms = rooms.map(r => r.id === updatedRoom.id ? updatedRoom : r);
    setRooms(newRooms);
    saveRoomsToStorage(newRooms);
  };

  return (
    <div style={{ animation: 'modal-enter 0.4s ease-out', height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Filter size={18} color="var(--text-muted)" />
          <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>Filtrar por estado:</span>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter('all')}>Todos</button>
          <button className={`btn ${filter === 'disponible' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter('disponible')}>Disponibles</button>
          <button className={`btn ${filter === 'ocupada' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter('ocupada')}>Ocupadas</button>
          <button className={`btn ${filter === 'limpieza' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter('limpieza')}>Limpieza</button>
          <button className={`btn ${filter === 'mantenimiento' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter('mantenimiento')}>Mantenimiento</button>
        </div>
      </div>

      <div className="room-grid" style={{ flex: 1 }}>
        {filteredRooms.map(room => (
          <div 
            key={room.id} 
            className="room-card" 
            onClick={() => setSelectedRoom(room)}
          >
            <div className="room-number">{room.number}</div>
            <div className="room-type" style={{ marginBottom: '0.5rem' }}>{room.type}</div>
            
            <div className="room-details-box">
              <div className={`room-status-badge status-${room.status}`}>
                {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-main)', fontWeight: 600, minHeight: '1.25rem' }}>
                {room.guest ? room.guest : '---'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedRoom && (
        <CheckInModal 
          room={selectedRoom} 
          onClose={() => setSelectedRoom(null)} 
          onUpdateRoom={(room) => {
            handleUpdateRoom(room);
            setSelectedRoom(null);
          }}
        />
      )}
    </div>
  );
}
