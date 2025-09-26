import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Login from './components/auth/Login';
import SignUpScreen from './components/auth/SignUpScreen';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/admin/AdminPanel';
import BIMViewer from './components/viewer/BIMViewer';
import SimpleBIMViewer from './components/viewer/SimpleBIMViewer';
import Header from './components/layout/Header';
import './App.css';

function SignUp() {
  const navigate = useNavigate();
  return <SignUpScreen onSwitchToLogin={() => navigate('/login')} />;
}

function AppRouter() {
  const { loading, user, profile } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  // Consider user authenticated if they have a user account OR are a guest
  const isAuthenticated = user || profile;

  return (
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      {!isAuthenticated ? (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        <>
          <Route path="/dashboard" element={
            <>
              <Header />
              <Dashboard />
            </>
          } />
          <Route path="/admin" element={
            <>
              <Header />
              <AdminPanel />
            </>
          } />
          <Route path="/project/:projectId" element={
            <>
              <SimpleBIMViewer />
            </>
          } />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </>
      )}
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <AppRouter />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;