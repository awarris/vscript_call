// chemin: vscript_call/src/utils/helpers.ts

/**
 * Génère un identifiant unique basé sur la date actuelle et une chaîne aléatoire.
 * @returns Une chaîne de caractères unique.
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Aligne une valeur sur la grille la plus proche.
 * Utile pour le positionnement et le redimensionnement par magnétisme.
 * @param value - La valeur à aligner.
 * @param gridSize - La taille de la grille (par défaut 10).
 * @returns La valeur alignée.
 */
export const snapToGrid = (value: number, gridSize: number = 10): number => {
  return Math.round(value / gridSize) * gridSize;
};

/**
 * Valide et contraint la position d'un composant pour qu'il reste dans les limites du canevas.
 * @param position - La position {x, y} souhaitée.
 * @param size - La taille {width, height} du composant.
 * @param canvasSize - La taille {width, height} du canevas.
 * @returns La nouvelle position validée.
 */
export const validateComponentPosition = (
  position: { x: number; y: number },
  size: { width: number; height: number },
  canvasSize: { width: number; height: number }
): { x: number; y: number } => {
  return {
    x: Math.max(0, Math.min(position.x, canvasSize.width - size.width)),
    y: Math.max(0, Math.min(position.y, canvasSize.height - size.height))
  };
};

/**
 * Exporte le script actuel au format JSON et déclenche le téléchargement.
 * @param script - L'objet Script complet.
 */
export const exportScriptToJSON = (script: any): void => {
  // Convertit l'objet script en une chaîne JSON joliment formatée
  const dataStr = JSON.stringify(script, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = `${script.name.replace(/\s+/g, '_')}_script.json`;
  
  // Crée un lien temporaire pour déclencher le téléchargement
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  document.body.appendChild(linkElement); // Requis pour Firefox
  linkElement.click();
  document.body.removeChild(linkElement);
};

/**
 * Importe un script depuis une chaîne de caractères JSON.
 * @param jsonString - La chaîne JSON représentant le script.
 * @returns L'objet Script parsé.
 * @throws Lance une erreur si le JSON est invalide.
 */
export const importScriptFromJSON = (jsonString: string): any => {
  try {
    // Ajoute la conversion des dates qui sont stockées en string
    const script = JSON.parse(jsonString, (key, value) => {
      if (key === 'createdAt' || key === 'updatedAt') {
        return value; // Les dates restent en string pour la cohérence
      }
      return value;
    });
    return script;
  } catch (error) {
    console.error("Erreur lors du parsing du JSON:", error);
    throw new Error('Format du fichier JSON invalide.');
  }
};