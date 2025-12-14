// Test Supabase connection
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Testing Supabase connection...\n');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey ? supabaseKey.substring(0, 20) + '...' : 'Not set');

if (!supabaseUrl || !supabaseKey) {
  console.error('\n❌ Error: Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Test 1: Check if we can connect
    console.log('\n📡 Testing connection...');
    const { data, error } = await supabase.from('users').select('count');

    if (error) {
      console.error('❌ Connection error:', error.message);
      console.log('\nMake sure you have:');
      console.log('1. Created the tables using supabase-schema.sql');
      console.log('2. Added correct credentials to .env.local');
      return;
    }

    console.log('✅ Successfully connected to Supabase!');
    console.log('✅ Database tables are accessible');

  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
  }
}

testConnection();
