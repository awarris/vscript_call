// chemin: src/main.tsx

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { ScriptsProvider } from './context/ScriptsContext.tsx'; // Importer le Provider
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      {/* On enveloppe l'application avec le ScriptsProvider */}
      <ScriptsProvider>
        <App />
      </ScriptsProvider>
    </BrowserRouter>
  </StrictMode>
);