// chemin: vscript_call/src/App.tsx

import React, { useState, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Nouveaux composants de layout
import { VerticalMenu } from './components/layout/VerticalMenu';
import { SidePanel } from './components/layout/SidePanel';
import { Toolbar } from './components/Toolbar/Toolbar';
import { Canvas } from './components/Canvas/Canvas';
import { PreviewPane } from './components/PreviewPane/PreviewPane';
import { PageManager } from './components/panels/PageManager';
import { ComponentPalette } from './components/panels/ComponentPalette';
import { PropertiesPanel } from './components/panels/PropertiesPanel';
import { WorkflowPanel } from './components/panels/WorkflowPanel';
import { VariablesPanel } from './components/panels/VariablesPanel';

import { Component, WorkflowRule, GlobalVariable, ScriptPage, Script } from './types';
import { generateId, importScriptFromJSON } from './utils/helpers';
import { useHistoryState } from './hooks/useHistoryState';

// État initial pour un nouveau script
const createInitialScript = (): Script => ({
  id: generateId(),
  name: 'Nouveau Script',
  description: 'Description de votre script',
  pages: [
    {
      id: 'home-page',
      name: 'Page d\'accueil',
      description: 'La première page de votre script',
      isHomePage: true,
      backgroundColor: '#f8fafc',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
  ],
  components: [],
  workflowRules: [],
  globalVariables: [],
  settings: {
    theme: 'light',
    primaryColor: '#3B82F6',
    secondaryColor: '#14B8A6',
    fontFamily: 'Inter, sans-serif'
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

function App() {
  // Hook d'état avec gestion de l'historique (undo/redo)
  const {
    state: script,
    setState: setScript,
    resetState: resetScript,
    undo,
    redo,
    canUndo,
    canRedo
  } = useHistoryState<Script>(createInitialScript());
  
  // États locaux pour la gestion de l'interface de l'éditeur
  const [currentPageId, setCurrentPageId] = useState<string>('home-page');
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [activePanel, setActivePanel] = useState<string>('components'); // 'components', 'pages', etc.

  // Données dérivées de l'état principal
  const currentPage = script.pages.find(page => page.id === currentPageId);
  const currentPageComponents = script.components.filter(comp => comp.pageId === currentPageId);
  const selectedComponent = script.components.find(c => c.id === selectedComponentId);

  // --- Fonctions de manipulation du Script ---

  // Met à jour le script complet (utilisé pour l'importation)
  const handleUpdateScript = useCallback((newScript: Script) => {
    resetScript(newScript); // Réinitialise l'historique avec le nouveau script
    const homePage = newScript.pages.find(p => p.isHomePage) || newScript.pages[0];
    if (homePage) {
      setCurrentPageId(homePage.id);
    }
  }, [resetScript]);

  // Met à jour des propriétés spécifiques du script (ex: nom)
  const updateScriptDetails = useCallback((updates: Partial<Script>) => {
    setScript(prev => ({ ...prev, ...updates, updatedAt: new Date().toISOString() }));
  }, [setScript]);

  // --- Gestion des Pages ---
  const addPage = useCallback((name: string, description?: string) => {
    const newPage: ScriptPage = {
      id: generateId(),
      name,
      description,
      isHomePage: script.pages.length === 0,
      backgroundColor: '#ffffff',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setScript(prev => ({ ...prev, pages: [...prev.pages, newPage] }));
    setCurrentPageId(newPage.id);
  }, [setScript, script.pages.length]);
  
  // ... (les fonctions updatePage et removePage sont déplacées dans le composant PageManager pour la simplicité)

  // --- Gestion des Composants ---
  const addComponent = useCallback((type: string, config: any, size: any, position?: { x: number; y: number }) => {
    const newComponent: Component = {
      id: generateId(),
      type,
      config,
      position: position || { x: 50, y: 50 },
      size,
      pageId: currentPageId
    };
    setScript(prev => ({ ...prev, components: [...prev.components, newComponent] }));
    setSelectedComponentId(newComponent.id); // Sélectionne le nouveau composant
    return newComponent.id;
  }, [currentPageId, setScript]);

  const updateComponent = useCallback((id: string, updates: Partial<Component>) => {
    setScript(prev => ({
      ...prev,
      components: prev.components.map(comp => comp.id === id ? { ...comp, ...updates } : comp)
    }));
  }, [setScript]);

  const removeComponent = useCallback((id: string) => {
    setScript(prev => ({
      ...prev,
      components: prev.components.filter(comp => comp.id !== id)
    }));
    if (selectedComponentId === id) {
      setSelectedComponentId(null);
    }
  }, [selectedComponentId, setScript]);

  const duplicateComponent = useCallback((id: string) => {
    const componentToDuplicate = script.components.find(comp => comp.id === id);
    if (componentToDuplicate) {
      const newComponent: Component = {
        ...componentToDuplicate,
        id: generateId(),
        position: {
          x: componentToDuplicate.position.x + 20,
          y: componentToDuplicate.position.y + 20
        }
      };
      setScript(prev => ({ ...prev, components: [...prev.components, newComponent] }));
    }
  }, [script.components, setScript]);
  
  const handleNavigateToPage = useCallback((pageId: string) => {
    if (script.pages.find(page => page.id === pageId)) {
        setCurrentPageId(pageId);
        setSelectedComponentId(null);
    }
  }, [script.pages]);


  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen bg-slate-100 font-sans">
        
        {/* Nouveau Menu Vertical */}
        <VerticalMenu activePanel={activePanel} setActivePanel={setActivePanel} />

        {/* Nouveau Panneau Latéral Dynamique */}
        <SidePanel activePanel={activePanel}>
          {activePanel === 'components' && <ComponentPalette onAddComponent={addComponent} />}
          {activePanel === 'pages' && (
            <PageManager
              script={script}
              setScript={setScript}
              currentPageId={currentPageId}
              setCurrentPageId={setCurrentPageId}
            />
           )}
          {activePanel === 'workflows' && <WorkflowPanel />}
          {activePanel === 'variables' && <VariablesPanel />}
          {activePanel === 'properties' && (
            <PropertiesPanel
                selectedComponent={selectedComponent}
                onUpdateComponent={updateComponent}
                pages={script.pages}
                currentPageId={currentPageId}
            />
           )}
        </SidePanel>

        {/* Zone principale de contenu */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <Toolbar
            script={script}
            onUpdateScript={updateScriptDetails}
            onImportScript={handleUpdateScript}
            isPreviewMode={isPreviewMode}
            onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
            currentDevice={device}
            onDeviceChange={setDevice}
            undo={undo}
            redo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
          />
          <div className="flex-1 overflow-auto">
            {isPreviewMode ? (
              <PreviewPane
                script={script}
                currentPageId={currentPageId}
                device={device}
                onNavigateToPage={handleNavigateToPage}
              />
            ) : (
              <Canvas
                components={currentPageComponents}
                onUpdateComponent={updateComponent}
                onRemoveComponent={removeComponent}
                onDuplicateComponent={duplicateComponent}
                selectedComponentId={selectedComponentId}
                onSelectComponent={setSelectedComponentId}
                device={device}
                onAddComponent={addComponent}
                currentPage={currentPage}
                onUpdatePage={(updates) => {
                  // Mettre à jour la page via setScript
                }}
              />
            )}
          </div>
        </main>
      </div>
    </DndProvider>
  );
}

export default App;