// chemin: src/pages/ScriptEditor.tsx

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useParams, useNavigate, Link } from 'react-router-dom';
// CORRECTION: On utilise notre nouveau hook de contexte
import { useScriptsContext } from '../context/ScriptsContext';
import { useHistoryState } from '../hooks/useHistoryState';
import { Script, Component, ComponentConfig } from '../types';
import { generateId } from '../utils/helpers';

import { VerticalMenu } from '../components/layout/VerticalMenu';
import { SidePanel } from '../components/layout/SidePanel';
import { Toolbar } from '../components/Toolbar/Toolbar';
import { Canvas } from '../components/Canvas/Canvas';
import { PreviewPane } from '../components/PreviewPane/PreviewPane';
import { PageManager } from '../components/panels/PageManager';
import { ComponentPalette } from '../components/panels/ComponentPalette';
import { PropertiesPanel } from '../components/panels/PropertiesPanel';
import { WorkflowPanel } from '../components/panels/WorkflowPanel';
import { VariablesPanel } from '../components/panels/VariablesPanel';
import { ArrowLeft } from 'lucide-react';

export const ScriptEditor: React.FC = () => {
  const { scriptId } = useParams<{ scriptId: string }>();
  const navigate = useNavigate();
  // CORRECTION: On récupère les données depuis le contexte partagé
  const { getScript, updateScript, isLoading } = useScriptsContext();

  const {
    state: script,
    setState: setScriptWithHistory,
    resetState,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useHistoryState<Script | null>(null);

  const [isInitialized, setIsInitialized] = useState(false);
  const [currentPageId, setCurrentPageId] = useState<string | null>(null);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [activePanel, setActivePanel] = useState<string>('pages');
  const [inlineEditingId, setInlineEditingId] = useState<string | null>(null);

  // Logique de chargement, qui dépend maintenant du `isLoading` du contexte
  useEffect(() => {
    if (isLoading || isInitialized) {
      return;
    }
    
    const loadedScript = getScript(scriptId || '');
    if (loadedScript) {
      resetState(loadedScript);
      const homePage = loadedScript.pages.find(p => p.isHomePage) || loadedScript.pages[0];
      setCurrentPageId(homePage?.id || null);
      setIsInitialized(true);
    } else {
      console.error(`Script avec l'ID "${scriptId}" non trouvé.`);
      navigate('/');
    }
  }, [scriptId, getScript, resetState, navigate, isLoading, isInitialized]);

  // Sauvegarde automatique du script
  useEffect(() => {
    if (script && isInitialized) {
      updateScript(script.id, script);
    }
  }, [script, updateScript, isInitialized]);

  // Le reste des callbacks et de la logique du composant est identique
  const currentPage = useMemo(() => script?.pages.find(page => page.id === currentPageId), [script?.pages, currentPageId]);
  const currentPageComponents = useMemo(() => script?.components.filter(comp => comp.pageId === currentPageId) || [], [script?.components, currentPageId]);
  const selectedComponent = useMemo(() => script?.components.find(c => c.id === selectedComponentId), [script?.components, selectedComponentId]);

  const handleSetScript = useCallback((newScriptState: Script | ((prevState: Script) => Script)) => {
      setScriptWithHistory(prev => {
          if (prev === null) return null; 
          if (typeof newScriptState === 'function') {
              return (newScriptState as (prevState: Script) => Script)(prev);
          }
          return newScriptState;
      });
  }, [setScriptWithHistory]);

    const addComponent = useCallback((type: string, config: ComponentConfig, size: {width: number, height: number}, position?: { x: number; y: number }) => {
        if (!currentPageId || !script) return '';
        const newComponent: Component = {
            id: generateId(), type, config, size, pageId: currentPageId,
            position: position || { x: 50, y: 50 },
        };
        handleSetScript(prev => ({ ...prev, components: [...prev.components, newComponent] }));
        setSelectedComponentId(newComponent.id);

        // Ouvre le panneau des propriétés à l'ajout
        setActivePanel('properties');

        return newComponent.id;
    }, [currentPageId, script, handleSetScript]);


    const updateComponent = useCallback((id: string, updates: Partial<Component>) => {
        if (!script) return;
        handleSetScript(prev => ({ ...prev, components: prev.components.map(c => c.id === id ? { ...c, ...updates } : c) }));
    }, [script, handleSetScript]);
  
  const removeComponent = useCallback((id: string) => {
    if (!script) return;
    handleSetScript(prev => ({ ...prev, components: prev.components.filter(c => c.id !== id) }));
    if (selectedComponentId === id) setSelectedComponentId(null);
  }, [script, selectedComponentId, handleSetScript]);

  const duplicateComponent = useCallback((id: string) => {
     if (!script) return;
     const componentToDuplicate = script.components.find(comp => comp.id === id);
     if (componentToDuplicate) {
         const newComponent: Component = {
             ...componentToDuplicate,
             id: generateId(),
             position: { x: componentToDuplicate.position.x + 20, y: componentToDuplicate.position.y + 20 }
         };
         handleSetScript(prev => ({ ...prev, components: [...prev.components, newComponent] }));
     }
  }, [script, handleSetScript]);

    const handleSelectComponent = (id: string | null) => {
        if (id !== selectedComponentId && inlineEditingId) {
            setInlineEditingId(null);
        }
        setSelectedComponentId(id);
    };

  if (isLoading || !script) {
    return <div className="flex items-center justify-center h-screen bg-slate-100 text-slate-600">Chargement de l'éditeur...</div>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen bg-slate-100 font-sans">
        <VerticalMenu activePanel={activePanel} setActivePanel={setActivePanel} />
        <SidePanel activePanel={activePanel}>
             {activePanel === 'components' && <ComponentPalette onAddComponent={addComponent} />}
             {activePanel === 'pages' && <PageManager script={script} setScript={handleSetScript} currentPageId={currentPageId || ''} setCurrentPageId={setCurrentPageId} />}
             {activePanel === 'workflows' && <WorkflowPanel script={script} setScript={handleSetScript} currentPageId={currentPageId || ''} />}
             {activePanel === 'variables' && <VariablesPanel script={script} setScript={handleSetScript} />}
             {activePanel === 'properties' && <PropertiesPanel selectedComponent={selectedComponent} onUpdateComponent={updateComponent} pages={script.pages} currentPageId={currentPageId || ''} />}
        </SidePanel>
        <main className="flex-1 flex flex-col overflow-hidden">
          <Toolbar script={script} onUpdateScript={(updates) => handleSetScript(prev => ({ ...prev, ...updates }))} onImportScript={() => {}} isPreviewMode={isPreviewMode} onTogglePreview={() => setIsPreviewMode(!isPreviewMode)} currentDevice={device} onDeviceChange={setDevice} undo={undo} redo={redo} canUndo={canUndo} canRedo={canRedo} />
          <div className="flex-1 overflow-auto relative">
            <Link to="/" className="absolute top-4 left-4 z-10 flex items-center space-x-2 px-3 py-1.5 bg-white rounded-full shadow-md hover:bg-slate-100 transition-colors">
                <ArrowLeft size={16} className="text-slate-600" />
                <span className="text-sm font-semibold text-slate-700">Retour</span>
            </Link>
            {isPreviewMode ? (
              <PreviewPane script={script} currentPageId={currentPageId || ''} device={device} onNavigateToPage={setCurrentPageId} />
            ) : (
              <Canvas 
                components={currentPageComponents} 
                onUpdateComponent={updateComponent} 
                onRemoveComponent={removeComponent} 
                onDuplicateComponent={duplicateComponent} 
                selectedComponentId={selectedComponentId} 
                onSelectComponent={handleSelectComponent} 
                device={device} 
                onAddComponent={addComponent} 
                currentPage={currentPage} 
                onUpdatePage={(updates) => handleSetScript(prev => ({ ...prev, pages: prev.pages.map(p => p.id === currentPageId ? {...p, ...updates} : p) }))}
                inlineEditingId={inlineEditingId}
                setInlineEditingId={setInlineEditingId}
              />
            )}
          </div>
        </main>
      </div>
    </DndProvider>
  );
};
