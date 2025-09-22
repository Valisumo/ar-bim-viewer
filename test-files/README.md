# Test Files

## Sample IFC File
- `sample-wall.ifc`: Simple wall element for testing
- Size: ~1KB (minimal valid IFC file)

## How to Test

1. **Start the conversion service**:
```bash
cd ../services/glb-converter
node index.js
```

2. **Run the test script**:
```bash
node verify-upload.js
```

3. **Expected Output**:
```
Uploading test file...
Creating test project...
Test project created. Triggering conversion...
Conversion result: { success: true }
Watching for updates...
Update received: { glb: '✅', thumbnail: '✅' }
```

## Verification Checklist

- [ ] IFC file uploads successfully
- [ ] Project record created in Supabase
- [ ] GLB conversion completes (check `glb-models` bucket)
- [ ] Thumbnail generated (check `thumbnails` bucket)
- [ ] Project record updates automatically

## Troubleshooting

1. If conversion fails:
   - Check service logs
   - Verify Supabase bucket permissions
   - Ensure CORS is configured for all domains

2. If no updates are received:
   - Verify Supabase Realtime is enabled
   - Check network connectivity
   - Ensure the client is subscribed properly
