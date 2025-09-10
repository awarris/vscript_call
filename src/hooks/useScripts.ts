// chemin: src/hooks/useScripts.ts

import { useState, useEffect, useCallback } from 'react';
import { Script } from '../types';
import { createNewEmptyScript } from '../data/defaultScript';

const SCRIPTS_STORAGE_KEY = 'vscript_scripts_storage';

export const useScripts = () => {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedScriptsJson = localStorage.getItem(SCRIPTS_STORAGE_KEY);
      if (savedScriptsJson) {
        setScripts(JSON.parse(savedScriptsJson));
      } else {
        setScripts([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des scripts:", error);
      setScripts([]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(SCRIPTS_STORAGE_KEY, JSON.stringify(scripts));
    }
  }, [scripts, isLoading]);

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

  // CORRECTION : Ajout d'une comparaison pour casser la boucle infinie
  const updateScript = useCallback((scriptId: string, updatedScript: Script) => {
    setScripts(prevScripts => {
      const oldScript = prevScripts.find(s => s.id === scriptId);
      if (!oldScript) return prevScripts;

      // On retire les dates de mise à jour pour comparer uniquement le contenu
      const { updatedAt: _, ...oldContent } = oldScript;
      const { updatedAt: __, ...newContent } = updatedScript;

      // Si le contenu n'a pas changé, on ne fait rien pour éviter la boucle
      if (JSON.stringify(oldContent) === JSON.stringify(newContent)) {
        return prevScripts;
      }

      // Si le contenu a changé, on met à jour avec un nouveau timestamp
      const scriptWithTimestamp = { ...updatedScript, updatedAt: new Date().toISOString() };
      return prevScripts.map(s => (s.id === scriptId ? scriptWithTimestamp : s));
    });
  }, []);

  return { scripts, isLoading, addScript, deleteScript, getScript, updateScript };
};