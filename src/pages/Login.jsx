import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Building2, LogIn, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError('Correo o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f1923 0%, #1a2f3a 40%, #0d3b2e 100%)',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative circles */}
      <div style={{
        position: 'absolute', top: '-120px', right: '-120px',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)'
      }} />
      <div style={{
        position: 'absolute', bottom: '-80px', left: '-80px',
        width: '300px', height: '300px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)'
      }} />

      <div style={{
        width: '100%', maxWidth: '420px', padding: '2rem',
        position: 'relative', zIndex: 1
      }}>
        {/* Logo */}
        <div style={{
          textAlign: 'center', marginBottom: '2.5rem'
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '72px', height: '72px', borderRadius: '20px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            marginBottom: '1rem',
            boxShadow: '0 8px 32px rgba(16,185,129,0.3)'
          }}>
            <Building2 size={36} color="white" />
          </div>
          <h1 style={{
            fontSize: '1.75rem', fontWeight: 700, color: '#ffffff',
            margin: '0 0 0.25rem'
          }}>Club Hotel La Joya</h1>
          <p style={{
            fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', margin: 0
          }}>Sistema de Gestión Hotelera</p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '2rem',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          <h2 style={{
            fontSize: '1.25rem', fontWeight: 600, color: '#ffffff',
            margin: '0 0 0.25rem', textAlign: 'center'
          }}>Iniciar Sesión</h2>
          <p style={{
            fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)',
            textAlign: 'center', margin: '0 0 1.5rem'
          }}>Ingresa tus credenciales para continuar</p>

          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.75rem 1rem', borderRadius: '12px',
              background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#fca5a5', fontSize: '0.85rem', marginBottom: '1rem'
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block', fontSize: '0.8rem', fontWeight: 500,
                color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem'
              }}>Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@lajoya.com"
                required
                style={{
                  width: '100%', padding: '0.75rem 1rem', borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: 'rgba(255,255,255,0.07)',
                  color: '#ffffff', fontSize: '0.9rem', outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block', fontSize: '0.8rem', fontWeight: 500,
                color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem'
              }}>Contraseña</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%', padding: '0.75rem 3rem 0.75rem 1rem', borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    background: 'rgba(255,255,255,0.07)',
                    color: '#ffffff', fontSize: '0.9rem', outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#10b981'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%',
                    transform: 'translateY(-50%)', background: 'none',
                    border: 'none', cursor: 'pointer',
                    color: 'rgba(255,255,255,0.4)', padding: '4px'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '0.85rem', borderRadius: '12px',
                border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                background: loading
                  ? 'rgba(16,185,129,0.5)'
                  : 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white', fontSize: '0.95rem', fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 20px rgba(16,185,129,0.3)',
                transition: 'transform 0.15s, box-shadow 0.15s'
              }}
              onMouseEnter={(e) => { if (!loading) { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 6px 25px rgba(16,185,129,0.4)'; }}}
              onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 20px rgba(16,185,129,0.3)'; }}
            >
              <LogIn size={18} />
              {loading ? 'Verificando...' : 'Ingresar al Sistema'}
            </button>
          </form>
        </div>

        {/* Footer hint */}
        <div style={{
          textAlign: 'center', marginTop: '1.5rem',
          padding: '1rem', borderRadius: '12px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)'
        }}>
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', margin: '0 0 0.5rem' }}>
            Usuarios de prueba:
          </p>
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', margin: '0 0 0.25rem' }}>
            <strong style={{ color: '#10b981' }}>Admin:</strong> admin@lajoya.com / admin123
          </p>
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
            <strong style={{ color: '#10b981' }}>Recepción:</strong> maria@lajoya.com / maria123
          </p>
        </div>
      </div>
    </div>
  );
}
