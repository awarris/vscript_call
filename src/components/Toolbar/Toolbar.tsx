// chemin: vscript_call/src/components/Toolbar/Toolbar.tsx

import React from 'react';
import { 
  Eye, Upload, Download, Undo, Redo, Play, PanelRight,
  MessageSquare, Moon, Sun, ZoomIn, ZoomOut, RefreshCw, Save
} from 'lucide-react';
import { Script } from '../../types';
import { exportScriptToJSON, importScriptFromJSON } from '../../utils/helpers';

// Interface des props pour la barre d'outils
interface ToolbarProps {
  script: Script;
  onUpdateScript: (updates: Partial<Script>) => void;
  onImportScript: (script: Script) => void;
  onSaveScript: () => void; // Ajout de la nouvelle prop
  isPreviewMode: boolean;
  onTogglePreview: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onToggleChat: () => void;
  onToggleRightPanels: () => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  // NOUVELLES PROPS POUR LE ZOOM
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  script,
  onUpdateScript,
  onImportScript,
  onSaveScript, // Utilisation de la nouvelle prop
  isPreviewMode,
  onTogglePreview,
  undo,
  redo,
  canUndo,
  canRedo,
  onToggleChat,
  onToggleRightPanels,
  theme,
  setTheme,
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onZoomReset,
}) => {

  // Gestion de l'importation d'un script via un fichier JSON
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedScript = importScriptFromJSON(e.target?.result as string);
          onImportScript(importedScript);
        } catch (error) {
          alert((error as Error).message);
        }
      };
      reader.readAsText(file);
    }
  };

  // Gestion de l'exportation du script au format JSON
  const handleExport = () => {
    exportScriptToJSON(script);
  };

  return (
    <div className="bg-white dark:bg-gray-vs-800 border-b border-gray-vs-200 dark:border-gray-vs-700 px-4 py-2 flex items-center justify-between shadow-sm flex-shrink-0 z-20">
      {/* Section Gauche : Outils d'édition et de gestion */}
      <div className="flex items-center space-x-2">
        <button
            onClick={onToggleChat}
            className="p-2 text-gray-vs-600 dark:text-gray-vs-300 rounded-lg hover:bg-gray-vs-100 dark:hover:bg-gray-vs-700"
            title="Afficher l'assistant IA"
          >
            <MessageSquare size={18} />
        </button>
        <div className="h-6 w-px bg-gray-vs-200 dark:bg-gray-vs-600"></div>
        <input
          type="text"
          value={script.name}
          onChange={(e) => onUpdateScript({ name: e.target.value })}
          className="text-md font-semibold text-gray-vs-900 dark:text-gray-vs-100 bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-vs-500 px-2 py-1 rounded-md"
        />
        <button
          onClick={undo}
          disabled={!canUndo}
          className="p-2 text-gray-vs-600 dark:text-gray-vs-300 rounded-md hover:bg-gray-vs-100 dark:hover:bg-gray-vs-700 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Annuler (Ctrl+Z)"
        >
          <Undo size={18} />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className="p-2 text-gray-vs-600 dark:text-gray-vs-300 rounded-md hover:bg-gray-vs-100 dark:hover:bg-gray-vs-700 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Rétablir (Ctrl+Y)"
        >
          <Redo size={18} />
        </button>
         <div className="h-6 w-px bg-gray-vs-200 dark:bg-gray-vs-600"></div>
        <input type="file" id="import-file" style={{ display: 'none' }} onChange={handleImport} accept=".json" />
        <button onClick={() => document.getElementById('import-file')?.click()} className="p-2 text-gray-vs-600 dark:text-gray-vs-300 rounded-md hover:bg-gray-vs-100 dark:hover:bg-gray-vs-700" title="Importer un script">
            <Upload size={18} />
        </button>
        <button onClick={handleExport} className="p-2 text-gray-vs-600 dark:text-gray-vs-300 rounded-md hover:bg-gray-vs-100 dark:hover:bg-gray-vs-700" title="Exporter le script">
            <Download size={18} />
        </button>
      </div>

      {/* Section Centrale : Contrôles de zoom */}
      <div className="flex items-center space-x-2 text-gray-vs-600 dark:text-gray-vs-300">
        <button onClick={onZoomOut} className="p-2 rounded-md hover:bg-gray-vs-100 dark:hover:bg-gray-vs-700" title="Zoom arrière"><ZoomOut size={18} /></button>
        <button onClick={onZoomReset} className="text-sm font-semibold w-16 text-center hover:bg-gray-vs-100 dark:hover:bg-gray-vs-700 rounded-md py-1" title="Réinitialiser le zoom">
            {Math.round(zoomLevel * 100)}%
        </button>
        <button onClick={onZoomIn} className="p-2 rounded-md hover:bg-gray-vs-100 dark:hover:bg-gray-vs-700" title="Zoom avant"><ZoomIn size={18} /></button>
      </div>

      {/* Section Droite : Actions principales et gestion de l'affichage */}
      <div className="flex items-center space-x-2">
         <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="p-2 text-gray-vs-600 dark:text-gray-vs-300 rounded-lg hover:bg-gray-vs-100 dark:hover:bg-gray-vs-700"
          title={`Passer au thème ${theme === 'light' ? 'sombre' : 'clair'}`}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* --- BOUTON SAUVEGARDER AJOUTÉ ICI --- */}
        <button
          onClick={onSaveScript}
          className="p-2 bg-gray-vs-100 text-gray-vs-600 dark:text-gray-vs-300 rounded-lg hover:bg-gray-vs-100 dark:hover:bg-gray-vs-700 flex items-center space-x-2"
          title="Sauvegarder le script"
        >
          <Save size={18} />
          <span>Sauvegarder</span>
        </button>

        <div className="h-6 w-px bg-gray-vs-200 dark:bg-gray-vs-600"></div>
        <button
          onClick={onTogglePreview}
          className={`px-3 py-2 text-sm rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
            isPreviewMode
              ? 'bg-amber-vs-200 text-amber-vs-800 hover:bg-amber-vs-300 dark:bg-amber-vs-700 dark:text-amber-vs-100'
              : 'bg-blue-vs-100 text-blue-vs-700 hover:bg-blue-vs-200 dark:bg-blue-vs-800 dark:text-blue-vs-200'
          }`}
        >
          <Eye size={16} />
          <span>{isPreviewMode ? 'Édition' : 'Aperçu'}</span>
        </button>
        
        <button className="px-3 py-2 text-sm bg-green-vs-600 text-white rounded-lg font-medium hover:bg-green-vs-700 transition-colors flex items-center space-x-2">
          <Play size={16} />
          <span>Publier</span>
        </button>
        <div className="h-6 w-px bg-gray-vs-200 dark:bg-gray-vs-600"></div>
         <button
            onClick={onToggleRightPanels}
            className="p-2 text-gray-vs-600 dark:text-gray-vs-300 rounded-lg hover:bg-gray-vs-100 dark:hover:bg-gray-vs-700"
            title="Afficher/Masquer les panneaux"
          >
            <PanelRight size={18} />
        </button>
      </div>
    </div>
  );
};