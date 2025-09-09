// chemin: vscript_call/src/components/Toolbar/Toolbar.tsx

import React from 'react';
import { 
  Eye, 
  EyeOff, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Save, 
  Upload, 
  Download,
  Undo, 
  Redo,
  Play
} from 'lucide-react';
import { Script } from '../../types';
import { exportScriptToJSON, importScriptFromJSON } from '../../utils/helpers';

interface ToolbarProps {
  script: Script;
  onUpdateScript: (updates: Partial<Script>) => void;
  onImportScript: (script: Script) => void;
  isPreviewMode: boolean;
  onTogglePreview: () => void;
  currentDevice: 'mobile' | 'tablet' | 'desktop';
  onDeviceChange: (device: 'mobile' | 'tablet' | 'desktop') => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  script,
  onUpdateScript,
  onImportScript,
  isPreviewMode,
  onTogglePreview,
  currentDevice,
  onDeviceChange,
  undo,
  redo,
  canUndo,
  canRedo,
}) => {

  const deviceButtons = [
    { key: 'mobile' as const, icon: Smartphone, label: 'Mobile (375px)' },
    { key: 'tablet' as const, icon: Tablet, label: 'Tablette (768px)' },
    { key: 'desktop' as const, icon: Monitor, label: 'Bureau (1200px)' }
  ];

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

  return (
    <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between shadow-sm flex-shrink-0">
      {/* Section Gauche: Nom du script et Actions sur l'historique */}
      <div className="flex items-center space-x-4">
        <input
          type="text"
          value={script.name}
          onChange={(e) => onUpdateScript({ name: e.target.value })}
          className="text-md font-semibold text-slate-900 bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1 rounded-md"
        />
        <div className="flex items-center space-x-1">
          <button
            onClick={undo}
            disabled={!canUndo}
            className="p-2 text-slate-600 rounded-md hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Annuler (Ctrl+Z)"
          >
            <Undo size={18} />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className="p-2 text-slate-600 rounded-md hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Rétablir (Ctrl+Y)"
          >
            <Redo size={18} />
          </button>
        </div>
      </div>

      {/* Section Centrale: Vues de l'appareil */}
      <div className="flex items-center bg-slate-100 rounded-lg p-1">
        {deviceButtons.map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => onDeviceChange(key)}
            className={`p-2 rounded-md transition-all duration-200 ${
              currentDevice === key
                ? 'bg-white shadow-sm text-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title={label}
          >
            <Icon size={18} />
          </button>
        ))}
      </div>

      {/* Section Droite: Actions principales */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => console.log("Sauvegarder")}
          className="px-3 py-2 text-sm bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors flex items-center space-x-2"
        >
          <Save size={16} />
          <span>Sauvegarder</span>
        </button>

        <button
          onClick={() => exportScriptToJSON(script)}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          title="Exporter le script"
        >
          <Download size={18} />
        </button>

        <label className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer" title="Importer un script">
          <Upload size={18} />
          <input type="file" accept=".json" onChange={handleImport} className="hidden" />
        </label>
        
        <div className="h-6 w-px bg-slate-200 mx-2"></div>

        <button
          onClick={onTogglePreview}
          className={`px-3 py-2 text-sm rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
            isPreviewMode
              ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          }`}
        >
          {isPreviewMode ? <EyeOff size={16} /> : <Eye size={16} />}
          <span>{isPreviewMode ? 'Édition' : 'Aperçu'}</span>
        </button>
        
        <button className="px-3 py-2 text-sm bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center space-x-2">
          <Play size={16} />
          <span>Publier</span>
        </button>
      </div>
    </div>
  );
};