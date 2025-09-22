# Quick Setup Guide

## 1. Install Dependencies

```bash
cd ar-bim-viewer
npm install
```

## 2. Download IFC.js WASM Files

Create the WASM directory and download the required files:

```bash
mkdir public/wasm
```

Download these files from [web-ifc releases](https://github.com/IFCjs/web-ifc/releases) to `public/wasm/`:
- `web-ifc.wasm`
- `web-ifc-mt.wasm` 

Or use these direct links:
```bash
# Download WASM files (replace with latest version URLs)
curl -L -o public/wasm/web-ifc.wasm https://github.com/IFCjs/web-ifc/releases/download/v0.0.44/web-ifc.wasm
curl -L -o public/wasm/web-ifc-mt.wasm https://github.com/IFCjs/web-ifc/releases/download/v0.0.44/web-ifc-mt.wasm
```

## 3. Set Up Supabase

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → API to get your project URL and anon key
4. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
5. Edit `.env` with your Supabase credentials:
   ```
   REACT_APP_SUPABASE_URL=your-project-url
   REACT_APP_SUPABASE_ANON_KEY=your-anon-key
   ```

## 4. Set Up Database

1. In your Supabase dashboard, go to SQL Editor
2. Copy and paste the contents of `supabase-schema.sql`
3. Run the SQL commands to create tables and policies

## 5. Configure Storage

1. In Supabase dashboard, go to Storage
2. Create a new bucket named `ifc-files`
3. Make it public
4. Set appropriate file size limits (recommended: 100MB+)

## 6. Start Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

## 7. Create Admin User

1. Sign up for a new account through the app
2. In Supabase dashboard, go to Table Editor → profiles
3. Find your user and change the `role` field from `user` to `admin`

## Troubleshooting

### Dependencies Not Installing
- Make sure you have Node.js 16+ installed
- Try deleting `node_modules` and `package-lock.json`, then run `npm install` again

### WASM Files Not Loading
- Ensure files are in `public/wasm/` directory
- Check browser console for 404 errors
- Verify file names match exactly: `web-ifc.wasm` and `web-ifc-mt.wasm`

### Supabase Connection Issues
- Double-check your `.env` file has correct URL and key
- Ensure RLS policies are set up correctly
- Check Supabase dashboard for any error logs

### AR Mode Not Working
- Use HTTPS (required for WebXR)
- Test on AR-capable device (Android Chrome, iOS Safari)
- Check browser console for WebXR errors

## Next Steps

1. Upload a sample IFC file to test the viewer
2. Explore the 3D navigation controls
3. Try AR mode on a compatible device
4. Set up additional users and test permissions

For detailed documentation, see `README.md`
