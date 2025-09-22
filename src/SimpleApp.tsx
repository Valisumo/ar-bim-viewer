import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import LoginScreen from './components/auth/LoginScreen';
import SignUpScreen from './components/auth/SignUpScreen';
import Dashboard from './components/Dashboard';
import SimpleBIMViewer from './components/viewer/SimpleBIMViewer';
import AdminPanel from './components/admin/AdminPanel';
import ErrorBoundary from './components/common/ErrorBoundary';

const AppContent: React.FC = () => {
  const { user, profile, loading } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showApp, setShowApp] = useState(false);

  // Show app immediately, with a 2-second max loading timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('App: Showing app after timeout');
      setShowApp(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Also show app when auth is ready
  useEffect(() => {
    if (!loading) {
      setShowApp(true);
    }
  }, [loading]);

  // Simple loading screen that auto-skips
  if (!showApp) {
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
          borderTop: '4px solid #007bff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '20px'
        }}></div>
        <h2>Loading...</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Auto-continuing in 2 seconds
        </p>
        <button
          onClick={() => setShowApp(true)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Continue Now
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

  // Show auth screens or main app
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

const SimpleApp: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default SimpleApp;
