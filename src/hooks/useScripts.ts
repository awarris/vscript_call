// chemin: vscript_call/src/hooks/useScripts.ts

import { useState, useEffect, useCallback } from 'react';
import { Script } from '../types';
import { createDefaultScript, createNewEmptyScript } from '../data/defaultScript';

const SCRIPTS_STORAGE_KEY = 'vscript_scripts_storage';

export const useScripts = () => {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les scripts au démarrage
  useEffect(() => {
    try {
      const savedScriptsJson = localStorage.getItem(SCRIPTS_STORAGE_KEY);
      // On vérifie que les données existent et ne sont pas une liste vide
      if (savedScriptsJson && JSON.parse(savedScriptsJson).length > 0) {
        setScripts(JSON.parse(savedScriptsJson));
      } else {
        // Si le stockage est vide, créer un script de démo
        const defaultScript = createDefaultScript("Exemple de Script de Vente");
        setScripts([defaultScript]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des scripts:", error);
      const defaultScript = createDefaultScript("Exemple de Script de Vente");
      setScripts([defaultScript]);
    }
    // On indique que le chargement est terminé
    setIsLoading(false);
  }, []);

  // Sauvegarder dans le localStorage à chaque modification des scripts
  useEffect(() => {
    // On ne sauvegarde pas pendant le chargement initial pour éviter d'écraser les données
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

  // CORRECTION : S'assure que `updatedAt` est mis à jour
  const updateScript = useCallback((scriptId: string, updatedScript: Script) => {
    const scriptWithTimestamp = { ...updatedScript, updatedAt: new Date().toISOString() };
    setScripts(prev => prev.map(s => (s.id === scriptId ? scriptWithTimestamp : s)));
  }, []);

  return { scripts, isLoading, addScript, deleteScript, getScript, updateScript };
};