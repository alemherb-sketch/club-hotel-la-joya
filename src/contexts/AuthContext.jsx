import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restaurar sesión desde localStorage
    const savedUser = localStorage.getItem('hotel_user');
    const savedSession = localStorage.getItem('hotel_session_id');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setSessionId(savedSession);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .single();

    if (error || !data) {
      throw new Error('Credenciales incorrectas');
    }

    // Crear sesión
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .insert({
        user_id: data.id,
        user_name: data.name,
        user_role: data.role,
        login_at: new Date().toISOString(),
        ip_address: 'Web App'
      })
      .select()
      .single();

    if (!sessionError && session) {
      setSessionId(session.id);
      localStorage.setItem('hotel_session_id', session.id);
    }

    // Registrar actividad
    await logActivity(data.id, data.name, 'login', `${data.name} inició sesión`, 'Sistema');

    setUser(data);
    localStorage.setItem('hotel_user', JSON.stringify(data));
    return data;
  };

  const logout = async () => {
    if (user && sessionId) {
      // Cerrar sesión en la BD
      await supabase
        .from('sessions')
        .update({ logout_at: new Date().toISOString() })
        .eq('id', sessionId);

      // Registrar actividad
      await logActivity(user.id, user.name, 'logout', `${user.name} cerró sesión`, 'Sistema');
    }

    setUser(null);
    setSessionId(null);
    localStorage.removeItem('hotel_user');
    localStorage.removeItem('hotel_session_id');
  };

  const logActivity = async (userId, userName, action, description, module) => {
    await supabase.from('activity_log').insert({
      user_id: userId || user?.id,
      user_name: userName || user?.name,
      action,
      description,
      module
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, sessionId, login, logout, logActivity }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
}
