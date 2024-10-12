// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Ensure this import is correct
import './styles/App.css'; // Import global styles if needed

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
