// chemin: vscript_call/src/hooks/useHistoryState.ts

import { useState, useCallback } from 'react';
import { HistoryState } from '../types';

/**
 * Un hook personnalisé pour gérer l'état avec un historique (undo/redo).
 * @param initialState - L'état initial de l'application.
 * @returns Un objet contenant l'état actuel, les fonctions pour le modifier,
 * et les fonctions pour naviguer dans l'historique.
 */
export const useHistoryState = <T>(initialState: T) => {
  // L'état de l'historique contient le passé, le présent et le futur.
  const [history, setHistory] = useState<HistoryState<T>>({
    past: [],
    present: initialState,
    future: [],
  });

  // Fonctions pour vérifier si on peut annuler ou rétablir
  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  /**
   * Annule la dernière action en revenant à l'état précédent.
   */
  const undo = useCallback(() => {
    if (!canUndo) return;

    setHistory(currentHistory => {
      const { past, present, future } = currentHistory;
      const previousState = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);

      return {
        past: newPast,
        present: previousState,
        future: [present, ...future],
      };
    });
  }, [canUndo]);

  /**
   * Rétablit la dernière action annulée.
   */
  const redo = useCallback(() => {
    if (!canRedo) return;

    setHistory(currentHistory => {
      const { past, present, future } = currentHistory;
      const nextState = future[0];
      const newFuture = future.slice(1);

      return {
        past: [...past, present],
        present: nextState,
        future: newFuture,
      };
    });
  }, [canRedo]);

  /**
   * Met à jour l'état actuel.
   * Ajoute l'ancien état à l'historique et efface le futur.
   * @param newState - Le nouvel état ou une fonction pour le calculer.
   */
  const setState = useCallback((newState: T | ((prevState: T) => T)) => {
    setHistory(currentHistory => {
      const { past, present } = currentHistory;

      // Calcule le nouvel état
      const newPresent =
        typeof newState === 'function'
          ? (newState as (prevState: T) => T)(present)
          : newState;
      
      // Si le nouvel état est le même, on ne fait rien pour éviter des entrées inutiles dans l'historique.
      if (newPresent === present) {
        return currentHistory;
      }
      
      // Ajoute l'état actuel au passé et met à jour le présent.
      // Le futur est vidé car on commence une nouvelle branche de modifications.
      return {
        past: [...past, present],
        present: newPresent,
        future: [],
      };
    });
  }, []);
  
  /**
   * Réinitialise l'historique avec un nouvel état.
   * Utile lors de l'importation d'un nouveau script.
   * @param newState - Le nouvel état pour réinitialiser l'historique.
   */
  const resetState = useCallback((newState: T) => {
    setHistory({
      past: [],
      present: newState,
      future: [],
    });
  }, []);


  return {
    state: history.present,
    setState,
    resetState,
    undo,
    redo,
    canUndo,
    canRedo,
  };
};