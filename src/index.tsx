import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import SimpleApp from './SimpleApp';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <SimpleApp />
  </React.StrictMode>
);

serviceWorkerRegistration.unregister();
