import { useState, useMemo, useEffect } from 'react';
import { ShoppingBag, Search, Plus, Minus, Trash2, DoorClosed } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function POS() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [cart, setCart] = useState([]);
  const [isChargingToRoom, setIsChargingToRoom] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState('');

  const [products, setProducts] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: prodData } = await supabase.from('products').select('*');
    if (prodData) setProducts(prodData);

    const { data: roomData } = await supabase.from('rooms').select('*').eq('status', 'ocupada');
    if (roomData) setRooms(roomData);
  };

  const categories = ['Todas', ...new Set(products.map(p => p.category))];

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = selectedCategory === 'Todas' || p.category === selectedCategory;
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [searchTerm, selectedCategory, products]);

  const occupiedRooms = rooms;

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQ = item.quantity + delta;
        return newQ > 0 ? { ...item, quantity: newQ } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const igv = subtotal * 0.18;
  const total = subtotal + igv;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    if (isChargingToRoom && !selectedRoom) {
      alert('Por favor, seleccione una habitación para cargar el consumo.');
      return;
    }
    
    const method = isChargingToRoom ? `Cargo Hab. ${selectedRoom}` : 'Venta Directa';
    alert(`Comanda registrada exitosamente.\nMétodo: ${method}\nTotal: S/. ${total.toFixed(2)}`);
    setCart([]);
    setIsChargingToRoom(false);
    setSelectedRoom('');
  };

  return (
    <div style={{ display: 'flex', gap: '1.5rem', height: 'calc(100vh - 100px)', animation: 'modal-enter 0.4s ease-out' }}>
      
      {/* Catálogo de Productos */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Punto de Venta (POS)</h2>
          <div className="search-bar" style={{ width: '300px' }}>
            <Search size={20} className="search-icon" />
            <input 
              type="text" 
              placeholder="Buscar producto..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Categorías */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {categories.map(cat => (
            <button 
              key={cat}
              className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setSelectedCategory(cat)}
              style={{ whiteSpace: 'nowrap' }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grilla */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
          gap: '1rem', 
          overflowY: 'auto',
          paddingRight: '0.5rem',
          paddingBottom: '1rem'
        }}>
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              className="glass"
              style={{ 
                padding: '1rem', 
                borderRadius: 'var(--radius-lg)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                textAlign: 'center',
                transition: 'transform 0.2s',
                backgroundColor: 'var(--surface-hover)'
              }}
              onClick={() => addToCart(product)}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div style={{ fontSize: '3rem' }}>{product.image}</div>
              <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{product.name}</div>
              <div style={{ color: 'var(--primary-dark)', fontWeight: 700 }}>S/. {product.price.toFixed(2)}</div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              No se encontraron productos.
            </div>
          )}
        </div>
      </div>

      {/* Comanda (Carrito) */}
      <div className="glass" style={{ 
        width: '380px', 
        borderRadius: 'var(--radius-lg)', 
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: 'var(--surface)'
      }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShoppingBag size={24} color="var(--primary)" />
          <h3 style={{ margin: 0 }}>Comanda Actual</h3>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>
              <ShoppingBag size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <p>El carrito está vacío</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cart.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500 }}>{item.name}</div>
                    <div style={{ color: 'var(--primary)', fontSize: '0.875rem' }}>S/. {(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button className="btn btn-outline" style={{ padding: '0.25rem' }} onClick={() => updateQuantity(item.id, -1)}><Minus size={14} /></button>
                    <span style={{ width: '20px', textAlign: 'center', fontWeight: 600 }}>{item.quantity}</span>
                    <button className="btn btn-outline" style={{ padding: '0.25rem' }} onClick={() => updateQuantity(item.id, 1)}><Plus size={14} /></button>
                    <button className="btn" style={{ padding: '0.25rem', color: '#ef4444', border: 'none', background: 'transparent' }} onClick={() => removeFromCart(item.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Totales y Cobro */}
        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--surface-hover)' }}>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 500 }}>
              <input 
                type="checkbox" 
                checked={isChargingToRoom}
                onChange={(e) => setIsChargingToRoom(e.target.checked)}
              />
              <DoorClosed size={18} /> Cargar a Habitación
            </label>
            
            {isChargingToRoom && (
              <select 
                className="form-select" 
                style={{ marginTop: '0.5rem' }}
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
              >
                <option value="">Seleccione habitación...</option>
                {occupiedRooms.map(r => (
                  <option key={r.id} value={r.number}>Hab. {r.number} - {r.guest}</option>
                ))}
              </select>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
            <span>Subtotal</span>
            <span>S/. {subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-muted)' }}>
            <span>IGV (18%)</span>
            <span>S/. {igv.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-dark)' }}>
            <span>Total</span>
            <span>S/. {total.toFixed(2)}</span>
          </div>

          <button 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
            disabled={cart.length === 0}
            onClick={handleCheckout}
          >
            {isChargingToRoom ? 'Cargar a Cuenta' : 'Cobrar (Efectivo/Tarjeta)'}
          </button>
        </div>
      </div>

    </div>
  );
}
