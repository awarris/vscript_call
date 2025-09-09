// chemin: vscript_call/src/components/PreviewPane/PreviewPane.tsx

import React, { useState, useEffect } from 'react';
import { Component, Script, WorkflowRule } from '../../types';
import { getDeviceWidth } from '../../utils/helpers';

interface PreviewPaneProps {
  script: Script;
  currentPageId: string;
  device: 'mobile' | 'tablet' | 'desktop';
  onNavigateToPage: (pageId: string) => void;
}

export const PreviewPane: React.FC<PreviewPaneProps> = ({
  script,
  currentPageId,
  device,
  onNavigateToPage,
}) => {
  // État pour les variables globales du script
  const [variables, setVariables] = useState<Record<string, any>>({});
  // État pour les valeurs des composants de la page actuelle (ex: champs de saisie)
  const [componentValues, setComponentValues] = useState<Record<string, any>>({});
  
  const currentPage = script.pages.find(p => p.id === currentPageId);
  const components = script.components.filter(c => c.pageId === currentPageId);
  const workflowRules = script.workflowRules.filter(r => r.pageId === currentPageId);

  // Initialisation des variables globales à partir du script
  useEffect(() => {
    const initialVariables: Record<string, any> = {};
    script.globalVariables.forEach(variable => {
      initialVariables[variable.name] = variable.defaultValue;
    });
    setVariables(initialVariables);
  }, [script.globalVariables]);

  /**
   * Moteur d'exécution des workflows.
   * @param triggerType - Le type d'événement (ex: 'onClick', 'onChange').
   * @param componentId - L'ID du composant qui a déclenché l'événement.
   */
  const executeWorkflow = (triggerType: WorkflowRule['trigger']['type'], componentId: string) => {
    const applicableRules = workflowRules.filter(rule => 
      rule.trigger.type === triggerType && rule.trigger.componentId === componentId
    );

    for (const rule of applicableRules) {
      // TODO: Implémenter la vérification des conditions ici

      // Exécuter chaque action de la règle
      for (const action of rule.actions) {
        switch (action.type) {
          case 'navigate':
            if (action.config.pageId) {
              onNavigateToPage(action.config.pageId);
            }
            break;

          case 'setVariable':
            const variableToUpdate = script.globalVariables.find(v => v.id === action.config.variableId);
            if (variableToUpdate) {
              let newValue = action.config.value;

              // Si la valeur doit provenir d'un autre composant
              if (action.config.valueFrom) {
                newValue = componentValues[action.config.valueFrom.componentId] || '';
              }

              setVariables(prev => ({
                ...prev,
                [variableToUpdate.name]: newValue,
              }));
            }
            break;
            
          case 'showMessage':
            alert(action.config.message);
            break;
        }
      }
    }
  };

  /**
   * Gère le changement de valeur d'un composant de saisie.
   * @param componentId - L'ID du composant.
   * @param value - La nouvelle valeur.
   */
  const handleComponentValueChange = (componentId: string, value: any) => {
    setComponentValues(prev => ({...prev, [componentId]: value}));
    executeWorkflow('onChange', componentId);
  }

  // Rendu d'un composant individuel en mode prévisualisation
  const renderPreviewComponent = (component: Component) => {
    const style = {
      ...component.config.style,
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: component.config.style?.textAlign === 'center' ? 'center' : 'flex-start',
      cursor: 'pointer',
    };

    switch (component.type) {
      case 'text':
        return <div style={style}>{component.config.text}</div>;

      case 'button':
        return (
          <button 
            style={style} 
            onClick={() => executeWorkflow('onClick', component.id)}
          >
            {component.config.text}
          </button>
        );

      case 'input':
        return (
          <input
            type="text"
            placeholder={component.config.placeholder}
            style={style}
            value={componentValues[component.id] || ''}
            onChange={(e) => handleComponentValueChange(component.id, e.target.value)}
          />
        );

      default:
        return <div style={style}>Preview: {component.type}</div>;
    }
  };

  const canvasWidth = getDeviceWidth(device);

  return (
    <div className="flex-1 bg-slate-100 overflow-auto p-8 flex justify-center items-center">
      <div
        className="bg-white rounded-xl shadow-2xl border border-slate-200 relative overflow-hidden"
        style={{
          width: canvasWidth,
          minHeight: '600px',
          backgroundColor: currentPage?.backgroundColor || '#ffffff',
        }}
      >
        {components.map(component => (
          <div
            key={component.id}
            style={{
              position: 'absolute',
              left: component.position.x,
              top: component.position.y,
              width: component.size.width,
              height: component.size.height,
            }}
          >
            {renderPreviewComponent(component)}
          </div>
        ))}

        {/* Panneau de débogage des variables */}
        {Object.keys(variables).length > 0 && (
          <div className="absolute bottom-4 right-4 bg-slate-800 bg-opacity-80 text-white p-3 rounded-lg text-xs backdrop-blur-sm shadow-xl">
            <div className="font-semibold mb-2 text-blue-300 border-b border-slate-600 pb-1">Variables en direct</div>
            {Object.entries(variables).map(([key, value]) => (
              <div key={key} className="flex justify-between mt-1">
                <span className="text-slate-400">{key}:</span>
                <span className="ml-4 font-mono text-emerald-300">{JSON.stringify(value)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};