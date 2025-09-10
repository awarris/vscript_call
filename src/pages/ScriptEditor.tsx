// chemin: vscript_call/src/pages/ScriptEditor.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { useScriptsContext } from '../context/ScriptsContext';
import { useHistoryState } from '../hooks/useHistoryState';
import { Script, Component, ComponentConfig, ScriptPage } from '../types';
import { generateId } from '../utils/helpers';

// Import des composants de l'interface
import { VerticalMenu } from '../components/layout/VerticalMenu';
import { SidePanel } from '../components/layout/SidePanel';
import { Toolbar } from '../components/Toolbar/Toolbar';
import { Canvas } from '../components/Canvas/Canvas';
import { LayersPanel } from '../components/panels/LayersPanel';
import { PreviewPane } from '../components/PreviewPane/PreviewPane';
import { ChatPanel } from '../components/layout/ChatPanel';

// Import des différents panneaux de la barre latérale
import { ComponentPalette } from '../components/panels/ComponentPalette';
import { PageManager } from '../components/panels/PageManager';
import { WorkflowPanel } from '../components/panels/WorkflowPanel';
import { VariablesPanel } from '../components/panels/VariablesPanel';
import { PropertiesPanel } from '../components/panels/PropertiesPanel';

// --- Fonctions Utilitaires ---
const isObject = (item: any): item is object => {
  return (item && typeof item === 'object' && !Array.isArray(item));
};

// Fonction pour fusionner des objets en profondeur (utile pour mettre à jour les configurations)
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


/**
 * Composant principal de l'éditeur de script.
 * C'est ici que toute la logique de l'éditeur est assemblée.
 */
export const ScriptEditor: React.FC = () => {
  const { scriptId } = useParams<{ scriptId: string }>();
  const navigate = useNavigate();
  const { getScript, updateScript } = useScriptsContext();

  // Hook pour gérer l'historique (undo/redo)
  const { state: script, setState: setScript, resetState, undo, redo, canUndo, canRedo } = useHistoryState<Script | null>(null);

  // États pour gérer l'interface
  const [activePanel, setActivePanel] = useState('components');
  const [currentPageId, setCurrentPageId] = useState<string>('');
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [inlineEditingId, setInlineEditingId] = useState<string | null>(null);

  // Nouveaux états pour la visibilité des panneaux et le thème
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Applique la classe 'dark' à l'élément racine du HTML lorsque le thème change
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Chargement du script au montage du composant
  useEffect(() => {
    if (scriptId) {
      const foundScript = getScript(scriptId);
      if (foundScript) {
        resetState(foundScript);
        const homePage = foundScript.pages.find(p => p.isHomePage) || foundScript.pages[0];
        if (homePage) {
          setCurrentPageId(homePage.id);
        }
      } else {
        navigate('/'); // Redirige si le script n'est pas trouvé
      }
    }
  }, [scriptId, getScript, navigate, resetState]);

  // Sauvegarde automatique du script à chaque modification
  useEffect(() => {
    if (script && scriptId) {
      updateScript(scriptId, script);
    }
  }, [script, scriptId, updateScript]);

  // Fonction pour mettre à jour une partie du script
  const handleUpdateScript = (updates: Partial<Script>) => {
    setScript(prev => prev ? { ...prev, ...updates } : null);
  };

  // Récupération des données de la page et des composants courants
  const currentPage = script?.pages.find(p => p.id === currentPageId);
  const componentsOnCurrentPage = script?.components.filter(c => c.pageId === currentPageId) || [];
  const selectedComponent = script?.components.find(c => c.id === selectedComponentId) || null;

  // Ajout d'un composant sur le canevas
  const handleAddComponent = (type: string, config: ComponentConfig, size: {width: number, height: number}, position?: { x: number; y: number }, parentId?: string): string => {
    const newComponent: Component = {
      id: generateId(), type, config, position: position || { x: 50, y: 50 },
      size, pageId: currentPageId, parentId,
    };
    setScript(prev => prev ? { ...prev, components: [...prev.components, newComponent] } : null);
    setSelectedComponentId(newComponent.id);
    setActivePanel('properties'); // OUVRE AUTOMATIQUEMENT LE PANNEAU PROPRIÉTÉS
    return newComponent.id;
  };
  
  // Mise à jour d'un composant existant
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

  // Mise à jour de la position d'un composant après un glisser-déposer
  const handleUpdateComponentPosition = useCallback((id: string, delta: { x: number; y: number }) => {
    setScript(prev => {
        if (!prev) return null;
        
        const allComponents = prev.components;
        const draggedComponent = allComponents.find(c => c.id === id);
        if (!draggedComponent || draggedComponent.parentId) return prev;

        const updatedComponents = allComponents.map(c => {
            if (c.id === id) {
                return { ...c, position: { x: c.position.x + delta.x, y: c.position.y + delta.y } };
            }
            return c;
        });

        return { ...prev, components: updatedComponents };
    });
  }, [setScript]);

  // Suppression d'un composant (et de ses enfants)
  const handleRemoveComponent = (id: string) => {
    if (!script) return;

    const idsToRemove = new Set<string>([id]);
    let changed = true;
    while (changed) {
        changed = false;
        script.components.forEach(c => {
            if (c.parentId && idsToRemove.has(c.parentId) && !idsToRemove.has(c.id)) {
                idsToRemove.add(c.id);
                changed = true;
            }
        });
    }

    setScript(prev => {
        if (!prev) return null;
        return {
            ...prev,
            components: prev.components.filter(c => !idsToRemove.has(c.id)),
        };
    });

    if (selectedComponentId && idsToRemove.has(selectedComponentId)) {
        setSelectedComponentId(null);
    }
  };

  // Duplication d'un composant
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

  // Mise à jour des propriétés de la page courante
  const handleUpdatePage = (updates: Partial<ScriptPage>) => {
    setScript(prev => prev ? {
      ...prev,
      pages: prev.pages.map(p => p.id === currentPageId ? { ...p, ...updates } : p)
    } : null);
  };

  // Importation d'un script depuis un fichier JSON
  const handleImportScript = (importedScript: Script) => {
    resetState(importedScript);
    const homePage = importedScript.pages.find(p => p.isHomePage) || importedScript.pages[0];
    setCurrentPageId(homePage?.id || '');
  };

  if (!script) {
    return <div>Chargement du script...</div>;
  }

  // Affiche le contenu du panneau latéral en fonction de l'onglet actif
  const renderPanelContent = () => {
    switch (activePanel) {
      case 'components': return <ComponentPalette onAddComponent={handleAddComponent} />;
      case 'pages': return <PageManager script={script} setScript={setScript} currentPageId={currentPageId} setCurrentPageId={setCurrentPageId} />;
      case 'workflows': return <WorkflowPanel script={script} setScript={setScript} currentPageId={currentPageId} />;
      case 'variables': return <VariablesPanel script={script} setScript={setScript} />;
      case 'properties': return <PropertiesPanel selectedComponent={selectedComponent} onUpdateComponent={handleUpdateComponent} pages={script.pages} currentPageId={currentPageId} script={script} setActivePanel={setActivePanel} componentsOnPage={componentsOnCurrentPage} />;
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
          currentDevice={device}
          onDeviceChange={setDevice}
          undo={undo}
          redo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
          onToggleChat={() => setIsChatOpen(!isChatOpen)}
          onToggleRightPanels={() => setIsRightPanelOpen(!isRightPanelOpen)}
          theme={theme}
          setTheme={setTheme}
        />
        <div className="flex-1 flex overflow-hidden">
          <ChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} script={script} />

          <div className="flex-1 flex flex-col overflow-hidden">
            {isPreviewMode ? (
              <PreviewPane script={script} currentPageId={currentPageId} device={device} onNavigateToPage={setCurrentPageId} />
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
                    device={device}
                    onAddComponent={handleAddComponent}
                    currentPage={currentPage}
                    onUpdatePage={handleUpdatePage}
                    inlineEditingId={inlineEditingId}
                    setInlineEditingId={setInlineEditingId}
                    theme={theme}
                  />
                  {isRightPanelOpen && (
                    <div className="flex-shrink-0 flex animate-slide-in-from-right">
                       <VerticalMenu activePanel={activePanel} setActivePanel={setActivePanel} />
                       <SidePanel activePanel={activePanel}>{renderPanelContent()}</SidePanel>
                       <LayersPanel
                          components={componentsOnCurrentPage}
                          allComponents={script.components}
                          selectedComponentId={selectedComponentId}
                          onSelectComponent={setSelectedComponentId}
                          onRemoveComponent={handleRemoveComponent}
                        />
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};