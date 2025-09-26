import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// WebXR Polyfill for browsers without native WebXR support (iOS Safari, etc.)
import WebXRPolyfill from 'webxr-polyfill';
const polyfill = new WebXRPolyfill();
console.log('WebXR Polyfill loaded:', polyfill);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);