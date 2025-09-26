// setup-ifc-storage.js - Vereinfachte Version ohne Service-Role-Key
// Diese Version verwendet nur den Anon-Key für Uploads

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Make sure you have in your .env file:');
  console.log('- REACT_APP_SUPABASE_URL=https://your-project.supabase.co');
  console.log('- SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
  console.log('');
  console.log('🔑 Get these from: https://app.supabase.com/project/YOUR_PROJECT/settings/api');
  console.log('💡 Use the SERVICE_ROLE key, not the anon key, for admin operations');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupStorage() {
  console.log('🚀 Setting up IFC Storage (using Service-Role-Key)...\n');

  console.log('📋 This script will create buckets and upload WASM files automatically.');
  console.log('Using Service-Role-Key for full admin access.');
  console.log('');
  console.log('1. Go to https://app.supabase.com/project/YOUR_PROJECT/storage');
  console.log('2. Create these buckets (make them public):');
  console.log('   - wasm-files');
  console.log('   - ifc-files');
  console.log('');
  console.log('3. Upload these files to wasm-files bucket:');
  console.log('   - web-ifc.wasm');
  console.log('   - web-ifc-api.js');
  console.log('   - web-ifc-mt.wasm');
  console.log('');

  // Test connection
  console.log('🔗 Testing Supabase connection...');
  try {
    const { data, error } = await supabase.storage.listBuckets();
    if (error) {
      console.error('❌ Connection failed:', error.message);
      console.error('❌ Error details:', error);
      console.log('💡 Make sure your REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY are correct');
      console.log('💡 Check if your Supabase project is active and accessible');
      return;
    }
    console.log('✅ Connected to Supabase successfully');
    console.log('📦 Available buckets:', data.map(b => b.name).join(', '));
  } catch (err) {
    console.error('❌ Connection error:', err.message);
    console.error('❌ Full error:', err);
    console.log('💡 This might be a network issue or CORS problem');
    console.log('💡 Try checking your internet connection');
    console.log('💡 Or verify the Supabase URL is correct');
    return;
  }

  // Check if buckets exist
  const requiredBuckets = ['wasm-files', 'ifc-files'];
  const { data: buckets } = await supabase.storage.listBuckets();
  const existingBuckets = buckets.map(b => b.name);

  console.log('\n📦 Checking required buckets...');
  for (const bucket of requiredBuckets) {
    if (existingBuckets.includes(bucket)) {
      console.log(`✅ Bucket '${bucket}' exists`);

      // Test if we can upload to it
      try {
        const testFile = new Uint8Array([72, 101, 108, 108, 111]); // "Hello"
        const { error } = await supabase.storage
          .from(bucket)
          .upload('test-connection.txt', testFile, { upsert: true });

        if (error) {
          console.log(`⚠️  Cannot upload to '${bucket}':`, error.message);
          console.log(`   Make sure the bucket is public and you have upload permissions`);
        } else {
          console.log(`✅ Can upload to '${bucket}'`);
          // Clean up test file
          await supabase.storage.from(bucket).remove(['test-connection.txt']);
        }
      } catch (err) {
        console.log(`⚠️  Error testing '${bucket}':`, err.message);
      }
    } else {
      console.log(`❌ Bucket '${bucket}' does not exist`);
      console.log(`   Create it at: https://app.supabase.com/project/YOUR_PROJECT/storage`);
    }
  }

  console.log('\n🎯 Next steps:');
  console.log('1. Create the missing buckets in Supabase Dashboard');
  console.log('2. Make sure they are public');
  console.log('3. Upload the WASM files manually to wasm-files bucket');
  console.log('4. Update your code to use Supabase-hosted WASM:');
  console.log(`   ifcApi.SetWasmPath('${supabaseUrl}/storage/v1/object/public/wasm-files/web-ifc/');`);
  console.log('');
  console.log('📁 WASM files are located in: node_modules/web-ifc/');
  console.log('   - web-ifc.wasm');
  console.log('   - web-ifc-api.js');
  console.log('   - web-ifc-mt.wasm');
}

setupStorage().catch(console.error);
