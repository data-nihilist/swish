import React from 'react';
import ReactDOM from 'react-dom/client';
import "./assets/scss/main.scss"  // keep live until after running `$ root/swish/client: npm run gulp`, then comment this line out
// import "./assets/css/main.css"   // then toggle this bad larry on
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
