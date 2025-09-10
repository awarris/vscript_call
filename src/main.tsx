// chemin: src/main.tsx

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { ScriptsProvider } from './context/ScriptsContext.tsx';
import './index.css';

// AJOUTEZ CETTE LIGNE pour le style de l'éditeur de code
import 'prismjs/themes/prism-tomorrow.css'; 

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ScriptsProvider>
        <App />
      </ScriptsProvider>
    </BrowserRouter>
  </StrictMode>
);