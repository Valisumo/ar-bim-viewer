const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Configuration
const PORT = process.env.PORT || 3001;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const CONVERT_API_URL = 'https://api.ifc-converter.com/v1/convert'; // Mock URL

const app = express();
app.use(express.json());

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Conversion endpoint
app.post('/convert', async (req, res) => {
  try {
    const { ifcPath, projectId } = req.body;
    
    // 1. Download IFC file from Supabase
    const { data: ifcFile, error: downloadError } = await supabase.storage
      .from('ifc-files')
      .download(ifcPath);
    
    if (downloadError) throw downloadError;
    
    // 2. Convert to GLB (using mock service)
    const form = new FormData();
    form.append('file', ifcFile, { filename: 'model.ifc' });
    
    const { data: glbFile } = await axios.post(CONVERT_API_URL, form, {
      headers: form.getHeaders(),
      responseType: 'arraybuffer'
    });
    
    // 3. Upload GLB to Supabase
    const glbPath = ifcPath.replace('.ifc', '.glb');
    const { error: uploadError } = await supabase.storage
      .from('glb-models')
      .upload(glbPath, glbFile);
    
    if (uploadError) throw uploadError;
    
    // 4. Update project record
    const glbUrl = supabase.storage.from('glb-models').getPublicUrl(glbPath).data.publicUrl;
    await supabase
      .from('projects')
      .update({ glb_file_url: glbUrl })
      .eq('id', projectId);
    
    res.json({ success: true, glbUrl });
  } catch (error) {
    console.error('Conversion failed:', error);
    res.status(500).json({ error: 'Conversion failed' });
  }
});

app.listen(PORT, () => {
  console.log(`GLB Converter running on port ${PORT}`);
});
