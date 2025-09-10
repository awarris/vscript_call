// chemin: vscript_call/src/pages/ScriptEditor.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { useScriptsContext } from '../context/ScriptsContext';
import { useHistoryState } from '../hooks/useHistoryState';
import { Script, Component, ComponentConfig, ScriptPage } from '../types';
import { generateId } from '../utils/helpers';

import { VerticalMenu } from '../components/layout/VerticalMenu';
import { SidePanel } from '../components/layout/SidePanel';
import { Toolbar } from '../components/Toolbar/Toolbar';
import { Canvas } from '../components/Canvas/Canvas';
import { LayersPanel } from '../components/panels/LayersPanel';
import { PreviewPane } from '../components/PreviewPane/PreviewPane';

import { ComponentPalette } from '../components/panels/ComponentPalette';
import { PageManager } from '../components/panels/PageManager';
import { WorkflowPanel } from '../components/panels/WorkflowPanel';
import { VariablesPanel } from '../components/panels/VariablesPanel';
import { PropertiesPanel } from '../components/panels/PropertiesPanel';

// --- UTILS ---
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


export const ScriptEditor: React.FC = () => {
  const { scriptId } = useParams<{ scriptId: string }>();
  const navigate = useNavigate();
  const { getScript, updateScript } = useScriptsContext();

  const { state: script, setState: setScript, resetState, undo, redo, canUndo, canRedo } = useHistoryState<Script | null>(null);

  const [activePanel, setActivePanel] = useState('components');
  const [currentPageId, setCurrentPageId] = useState<string>('');
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [inlineEditingId, setInlineEditingId] = useState<string | null>(null);

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

  const renderPanelContent = () => {
    switch (activePanel) {
      case 'components': return <ComponentPalette onAddComponent={handleAddComponent} />;
      case 'pages': return <PageManager script={script} setScript={setScript} currentPageId={currentPageId} setCurrentPageId={setCurrentPageId} />;
      case 'workflows': return <WorkflowPanel script={script} setScript={setScript} currentPageId={currentPageId} />;
      case 'variables': return <VariablesPanel script={script} setScript={setScript} />;
      case 'properties': return <PropertiesPanel selectedComponent={selectedComponent} onUpdateComponent={handleUpdateComponent} pages={script.pages} currentPageId={currentPageId} />;
      default: return null;
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen w-screen flex flex-col bg-slate-100">
        <Toolbar script={script} onUpdateScript={handleUpdateScript} onImportScript={handleImportScript} isPreviewMode={isPreviewMode} onTogglePreview={() => setIsPreviewMode(!isPreviewMode)} currentDevice={device} onDeviceChange={setDevice} undo={undo} redo={redo} canUndo={canUndo} canRedo={canRedo} />
        <div className="flex-1 flex overflow-hidden">
          <VerticalMenu activePanel={activePanel} setActivePanel={setActivePanel} />
          <SidePanel activePanel={activePanel}>{renderPanelContent()}</SidePanel>
          {isPreviewMode ? (
            <PreviewPane script={script} currentPageId={currentPageId} device={device} onNavigateToPage={setCurrentPageId} />
          ) : (
            <>
              <Canvas
                components={componentsOnCurrentPage}
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
                allComponents={script.components}
              />
              <LayersPanel
                components={componentsOnCurrentPage}
                selectedComponentId={selectedComponentId}
                onSelectComponent={setSelectedComponentId}
                onRemoveComponent={handleRemoveComponent}
              />
            </>
          )}
        </div>
      </div>
    </DndProvider>
  );
};