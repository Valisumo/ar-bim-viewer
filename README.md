# AR-BIM Viewer

A comprehensive React-based AR-BIM viewer application for visualizing and maintaining infrastructure using Building Information Modeling (BIM) and Augmented Reality (AR) technologies. Built for field engineers, maintenance teams, and facility managers.

![AR-BIM Viewer](https://img.shields.io/badge/React-18.2.0-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue) ![Three.js](https://img.shields.io/badge/Three.js-0.135.0-black) ![WebXR](https://img.shields.io/badge/WebXR-API-green) ![Supabase](https://img.shields.io/badge/Supabase-2.38.0-orange)

## 🌟 Features

### 🏗️ **3D BIM Visualization**
- **Multiple Viewers**: Choose between Xeokit and Simple BIM viewers
- **IFC File Support**: Industry Foundation Classes (.ifc) parsing and rendering
- **Interactive Navigation**: Orbit, pan, zoom controls with camera presets
- **Component Selection**: Click-to-select BIM components with detailed properties
- **Performance Optimized**: WebGL acceleration with LOD (Level of Detail)

### 📱 **Augmented Reality (AR)**
- **WebXR Integration**: Native AR support for AR-capable devices
- **Cross-Platform**: Works on HoloLens, iOS Safari, Android Chrome
- **WebXR Polyfill**: Fallback support for older browsers
- **HTTPS Required**: Secure context for WebXR functionality
- **Device Detection**: Automatic capability detection and session management

### 🎨 **Modern UI/UX**
- **Dark/Light Theme**: Complete theme system with CSS custom properties
- **Responsive Design**: Mobile-first approach for tablets and smartphones
- **Touch Controls**: Optimized for field work on mobile devices
- **Admin Dashboard**: User management and system analytics
- **Role-Based Access**: Guest, User, and Admin permission levels

### 📊 **Data Management**
- **Supabase Backend**: PostgreSQL database with real-time subscriptions
- **File Storage**: Secure IFC file upload and management
- **Component Tracking**: Maintenance schedules and status monitoring
- **User Authentication**: JWT-based auth with social login options
- **Row-Level Security**: Database-level access control

### 🔧 **Developer Experience**
- **TypeScript**: Full type safety throughout the application
- **Service Worker**: Offline capability for field operations
- **Docker Support**: Containerized deployment with docker-compose
- **GLB Converter**: Automated IFC to GLB conversion service
- **Hot Reload**: Fast development with React hot module replacement

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript and hooks
- **Three.js** for 3D rendering and WebGL acceleration
- **@thatopen/components** - Modern BIM viewing components
- **@xeokit/xeokit-bim-viewer** - High-performance BIM viewer
- **WebXR API** with webxr-polyfill for AR support
- **React Router v6** for client-side routing
- **CSS Custom Properties** for theming system

### Backend & Services
- **Supabase** (PostgreSQL + Auth + Storage + Edge Functions)
- **GLB Converter Service** - Node.js service for IFC to GLB conversion
- **Workbox** - Service worker for offline functionality
- **Docker** - Containerized deployment

### Development Tools
- **Create React App** with CRACO configuration
- **TypeScript** for type safety
- **ESLint** for code quality
- **Jest + React Testing Library** for testing
- **Workbox** for PWA features

## 📋 Prerequisites

- **Node.js 16+** and npm
- **Supabase Account** for backend services
- **Modern Browser** with WebXR support (Chrome 79+, Edge 79+, Safari 13.1+)
- **HTTPS Support** for AR functionality (development certificates included)
- **Docker** (optional, for containerized deployment)

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone <repository-url>
cd ar-bim-viewer
npm install
```

### 2. Download WASM Files

```bash
mkdir public/wasm
# Download from: https://github.com/IFCjs/web-ifc/releases
curl -L -o public/wasm/web-ifc.wasm https://github.com/IFCjs/web-ifc/releases/download/v0.0.44/web-ifc.wasm
curl -L -o public/wasm/web-ifc-mt.wasm https://github.com/IFCjs/web-ifc/releases/download/v0.0.44/web-ifc-mt.wasm
```

### 3. Configure Supabase

1. Create a [Supabase](https://supabase.com) account and project
2. Copy environment variables:
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

3. Set up database:
```bash
# Run the SQL schema in Supabase SQL Editor
cat supabase-schema.sql | supabase db push
```

4. Configure storage:
- Create `ifc-files` bucket in Supabase Storage
- Make it public with appropriate size limits

### 4. Start Development

```bash
npm start
```

Visit `http://localhost:3000` to see the application.

### 5. Create Admin User

1. Sign up through the app
2. In Supabase dashboard, update user role to `admin` in the profiles table

## 🎯 Usage Guide

### User Roles

#### 👤 **Guest User**
- Browse public BIM projects
- Basic 3D navigation and inspection
- No upload or editing capabilities

#### 👨‍💼 **Regular User**
- All guest permissions
- Upload and manage IFC files
- Edit component information
- Create private projects

#### 👨‍💼 **Admin User**
- All user permissions
- User management dashboard
- System analytics and monitoring
- Access to all projects regardless of privacy

### AR Mode Setup

1. **HTTPS Required**: AR mode only works over HTTPS
2. **Device Compatibility**:
   - **Android**: Chrome 79+ with ARCore
   - **iOS**: Safari 13.1+ with ARKit
   - **HoloLens**: Edge browser with WebXR
3. **Permissions**: Allow camera access when prompted
4. **Usage**: Click "Enter AR" button in the 3D viewer

### File Management

- **Supported Formats**: IFC 2x3, IFC 4 files
- **Upload Limits**: Configurable via Supabase (default: 100MB)
- **Processing**: Client-side parsing with web-ifc
- **Storage**: Secure cloud storage with access controls

## 🐳 Deployment Options

### Docker Deployment

```bash
# Build and run with docker-compose
docker-compose up --build
```

### Netlify/Vercel (Recommended)

1. Connect your repository
2. Set environment variables in dashboard
3. Deploy with build command: `npm run build`

### Self-Hosted

```bash
npm run build
# Serve build/ directory with any static web server
# Ensure HTTPS for AR functionality
```

### Production Scripts

- `deploy-prod.sh` - Production deployment script
- `deploy-converter.sh` - GLB converter service deployment
- `nginx-config.conf` - Nginx configuration for production

## 🔧 Configuration

### Environment Variables

```env
REACT_APP_SUPABASE_URL=your-supabase-project-url
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
HTTPS=true  # Required for AR mode
SSL_CRT_FILE=cert.crt
SSL_KEY_FILE=cert.key
```

### HTTPS Setup (Development)

The project includes self-signed certificates for development:

```bash
# Install mkcert for local HTTPS
npm install -g mkcert
mkcert create-ca
mkcert create-cert --domains localhost
```

## 🐛 Troubleshooting

### Common Issues

#### IFC Files Not Loading
```bash
# Check WASM files are present
ls public/wasm/
# Should show: web-ifc.wasm web-ifc-mt.wasm
```

#### AR Mode Not Working
- Verify HTTPS is enabled
- Check browser WebXR support
- Enable camera permissions
- Test on AR-capable device

#### Authentication Issues
- Verify Supabase credentials in `.env`
- Check RLS policies in database
- Confirm user roles are set correctly

#### Performance Issues
- Reduce IFC file complexity
- Enable browser hardware acceleration
- Check WebGL support
- Monitor memory usage

### Development Tips

- Use browser dev tools for 3D debugging
- Check console for WebXR capability logs
- Monitor network tab for file loading
- Use React DevTools for component inspection

## 📊 API & Database

### Supabase Schema

- **profiles** - User profiles with roles
- **projects** - BIM project metadata
- **components** - BIM component tracking
- **maintenance_logs** - Maintenance records

### Storage Buckets

- **ifc-files** - IFC file storage
- **glb-files** - Converted GLB files
- **thumbnails** - Project preview images

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup

```bash
npm install
npm start
# Visit http://localhost:3000
```

### Code Quality

- TypeScript for type safety
- ESLint for code consistency
- Prettier for code formatting
- Jest for unit testing

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **@thatopen** - Modern BIM viewing components
- **xeokit** - High-performance WebGL BIM viewer
- **Three.js** - 3D graphics library
- **web-ifc** - IFC file parsing
- **Supabase** - Backend-as-a-service platform

## 🗺️ Roadmap

- [ ] **Advanced AR Features**: Object anchoring, occlusion, spatial audio
- [ ] **Multi-Language Support**: i18n for international deployments
- [ ] **IoT Integration**: Sensor data visualization
- [ ] **Collaborative Features**: Real-time multi-user editing
- [ ] **Advanced Analytics**: Maintenance prediction, usage reports
- [ ] **Mobile Apps**: React Native companion apps
- [ ] **Offline Sync**: Advanced offline capability
- [ ] **API Integrations**: Third-party BIM software support

## 📞 Support

- 📖 **Documentation**: Check this README and SETUP.md
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- 📧 **Email**: For enterprise support inquiries

---

**Built with ❤️ for infrastructure professionals worldwide**
