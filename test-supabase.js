import { createClient } from '@supabase/supabase-js';

const url = 'https://wgwkeijeaxigkgohkvlk.supabase.co';
const key = 'sb_publishable_YUruGP-enDevZ6q1Mq9q3A_2Q6qES2G';

const supabase = createClient(url, key);

async function test() {
  console.log('Testing Supabase connection...');
  const { data, error } = await supabase.from('rooms').select('*');
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Success! Data:', data);
  }
}

test();
