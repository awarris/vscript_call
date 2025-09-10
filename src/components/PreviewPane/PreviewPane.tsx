// chemin: src/components/PreviewPane/PreviewPane.tsx

import React, { useState, useEffect } from 'react';
import { Component, Script, WorkflowTriggerType, ComponentStyle } from '../../types';
import { getDeviceWidth } from '../../utils/helpers';
import { File, Delete } from 'lucide-react';

// Sous-composant pour la calculatrice fonctionnelle
const FunctionalCalculator: React.FC<{ styleConfig: ComponentStyle }> = ({ styleConfig }) => {
    const [currentValue, setCurrentValue] = useState('0');
    const [previousValue, setPreviousValue] = useState<string | null>(null);
    const [operator, setOperator] = useState<string | null>(null);
    const [displayValue, setDisplayValue] = useState('0');

    useEffect(() => {
        let display = currentValue;
        if (operator) {
            display = `${previousValue || ''} ${operator} ${currentValue === previousValue ? '' : currentValue}`;
        }
        setDisplayValue(display);
    }, [currentValue, previousValue, operator]);

    const handleDigitClick = (digit: string) => {
        if (currentValue === '0' || (operator && currentValue === previousValue)) {
            setCurrentValue(digit);
        } else {
            setCurrentValue(currentValue + digit);
        }
    };

    const handleDecimalClick = () => {
        if (!currentValue.includes('.')) {
            setCurrentValue(currentValue + '.');
        }
    };

    const handleOperatorClick = (nextOperator: string) => {
        if (operator && previousValue) {
             handleEqualClick();
        } else {
            setPreviousValue(currentValue);
        }
        setOperator(nextOperator);
    };

    const calculate = () => {
        const prev = parseFloat(previousValue!);
        const current = parseFloat(currentValue);
        let result: number;
        switch (operator) {
            case '+': result = prev + current; break;
            case '-': result = prev - current; break;
            case '*': result = prev * current; break;
            case '/': result = prev / current; break;
            default: return;
        }
        return result;
    };

    const handleEqualClick = () => {
        if (!operator || previousValue === null) return;
        const result = calculate();
        if (result !== undefined) {
            const resultString = String(result);
            setCurrentValue(resultString);
            setPreviousValue(null);
            setOperator(null);
        }
    };

    const handleClearClick = () => {
        setCurrentValue('0');
        setPreviousValue(null);
        setOperator(null);
    };

    const handleBackspaceClick = () => {
        if (currentValue.length > 1) {
            setCurrentValue(currentValue.slice(0, -1));
        } else {
            setCurrentValue('0');
        }
    };

    const buttons = [
        { label: <Delete size={18} className="mx-auto" />, action: handleBackspaceClick, style: { bg: styleConfig.buttonColor, text: styleConfig.buttonTextColor }, span: 'col-span-1' },
        { label: 'C', action: handleClearClick, style: { bg: styleConfig.clearColor, text: styleConfig.clearTextColor }, span: 'col-span-2' },
        { label: '/', action: () => handleOperatorClick('/'), style: { bg: styleConfig.operatorColor, text: styleConfig.operatorTextColor }, span: 'col-span-1' },
        { label: '7', action: () => handleDigitClick('7'), style: { bg: styleConfig.buttonColor, text: styleConfig.buttonTextColor }, span: 'col-span-1' },
        { label: '8', action: () => handleDigitClick('8'), style: { bg: styleConfig.buttonColor, text: styleConfig.buttonTextColor }, span: 'col-span-1' },
        { label: '9', action: () => handleDigitClick('9'), style: { bg: styleConfig.buttonColor, text: styleConfig.buttonTextColor }, span: 'col-span-1' },
        { label: '*', action: () => handleOperatorClick('*'), style: { bg: styleConfig.operatorColor, text: styleConfig.operatorTextColor }, span: 'col-span-1' },
        { label: '4', action: () => handleDigitClick('4'), style: { bg: styleConfig.buttonColor, text: styleConfig.buttonTextColor }, span: 'col-span-1' },
        { label: '5', action: () => handleDigitClick('5'), style: { bg: styleConfig.buttonColor, text: styleConfig.buttonTextColor }, span: 'col-span-1' },
        { label: '6', action: () => handleDigitClick('6'), style: { bg: styleConfig.buttonColor, text: styleConfig.buttonTextColor }, span: 'col-span-1' },
        { label: '-', action: () => handleOperatorClick('-'), style: { bg: styleConfig.operatorColor, text: styleConfig.operatorTextColor }, span: 'col-span-1' },
        { label: '1', action: () => handleDigitClick('1'), style: { bg: styleConfig.buttonColor, text: styleConfig.buttonTextColor }, span: 'col-span-1' },
        { label: '2', action: () => handleDigitClick('2'), style: { bg: styleConfig.buttonColor, text: styleConfig.buttonTextColor }, span: 'col-span-1' },
        { label: '3', action: () => handleDigitClick('3'), style: { bg: styleConfig.buttonColor, text: styleConfig.buttonTextColor }, span: 'col-span-1' },
        { label: '+', action: () => handleOperatorClick('+'), style: { bg: styleConfig.operatorColor, text: styleConfig.operatorTextColor }, span: 'col-span-1' },
        { label: '0', action: () => handleDigitClick('0'), style: { bg: styleConfig.buttonColor, text: styleConfig.buttonTextColor }, span: 'col-span-2' },
        { label: '.', action: handleDecimalClick, style: { bg: styleConfig.buttonColor, text: styleConfig.buttonTextColor }, span: 'col-span-1' },
        { label: '=', action: handleEqualClick, style: { bg: styleConfig.equalColor, text: styleConfig.equalTextColor }, span: 'col-span-1' },
    ];

    return (
        <div className="w-full h-full p-2 rounded-lg flex flex-col" style={{ backgroundColor: styleConfig.backgroundColor }}>
            <div className="w-full h-1/6 rounded-md mb-2 flex items-end justify-end p-2 text-2xl text-right overflow-hidden break-all" style={{ backgroundColor: styleConfig.displayColor, color: styleConfig.displayTextColor }}>
                {displayValue}
            </div>
            <div className="grid grid-cols-4 gap-2 flex-1">
                {buttons.map((btn, i) => (
                    <button
                        key={i}
                        onClick={btn.action}
                        className={`rounded-md text-lg flex items-center justify-center transition-opacity hover:opacity-80 active:opacity-60 ${btn.span}`}
                        style={{ backgroundColor: btn.style.bg, color: btn.style.text }}
                    >
                        {btn.label}
                    </button>
                ))}
            </div>
        </div>
    );
};


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
  const [editingDateTimeId, setEditingDateTimeId] = useState<string | null>(null);


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

  useEffect(() => { 
    setComponentValues({}); 
    setEditingDateTimeId(null);
    executeWorkflow('onPageLoad', 'page'); // Déclenche les événements au chargement de la page
}, [currentPageId]);

  const executeWorkflow = (triggerType: WorkflowTriggerType, componentId: string) => {
    const applicableRules = workflowRules.filter(rule =>
        (rule.trigger.type === triggerType && rule.trigger.componentId === componentId) ||
        (triggerType === 'onPageLoad' && rule.trigger.type === 'onPageLoad' && !rule.trigger.componentId) // Cas spécial pour onPageLoad
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
          case 'executeCode':
            if (action.config.code) {
              try {
                // Création d'un contexte sécurisé pour l'exécution du code
                const getVariable = (name: string) => variables[name];
                const setVariable = (name: string, value: any) => {
                    const variableExists = script.globalVariables.some(v => v.name === name);
                    if (variableExists) {
                        setVariables(prev => ({ ...prev, [name]: value }));
                    } else {
                        console.warn(`Tentative de modification d'une variable inexistante: ${name}`);
                    }
                };
                const getComponentValue = (id: string) => componentValues[id];
                const navigate = (pageId: string) => onNavigateToPage(pageId);

                // Exécution du code via le constructeur Function
                const func = new Function('getVariable', 'setVariable', 'getComponentValue', 'navigate', action.config.code);
                func(getVariable, setVariable, getComponentValue, navigate);

              } catch (error) {
                console.error("Erreur lors de l'exécution du code utilisateur:", error);
                alert("Une erreur s'est produite lors de l'exécution du script personnalisé.");
              }
            }
            break;
        }
      }
    }
  };

  const handleComponentValueChange = (componentId: string, value: any) => {
    setComponentValues(prev => ({...prev, [componentId]: value}));
  
    const linkedVariable = script.globalVariables.find(v => v.componentId === componentId);
    if (linkedVariable) {
      setVariables(prev => ({...prev, [linkedVariable.name]: value}));
    }
  
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
    
    if ((component.type === 'inputDate' || component.type === 'inputTime') && editingDateTimeId === component.id) {
        return (
            <input
                type={component.type === 'inputDate' ? 'date' : 'time'}
                style={style}
                value={componentValues[component.id] || ''}
                onChange={(e) => handleComponentValueChange(component.id, e.target.value)}
                onBlur={() => setEditingDateTimeId(null)}
                autoFocus
            />
        );
    }


    switch (component.type) {
        case 'paragraphe': case 'h1':
            return <div style={style} {...eventHandlers}>{component.config.value || component.config.text}</div>;
        case 'button':
            return <button style={{...style, cursor: 'pointer'}} {...eventHandlers}>{component.config.value || component.config.text}</button>;
        case 'input':
            return <input {...component.config.attributes} style={style} value={componentValues[component.id] || ''} onChange={(e) => handleComponentValueChange(component.id, e.target.value)} {...eventHandlers} />;
        case 'inputDate':
        case 'inputTime':
            return (
                <div 
                    style={{...style, cursor: 'pointer', display: 'flex', alignItems: 'center'}}
                    onClick={() => setEditingDateTimeId(component.id)}
                    {...eventHandlers}
                >
                    {componentValues[component.id] || (component.type === 'inputDate' ? 'jj/mm/aaaa' : 'hh:mm')}
                </div>
            )
        case 'textarea':
            return <textarea {...component.config.attributes} style={style} value={componentValues[component.id] || ''} onChange={(e) => handleComponentValueChange(component.id, e.target.value)} {...eventHandlers} />;
        case 'image':
            return <img src={component.config.src} alt={component.config.alt} style={style} {...eventHandlers} />;
        case 'iframe':
            if (component.config.htmlContent) {
              return <iframe srcDoc={component.config.htmlContent} style={style} title="iframe content" />;
            }
            return <iframe src={component.config.src} style={style} title="iframe content" />;
        case 'select':
            return (
                <select style={style} value={componentValues[component.id] || ''} onChange={(e) => handleComponentValueChange(component.id, e.target.value)} {...eventHandlers}>
                    {(component.config.options || []).map((opt: any, index: number) => ( <option key={index} value={opt.value}>{opt.label}</option> ))}
                </select>
            );
        case 'checkbox':
            return <div style={{...style, display: 'flex', alignItems: 'center'}}><input type="checkbox" checked={componentValues[component.id] || component.config.checked} onChange={(e) => handleComponentValueChange(component.id, e.target.checked)} {...eventHandlers} /> <span style={{ marginLeft: '8px' }}>{component.config.label}</span></div>;
        case 'calculator':
            return <FunctionalCalculator styleConfig={component.config.style as ComponentStyle} />;
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
          <div key={component.id} style={{ position: 'absolute', left: component.position.x, top: component.position.y, width: component.size.width, height: 'auto' }}>
            {component.config.label && (
                <label style={{...component.config.labelStyle, display: 'block', marginBottom: '4px'}}>
                    {component.config.label}
                </label>
            )}
            <div style={{height: component.size.height}}>
              {renderPreviewComponent(component)}
            </div>
          </div>
        ))}

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