// chemin: src/components/Canvas/ComponentRenderer.tsx

import React from 'react';
import { motion } from 'framer-motion';
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
  component, isSelected, onSelect, onUpdate, onRemove, onDuplicate
}) => {

  const renderComponentContent = () => {
    const style = {
        width: '100%', height: '100%',
        ...component.config.style,
        overflow: 'hidden',
        boxSizing: 'border-box' as const,
        // On s'assure que les clics ne sont pas interceptés par les éléments enfants
        pointerEvents: 'none' as const,
    };

    switch (component.type) {
      case 'paragraphe': case 'h1':
        return <div style={style}>{component.config.value}</div>;
      case 'button':
        return <button style={style}>{component.config.value}</button>;
      case 'input': case 'inputDate': case 'inputTime':
        return <input {...component.config.attributes} style={style} readOnly />;
      case 'textarea':
        return <textarea {...component.config.attributes} style={style} readOnly />;
      case 'image':
        return <img src={component.config.src} alt={component.config.alt} style={style} />;
      case 'iframe':
        return <div style={{...style, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e2e8f0' }}>Contenu Iframe</div>;
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
      case 'divPannel': case 'ficheClient':
        return <div style={style}></div>;
      default:
        return <div style={{...style, border: '1px dashed red'}}>Composant inconnu: {component.type}</div>;
    }
  };

  return (
    <motion.div
      // CORRECTION : On utilise motion.div pour l'animation et le déplacement
      drag
      onDragEnd={(event, info) => {
        onUpdate(component.id, {
          position: {
            x: component.position.x + info.offset.x,
            y: component.position.y + info.offset.y,
          }
        });
      }}
      dragMomentum={false} // Pour un arrêt net
      style={{
        position: 'absolute',
        x: component.position.x,
        y: component.position.y,
        width: component.size.width,
        height: component.size.height,
        zIndex: isSelected ? 10 : 1,
        cursor: 'grab',
      }}
      whileDrag={{ cursor: 'grabbing' }}
      onMouseDown={onSelect}
      className={`group transition-all duration-200 ${isSelected ? 'outline outline-2 outline-offset-2 outline-blue-500' : ''}`}
    >
      <div className="w-full h-full">
        {renderComponentContent()}
      </div>

      {isSelected && (
        <div className="absolute -top-7 left-0 flex items-center space-x-1 bg-blue-600 text-white px-2 py-1 rounded text-xs z-20">
          <span>{component.type}</span>
          <button onClick={() => onDuplicate(component.id)} className="ml-2 hover:bg-blue-700 p-0.5 rounded" title="Dupliquer"><Copy size={14} /></button>
          <button onClick={() => onRemove(component.id)} className="hover:bg-blue-700 p-0.5 rounded" title="Supprimer"><Trash2 size={14} /></button>
        </div>
      )}
    </motion.div>
  );
};