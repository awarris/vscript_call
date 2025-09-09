// chemin: src/components/PreviewPane/PreviewPane.tsx

import React, { useState, useEffect } from 'react';
import { Component, Script, WorkflowTriggerType } from '../../types';
import { getDeviceWidth } from '../../utils/helpers';
import { File } from 'lucide-react';

interface PreviewPaneProps {
  script: Script;
  currentPageId: string;
  device: 'mobile' | 'tablet' | 'desktop';
  onNavigateToPage: (pageId: string) => void;
}

export const PreviewPane: React.FC<PreviewPaneProps> = ({
  script, currentPageId, device, onNavigateToPage,
}) => {
  const [variables, setVariables] = useState<Record<string, any>>({});
  const [componentValues, setComponentValues] = useState<Record<string, any>>({});
  
  const currentPage = script.pages.find(p => p.id === currentPageId);
  const currentPageIndex = script.pages.findIndex(p => p.id === currentPageId);
  const components = script.components.filter(c => c.pageId === currentPageId);
  const workflowRules = script.workflowRules.filter(r => r.pageId === currentPageId);

  useEffect(() => {
    const initialVariables: Record<string, any> = {};
    script.globalVariables.forEach(variable => {
      initialVariables[variable.name] = variable.defaultValue;
    });
    setVariables(initialVariables);
  }, [script.globalVariables]);

  useEffect(() => { setComponentValues({}); }, [currentPageId]);

  const executeWorkflow = (triggerType: WorkflowTriggerType, componentId: string) => {
    const applicableRules = workflowRules.filter(rule => 
      rule.trigger.type === triggerType && rule.trigger.componentId === componentId
    );
    for (const rule of applicableRules) {
      for (const action of rule.actions) {
        switch (action.type) {
          case 'navigate':
            if (action.config.pageId) onNavigateToPage(action.config.pageId);
            break;
          case 'setVariable':
            const variableToUpdate = script.globalVariables.find(v => v.id === action.config.variableId);
            if (variableToUpdate) {
              let newValue = action.config.value;
              if (action.config.valueFrom) {
                newValue = componentValues[action.config.valueFrom.componentId] || '';
              }
              setVariables(prev => ({ ...prev, [variableToUpdate.name]: newValue }));
            }
            break;
          case 'showMessage':
            alert(action.config.message);
            break;
        }
      }
    }
  };

  const handleComponentValueChange = (componentId: string, value: any) => {
    setComponentValues(prev => ({...prev, [componentId]: value}));
    executeWorkflow('onChange', componentId);
  };

  const renderPreviewComponent = (component: Component) => {
    const style = {
        width: '100%', height: '100%', ...component.config.style,
        boxSizing: 'border-box' as const,
    };
    const eventHandlers = {
      onClick: () => executeWorkflow('onClick', component.id),
      onDoubleClick: () => executeWorkflow('onDoubleClick', component.id),
      onMouseEnter: () => executeWorkflow('onMouseEnter', component.id),
      onMouseLeave: () => executeWorkflow('onMouseLeave', component.id),
    };
    switch (component.type) {
        case 'paragraphe': case 'h1':
            return <div style={style} {...eventHandlers}>{component.config.value || component.config.text}</div>;
        case 'button':
            return <button style={{...style, cursor: 'pointer'}} {...eventHandlers}>{component.config.value || component.config.text}</button>;
        case 'input': case 'inputDate': case 'inputTime':
            return <input {...component.config.attributes} style={style} value={componentValues[component.id] || ''} onChange={(e) => handleComponentValueChange(component.id, e.target.value)} {...eventHandlers} />;
        case 'textarea':
            return <textarea {...component.config.attributes} style={style} value={componentValues[component.id] || ''} onChange={(e) => handleComponentValueChange(component.id, e.target.value)} {...eventHandlers} />;
        case 'image':
            return <img src={component.config.src} alt={component.config.alt} style={style} {...eventHandlers} />;
        case 'iframe':
            return <iframe src={component.config.src} style={style} title="iframe content" />;
        case 'select':
            return (
                <select style={style} value={componentValues[component.id] || ''} onChange={(e) => handleComponentValueChange(component.id, e.target.value)} {...eventHandlers}>
                    {(component.config.options || []).map((opt: any, index: number) => ( <option key={index} value={opt.value}>{opt.label}</option> ))}
                </select>
            );
        case 'checkbox':
            return <div style={style}><input type="checkbox" checked={componentValues[component.id] || component.config.checked} onChange={(e) => handleComponentValueChange(component.id, e.target.checked)} {...eventHandlers} /> <label>{component.config.label}</label></div>;
        case 'divPannel': case 'ficheClient':
            return <div style={style} {...eventHandlers}></div>;
        default:
            return <div style={{...style, border: '1px dashed red'}}>Composant inconnu: {component.type}</div>;
    }
  };

  return (
    <div className="flex-1 bg-slate-200 overflow-auto p-8 flex justify-center items-start">
      <div
        className="bg-white rounded-xl shadow-2xl border border-slate-300 relative overflow-hidden"
        style={{ width: getDeviceWidth(device), minHeight: '800px', backgroundColor: currentPage?.backgroundColor || '#ffffff' }}
      >
        {components.map(component => (
          <div key={component.id} style={{ position: 'absolute', left: component.position.x, top: component.position.y, width: component.size.width, height: component.size.height }}>
            {renderPreviewComponent(component)}
          </div>
        ))}
        
        {/* CORRECTION : Pied de page pour l'information de la page actuelle */}
        <div className="absolute bottom-0 left-0 right-0 bg-slate-800 text-white p-2 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
                <File size={14} className="text-slate-400" />
                <span>{currentPage?.name || 'Page inconnue'}</span>
            </div>
            <span>Page {currentPageIndex + 1} / {script.pages.length}</span>
        </div>

        {Object.keys(variables).length > 0 && (
          <div className="absolute bottom-10 right-4 bg-slate-800 bg-opacity-80 text-white p-3 rounded-lg text-xs backdrop-blur-sm shadow-xl">
            <div className="font-semibold mb-2 text-blue-300 border-b border-slate-600 pb-1">Variables</div>
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