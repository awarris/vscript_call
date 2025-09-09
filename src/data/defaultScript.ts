// chemin: src/data/defaultScript.ts

import { Script, ScriptPage } from '../types';
import { generateId } from '../utils/helpers';

/**
 * Crée un script entièrement vide avec juste une page d'accueil.
 * C'est maintenant la seule fonction dans ce fichier.
 * @param scriptName - Le nom du nouveau script.
 */
export const createNewEmptyScript = (scriptName: string): Script => {
  const homePage: ScriptPage = {
    id: generateId(),
    name: 'Page d\'accueil',
    description: 'Ceci est la première page de votre script.',
    isHomePage: true,
    backgroundColor: '#ffffff',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return {
    id: generateId(),
    name: scriptName,
    description: 'Une courte description de votre nouveau script.',
    pages: [homePage],
    components: [],
    workflowRules: [],
    globalVariables: [],
    settings: {
      fontFamily: 'Inter, sans-serif'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};