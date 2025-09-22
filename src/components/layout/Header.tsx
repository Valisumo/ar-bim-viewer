import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const Header: React.FC = () => {
  const { profile, signOut, isAdmin, isGuest } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header style={{
      backgroundColor: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-color)',
      padding: '15px 0',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <h1 
            onClick={() => navigate('/')}
            style={{ 
              fontSize: '24px', 
              fontWeight: 'bold',
              cursor: 'pointer',
              margin: 0
            }}
          >
            AR-BIM Viewer
          </h1>
          
          <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Dashboard
            </button>
            
            {isAdmin && (
              <button
                onClick={() => navigate('/admin')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Admin Panel
              </button>
            )}
          </nav>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button
            onClick={toggleTheme}
            className="btn btn-secondary"
            style={{ padding: '8px 12px', fontSize: '12px' }}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            padding: '8px 12px',
            backgroundColor: 'var(--bg-tertiary)',
            borderRadius: '6px',
            fontSize: '14px'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: isGuest ? 'var(--warning-color)' : 
                             isAdmin ? 'var(--danger-color)' : 'var(--success-color)'
            }}></div>
            <span>{profile?.full_name || 'User'}</span>
            <span style={{ 
              fontSize: '12px', 
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              fontWeight: '500'
            }}>
              {profile?.role}
            </span>
          </div>

          {!isGuest && (
            <button
              onClick={handleSignOut}
              className="btn btn-secondary"
              style={{ padding: '8px 16px', fontSize: '14px' }}
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
