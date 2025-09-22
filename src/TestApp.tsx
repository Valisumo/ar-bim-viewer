import React from 'react';

const TestApp: React.FC = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>AR-BIM Viewer Test</h1>
      <p>If you can see this, the React app is working!</p>
      <div style={{ 
        backgroundColor: '#f0f0f0', 
        padding: '20px', 
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <h2>✅ Basic React App Working</h2>
        <p>The issue might be with:</p>
        <ul>
          <li>Supabase connection</li>
          <li>Context providers</li>
          <li>Missing components</li>
          <li>Environment variables</li>
        </ul>
      </div>
    </div>
  );
};

export default TestApp;
