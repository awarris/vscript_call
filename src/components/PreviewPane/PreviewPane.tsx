// chemin: src/components/PreviewPane/PreviewPane.tsx

import React, { useState, useEffect, useRef } from 'react';
import { Component, Script, WorkflowTriggerType, ComponentStyle, GlobalVariable } from '../../types';
import { File, Delete, ArrowLeft, ArrowRight } from 'lucide-react';
import { ViewState } from '../../pages/ScriptEditor';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../Canvas/Canvas';

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
  onNavigateToPage: (pageId: string) => void;
  theme: 'light' | 'dark';
  viewState: ViewState;
  setViewState: React.Dispatch<React.SetStateAction<ViewState>>;
}

export const PreviewPane: React.FC<PreviewPaneProps> = ({
  script, currentPageId, onNavigateToPage, theme, viewState, setViewState,
}) => {
  const [variables, setVariables] = useState<Record<string, any>>({});
  const [componentValues, setComponentValues] = useState<Record<string, any>>({});
  const [editingDateTimeId, setEditingDateTimeId] = useState<string | null>(null);
  const [componentVisibility, setComponentVisibility] = useState<Record<string, boolean>>({});
  const viewportRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);

  const currentPage = script.pages.find(p => p.id === currentPageId);
  const currentPageIndex = script.pages.findIndex(p => p.id === currentPageId);
  const components = script.components.filter(c => c.pageId === currentPageId);
  const workflowRules = script.workflowRules.filter(r => r.pageId === currentPageId);

  const variableMap = new Map<string, GlobalVariable>(script.globalVariables.map(v => [v.name, v]));

    const resolveValue = (value: any): string => {
        if (typeof value !== 'string') return value;
        return value.replace(/\{\{(V_[a-zA-Z0-9_]+)\}\}/g, (match, varName) => {
            return variables[varName] !== undefined ? String(variables[varName]) : match;
        });
    };

  useEffect(() => {
    const initialVisibility: Record<string, boolean> = {};
    components.forEach(c => {
        initialVisibility[c.id] = c.config.visible !== false;
    });
    setComponentVisibility(initialVisibility);
  }, [currentPageId, script.components]);

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
    executeWorkflow('onPageLoad', 'page');
  }, [currentPageId]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) { // Zoom
        const rect = viewport.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const worldX = (mouseX - viewState.x) / viewState.scale;
        const worldY = (mouseY - viewState.y) / viewState.scale;
        const delta = e.deltaY * -0.001;
        const newScale = Math.max(0.1, Math.min(viewState.scale * (1 + delta), 4));
        const newX = mouseX - worldX * newScale;
        const newY = mouseY - worldY * newScale;
        setViewState({ scale: newScale, x: newX, y: newY });
      } else { // Déplacement (Pan)
        setViewState(vs => ({ ...vs, x: vs.x - e.deltaX, y: vs.y - e.deltaY }));
      }
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        setIsPanning(true);
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsPanning(false);
      }
    };

    viewport.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      viewport.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [viewState, setViewState, isPanning]);

const executeWorkflow = (triggerType: WorkflowTriggerType, componentId: string) => {
    const applicableRules = workflowRules.filter(rule =>
        (rule.trigger.type === triggerType && rule.trigger.componentId === componentId) ||
        (triggerType === 'onPageLoad' && rule.trigger.type === 'onPageLoad' && !rule.trigger.componentId)
    );

    for (const rule of applicableRules) {
      for (const action of rule.actions) {
        switch (action.type) {
          case 'navigate':
            if (action.config.pageId) onNavigateToPage(action.config.pageId);
            break;
          case 'setVisibility':
            if (action.config.targetComponentId !== undefined && action.config.visible !== undefined) {
                setComponentVisibility(prev => ({
                    ...prev,
                    [action.config.targetComponentId!]: action.config.visible!,
                }));
            }
            break;
          case 'showMessage':
            alert(action.config.message);
            break;
          case 'executeCode':
            if (action.config.code) {
              try {
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
                const setComponentVisibilityFunc = (id: string, visible: boolean) => {
                    setComponentVisibility(prev => ({...prev, [id]: visible}));
                }
                const navigate = (pageId: string) => onNavigateToPage(pageId);

                const func = new Function('getVariable', 'setVariable', 'getComponentValue', 'navigate', 'setComponentVisibility', action.config.code);
                func(getVariable, setVariable, getComponentValue, navigate, setComponentVisibilityFunc);

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
            return <div style={style} {...eventHandlers}>{resolveValue(component.config.value || component.config.text)}</div>;
        case 'button':
            return <button style={{...style, cursor: 'pointer'}} {...eventHandlers}>{resolveValue(component.config.value || component.config.text)}</button>;
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
                    {(component.config.options || []).map((opt: any, index: number) => ( <option key={index} value={opt.value}>{opt.label}</option>))}
                </select>
            );
        case 'checkbox':
            return <div style={{...style, display: 'flex', alignItems: 'center'}}><input type="checkbox" checked={componentValues[component.id] || false} onChange={(e) => handleComponentValueChange(component.id, e.target.checked)} {...eventHandlers} /> <span style={{ marginLeft: '8px' }}>{resolveValue(component.config.label)}</span></div>;
        case 'calculator':
            return <FunctionalCalculator styleConfig={component.config.style as ComponentStyle} />;
        case 'divPannel': case 'ficheClient': case 'container':
            return <div style={style} {...eventHandlers}></div>;
        default:
            return <div style={{...style, border: '1px dashed red'}}>Composant inconnu: {component.type}</div>;
    }
  };

  const goToNextPage = () => {
    const nextPageIndex = currentPageIndex + 1;
    if (nextPageIndex < script.pages.length) {
      onNavigateToPage(script.pages[nextPageIndex].id);
    }
  };

  const goToPreviousPage = () => {
    const prevPageIndex = currentPageIndex - 1;
    if (prevPageIndex >= 0) {
      onNavigateToPage(script.pages[prevPageIndex].id);
    }
  };

  const backgroundStyle: React.CSSProperties = {
    '--bg-color': theme === 'dark' ? '#111827' : '#f8fafc',
    '--grid-color': theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
    '--grid-space': `${20 * viewState.scale}px`,
    backgroundColor: 'var(--bg-color)',
    backgroundImage: `
      linear-gradient(var(--grid-color) 1px, transparent 1px),
      linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)
    `,
    backgroundSize: `var(--grid-space) var(--grid-space)`,
    backgroundPosition: `${viewState.x % (20 * viewState.scale)}px ${viewState.y % (20 * viewState.scale)}px`,
    cursor: isPanning ? 'grabbing' : 'grab',
    transition: 'background-color 0.3s ease',
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-200" ref={viewportRef} style={backgroundStyle}>
      <div
        className="flex-1 relative overflow-hidden"
        style={{
          backgroundColor: currentPage?.backgroundColor || '#ffffff'
        }}
      >
        <div
          style={{
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
            transform: `translate(${viewState.x}px, ${viewState.y}px) scale(${viewState.scale})`,
            transformOrigin: '0 0',
            backgroundColor: currentPage?.backgroundColor || '#ffffff'
          }}
        >
          {components
            .filter(c => componentVisibility[c.id])
            .map(component => (
              <div key={component.id} style={{ position: 'absolute', left: component.position.x, top: component.position.y, width: component.size.width, height: 'auto' }}>
                {component.config.label && (
                    <label style={{...component.config.labelStyle, display: 'block', marginBottom: '4px'}}>
                        {resolveValue(component.config.label)}
                    </label>
                )}
                <div style={{height: component.size.height}}>
                  {renderPreviewComponent(component)}
                </div>
              </div>
          ))}
        </div>
      </div>

       {/* Barre de navigation et d'information */}
       <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 p-2 rounded-lg shadow-lg flex items-center space-x-4">
        <button 
          onClick={goToPreviousPage} 
          disabled={currentPageIndex <= 0}
          className="p-2 disabled:opacity-50 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-gray-700 rounded-md"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="flex items-center space-x-2 text-sm text-slate-700 dark:text-slate-200">
          <File size={16} />
          <span>{currentPage?.name || 'Page inconnue'} ({currentPageIndex + 1} / {script.pages.length})</span>
        </div>
        
        <button 
          onClick={goToNextPage} 
          disabled={currentPageIndex >= script.pages.length - 1}
          className="p-2 disabled:opacity-50 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-gray-700 rounded-md"
        >
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Panneau des variables */}
      {Object.keys(variables).length > 0 && (
        <div className="absolute bg-gray-200 top-4 right-4 w-72 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-xl p-4 flex flex-col max-h-[90vh]">
          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 border-b border-slate-300 dark:border-slate-600 pb-2 mb-4">
            Variables Globales
          </h3>
          <div className="overflow-y-auto flex-1 space-y-3 pr-2">
            {Object.entries(variables).map(([key, value]) => (
              <div key={key} className="bg-slate-100 dark:bg-gray-700 rounded-lg p-3">
                <div className="text-sm text-slate-700 dark:text-slate-200 font-bold mb-1">{key}</div>
                <div className="font-mono text-emerald-500 text-base break-words">
                  {JSON.stringify(value)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};