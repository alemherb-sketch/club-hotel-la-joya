import { createClient } from '@supabase/supabase-js';

const url = 'https://wgwkeijeaxigkgohkvlk.supabase.co';
const key = 'sb_publishable_YUruGP-enDevZ6q1Mq9q3A_2Q6qES2G';

const supabase = createClient(url, key);

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

const initialProducts = [
  { name: 'Agua Mineral', price: 3.50, category: 'Bebidas', image: '💧' },
  { name: 'Gaseosa 500ml', price: 4.00, category: 'Bebidas', image: '🥤' },
  { name: 'Cerveza Personal', price: 7.00, category: 'Bebidas', image: '🍺' },
  { name: "Papitas Lay's", price: 5.00, category: 'Snacks', image: '🥔' },
  { name: 'Galletas Oreo', price: 3.00, category: 'Snacks', image: '🍪' },
  { name: 'Chocolatina', price: 4.50, category: 'Snacks', image: '🍫' },
  { name: 'Desayuno Americano', price: 25.00, category: 'Restaurante', image: '🍳' },
  { name: 'Almuerzo Ejecutivo', price: 35.00, category: 'Restaurante', image: '🍽️' },
  { name: 'Cena Ligera', price: 20.00, category: 'Restaurante', image: '🥗' },
  { name: 'Lavandería (Prenda)', price: 10.00, category: 'Servicios', image: '👕' },
  { name: 'Masaje 30 min', price: 50.00, category: 'Servicios', image: '💆' },
  { name: 'Tour Ciudad', price: 80.00, category: 'Servicios', image: '🗺️' }
];

async function seed() {
  console.log('Inserting rooms...');
  const { error: errorRooms } = await supabase.from('rooms').upsert(initialRooms);
  if (errorRooms) console.error('Error inserting rooms:', errorRooms);
  else console.log('Rooms inserted!');

  console.log('Inserting products...');
  const { error: errorProducts } = await supabase.from('products').upsert(initialProducts, { onConflict: 'name' });
  if (errorProducts) console.error('Error inserting products:', errorProducts);
  else console.log('Products inserted!');
}

seed();
