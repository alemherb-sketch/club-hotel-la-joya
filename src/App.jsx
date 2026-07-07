import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Reception from './pages/Reception';
import Huespedes from './pages/Huespedes';
import Caja from './pages/Caja';
import POS from './pages/POS';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="recepcion" element={<Reception />} />
          <Route path="pos" element={<POS />} />
          <Route path="huespedes" element={<Huespedes />} />
          <Route path="caja" element={<Caja />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
