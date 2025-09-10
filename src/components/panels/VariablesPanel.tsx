// chemin: vscript_call/src/components/panels/VariablesPanel.tsx

import React, { useState, useMemo } from 'react';
import { Plus, Edit3, Trash2, Database, Link } from 'lucide-react';
import { Script, GlobalVariable } from '../../types';
import { generateId } from '../../utils/helpers';

// Définition correcte des props
interface VariablesPanelProps {
  script: Script;
  setScript: React.Dispatch<React.SetStateAction<Script>>;
}

export const VariablesPanel: React.FC<VariablesPanelProps> = ({ script, setScript }) => {
  const [editingVariable, setEditingVariable] = useState<GlobalVariable | null>(null);

  // On crée une map pour accéder rapidement au nom de la page d'un composant
  const pageNameById = useMemo(() => {
    const map = new Map<string, string>();
    script.pages.forEach(page => {
      map.set(page.id, page.name);
    });
    return map;
  }, [script.pages]);


  const handleAddVariable = () => {
    const newVariable: GlobalVariable = {
      id: generateId(),
      name: `V_variable_${script.globalVariables.length + 1}`,
      type: 'string',
      defaultValue: '',
      description: '',
      componentId: '',
    };
    setEditingVariable(newVariable);
  };

  const handleEditVariable = (variable: GlobalVariable) => {
    setEditingVariable(variable);
  };

  const handleSaveVariable = () => {
    if (!editingVariable) return;

    if (!editingVariable.name.startsWith('V_')) {
      alert("Le nom de la variable doit commencer par 'V_'.");
      return;
    }

    const isNew = !script.globalVariables.some(v => v.id === editingVariable.id);
    if (isNew) {
      setScript(prev => ({
        ...prev,
        globalVariables: [...prev.globalVariables, editingVariable],
      }));
    } else {
      setScript(prev => ({
        ...prev,
        globalVariables: prev.globalVariables.map(v =>
          v.id === editingVariable.id ? editingVariable : v
        ),
      }));
    }
    setEditingVariable(null);
  };

  const handleRemoveVariable = (variableId: string) => {
    // TODO: Ajouter une vérification pour s'assurer que la variable n'est pas utilisée dans un workflow
    setScript(prevScript => ({
      ...prevScript,
      globalVariables: prevScript.globalVariables.filter(v => v.id !== variableId),
    }));
  };

  const handleInputChange = (field: keyof GlobalVariable, value: any) => {
    if (editingVariable) {
      let newDefaultValue = editingVariable.defaultValue;

        // Convertir la valeur par défaut si le type change
        if (field === 'type') {
            switch(value) {
                case 'number':
                    newDefaultValue = Number(editingVariable.defaultValue) || 0;
                    break;
                case 'boolean':
                    newDefaultValue = Boolean(editingVariable.defaultValue);
                    break;
                case 'string':
                default:
                    newDefaultValue = String(editingVariable.defaultValue);
                    break;
            }
        }
      setEditingVariable({ ...editingVariable, [field]: value, defaultValue: newDefaultValue });
    }
  };
  
  const handleDefaultValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingVariable) return;
    let value: any = e.target.value;
    switch(editingVariable.type) {
        case 'number':
            value = Number(e.target.value);
            break;
        case 'boolean':
            value = e.target.checked;
            break;
    }
    setEditingVariable({...editingVariable, defaultValue: value});
  }

  // Formulaire d'édition/création
  if (editingVariable) {
    return (
      <div className="space-y-4 p-4 bg-slate-50 rounded-lg border">
        <h3 className="text-lg font-semibold text-slate-800">
          {script.globalVariables.some(v => v.id === editingVariable.id) ? 'Modifier la variable' : 'Nouvelle Variable'}
        </h3>
        
        <div>
          <label className="text-sm font-medium text-slate-700">Nom</label>
          <input
            type="text"
            value={editingVariable.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full mt-1 px-3 py-2 text-sm border border-slate-300 rounded-lg"
          />
           <p className="text-xs text-slate-500 mt-1">Doit commencer par "V_".</p>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Type</label>
          <select
            value={editingVariable.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
            className="w-full mt-1 px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
          >
            <option value="string">Texte (String)</option>
            <option value="number">Nombre (Number)</option>
            <option value="boolean">Booléen (Boolean)</option>
          </select>
        </div>
        
        <div>
            <label className="text-sm font-medium text-slate-700">Composant lié</label>
            <select
                value={editingVariable.componentId || ''}
                onChange={(e) => handleInputChange('componentId', e.target.value)}
                className="w-full mt-1 px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
            >
                <option value="">Aucun (utilise la valeur par défaut)</option>
                {script.components.map(comp => (
                    <option key={comp.id} value={comp.id}>
                        {comp.type} ({comp.id.slice(-4)}) - Page: {pageNameById.get(comp.pageId) || 'Inconnue'}
                    </option>
                ))}
            </select>
            <p className="text-xs text-slate-500 mt-1">Lier la variable à un composant du canevas.</p>
        </div>

        {!editingVariable.componentId && (
            <div>
                <label className="text-sm font-medium text-slate-700">Valeur par défaut</label>
                {editingVariable.type === 'boolean' ? (
                    <input
                        type="checkbox"
                        checked={Boolean(editingVariable.defaultValue)}
                        onChange={handleDefaultValueChange}
                        className="mt-2"
                    />
                ) : (
                    <input
                        type={editingVariable.type === 'number' ? 'number' : 'text'}
                        value={editingVariable.defaultValue}
                        onChange={handleDefaultValueChange}
                        className="w-full mt-1 px-3 py-2 text-sm border border-slate-300 rounded-lg"
                    />
                )}
            </div>
        )}

        <div className="flex items-center space-x-2">
          <button onClick={handleSaveVariable} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Enregistrer
          </button>
          <button onClick={() => setEditingVariable(null)} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300">
            Annuler
          </button>
        </div>
      </div>
    );
  }

  // Vue principale
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
        {script.globalVariables.map(variable => {
          const linkedComponent = script.components.find(c => c.id === variable.componentId);
          return (
            <div key={variable.id} className="p-3 bg-white border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                    {variable.type.substring(0,3)}
                  </span>
                  <span className="text-sm font-medium text-slate-900">{variable.name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <button onClick={() => handleEditVariable(variable)} className="p-1 text-slate-400 hover:text-blue-600 rounded" title="Modifier">
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
              {linkedComponent && (
                <div className="text-xs text-slate-500 mt-1 flex items-center space-x-1">
                  <Link size={12} className="text-blue-500" />
                  <span>Liée à: {linkedComponent.type} sur la page "{pageNameById.get(linkedComponent.pageId)}"</span>
                </div>
              )}
            </div>
          )
        })}
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