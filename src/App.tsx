// chemin: vscript_call/src/App.tsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { ScriptEditor } from './pages/ScriptEditor';

/**
 * Le composant racine de l'application qui gère le routage.
 * Il n'a plus de logique d'état, il ne fait que diriger l'utilisateur.
 */
function App() {
  return (
    <Routes>
      {/* La route "/" (racine) mène au tableau de bord des scripts */}
      <Route path="/" element={<Dashboard />} />
      
      {/* La route "/editor/:scriptId" mène à l'éditeur pour un script spécifique */}
      <Route path="/editor/:scriptId" element={<ScriptEditor />} />
    </Routes>
  );
}

export default App;