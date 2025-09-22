import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import LoginScreen from './components/auth/LoginScreen';
import SignUpScreen from './components/auth/SignUpScreen';
import Dashboard from './components/Dashboard';
import SimpleBIMViewer from './components/viewer/SimpleBIMViewer';
import AdminPanel from './components/admin/AdminPanel';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary';

// Immediate loading bypass component
const ImmediateApp: React.FC = () => {
  const { user, profile, loading } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showApp, setShowApp] = useState(true); // Always show app immediately

  // If somehow loading gets stuck, force show app after 2 seconds
  React.useEffect(() => {
    if (loading) {
      const timeout = setTimeout(() => {
        console.log('ImmediateApp: Force showing app after timeout');
        setShowApp(true);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [loading]);

  // Show loading screen while auth is initializing
  if (loading && !showApp) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '20px'
        }}></div>
        <p>Loading...</p>
        <button
          onClick={() => setShowApp(true)}
          style={{
            marginTop: '10px',
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Skip Loading
        </button>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Show app immediately
  if (!user && !profile) {
    return authMode === 'login' ? (
      <LoginScreen onSwitchToSignUp={() => setAuthMode('signup')} />
    ) : (
      <SignUpScreen onSwitchToLogin={() => setAuthMode('login')} />
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/viewer/:projectId?" element={<SimpleBIMViewer />} />
        <Route
          path="/admin"
          element={
            profile?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <ImmediateApp />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
