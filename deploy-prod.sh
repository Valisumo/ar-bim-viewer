#!/bin/bash

# Production Deployment Script

# 1. Build the React app
npm install
npm run build

# 2. Set up environment variables
cat > .env <<EOL
REACT_APP_SUPABASE_URL=$SUPABASE_URL
REACT_APP_SUPABASE_ANON_KEY=$SUPABASE_KEY
REACT_APP_API_URL=https://api.yourdomain.com
EOL

# 3. Serve using PM2 (install if needed: npm install -g pm2)
pm2 serve build 3000 --name "ar-bim-viewer" --spa
pm2 save
pm2 startup

# 4. Set up NGINX reverse proxy (sample config below)
echo "Don't forget to configure NGINX!"
