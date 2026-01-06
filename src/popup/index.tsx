import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '../styles/globals.css';

declare global {
  interface Window {
    __themeReady: Promise<void>;
  }
}

// Wait for theme to be determined before rendering to prevent flash
const mount = async () => {
  await window.__themeReady;

  const root = ReactDOM.createRoot(document.getElementById('root')!);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

mount();
