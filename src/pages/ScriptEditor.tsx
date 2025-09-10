// chemin: vscript_call/src/pages/ScriptEditor.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import * as Icons from 'lucide-react';

import { useScriptsContext } from '../context/ScriptsContext';
import { useHistoryState } from '../hooks/useHistoryState';
import { Script, Component, ComponentConfig, ScriptPage } from '../types';
import { generateId } from '../utils/helpers';

// Import des composants de l'interface
import { Toolbar } from '../components/Toolbar/Toolbar';
import { Canvas } from '../components/Canvas/Canvas';
import { PreviewPane } from '../components/PreviewPane/PreviewPane';
import { ChatPanel } from '../components/layout/ChatPanel';

// Import des différents panneaux de la barre latérale
import { ComponentPalette } from '../components/panels/ComponentPalette';
import { PageManager } from '../components/panels/PageManager';
import { WorkflowPanel } from '../components/panels/WorkflowPanel';
import { VariablesPanel } from '../components/panels/VariablesPanel';
import { PropertiesPanel } from '../components/panels/PropertiesPanel';
import { LayersPanel } from '../components/panels/LayersPanel';

// --- Fonctions Utilitaires ---
const isObject = (item: any): item is object => {
  return (item && typeof item === 'object' && !Array.isArray(item));
};

const mergeDeep = <T extends object>(target: T, source: Partial<T>): T => {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      const sourceKey = key as keyof T;
      if (isObject(source[sourceKey]) && sourceKey in target && isObject(target[sourceKey])) {
        output[sourceKey] = mergeDeep(target[sourceKey] as object, source[sourceKey] as object) as T[keyof T];
      } else {
        output[sourceKey] = source[sourceKey] as T[keyof T];
      }
    });
  }
  return output;
};

// Interface pour l'état de la vue (zoom/pan)
export interface ViewState {
  scale: number;
  x: number;
  y: number;
}


/**
 * Composant principal de l'éditeur de script.
 */
export const ScriptEditor: React.FC = () => {
  const { scriptId } = useParams<{ scriptId: string }>();
  const navigate = useNavigate();
  const { getScript, updateScript } = useScriptsContext();

  const { state: script, setState: setScript, resetState, undo, redo, canUndo, canRedo } = useHistoryState<Script | null>(null);

  const [activeTab, setActiveTab] = useState('components');
  const [currentPageId, setCurrentPageId] = useState<string>('');
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [inlineEditingId, setInlineEditingId] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // NOUVEL ÉTAT pour le zoom et le panoramique
  const [viewState, setViewState] = useState<ViewState>({ scale: 1, x: 0, y: 0 });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    if (scriptId) {
      const foundScript = getScript(scriptId);
      if (foundScript) {
        resetState(foundScript);
        const homePage = foundScript.pages.find(p => p.isHomePage) || foundScript.pages[0];
        if (homePage) setCurrentPageId(homePage.id);
      } else {
        navigate('/');
      }
    }
  }, [scriptId, getScript, navigate, resetState]);

  useEffect(() => {
    if (script && scriptId) {
      updateScript(scriptId, script);
    }
  }, [script, scriptId, updateScript]);

  const handleUpdateScript = (updates: Partial<Script>) => {
    setScript(prev => prev ? { ...prev, ...updates } : null);
  };

  const currentPage = script?.pages.find(p => p.id === currentPageId);
  const componentsOnCurrentPage = script?.components.filter(c => c.pageId === currentPageId) || [];
  const selectedComponent = script?.components.find(c => c.id === selectedComponentId) || null;

  const handleAddComponent = (type: string, config: ComponentConfig, size: {width: number, height: number}, position?: { x: number; y: number }, parentId?: string): string => {
    const newComponent: Component = {
      id: generateId(), type, config, position: position || { x: 50, y: 50 },
      size, pageId: currentPageId, parentId,
    };
    setScript(prev => prev ? { ...prev, components: [...prev.components, newComponent] } : null);
    setSelectedComponentId(newComponent.id);
    setActiveTab('properties');
    return newComponent.id;
  };
  
  const handleUpdateComponent = (id: string, updates: Partial<Component>) => {
    setScript(prev => {
      if (!prev) return null;
      return {
        ...prev,
        components: prev.components.map(c => 
          c.id === id ? mergeDeep(c, updates) : c
        ),
      };
    });
  };

  const handleUpdateComponentPosition = useCallback((id: string, newPosition: { x: number; y: number }) => {
    setScript(prev => {
      if (!prev) return null;
      return {
        ...prev,
        components: prev.components.map(c => 
          c.id === id ? { ...c, position: newPosition } : c
        ),
      };
    });
}, [setScript]);

  const handleRemoveComponent = (id: string) => {
    if (!script) return;
    const idsToRemove = new Set<string>([id]);
    // Logique pour supprimer aussi les enfants si nécessaire
    setScript(prev => prev ? { ...prev, components: prev.components.filter(c => !idsToRemove.has(c.id)) } : null);
    if (selectedComponentId === id) setSelectedComponentId(null);
  };

  const handleDuplicateComponent = (id: string) => {
    const componentToDuplicate = script?.components.find(c => c.id === id);
    if (componentToDuplicate) {
      const newComponent: Component = {
        ...componentToDuplicate, id: generateId(),
        position: { x: componentToDuplicate.position.x + 20, y: componentToDuplicate.position.y + 20 },
      };
      setScript(prev => prev ? { ...prev, components: [...prev.components, newComponent] } : null);
      setSelectedComponentId(newComponent.id);
    }
  };

  const handleUpdatePage = (updates: Partial<ScriptPage>) => {
    setScript(prev => prev ? {
      ...prev,
      pages: prev.pages.map(p => p.id === currentPageId ? { ...p, ...updates } : p)
    } : null);
  };

  const handleImportScript = (importedScript: Script) => {
    resetState(importedScript);
    const homePage = importedScript.pages.find(p => p.isHomePage) || importedScript.pages[0];
    setCurrentPageId(homePage?.id || '');
  };

  if (!script) {
    return <div>Chargement du script...</div>;
  }

  const tabs = [
    { id: 'components', label: 'Composants', icon: 'LayoutGrid' },
    { id: 'layers', label: 'Éléments', icon: 'Layers' },
    { id: 'pages', label: 'Pages', icon: 'File' },
    { id: 'workflows', label: 'Workflows', icon: 'Zap' },
    { id: 'variables', label: 'Variables', icon: 'Database' },
    { id: 'properties', label: 'Propriétés', icon: 'Settings' },
  ];

  const activeTabInfo = tabs.find(tab => tab.id === activeTab);

  const renderPanelContent = () => {
    switch (activeTab) {
      case 'components': return <ComponentPalette onAddComponent={handleAddComponent} />;
      case 'layers': return <LayersPanel components={componentsOnCurrentPage} allComponents={script.components} selectedComponentId={selectedComponentId} onSelectComponent={setSelectedComponentId} onRemoveComponent={handleRemoveComponent} />;
      case 'pages': return <PageManager script={script} setScript={setScript} currentPageId={currentPageId} setCurrentPageId={setCurrentPageId} />;
      case 'workflows': return <WorkflowPanel script={script} setScript={setScript} currentPageId={currentPageId} />;
      case 'variables': return <VariablesPanel script={script} setScript={setScript} />;
      case 'properties': return <PropertiesPanel selectedComponent={selectedComponent} onUpdateComponent={handleUpdateComponent} pages={script.pages} currentPageId={currentPageId} script={script} setActivePanel={setActiveTab} componentsOnPage={componentsOnCurrentPage} />;
      default: return null;
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={`h-screen w-screen flex flex-col bg-gray-vs-100 dark:bg-gray-vs-900 ${theme}`}>
        <Toolbar
          script={script}
          onUpdateScript={handleUpdateScript}
          onImportScript={handleImportScript}
          isPreviewMode={isPreviewMode}
          onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
          undo={undo}
          redo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
          onToggleChat={() => setIsChatOpen(!isChatOpen)}
          onToggleRightPanels={() => setIsRightPanelOpen(!isRightPanelOpen)}
          theme={theme}
          setTheme={setTheme}
          zoomLevel={viewState.scale}
          onZoomIn={() => setViewState(v => ({...v, scale: Math.min(v.scale * 1.2, 4)}))}
          onZoomOut={() => setViewState(v => ({...v, scale: Math.max(v.scale / 1.2, 0.1)}))}
          onZoomReset={() => setViewState({ scale: 1, x: 0, y: 0 })}
        />
        <div className="flex-1 relative overflow-hidden">
          <ChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} script={script} />
          
          <div className="h-full flex flex-col overflow-hidden">
            {isPreviewMode ? (
              <PreviewPane script={script} currentPageId={currentPageId} onNavigateToPage={setCurrentPageId} />
            ) : (
              <div className="flex-1 flex overflow-hidden">
                 <Canvas
                    components={componentsOnCurrentPage}
                    allComponents={script.components}
                    onUpdateComponent={handleUpdateComponent}
                    onUpdateComponentPosition={handleUpdateComponentPosition}
                    onRemoveComponent={handleRemoveComponent}
                    onDuplicateComponent={handleDuplicateComponent}
                    selectedComponentId={selectedComponentId}
                    onSelectComponent={setSelectedComponentId}
                    onAddComponent={handleAddComponent}
                    currentPage={currentPage}
                    onUpdatePage={handleUpdatePage}
                    inlineEditingId={inlineEditingId}
                    setInlineEditingId={setInlineEditingId}
                    theme={theme}
                    viewState={viewState}
                    setViewState={setViewState}
                  />
                  
                  {isRightPanelOpen && (
                    <aside className="w-[380px] bg-white dark:bg-gray-vs-800 border-l border-slate-200 dark:border-gray-vs-700 flex shadow-lg flex-shrink-0 animate-slide-in-from-right">
                      {/* Barre d'onglets verticale */}
                      <div className="w-20 bg-slate-50 dark:bg-gray-vs-800 border-r border-slate-200 dark:border-gray-vs-700 flex flex-col items-center py-4 space-y-2">
                          {tabs.map(tab => {
                             const Icon = Icons[tab.icon as keyof typeof Icons] as React.ElementType;
                             return (
                                <button
                                  key={tab.id}
                                  onClick={() => setActiveTab(tab.id)}
                                  title={tab.label}
                                  disabled={tab.id === 'properties' && !selectedComponent}
                                  className={`flex flex-col items-center justify-center w-16 h-16 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                                    activeTab === tab.id 
                                      ? 'bg-blue-600 text-white' 
                                      : 'text-slate-500 dark:text-gray-vs-300 hover:bg-slate-200 dark:hover:bg-gray-vs-700 hover:text-slate-700 dark:hover:text-white'
                                  }`}
                                >
                                  <Icon size={22} />
                                  <span className="text-xs mt-1">{tab.label}</span>
                                </button>
                             )
                          })}
                      </div>

                      {/* Contenu du panneau */}
                      <div className="flex-1 flex flex-col">
                        <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-gray-vs-700">
                          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">{activeTabInfo?.label}</h2>
                           <button onClick={() => setIsRightPanelOpen(false)} className="p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-gray-vs-700 rounded-full">
                             <Icons.X size={18} />
                           </button>
                        </header>
                        <div className="flex-1 overflow-y-auto p-4">
                          {renderPanelContent()}
                        </div>
                      </div>
                    </aside>
                  )}
              </div>
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};