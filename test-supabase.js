// test-supabase.js - Detaillierte Fehlerdiagnose
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

const url = process.env.REACT_APP_SUPABASE_URL;
const key = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log('🔍 Detaillierte Supabase-Diagnose...\n');

console.log('📋 Konfiguration:');
console.log('URL:', url ? `${url.substring(0, 40)}...` : '❌ FEHLT');
console.log('Key vorhanden:', !!key);
console.log('Key Länge:', key ? key.length : 'N/A');
console.log('Key Start:', key ? `${key.substring(0, 20)}...` : 'N/A');
console.log('');

if (!url || !key) {
  console.error('❌ Environment-Variablen fehlen');
  process.exit(1);
}

// Erstelle Client
console.log('🔗 Erstelle Supabase-Client...');
const supabase = createClient(url, key);
console.log('✅ Client erstellt\n');

// Test 1: Einfacher Fetch-Test
console.log('🌐 Test 1: Direkter HTTP-Test...');
fetch(`${url}/rest/v1/`, {
  method: 'GET',
  headers: {
    'apikey': key,
    'Authorization': `Bearer ${key}`,
    'Content-Type': 'application/json'
  }
})
.then(response => {
  console.log('📡 HTTP Status:', response.status);
  console.log('📡 Response Headers:', Object.fromEntries(response.headers.entries()));
  return response.text();
})
.then(text => {
  console.log('📡 Response Body:', text.substring(0, 200) + '...');
})
.catch(error => {
  console.error('❌ HTTP Fehler:', error.message);
  console.error('❌ Fehler Details:', error);
})
.finally(() => {
  console.log('\n🔗 Test 2: Supabase Client Test...');

  // Test 2: Supabase Client
  supabase.auth.getSession()
    .then(({ data, error }) => {
      if (error) {
        console.error('❌ Supabase Auth Fehler:', error.message);
        console.error('❌ Error Code:', error.status);
        console.error('❌ Error Details:', error);

        // Zusätzliche Diagnose
        if (error.message.includes('Failed to fetch')) {
          console.log('\n🔍 Mögliche Ursachen:');
          console.log('1. 🌐 Netzwerk: Firewall blockiert Verbindung');
          console.log('2. 🔒 CORS: Supabase erlaubt keine localhost-Anfragen');
          console.log('3. 🚫 Projekt: Supabase-Projekt ist pausiert');
          console.log('4. 🔑 Auth: API-Key ist falsch oder abgelaufen');
          console.log('5. 📍 URL: Supabase-URL ist falsch');
        }
      } else {
        console.log('✅ Supabase Auth erfolgreich');
        console.log('📊 Session Data:', data);
      }
    })
    .catch(err => {
      console.error('❌ Supabase Exception:', err.message);
      console.error('❌ Exception Details:', err);
    })
    .finally(() => {
      console.log('\n🎯 Diagnose abgeschlossen');
    });
});
