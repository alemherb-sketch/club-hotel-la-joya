import { createClient } from '@supabase/supabase-js'

// Credenciales públicas de Supabase (la anon key es segura para exponer en el frontend)
const supabaseUrl = 'https://wgwkeijeaxigkgohkvlk.supabase.co'
const supabaseAnonKey = 'sb_publishable_YUruGP-enDevZ6q1Mq9q3A_2Q6qES2G'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
