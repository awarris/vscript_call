// chemin: vscript_call/src/components/Canvas/Canvas.tsx

import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { Component, ScriptPage, DragItem, ComponentConfig } from '../../types';
import { ComponentRenderer } from './ComponentRenderer';
import { snapToGrid, validateComponentPosition } from '../../utils/helpers';
import { Plus } from 'lucide-react';

interface CanvasProps {
  components: Component[];
  allComponents: Component[];
  onUpdateComponent: (id: string, updates: Partial<Component>) => void;
  onUpdateComponentPosition: (id: string, delta: { x: number; y: number }) => void;
  onRemoveComponent: (id: string) => void;
  onDuplicateComponent: (id: string) => void;
  selectedComponentId: string | null;
  onSelectComponent: (id: string | null) => void;
  onAddComponent: (type: string, config: ComponentConfig, size: {width: number, height: number}, position?: { x: number; y: number }, parentId?: string) => string;
  currentPage?: ScriptPage;
  onUpdatePage: (updates: Partial<ScriptPage>) => void;
  inlineEditingId: string | null;
  setInlineEditingId: (id: string | null) => void;
  theme: 'light' | 'dark';
}

export const Canvas: React.FC<CanvasProps> = (props) => {
  const { components, onAddComponent, theme } = props;
  const canvasRef = useRef<HTMLDivElement>(null);
  const canvasWidth = 1200; // Largeur fixe
  const canvasHeight = 800;

  const canvasBackgroundColor = theme === 'dark' ? '#111827' : (props.currentPage?.backgroundColor || '#ffffff');

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['component', 'new-component'],
    drop: (item: DragItem, monitor) => {
      if (monitor.didDrop()) return;
      const clientOffset = monitor.getClientOffset();
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (!clientOffset || !canvasRect) return;
      
      const dropX = clientOffset.x - canvasRect.left;
      const dropY = clientOffset.y - canvasRect.top;
      
      if (item.type === 'new-component' && item.componentType && item.config && item.size) {
        const validatedPosition = validateComponentPosition(
            { x: snapToGrid(dropX), y: snapToGrid(dropY) },
            item.size,
            { width: canvasWidth, height: canvasHeight }
        );
        onAddComponent(item.componentType, item.config, item.size, validatedPosition);
      }
    },
    collect: (monitor) => ({ isOver: !!monitor.isOver({ shallow: true }) }),
  }));

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) props.onSelectComponent(null);
  };

  const rootComponents = components.filter(c => !c.parentId);

  return (
    <div className="flex-1 bg-gray-vs-100 dark:bg-gray-vs-900 p-8 overflow-auto flex justify-center items-start">
      <div
        ref={(node) => { canvasRef.current = node; drop(node); }}
        className={`rounded-lg shadow-lg relative overflow-hidden transition-colors ${isOver ? 'outline outline-2 outline-blue-400' : ''}`}
        style={{ width: canvasWidth, height: canvasHeight, backgroundColor: canvasBackgroundColor }}
        onClick={handleCanvasClick}
      >
        <div 
          className="absolute inset-0 pointer-events-none" 
          style={{ 
            backgroundImage: `
              linear-gradient(to right, ${theme === 'dark' ? 'rgba(255,255,255,0.05)' : '#e2e8f0'} 1px, transparent 1px), 
              linear-gradient(to bottom, ${theme === 'dark' ? 'rgba(255,255,255,0.05)' : '#e2e8f0'} 1px, transparent 1px)
            `, 
            backgroundSize: '20px 20px' 
          }} 
        />
        
        {rootComponents.map(component => 
          <ComponentRenderer 
            key={component.id} 
            {...props} 
            component={component} 
            canvasSize={{ width: canvasWidth, height: canvasHeight }}
          />
        )}
        
        {components.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-center text-slate-400 dark:text-gray-vs-500">
            <div>
              <div className="w-24 h-24 mx-auto mb-4 border-2 border-dashed border-slate-300 dark:border-gray-vs-600 rounded-lg flex items-center justify-center"><Plus size={32} /></div>
              <p className="font-semibold">Commencez à créer</p>
              <p className="text-sm">Glissez des composants depuis la barre latérale.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};