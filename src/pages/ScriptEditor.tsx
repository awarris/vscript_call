// chemin: vscript_call/src/pages/ScriptEditor.tsx

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useParams, useNavigate } from 'react-router-dom';
import { useScripts } from '../hooks/useScripts';
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

/**
 * Page principale de l'éditeur de script.
 * Gère l'état du script actif, l'historique, et la disposition de l'interface.
 */
export const ScriptEditor: React.FC = () => {
  const { scriptId } = useParams<{ scriptId: string }>();
  const navigate = useNavigate();
  const { getScript, updateScript } = useScripts();

  const {
    state: script,
    setState: setScriptWithHistory,
    resetState,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useHistoryState<Script | null>(null); // L'état peut être `null` au début

  // États locaux de l'interface de l'éditeur
  const [currentPageId, setCurrentPageId] = useState<string | null>(null);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [activePanel, setActivePanel] = useState<string>('pages');

  // Chargement et initialisation du script
  useEffect(() => {
    const loadedScript = getScript(scriptId || '');
    if (loadedScript) {
      resetState(loadedScript);
      const homePage = loadedScript.pages.find(p => p.isHomePage) || loadedScript.pages[0];
      setCurrentPageId(homePage?.id || null);
    } else {
      navigate('/');
    }
  }, [scriptId, getScript, resetState, navigate]);

  // Sauvegarde automatique du script
  useEffect(() => {
    if (script) {
      updateScript(script.id, script);
    }
  }, [script, updateScript]);

  // Données dérivées (calculées à partir de l'état)
  const currentPage = useMemo(() => script?.pages.find(page => page.id === currentPageId), [script?.pages, currentPageId]);
  const currentPageComponents = useMemo(() => script?.components.filter(comp => comp.pageId === currentPageId) || [], [script?.components, currentPageId]);
  const selectedComponent = useMemo(() => script?.components.find(c => c.id === selectedComponentId), [script?.components, selectedComponentId]);

  // --- CORRECTION : Création d'un callback avec le bon type ---
  // Cette fonction garantit que nous ne passons jamais `null` à setScriptWithHistory,
  // et elle a le type que les composants enfants attendent.
  const handleSetScript = useCallback((newScriptState: Script | ((prevState: Script) => Script)) => {
      setScriptWithHistory(prev => {
          // On s'assure que prev n'est pas null avant d'appeler la fonction de mise à jour
          if (prev === null) return null; 
          
          if (typeof newScriptState === 'function') {
              return (newScriptState as (prevState: Script) => Script)(prev);
          }
          return newScriptState;
      });
  }, [setScriptWithHistory]);


  // --- Callbacks de modification de l'état (passées aux composants enfants) ---
  const addComponent = useCallback((type: string, config: ComponentConfig, size: {width: number, height: number}, position?: { x: number; y: number }) => {
    if (!currentPageId || !script) return '';
    const newComponent: Component = {
      id: generateId(), type, config, size, pageId: currentPageId,
      position: position || { x: 50, y: 50 },
    };
    handleSetScript({ ...script, components: [...script.components, newComponent] });
    setSelectedComponentId(newComponent.id);
    return newComponent.id;
  }, [currentPageId, script, handleSetScript]);

  const updateComponent = useCallback((id: string, updates: Partial<Component>) => {
    if (!script) return;
    handleSetScript({ ...script, components: script.components.map(c => c.id === id ? { ...c, ...updates } : c) });
  }, [script, handleSetScript]);
  
  const removeComponent = useCallback((id: string) => {
    if (!script) return;
    handleSetScript({ ...script, components: script.components.filter(c => c.id !== id) });
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
         handleSetScript({ ...script, components: [...script.components, newComponent] });
     }
  }, [script, handleSetScript]);

  // --- CORRECTION : Gardien pour l'état null ---
  // Si le script n'est pas encore chargé, on affiche un message.
  // Tout le code en dessous de cette ligne est maintenant sûr de tourner avec un objet `script` valide.
  if (!script) {
    return <div className="flex items-center justify-center h-screen">Chargement de l'éditeur...</div>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen bg-slate-100 font-sans">
        <VerticalMenu activePanel={activePanel} setActivePanel={setActivePanel} />
        <SidePanel activePanel={activePanel}>
             {activePanel === 'components' && <ComponentPalette onAddComponent={addComponent} />}
             {/* On passe handleSetScript qui a maintenant le bon type */}
             {activePanel === 'pages' && <PageManager script={script} setScript={handleSetScript} currentPageId={currentPageId || ''} setCurrentPageId={setCurrentPageId} />}
             {activePanel === 'workflows' && <WorkflowPanel script={script} setScript={handleSetScript} currentPageId={currentPageId || ''} />}
             {activePanel === 'variables' && <VariablesPanel script={script} setScript={handleSetScript} />}
             {activePanel === 'properties' && <PropertiesPanel selectedComponent={selectedComponent} onUpdateComponent={updateComponent} pages={script.pages} currentPageId={currentPageId || ''} />}
        </SidePanel>
        <main className="flex-1 flex flex-col overflow-hidden">
          <Toolbar script={script} onUpdateScript={(updates) => handleSetScript({ ...script, ...updates })} onImportScript={() => {}} isPreviewMode={isPreviewMode} onTogglePreview={() => setIsPreviewMode(!isPreviewMode)} currentDevice={device} onDeviceChange={setDevice} undo={undo} redo={redo} canUndo={canUndo} canRedo={canRedo} />
          <div className="flex-1 overflow-auto">
            {isPreviewMode ? (
              <PreviewPane script={script} currentPageId={currentPageId || ''} device={device} onNavigateToPage={setCurrentPageId} />
            ) : (
              <Canvas components={currentPageComponents} onUpdateComponent={updateComponent} onRemoveComponent={removeComponent} onDuplicateComponent={duplicateComponent} selectedComponentId={selectedComponentId} onSelectComponent={setSelectedComponentId} device={device} onAddComponent={addComponent} currentPage={currentPage} onUpdatePage={(updates) => handleSetScript({ ...script, pages: script.pages.map(p => p.id === currentPageId ? {...p, ...updates} : p) })} />
            )}
          </div>
        </main>
      </div>
    </DndProvider>
  );
};