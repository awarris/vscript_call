// chemin: vscript_call/src/components/panels/WorkflowPanel.tsx

import React from 'react';
import { Plus, Play, Settings, Trash2, Zap } from 'lucide-react';
import { Script, WorkflowRule } from '../../types';
import { generateId } from '../../utils/helpers';

// Définition correcte des props attendues par le composant
interface WorkflowPanelProps {
  script: Script;
  setScript: React.Dispatch<React.SetStateAction<Script>>;
  currentPageId: string;
}

export const WorkflowPanel: React.FC<WorkflowPanelProps> = ({ script, setScript, currentPageId }) => {
  // On filtre les workflows pour n'afficher que ceux de la page courante
  const currentWorkflowRules = script.workflowRules.filter(rule => rule.pageId === currentPageId);

  /**
   * Ajoute un nouveau workflow vide à la page actuelle.
   */
  const handleAddWorkflow = () => {
    const newWorkflow: WorkflowRule = {
      id: generateId(),
      name: `Nouveau Workflow ${currentWorkflowRules.length + 1}`,
      pageId: currentPageId,
      trigger: {
        type: 'onClick', // Déclencheur par défaut
      },
      conditions: [],
      actions: [],
    };

    setScript(prevScript => ({
      ...prevScript,
      workflowRules: [...prevScript.workflowRules, newWorkflow],
    }));
  };

  /**
   * Supprime un workflow par son ID.
   * @param ruleId - L'ID du workflow à supprimer.
   */
  const handleRemoveWorkflow = (ruleId: string) => {
    setScript(prevScript => ({
      ...prevScript,
      workflowRules: prevScript.workflowRules.filter(rule => rule.id !== ruleId),
    }));
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleAddWorkflow}
        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus size={18} />
        <span>Nouveau Workflow</span>
      </button>

      <div className="space-y-2">
        {currentWorkflowRules.map(rule => (
          <div key={rule.id} className="p-3 bg-white border border-slate-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h5 className="text-sm font-medium text-slate-900">{rule.name}</h5>
              <div className="flex space-x-1">
                <button className="p-1 text-slate-400 hover:text-blue-600 rounded" title="Modifier">
                  <Settings size={14} />
                </button>
                <button 
                  className="p-1 text-slate-400 hover:text-red-600 rounded" 
                  title="Supprimer"
                  onClick={() => handleRemoveWorkflow(rule.id)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Déclencheur: <span className="font-semibold">{rule.trigger.type}</span> → {rule.actions.length} action(s)
            </p>
          </div>
        ))}
      </div>

      {currentWorkflowRules.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          <Zap className="h-10 w-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm font-medium">Aucun workflow pour cette page</p>
          <p className="text-xs mt-1">Créez un workflow pour ajouter de l'interactivité.</p>
        </div>
      )}
    </div>
  );
};