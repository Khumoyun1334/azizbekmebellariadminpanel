import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import './index.css';

// MetaMask xatolarini bostirish (iloji boricha erta)
const suppressErrors = () => {
  const originalError = console.error;
  console.error = (...args) => {
    if (typeof args[0] === 'string' && (
      args[0].includes('MetaMask') ||
      args[0].includes('inpage.js')
    )) {
      return;
    }
    originalError.apply(console, args);
  };
};

suppressErrors();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <App />
  </React.StrictMode>
);