// chemin: vscript_call/src/components/Canvas/Canvas.tsx

import React, { useRef, useCallback } from 'react';
import { useDrop } from 'react-dnd';
import { Component, ScriptPage, DragItem, ComponentConfig } from '../../types';
import { ComponentRenderer } from './ComponentRenderer';
import { getDeviceWidth, snapToGrid, validateComponentPosition } from '../../utils/helpers';
import { Grid, Plus, Palette } from 'lucide-react';

interface CanvasProps {
  components: Component[];
  onUpdateComponent: (id: string, updates: Partial<Component>) => void;
  onRemoveComponent: (id: string) => void;
  onDuplicateComponent: (id: string) => void;
  selectedComponentId: string | null;
  onSelectComponent: (id: string | null) => void;
  device: 'mobile' | 'tablet' | 'desktop';
  onAddComponent: (type: string, config: ComponentConfig, size: {width: number, height: number}, position?: { x: number; y: number }) => string;
  currentPage?: ScriptPage;
  onUpdatePage: (updates: Partial<ScriptPage>) => void;
  inlineEditingId: string | null;
  setInlineEditingId: (id: string | null) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  components,
  onUpdateComponent,
  onRemoveComponent,
  onDuplicateComponent,
  selectedComponentId,
  onSelectComponent,
  device,
  onAddComponent,
  currentPage,
  onUpdatePage,
  inlineEditingId,
  setInlineEditingId,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const canvasWidth = getDeviceWidth(device);
  const canvasHeight = 800; // Hauteur fixe pour le moment

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['component', 'new-component'],
    drop: (item: DragItem, monitor) => {
      if (monitor.didDrop()) return;

      const delta = monitor.getDifferenceFromInitialOffset();
      const clientOffset = monitor.getClientOffset();
      const canvasRect = canvasRef.current?.getBoundingClientRect();

      if (!delta || !clientOffset || !canvasRect) return;

      if (item.type === 'new-component' && item.componentType && item.config && item.size) {
        // Ajout d'un nouveau composant
        const x = clientOffset.x - canvasRect.left;
        const y = clientOffset.y - canvasRect.top;
        const snappedPosition = { x: snapToGrid(x), y: snapToGrid(y) };
        onAddComponent(item.componentType, item.config, item.size, snappedPosition);
      } else if (item.type === 'component' && item.id) {
        // Déplacement d'un composant existant
        const originalComponent = components.find(c => c.id === item.id);
        if (originalComponent) {
            const newPosition = {
                x: originalComponent.position.x + delta.x,
                y: originalComponent.position.y + delta.y,
            };
            const snappedPosition = { x: snapToGrid(newPosition.x), y: snapToGrid(newPosition.y) };
            const validatedPosition = validateComponentPosition(snappedPosition, originalComponent.size, { width: canvasWidth, height: canvasHeight });
            onUpdateComponent(item.id, { position: validatedPosition });
        }
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver({ shallow: true }),
    }),
  }));

  // Gestion du clic sur le canevas pour désélectionner
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onSelectComponent(null);
      setInlineEditingId(null);
    }
  };

  // Gestion des raccourcis clavier
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (selectedComponentId) {
      const component = components.find(c => c.id === selectedComponentId);
      if (!component) return;

      const step = e.shiftKey ? 1 : 10;
      let newPosition = { ...component.position };

      switch (e.key) {
        case 'ArrowUp':
          newPosition.y -= step;
          break;
        case 'ArrowDown':
          newPosition.y += step;
          break;
        case 'ArrowLeft':
          newPosition.x -= step;
          break;
        case 'ArrowRight':
          newPosition.x += step;
          break;
        case 'Delete':
        case 'Backspace':
          e.preventDefault();
          onRemoveComponent(selectedComponentId);
          return; // Sortir pour ne pas mettre à jour la position
        case 'd':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            onDuplicateComponent(selectedComponentId);
          }
          return;
      }
      
      // Mettre à jour la position seulement si une flèche a été pressée
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        const validatedPosition = validateComponentPosition(newPosition, component.size, { width: canvasWidth, height: canvasHeight });
        onUpdateComponent(selectedComponentId, { position: validatedPosition });
      }
    }
  }, [selectedComponentId, components, onUpdateComponent, onRemoveComponent, onDuplicateComponent, canvasWidth, canvasHeight]);

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="flex-1 bg-slate-100 p-8 overflow-auto">
      <div className="flex justify-center">
        <div
          ref={(node) => {
            canvasRef.current = node;
            drop(node);
          }}
          className={`bg-white rounded-lg shadow-lg border-2 transition-all duration-300 relative overflow-hidden ${
            isOver ? 'border-blue-400' : 'border-transparent'
          }`}
          style={{
            width: canvasWidth,
            height: canvasHeight,
            backgroundColor: currentPage?.backgroundColor || '#ffffff',
          }}
          onClick={handleCanvasClick}
        >
          {/* Grille de fond */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)`,
              backgroundSize: '20px 20px'
            }}
          />

          {/* Composants rendus */}
          {components.map(component => (
            <ComponentRenderer
              key={component.id}
              component={component}
              isSelected={selectedComponentId === component.id}
              onSelect={() => onSelectComponent(component.id)}
              onUpdate={onUpdateComponent}
              onRemove={onRemoveComponent}
              onDuplicate={onDuplicateComponent}
              inlineEditingId={inlineEditingId}
              setInlineEditingId={setInlineEditingId}
            />
          ))}

          {/* État vide */}
          {components.length === 0 && !isOver && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center text-slate-400">
                <div className="w-24 h-24 mx-auto mb-4 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center">
                  <Plus size={32} />
                </div>
                <p className="font-semibold">Commencez à créer</p>
                <p className="text-sm">Glissez des composants depuis la barre latérale.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
