// upload-wasm-to-supabase.js
// Run this script to upload WASM files to Supabase Storage with correct MIME types

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Your Supabase credentials
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadWasmFiles() {
  const wasmDir = path.join(__dirname, 'node_modules', 'web-ifc');

  // Files to upload with their MIME types
  const files = [
    { name: 'web-ifc.wasm', mimeType: 'application/wasm' },
    { name: 'web-ifc-api.js', mimeType: 'application/javascript' },
    { name: 'web-ifc-mt.wasm', mimeType: 'application/wasm' }
  ];

  console.log('Uploading WASM files to Supabase Storage...');

  for (const file of files) {
    const filePath = path.join(wasmDir, file.name);

    if (!fs.existsSync(filePath)) {
      console.warn(`File ${file.name} not found, skipping...`);
      continue;
    }

    try {
      const fileBuffer = fs.readFileSync(filePath);

      const { data, error } = await supabase.storage
        .from('wasm-files') // Create this bucket in Supabase
        .upload(`web-ifc/${file.name}`, fileBuffer, {
          contentType: file.mimeType,
          upsert: true
        });

      if (error) {
        console.error(`Error uploading ${file.name}:`, error);
      } else {
        console.log(`✅ Successfully uploaded ${file.name}`);
      }
    } catch (err) {
      console.error(`Error processing ${file.name}:`, err);
    }
  }

  console.log('Upload complete!');
  console.log('Set your WASM path to: https://YOUR_PROJECT.supabase.co/storage/v1/object/public/wasm-files/web-ifc/');
}

uploadWasmFiles().catch(console.error);
