const fs = require('fs');
const { supabase } = require('../src/config/supabase');

async function testUpload() {
  try {
    // 1. Upload test file
    const ifcFile = fs.readFileSync('./test-files/sample-wall.ifc');
    const ifcPath = `test-uploads/sample-wall-${Date.now()}.ifc`;
    
    console.log('Uploading test file...');
    const { error: uploadError } = await supabase.storage
      .from('ifc-files')
      .upload(ifcPath, ifcFile);
    
    if (uploadError) throw uploadError;
    
    // 2. Create test project
    console.log('Creating test project...');
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        name: 'Test Wall',
        description: 'Verification test file',
        ifc_file_url: supabase.storage.from('ifc-files').getPublicUrl(ifcPath).data.publicUrl,
        created_by: 'test-user'
      })
      .select()
      .single();
    
    if (projectError) throw projectError;
    
    console.log('Test project created. Triggering conversion...');
    
    // 3. Trigger conversion
    const res = await fetch('http://localhost:3001/convert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ifcPath, projectId: project.id })
    });
    
    const result = await res.json();
    console.log('Conversion result:', result);
    
    // 4. Monitor progress
    console.log('Watching for updates (Ctrl+C to stop)...');
    const subscription = supabase
      .channel('project-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'projects',
          filter: `id=eq.${project.id}`
        },
        (payload) => {
          console.log('Update received:', {
            glb: payload.new.glb_file_url ? '✅' : '❌',
            thumbnail: payload.new.thumbnail_url ? '✅' : '❌'
          });
        }
      )
      .subscribe();
    
    // Keep running for 5 minutes
    await new Promise(resolve => setTimeout(resolve, 300000));
    
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

testUpload();
