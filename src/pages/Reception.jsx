import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import CheckInModal from '../components/CheckInModal';
import { Filter } from 'lucide-react';

export default function Reception() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchRooms();

    // Suscribirse a cambios en tiempo real
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rooms' },
        (payload) => {
          console.log('Cambio recibido en tiempo real:', payload);
          if (payload.eventType === 'UPDATE') {
            setRooms(prev => prev.map(r => r.id === payload.new.id ? payload.new : r));
          } else if (payload.eventType === 'INSERT') {
            setRooms(prev => [...prev, payload.new].sort((a, b) => a.id - b.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchRooms = async () => {
    const { data, error } = await supabase.from('rooms').select('*').order('id', { ascending: true });
    if (error) {
      console.error('Error fetching rooms:', error);
    } else if (data) {
      setRooms(data);
    }
  };

  const filteredRooms = rooms.filter(r => filter === 'all' || r.status === filter);

  const handleUpdateRoom = async (updatedRoom) => {
    // Actualización optimista en la UI local
    setRooms(prev => prev.map(r => r.id === updatedRoom.id ? updatedRoom : r));
    
    // Guardar en la Base de Datos Real
    const { error } = await supabase
      .from('rooms')
      .update({ status: updatedRoom.status, guest: updatedRoom.guest })
      .eq('id', updatedRoom.id);
      
    if (error) {
      console.error('Error actualizando la habitación:', error);
      // Revertir en caso de error llamando de nuevo a fetchRooms
      fetchRooms();
    }
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
