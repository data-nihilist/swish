import React from 'react';
import ReactDOM from 'react-dom/client';
import "./assets/scss/main.scss"  // keep live until after `$ root/swish/client: npm run gulp
// import "./assets/css/main.css"
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
