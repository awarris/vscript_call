// chemin: src/components/Canvas/ComponentRenderer.tsx

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
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  component, isSelected, onSelect, onRemove, onDuplicate
}) => {
  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    type: 'component',
    item: { type: 'component', id: component.id },
    collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
  }));

  /**
   * Moteur de rendu des composants pour l'éditeur.
   * Il affiche une version non-interactive des composants.
   */
  const renderComponentContent = () => {
    const style = {
        width: '100%', height: '100%',
        ...component.config.style,
        // On s'assure que le contenu ne déborde pas
        overflow: 'hidden',
        boxSizing: 'border-box' as const,
    };

    switch (component.type) {
      case 'paragraphe':
      case 'h1':
        return <div style={style}>{component.config.value}</div>;
      
      case 'button':
        return <button style={style}>{component.config.value}</button>;
      
      case 'input':
      case 'inputDate':
      case 'inputTime':
        return <input {...component.config.attributes} style={style} readOnly />;
      
      case 'textarea':
        return <textarea {...component.config.attributes} style={style} readOnly />;
      
      case 'image':
        return <img src={component.config.src} alt={component.config.alt} style={style} />;
      
      case 'iframe':
        // On affiche un placeholder dans l'éditeur pour éviter les problèmes de sécurité/performance
        return <div style={{...style, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e2e8f0' }}>Iframe Content</div>;

      case 'select':
        return (
            <select style={style} disabled>
                {(component.config.options || []).map((opt: any, index: number) => (
                    <option key={index} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        );

      case 'checkbox':
        return <div style={style}><input type="checkbox" checked={component.config.checked} readOnly /> <label>{component.config.label}</label></div>;

      case 'divPannel':
      case 'ficheClient':
        return <div style={style}>{/* Conteneur vide */}</div>;

      default:
        return <div style={{...style, border: '1px dashed red'}}>Composant inconnu: {component.type}</div>;
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
      onMouseDown={(e) => { e.stopPropagation(); onSelect(); }}
      className={`group transition-all duration-200 ${isSelected ? 'outline outline-2 outline-offset-2 outline-blue-500' : ''}`}
    >
      <div className="w-full h-full" ref={drag}>
        {renderComponentContent()}
      </div>

      {isSelected && (
        <div className="absolute -top-7 left-0 flex items-center space-x-1 bg-blue-600 text-white px-2 py-1 rounded text-xs z-20">
          <span>{component.type}</span>
          <button onClick={() => onDuplicate(component.id)} className="ml-2 hover:bg-blue-700 p-0.5 rounded" title="Dupliquer"><Copy size={14} /></button>
          <button onClick={() => onRemove(component.id)} className="hover:bg-blue-700 p-0.5 rounded" title="Supprimer"><Trash2 size={14} /></button>
        </div>
      )}
    </div>
  );
};