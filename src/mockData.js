const initialRooms = [
  { id: 101, number: '101', type: 'Simple', status: 'ocupada', guest: 'Juan Pérez' },
  { id: 102, number: '102', type: 'Doble', status: 'disponible', guest: null },
  { id: 103, number: '103', type: 'Matrimonial', status: 'limpieza', guest: null },
  { id: 104, number: '104', type: 'Simple', status: 'disponible', guest: null },
  { id: 105, number: '105', type: 'Suite', status: 'mantenimiento', guest: null },
  { id: 201, number: '201', type: 'Doble', status: 'ocupada', guest: 'María Torres' },
  { id: 202, number: '202', type: 'Doble', status: 'disponible', guest: null },
  { id: 203, number: '203', type: 'Matrimonial', status: 'ocupada', guest: 'Carlos Ruiz' },
  { id: 204, number: '204', type: 'Simple', status: 'disponible', guest: null },
  { id: 205, number: '205', type: 'Suite', status: 'disponible', guest: null }
];

export let MOCK_ROOMS = JSON.parse(localStorage.getItem('hotel_rooms')) || initialRooms;

export const saveRoomsToStorage = (rooms) => {
  MOCK_ROOMS = rooms;
  localStorage.setItem('hotel_rooms', JSON.stringify(rooms));
};

export const MOCK_STATS = {
  occupancyRate: 40,
  availableRooms: 6,
  checkInsToday: 3,
  revenueToday: 1250.00, // En Soles
};

export const MOCK_GUESTS = [
  { id: 1, name: 'Juan Pérez', docType: 'DNI', docNumber: '71234567', room: '101', checkIn: '2023-10-25 14:30', status: 'Alojado' },
  { id: 2, name: 'María Torres', docType: 'DNI', docNumber: '45678912', room: '201', checkIn: '2023-10-24 18:15', status: 'Alojado' },
  { id: 3, name: 'Carlos Ruiz', docType: 'CE', docNumber: '001122334', room: '203', checkIn: '2023-10-26 09:45', status: 'Alojado' },
  { id: 4, name: 'John Smith', docType: 'Pasaporte', docNumber: 'US987654', room: '---', checkIn: '2023-10-20 12:00', status: 'Check-out' },
  { id: 5, name: 'Empresa Constructora SAC', docType: 'RUC', docNumber: '20123456789', room: '---', checkIn: '2023-10-22 10:00', status: 'Check-out' }
];

export const MOCK_TRANSACTIONS = [
  { id: 'TRX-001', time: '08:30 AM', concept: 'Apertura de Caja', type: 'ingreso', amount: 200.00, method: 'Efectivo', user: 'Admin' },
  { id: 'TRX-002', time: '09:45 AM', concept: 'Cobro Hab. 203 (Adelanto)', type: 'ingreso', amount: 150.00, method: 'Tarjeta/POS', user: 'Admin' },
  { id: 'TRX-003', time: '11:15 AM', concept: 'Compra de Suministros (Agua)', type: 'egreso', amount: 35.50, method: 'Efectivo', user: 'Admin' },
  { id: 'TRX-004', time: '14:30 PM', concept: 'Cobro Hab. 101', type: 'ingreso', amount: 120.00, method: 'Yape/Plin', user: 'Admin' },
  { id: 'TRX-005', time: '16:00 PM', concept: 'Cobro Consumo Minibar Hab 201', type: 'ingreso', amount: 25.00, method: 'Efectivo', user: 'Admin' }
];

export const MOCK_PRODUCTS = [
  { id: 1, name: 'Agua Mineral 500ml', price: 3.50, category: 'Bebidas', stock: 24, image: '🥤' },
  { id: 2, name: 'Coca Cola 600ml', price: 5.00, category: 'Bebidas', stock: 15, image: '🥤' },
  { id: 3, name: 'Cerveza Cristal Lata', price: 8.00, category: 'Bebidas', stock: 30, image: '🍺' },
  { id: 4, name: 'Papitas Lays Clásicas', price: 4.50, category: 'Snacks', stock: 12, image: '🍟' },
  { id: 5, name: 'Galletas Oreo', price: 2.50, category: 'Snacks', stock: 20, image: '🍪' },
  { id: 6, name: 'Club Sándwich', price: 25.00, category: 'Restaurante', stock: 5, image: '🥪' },
  { id: 7, name: 'Lomo Saltado', price: 35.00, category: 'Restaurante', stock: 10, image: '🍛' },
  { id: 8, name: 'Ceviche de Pescado', price: 40.00, category: 'Restaurante', stock: 8, image: '🥗' },
  { id: 9, name: 'Cama Adicional', price: 50.00, category: 'Servicios', stock: 99, image: '🛏️' },
  { id: 10, name: 'Late Check-out', price: 80.00, category: 'Servicios', stock: 99, image: '⏰' }
];
