// chemin: vscript_call/src/components/Canvas/ComponentRenderer.tsx

import React from 'react';
import { useDrag } from 'react-dnd';
import { Trash2, Copy } from 'lucide-react';
import { Component } from '../../types';

interface ComponentRendererProps {
  component: Component;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (id: string, updates: Partial<Component>) => void;
  onRemove: (id: string) => void;
  onDuplicate: (id: string) => void;
  canvasWidth: number;
  canvasHeight: number;
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  component,
  isSelected,
  onSelect,
  onUpdate,
  onRemove,
  onDuplicate,
  canvasWidth,
  canvasHeight,
}) => {

  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    type: 'component',
    item: { type: 'component', id: component.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  // Le rendu du composant lui-même, simplifié pour la lisibilité
  const renderComponentContent = () => {
    const style = {
      ...component.config.style,
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: component.config.style?.textAlign === 'center' ? 'center' : 'flex-start',
      overflow: 'hidden',
    };

    switch (component.type) {
      case 'text':
        return <div style={style}>{component.config.text}</div>;
      case 'button':
        return <button style={style}>{component.config.text}</button>;
      case 'input':
        return <input type="text" placeholder={component.config.placeholder} style={style} readOnly />;
      default:
        return <div style={style}>Composant: {component.type}</div>;
    }
  };

  return (
    <div
      ref={dragPreview}
      style={{
        position: 'absolute',
        left: component.position.x,
        top: component.position.y,
        width: component.size.width,
        height: component.size.height,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isSelected ? 10 : 1,
      }}
      onMouseDown={handleMouseDown}
      className={`group transition-all duration-200 ${isSelected ? 'outline outline-2 outline-blue-500' : ''}`}
    >
      {/* Contenu du composant */}
      <div className="w-full h-full" ref={drag}>
        {renderComponentContent()}
      </div>

      {/* Superposition d'outils quand sélectionné */}
      {isSelected && (
        <>
          <div className="absolute -top-7 left-0 flex items-center space-x-1 bg-blue-600 text-white px-2 py-1 rounded text-xs z-20">
            <span>{component.type}</span>
            <button
              onClick={() => onDuplicate(component.id)}
              className="ml-2 hover:bg-blue-700 p-0.5 rounded"
              title="Dupliquer"
            >
              <Copy size={14} />
            </button>
            <button
              onClick={() => onRemove(component.id)}
              className="hover:bg-blue-700 p-0.5 rounded"
              title="Supprimer"
            >
              <Trash2 size={14} />
            </button>
          </div>
          {/* Poignées de redimensionnement (à implémenter) */}
        </>
      )}
    </div>
  );
};