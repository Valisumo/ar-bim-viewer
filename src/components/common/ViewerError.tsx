import React from 'react';
import { useNavigate } from 'react-router-dom';

export const ViewerError: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h2>🚨 Viewer Failed to Load</h2>
      <p style={{ margin: '20px 0' }}>
        We couldn't load the 3D viewer. This might be due to:
      </p>
      <ul style={{
        textAlign: 'left',
        maxWidth: '500px',
        margin: '0 auto 20px'
      }}>
        <li>Missing project data</li>
        <li>Unsupported file format</li>
        <li>Browser compatibility issues</li>
      </ul>
      <button
        onClick={() => navigate('/')}
        style={{
          padding: '10px 20px',
          backgroundColor: '#3182ce',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Return to Dashboard
      </button>
    </div>
  );
};
