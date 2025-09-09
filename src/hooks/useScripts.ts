// chemin: src/hooks/useScripts.ts

import { useState, useEffect, useCallback } from 'react';
import { Script } from '../types';
// CORRECTION: On importe uniquement la fonction de création de script vide.
import { createNewEmptyScript } from '../data/defaultScript';

const SCRIPTS_STORAGE_KEY = 'vscript_scripts_storage';

export const useScripts = () => {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les scripts au démarrage
  useEffect(() => {
    try {
      const savedScriptsJson = localStorage.getItem(SCRIPTS_STORAGE_KEY);
      if (savedScriptsJson) {
        setScripts(JSON.parse(savedScriptsJson));
      } else {
        // CORRECTION : Si le stockage est vide, on initialise avec une liste vide.
        // Il n'y a plus de script par défaut.
        setScripts([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des scripts:", error);
      setScripts([]); // En cas d'erreur, on repart d'une liste vide.
    }
    setIsLoading(false);
  }, []);

  // Sauvegarder dans le localStorage à chaque modification des scripts
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(SCRIPTS_STORAGE_KEY, JSON.stringify(scripts));
    }
  }, [scripts, isLoading]);

  // Utilise `createNewEmptyScript` pour ajouter un nouveau script vierge
  const addScript = useCallback((name: string): string => {
    const newScript = createNewEmptyScript(name);
    setScripts(prev => [...prev, newScript]);
    return newScript.id;
  }, []);

  const deleteScript = useCallback((scriptId: string) => {
    setScripts(prev => prev.filter(s => s.id !== scriptId));
  }, []);

  const getScript = useCallback((scriptId: string): Script | undefined => {
    return scripts.find(s => s.id === scriptId);
  }, [scripts]);

  const updateScript = useCallback((scriptId: string, updatedScript: Script) => {
    const scriptWithTimestamp = { ...updatedScript, updatedAt: new Date().toISOString() };
    setScripts(prev => prev.map(s => (s.id === scriptId ? scriptWithTimestamp : s)));
  }, []);

  return { scripts, isLoading, addScript, deleteScript, getScript, updateScript };
};