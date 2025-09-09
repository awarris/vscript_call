// chemin: vscript_call/src/main.tsx

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

// Le point d'entrée de l'application
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* BrowserRouter active la navigation entre les pages (Dashboard et Editeur) */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);