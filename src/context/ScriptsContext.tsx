// chemin: src/context/ScriptsContext.tsx

import React, { createContext, useContext, ReactNode } from 'react';
import { Script } from '../types';
import { useScripts } from '../hooks/useScripts';

// Définition du type pour notre contexte
interface ScriptsContextType {
  scripts: Script[];
  isLoading: boolean;
  addScript: (name: string) => string;
  deleteScript: (scriptId: string) => void;
  getScript: (scriptId: string) => Script | undefined;
  updateScript: (scriptId: string, updatedScript: Script) => void;
}

// Création du contexte
const ScriptsContext = createContext<ScriptsContextType | undefined>(undefined);

// Création du "Provider", le composant qui fournira l'état
export const ScriptsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const scriptData = useScripts();

  return (
    <ScriptsContext.Provider value={scriptData}>
      {children}
    </ScriptsContext.Provider>
  );
};

// Création d'un hook personnalisé pour utiliser facilement le contexte
export const useScriptsContext = (): ScriptsContextType => {
  const context = useContext(ScriptsContext);
  if (context === undefined) {
    throw new Error('useScriptsContext must be used within a ScriptsProvider');
  }
  return context;
};