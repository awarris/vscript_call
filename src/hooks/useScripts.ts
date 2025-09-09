// chemin: vscript_call/src/hooks/useScripts.ts

import { useState, useEffect, useCallback } from 'react';
import { Script } from '../types';
import { createDefaultScript } from '../data/defaultScript';

const SCRIPTS_STORAGE_KEY = 'vscript_scripts_storage';

/**
 * Hook pour gérer la collection de scripts dans le localStorage.
 * Permet de charger, ajouter, supprimer et mettre à jour des scripts.
 */
export const useScripts = () => {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les scripts depuis le localStorage au premier rendu
  useEffect(() => {
    try {
      const savedScriptsJson = localStorage.getItem(SCRIPTS_STORAGE_KEY);
      if (savedScriptsJson) {
        setScripts(JSON.parse(savedScriptsJson));
      } else {
        // Si aucun script n'est sauvegardé, en créer un par défaut pour la démo
        const defaultScript = createDefaultScript("Exemple de Script de Vente");
        setScripts([defaultScript]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des scripts depuis le localStorage:", error);
      const defaultScript = createDefaultScript("Exemple de Script de Vente");
      setScripts([defaultScript]);
    }
    setIsLoading(false);
  }, []);

  // Sauvegarder les scripts dans le localStorage à chaque fois qu'ils changent
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(SCRIPTS_STORAGE_KEY, JSON.stringify(scripts));
    }
  }, [scripts, isLoading]);

  const addScript = useCallback((name: string): string => {
    const newScript = createDefaultScript(name);
    setScripts(prev => [...prev, newScript]);
    console.log('this is script', newScript);
    
    return newScript.id;
  }, []);

  const deleteScript = useCallback((scriptId: string) => {
    setScripts(prev => prev.filter(s => s.id !== scriptId));
  }, []);

  const getScript = useCallback((scriptId: string): Script | undefined => {
    return scripts.find(s => s.id === scriptId);
  }, [scripts]);

  const updateScript = useCallback((scriptId: string, updatedScript: Script) => {
    setScripts(prev => prev.map(s => (s.id === scriptId ? updatedScript : s)));
  }, []);

  return { scripts, isLoading, addScript, deleteScript, getScript, updateScript };
};