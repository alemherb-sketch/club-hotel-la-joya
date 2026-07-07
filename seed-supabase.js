import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://wgwkeijeaxigkgohkvlk.supabase.co',
  'sb_publishable_YUruGP-enDevZ6q1Mq9q3A_2Q6qES2G'
);

async function seed() {
  // Insertar habitaciones
  console.log('Insertando habitaciones...');
  const { data: roomData, error: roomError } = await supabase.from('rooms').insert([
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
  ]).select();

  if (roomError) console.error('Error habitaciones:', roomError);
  else console.log('Habitaciones insertadas:', roomData.length);

  // Insertar productos
  console.log('Insertando productos...');
  const { data: prodData, error: prodError } = await supabase.from('products').insert([
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
  ]).select();

  if (prodError) console.error('Error productos:', prodError);
  else console.log('Productos insertados:', prodData.length);

  // Verificación final
  const { data: check } = await supabase.from('rooms').select('*');
  console.log('\nVerificación - Total habitaciones en BD:', check?.length);
}

seed();
