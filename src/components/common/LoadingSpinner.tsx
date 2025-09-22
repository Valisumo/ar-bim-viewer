import React from 'react';

const LoadingSpinner: React.FC = () => {
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
      <h2 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>
        🏗️ AR-BIM Viewer
      </h2>
      <p style={{ margin: '0 0 30px 0', color: '#666' }}>
        Loading your application...
      </p>
      <button
        onClick={() => {
          // Force reload to bypass loading
          window.location.reload();
        }}
        style={{
          padding: '15px 30px',
          backgroundColor: '#e74c3c',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          boxShadow: '0 2px 10px rgba(231, 76, 60, 0.3)'
        }}
      >
        🔄 Reload Page
      </button>
      <button
        onClick={() => {
          // Clear all storage and reload
          localStorage.clear();
          sessionStorage.clear();
          window.location.reload();
        }}
        style={{
          marginTop: '10px',
          padding: '10px 20px',
          backgroundColor: '#95a5a6',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        🗑️ Clear Data & Reload
      </button>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
