// chemin: vscript_call/src/components/Canvas/Canvas.tsx

import React, { useRef, useCallback } from 'react';
import { useDrop } from 'react-dnd';
import { Component, ScriptPage, DragItem, ComponentConfig } from '../../types';
import { ComponentRenderer } from './ComponentRenderer';
import { getDeviceWidth, snapToGrid } from '../../utils/helpers';
import { Plus } from 'lucide-react';

interface CanvasProps {
  components: Component[];
  allComponents: Component[]; // <<<--- CORRECTION ICI
  onUpdateComponent: (id: string, updates: Partial<Component>) => void;
  onUpdateComponentPosition: (id: string, delta: { x: number; y: number }) => void;
  onRemoveComponent: (id: string) => void;
  onDuplicateComponent: (id: string) => void;
  selectedComponentId: string | null;
  onSelectComponent: (id: string | null) => void;
  device: 'mobile' | 'tablet' | 'desktop';
  onAddComponent: (type: string, config: ComponentConfig, size: {width: number, height: number}, position?: { x: number; y: number }, parentId?: string) => string;
  currentPage?: ScriptPage;
  onUpdatePage: (updates: Partial<ScriptPage>) => void;
  inlineEditingId: string | null;
  setInlineEditingId: (id: string | null) => void;
}

export const Canvas: React.FC<CanvasProps> = (props) => {
  const { components, onUpdateComponent, onUpdateComponentPosition, selectedComponentId, onSelectComponent, onAddComponent } = props;
  const canvasRef = useRef<HTMLDivElement>(null);
  const canvasWidth = getDeviceWidth(props.device);

  const findHoveredContainer = (x: number, y: number, draggedItemId?: string): string | undefined => {
    let bestMatch: Component | undefined;
    for (const component of components) {
      if (component.type === 'container' && component.id !== draggedItemId) {
        const { position, size } = component;
        if (x >= position.x && x <= position.x + size.width && y >= position.y && y <= position.y + size.height) {
          if (!bestMatch || (size.width * size.height < bestMatch.size.width * bestMatch.size.height)) {
            bestMatch = component;
          }
        }
      }
    }
    return bestMatch?.id;
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['component', 'new-component'],
    drop: (item: DragItem, monitor) => {
      if (monitor.didDrop()) return;
      const delta = monitor.getDifferenceFromInitialOffset();
      const clientOffset = monitor.getClientOffset();
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (!delta || !clientOffset || !canvasRect) return;

      const dropX = clientOffset.x - canvasRect.left;
      const dropY = clientOffset.y - canvasRect.top;
      const hoveredContainerId = findHoveredContainer(dropX, dropY, item.id);
      const container = hoveredContainerId ? components.find(c => c.id === hoveredContainerId) : null;

      if (item.type === 'new-component' && item.componentType && item.config && item.size) {
        let x = dropX;
        let y = dropY;
        if (container) {
          x -= container.position.x;
          y -= container.position.y;
        }
        onAddComponent(item.componentType, item.config, item.size, { x: snapToGrid(x), y: snapToGrid(y) }, hoveredContainerId);
      } else if (item.type === 'component' && item.id) {
        const originalComponent = components.find(c => c.id === item.id);
        if (!originalComponent) return;

        let newPosition = { x: originalComponent.position.x + delta.x, y: originalComponent.position.y + delta.y };
        if (originalComponent.parentId) {
            const parent = components.find(c => c.id === originalComponent.parentId);
            if (parent) {
                newPosition = { x: parent.position.x + originalComponent.position.x + delta.x, y: parent.position.y + originalComponent.position.y + delta.y };
            }
        }

        if (container) {
            newPosition.x -= container.position.x;
            newPosition.y -= container.position.y;
        }
        
        onUpdateComponent(item.id, { position: { x: snapToGrid(newPosition.x), y: snapToGrid(newPosition.y) }, parentId: hoveredContainerId || undefined });
      }
    },
    collect: (monitor) => ({ isOver: !!monitor.isOver({ shallow: true }) }),
  }));

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onSelectComponent(null);
  };

  const rootComponents = components.filter(c => !c.parentId);

  return (
    <div className="flex-1 bg-slate-100 p-8 overflow-auto">
      <div className="flex justify-center">
        <div ref={(node) => { canvasRef.current = node; drop(node); }}
          className={`bg-white rounded-lg shadow-lg relative overflow-hidden ${isOver ? 'outline outline-2 outline-blue-400' : ''}`}
          style={{ width: canvasWidth, height: 800, backgroundColor: props.currentPage?.backgroundColor || '#ffffff' }}
          onClick={handleCanvasClick}>
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />
          {rootComponents.map(component => <ComponentRenderer key={component.id} {...props} component={component} onUpdateComponentPosition={onUpdateComponentPosition} selectedComponentId={selectedComponentId} onSelectComponent={onSelectComponent} />)}
          {components.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-center text-slate-400">
              <div>
                <div className="w-24 h-24 mx-auto mb-4 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center"><Plus size={32} /></div>
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