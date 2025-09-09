// chemin: vscript_call/src/components/panels/VariablesPanel.tsx

import React from 'react';
import { Plus, Edit3, Trash2, Database } from 'lucide-react';
import { Script, GlobalVariable } from '../../types';
import { generateId } from '../../utils/helpers';

// Définition correcte des props
interface VariablesPanelProps {
  script: Script;
  setScript: React.Dispatch<React.SetStateAction<Script>>;
}

export const VariablesPanel: React.FC<VariablesPanelProps> = ({ script, setScript }) => {

  /**
   * Ajoute une nouvelle variable globale au script.
   */
  const handleAddVariable = () => {
    const newVariable: GlobalVariable = {
      id: generateId(),
      name: `variable_${script.globalVariables.length + 1}`,
      type: 'string',
      defaultValue: '',
      description: '',
    };
    
    setScript(prevScript => ({
      ...prevScript,
      globalVariables: [...prevScript.globalVariables, newVariable],
    }));
  };

  /**
   * Supprime une variable globale par son ID.
   * @param variableId - L'ID de la variable à supprimer.
   */
  const handleRemoveVariable = (variableId: string) => {
    // TODO: Ajouter une vérification pour s'assurer que la variable n'est pas utilisée dans un workflow
    setScript(prevScript => ({
      ...prevScript,
      globalVariables: prevScript.globalVariables.filter(v => v.id !== variableId),
    }));
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleAddVariable}
        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus size={18} />
        <span>Nouvelle Variable</span>
      </button>

      <div className="space-y-2">
        {script.globalVariables.map(variable => (
          <div key={variable.id} className="p-3 bg-white border border-slate-200 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                  {variable.type.substring(0,3)}
                </span>
                <span className="text-sm font-medium text-slate-900">{variable.name}</span>
              </div>
              <div className="flex items-center space-x-1">
                <button className="p-1 text-slate-400 hover:text-blue-600 rounded" title="Modifier">
                  <Edit3 size={14} />
                </button>
                <button 
                  className="p-1 text-slate-400 hover:text-red-600 rounded" 
                  title="Supprimer"
                  onClick={() => handleRemoveVariable(variable.id)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Valeur par défaut: {JSON.stringify(variable.defaultValue)}
            </p>
          </div>
        ))}
      </div>

      {script.globalVariables.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          <Database className="h-10 w-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm font-medium">Aucune variable</p>
          <p className="text-xs mt-1">Créez des variables pour stocker des données.</p>
        </div>
      )}
    </div>
  );
};