// chemin: vscript_call/src/components/panels/WorkflowPanel.tsx

import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Zap, Settings, ArrowLeft } from 'lucide-react';
import { Script, WorkflowRule, WorkflowTriggerType, WorkflowAction, Component, ScriptPage } from '../../types';
import { generateId } from '../../utils/helpers';

// Props du composant principal
interface WorkflowPanelProps {
  script: Script;
  setScript: React.Dispatch<React.SetStateAction<Script>>;
  currentPageId: string;
}

// Props de l'éditeur de workflow
interface WorkflowEditorProps {
  rule: WorkflowRule;
  onSave: (updatedRule: WorkflowRule) => void;
  onCancel: () => void;
  onDelete: (ruleId: string) => void;
  componentsOnPage: Component[];
  pages: ScriptPage[];
}

// --- Définition des événements disponibles par type de composant ---
const componentEventMap: Record<string, { type: WorkflowTriggerType; label: string }[]> = {
  default: [
    { type: 'onClick', label: 'Au clic' },
    { type: 'onDoubleClick', label: 'Au double-clic' },
    { type: 'onMouseEnter', label: 'La souris entre' },
    { type: 'onMouseLeave', label: 'La souris sort' },
  ],
  input: [
    { type: 'onChange', label: 'Quand la valeur change' },
    { type: 'onClick', label: 'Au clic' },
  ],
  textarea: [
    { type: 'onChange', label: 'Quand la valeur change' },
    { type: 'onClick', label: 'Au clic' },
  ],
  select: [
    { type: 'onChange', label: 'Quand une option est sélectionnée' },
  ],
  checkbox: [
    { type: 'onChange', label: 'Quand la case est cochée/décochée' },
  ]
};

const pageLoadEvent = { type: 'onPageLoad', label: 'Au chargement de la page' };

const availableActions = [
  { type: 'navigate', label: 'Naviguer vers...' },
  { type: 'showMessage', label: 'Afficher un message' },
  // Ajoutez d'autres types d'actions ici
];

// L'éditeur de workflow
const WorkflowEditor: React.FC<WorkflowEditorProps> = ({ rule, onSave, onCancel, onDelete, componentsOnPage, pages }) => {
  const [currentRule, setCurrentRule] = useState(rule);

  // Détermine les événements disponibles en fonction du composant sélectionné
  const availableTriggers = useMemo(() => {
    if (!currentRule.trigger.componentId) {
      return [pageLoadEvent];
    }
    const component = componentsOnPage.find(c => c.id === currentRule.trigger.componentId);
    const componentType = component?.type || 'default';
    
    // Pour les types input, textarea, etc., on utilise leur mapping spécifique
    if (['input', 'textarea', 'select', 'checkbox'].includes(componentType)) {
        return componentEventMap[componentType];
    }
    
    // Sinon, on utilise le mapping par défaut
    return componentEventMap.default;
  }, [currentRule.trigger.componentId, componentsOnPage]);

  const handleTriggerComponentChange = (componentId: string) => {
    if (componentId === 'page') {
        // Cas spécial pour le chargement de la page
        setCurrentRule(prev => ({ ...prev, trigger: { type: 'onPageLoad', componentId: undefined } }));
    } else {
        const selectedComponent = componentsOnPage.find(c => c.id === componentId);
        const newAvailableTriggers = componentEventMap[selectedComponent?.type || 'default'] || componentEventMap.default;

        setCurrentRule(prev => ({
            ...prev,
            trigger: {
                ...prev.trigger,
                componentId,
                // Réinitialise le type de trigger au premier disponible pour ce composant
                type: newAvailableTriggers[0].type
            }
        }));
    }
};

  const handleTriggerTypeChange = (type: WorkflowTriggerType) => {
    setCurrentRule(prev => ({ ...prev, trigger: { ...prev.trigger, type } }));
  };
  
  const handleActionChange = (index: number, field: keyof WorkflowAction['config'], value: any) => {
    const newActions = [...currentRule.actions];
    newActions[index].config = { ...newActions[index].config, [field]: value };
    setCurrentRule(prev => ({...prev, actions: newActions}));
  }
  
  const handleAddAction = () => {
    const newAction: WorkflowAction = {
        id: generateId(),
        type: 'navigate',
        config: {}
    };
    setCurrentRule(prev => ({...prev, actions: [...prev.actions, newAction]}));
  }

  const handleRemoveAction = (index: number) => {
    setCurrentRule(prev => ({...prev, actions: prev.actions.filter((_, i) => i !== index)}));
  }

  const handleActionTypeChange = (index: number, newType: 'navigate' | 'showMessage') => {
    const newActions = [...currentRule.actions];
    newActions[index] = { ...newActions[index], type: newType, config: {} }; // Réinitialise la config
    setCurrentRule(prev => ({...prev, actions: newActions}));
  }

  return (
    <div className="space-y-4">
      <button onClick={onCancel} className="flex items-center space-x-2 text-sm text-slate-600 hover:text-slate-900">
        <ArrowLeft size={16} />
        <span>Retour à la liste</span>
      </button>

      {/* Nom du workflow */}
      <div>
        <label className="text-sm font-semibold">Nom du workflow</label>
        <input
          type="text"
          value={currentRule.name}
          onChange={(e) => setCurrentRule(prev => ({ ...prev, name: e.target.value }))}
          className="w-full mt-1 px-3 py-2 text-sm border border-slate-300 rounded-lg"
        />
      </div>

      {/* Déclencheur */}
      <div className="p-3 bg-slate-50 border rounded-lg space-y-2">
        <h3 className="font-semibold text-slate-800">Quand... (Déclencheur)</h3>
        
        <label className="text-xs font-medium text-slate-600">L'événement se produit sur :</label>
        <select
          value={currentRule.trigger.componentId || 'page'}
          onChange={(e) => handleTriggerComponentChange(e.target.value)}
          className="w-full px-2 py-1.5 text-sm border bg-white border-slate-300 rounded-md"
        >
          <option value="page">La Page (chargement)</option>
          {componentsOnPage.map(c => <option key={c.id} value={c.id}>{c.type} ({c.id.slice(-4)})</option>)}
        </select>

        <label className="text-xs font-medium text-slate-600">Le type d'événement est :</label>
        <select
          value={currentRule.trigger.type}
          onChange={(e) => handleTriggerTypeChange(e.target.value as WorkflowTriggerType)}
          className="w-full px-2 py-1.5 text-sm border bg-white border-slate-300 rounded-md"
        >
          {availableTriggers.map(t => <option key={t.type} value={t.type}>{t.label}</option>)}
        </select>
      </div>

      {/* Actions */}
      <div className="p-3 bg-slate-50 border rounded-lg space-y-3">
        <h3 className="font-semibold text-slate-800">Alors... (Actions)</h3>
        {currentRule.actions.map((action, index) => (
          <div key={action.id} className="p-2 border-t space-y-2">
            <div className="flex items-center justify-between">
                <select value={action.type} onChange={(e) => handleActionTypeChange(index, e.target.value as any)} className="w-full px-2 py-1.5 text-sm border bg-white border-slate-300 rounded-md">
                   {availableActions.map(a => <option key={a.type} value={a.type}>{a.label}</option>)}
                </select>
                <button onClick={() => handleRemoveAction(index)} className="p-1 text-red-500 hover:bg-red-100 rounded ml-2"><Trash2 size={14} /></button>
            </div>
            {action.type === 'navigate' && (
                <select value={action.config.pageId || ''} onChange={(e) => handleActionChange(index, 'pageId', e.target.value)} className="w-full px-2 py-1.5 text-sm border bg-white border-slate-300 rounded-md">
                    <option value="">Choisir une page</option>
                    {pages.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
            )}
            {action.type === 'showMessage' && (
                <input type="text" placeholder="Votre message..." value={action.config.message || ''} onChange={(e) => handleActionChange(index, 'message', e.target.value)} className="w-full mt-1 px-3 py-2 text-sm border border-slate-300 rounded-lg"/>
            )}
          </div>
        ))}
         <button onClick={handleAddAction} className="w-full mt-2 text-sm text-blue-600 hover:text-blue-800">
            + Ajouter une action
        </button>
      </div>

      {/* Boutons de sauvegarde */}
      <div className="flex items-center space-x-2">
        <button onClick={() => onSave(currentRule)} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Enregistrer
        </button>
        <button onClick={() => onDelete(rule.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-lg">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

// Le composant principal qui affiche la liste ou l'éditeur
export const WorkflowPanel: React.FC<WorkflowPanelProps> = ({ script, setScript, currentPageId }) => {
  const [editingRule, setEditingRule] = useState<WorkflowRule | null>(null);

  const componentsOnPage = script.components.filter(c => c.pageId === currentPageId);
  const workflowsOnPage = script.workflowRules.filter(rule => rule.pageId === currentPageId);

  const handleAddWorkflow = () => {
    const newWorkflow: WorkflowRule = {
      id: generateId(),
      name: `Nouveau Workflow ${workflowsOnPage.length + 1}`,
      pageId: currentPageId,
      trigger: { type: 'onPageLoad' }, // Par défaut, on commence avec un événement de page
      conditions: [],
      actions: [],
    };
    setEditingRule(newWorkflow);
  };

  const handleSaveWorkflow = (updatedRule: WorkflowRule) => {
    const isNew = !script.workflowRules.some(r => r.id === updatedRule.id);
    setScript(prev => ({
      ...prev,
      workflowRules: isNew
        ? [...prev.workflowRules, updatedRule]
        : prev.workflowRules.map(r => r.id === updatedRule.id ? updatedRule : r),
    }));
    setEditingRule(null);
  };

  const handleDeleteWorkflow = (ruleId: string) => {
    setScript(prev => ({
      ...prev,
      workflowRules: prev.workflowRules.filter(r => r.id !== ruleId),
    }));
    setEditingRule(null);
  };

  if (editingRule) {
    return (
      <WorkflowEditor
        rule={editingRule}
        onSave={handleSaveWorkflow}
        onCancel={() => setEditingRule(null)}
        onDelete={handleDeleteWorkflow}
        componentsOnPage={componentsOnPage}
        pages={script.pages}
      />
    );
  }

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
        {workflowsOnPage.map(rule => (
          <div key={rule.id} className="p-3 bg-white border border-slate-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h5 className="text-sm font-medium text-slate-900">{rule.name}</h5>
              <div className="flex space-x-1">
                <button onClick={() => setEditingRule(rule)} className="p-1 text-slate-400 hover:text-blue-600 rounded" title="Modifier">
                  <Settings size={14} />
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Déclencheur: <span className="font-semibold">{rule.trigger.type}</span> → {rule.actions.length} action(s)
            </p>
          </div>
        ))}
      </div>

      {workflowsOnPage.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          <Zap className="h-10 w-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm font-medium">Aucun workflow pour cette page</p>
          <p className="text-xs mt-1">Créez un workflow pour ajouter de l'interactivité.</p>
        </div>
      )}
    </div>
  );
};