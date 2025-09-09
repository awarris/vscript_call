// chemin: vscript_call/src/hooks/useHistoryState.ts

import { useState, useCallback } from 'react';
import { HistoryState } from '../types';

/**
 * Hook personnalisé pour gérer un état avec un historique (undo/redo).
 * @param initialState L'état initial.
 * @returns Un objet avec l'état actuel et les fonctions pour le manipuler.
 */
export const useHistoryState = <T>(initialState: T) => {
  const [history, setHistory] = useState<HistoryState<T>>({
    past: [],
    present: initialState,
    future: [],
  });

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const undo = useCallback(() => {
    if (!canUndo) return;
    setHistory(current => {
      const previous = current.past[current.past.length - 1];
      const newPast = current.past.slice(0, current.past.length - 1);
      return {
        past: newPast,
        present: previous,
        future: [current.present, ...current.future],
      };
    });
  }, [canUndo]);

  const redo = useCallback(() => {
    if (!canRedo) return;
    setHistory(current => {
      const next = current.future[0];
      const newFuture = current.future.slice(1);
      return {
        past: [...current.past, current.present],
        present: next,
        future: newFuture,
      };
    });
  }, [canRedo]);

  const setState = useCallback((newState: T | ((prevState: T) => T)) => {
    setHistory(current => {
      const newPresent = typeof newState === 'function'
          ? (newState as (prevState: T) => T)(current.present)
          : newState;
      
      if (newPresent === current.present) return current;

      return {
        past: [...current.past, current.present],
        present: newPresent,
        future: [],
      };
    });
  }, []);

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