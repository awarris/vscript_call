// chemin: vscript_call/src/components/Toolbar/Toolbar.tsx

import React from 'react';
import { 
  Eye, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Save, 
  Upload, 
  Download,
  Undo, 
  Redo,
  Play,
  PanelLeft,
  PanelRight,
  MessageSquare
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
  onToggleChat: () => void;
  onToggleRightPanels: () => void;
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
  onToggleChat,
  onToggleRightPanels
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
    <div className="bg-white border-b border-gray-vs-200 px-4 py-2 flex items-center justify-between shadow-sm flex-shrink-0 z-20">
      {/* Section Gauche */}
      <div className="flex items-center space-x-2">
        <button
            onClick={onToggleChat}
            className="p-2 text-gray-vs-600 rounded-lg hover:bg-gray-vs-100"
            title="Afficher l'assistant IA"
          >
            <MessageSquare size={18} />
        </button>
        <div className="h-6 w-px bg-gray-vs-200"></div>
        <input
          type="text"
          value={script.name}
          onChange={(e) => onUpdateScript({ name: e.target.value })}
          className="text-md font-semibold text-gray-vs-900 bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-vs-500 px-2 py-1 rounded-md"
        />
        <button
          onClick={undo}
          disabled={!canUndo}
          className="p-2 text-gray-vs-600 rounded-md hover:bg-gray-vs-100 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Annuler (Ctrl+Z)"
        >
          <Undo size={18} />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className="p-2 text-gray-vs-600 rounded-md hover:bg-gray-vs-100 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Rétablir (Ctrl+Y)"
        >
          <Redo size={18} />
        </button>
      </div>

      {/* Section Centrale */}
      {!isPreviewMode && (
        <div className="flex items-center bg-gray-vs-100 rounded-lg p-1">
          {deviceButtons.map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => onDeviceChange(key)}
              className={`p-2 rounded-md transition-all duration-200 ${
                currentDevice === key
                  ? 'bg-white shadow-sm text-blue-vs-600'
                  : 'text-gray-vs-600 hover:text-gray-vs-900'
              }`}
              title={label}
            >
              <Icon size={18} />
            </button>
          ))}
        </div>
      )}

      {/* Section Droite */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onTogglePreview}
          className={`px-3 py-2 text-sm rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
            isPreviewMode
              ? 'bg-amber-vs-200 text-amber-vs-700 hover:bg-amber-vs-300'
              : 'bg-blue-vs-100 text-blue-vs-700 hover:bg-blue-vs-200'
          }`}
        >
          <Eye size={16} />
          <span>{isPreviewMode ? 'Édition' : 'Aperçu'}</span>
        </button>
        
        <button className="px-3 py-2 text-sm bg-green-vs-600 text-white rounded-lg font-medium hover:bg-green-vs-700 transition-colors flex items-center space-x-2">
          <Play size={16} />
          <span>Publier</span>
        </button>
        <div className="h-6 w-px bg-gray-vs-200"></div>
         <button
            onClick={onToggleRightPanels}
            className="p-2 text-gray-vs-600 rounded-lg hover:bg-gray-vs-100"
            title="Afficher les panneaux"
          >
            <PanelRight size={18} />
        </button>
      </div>
    </div>
  );
};
