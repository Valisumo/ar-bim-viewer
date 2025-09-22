# AR-BIM Viewer for Hydroelectric Plant Maintenance

A complete React-based AR-BIM viewer application for visualizing and maintaining hydroelectric plant components using Building Information Modeling (BIM) and Augmented Reality (AR) technologies.

## Features

- **3D BIM Visualization**: Interactive 3D viewing of IFC files using Three.js
- **AR Overlay**: WebXR-powered augmented reality for on-site maintenance
- **User Management**: Admin and user roles with guest access
- **Component Information**: Detailed component properties and maintenance tracking
- **Mobile Responsive**: Optimized for field work on mobile devices
- **Offline Capability**: Service worker for offline functionality
- **Dark/Light Mode**: Theme switching for different environments
- **File Upload**: IFC file upload and parsing with web-ifc
- **Real-time Data**: Supabase integration for live data synchronization

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **3D Engine**: Three.js with OrbitControls
- **AR**: WebXR API
- **IFC Processing**: web-ifc and web-ifc-three
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Routing**: React Router v6
- **Styling**: CSS Variables with responsive design
- **PWA**: Service Worker for offline support

## Prerequisites

- Node.js 16+ and npm
- Supabase account and project
- Modern browser with WebXR support (for AR features)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ar-bim-viewer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Supabase credentials:
   ```
   REACT_APP_SUPABASE_URL=your-supabase-project-url
   REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Set up Supabase database**
   - Create a new Supabase project
   - Run the SQL commands from `supabase-schema.sql` in your Supabase SQL editor
   - Enable authentication providers (Email/Password recommended)
   - Create storage bucket named `ifc-files` with public access

5. **Download IFC.js WASM files**
   ```bash
   mkdir public/wasm
   # Download web-ifc WASM files to public/wasm/
   # You can get these from: https://github.com/IFCjs/web-ifc/releases
   ```

## Usage

### Development

```bash
npm start
```

The application will open at `http://localhost:3000`.

### Production Build

```bash
npm run build
```

### Testing

```bash
npm test
```

## User Roles

### Guest User
- View public BIM projects
- Basic 3D navigation
- No upload or edit capabilities

### Regular User
- All guest capabilities
- Upload and manage own IFC files
- Edit component information
- Create private projects

### Admin User
- All user capabilities
- Manage all users and projects
- Access admin panel
- System analytics

## AR Features

The application supports WebXR for augmented reality experiences:

1. **Device Requirements**: AR-capable device with WebXR support
2. **Browser Support**: Chrome/Edge on Android, Safari on iOS (with WebXR polyfill)
3. **Usage**: Click "Enter AR" in the 3D viewer to start AR mode

## File Support

- **IFC Files**: Industry Foundation Classes files (.ifc)
- **Size Limit**: Configurable via Supabase storage settings
- **Processing**: Client-side IFC parsing with web-ifc

## Component Management

- **Selection**: Click 3D objects to view component details
- **Properties**: View IFC properties and metadata
- **Maintenance**: Track inspection dates and maintenance notes
- **Status**: Visual status indicators (Good/Warning/Critical)

## Mobile Optimization

- Responsive design for tablets and smartphones
- Touch-friendly controls
- Optimized performance for mobile GPUs
- Offline capability for field work

## Security

- Row Level Security (RLS) enabled on all tables
- JWT-based authentication via Supabase
- File upload restrictions and validation
- Role-based access control

## API Integration

The application uses Supabase for:
- **Authentication**: User registration and login
- **Database**: PostgreSQL with real-time subscriptions
- **Storage**: File upload and management
- **Edge Functions**: Custom server-side logic (optional)

## Deployment

### Netlify/Vercel
1. Connect your repository
2. Set environment variables
3. Deploy with build command: `npm run build`

### Self-hosted
1. Build the application: `npm run build`
2. Serve the `build` directory with a web server
3. Ensure HTTPS for WebXR functionality

## Troubleshooting

### Common Issues

1. **IFC files not loading**
   - Ensure WASM files are in `public/wasm/`
   - Check file format and size limits
   - Verify CORS settings

2. **AR mode not working**
   - Use HTTPS (required for WebXR)
   - Check device and browser compatibility
   - Enable camera permissions

3. **Authentication issues**
   - Verify Supabase configuration
   - Check environment variables
   - Ensure RLS policies are correct

### Performance Optimization

- Use smaller IFC files for better performance
- Enable gzip compression on server
- Consider using CDN for static assets
- Monitor memory usage with large models

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Check the troubleshooting section
- Review Supabase documentation
- Check Three.js and web-ifc documentation
- Open an issue on GitHub

## Roadmap

- [ ] Advanced AR features (object anchoring, occlusion)
- [ ] Multi-language support
- [ ] Advanced analytics and reporting
- [ ] Integration with IoT sensors
- [ ] Collaborative editing features
- [ ] Export capabilities (PDF reports, etc.)
- [ ] Advanced search and filtering
- [ ] Scheduled maintenance workflows
