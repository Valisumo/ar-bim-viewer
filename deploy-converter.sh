#!/bin/bash

# GLB Converter Deployment
cd services/glb-converter

# 1. Install dependencies
npm install

# 2. Set environment variables
cat > .env <<EOL
SUPABASE_URL=$SUPABASE_URL
SUPABASE_KEY=$SUPABASE_KEY
PORT=3001
EOL

# 3. Run using PM2
pm2 start index.js --name "glb-converter"
pm2 save

# 4. Enable auto-restart
pm2 startup

# 5. Set up as system service (optional)
echo "Optionally configure as systemd service for production"
