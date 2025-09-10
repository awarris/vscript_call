// chemin: src/components/Canvas/ComponentRenderer.tsx

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight,
    X, Copy, Trash2, Palette, Delete
} from 'lucide-react';
import { Component, ComponentStyle } from '../../types';

// Sous-composant pour le rendu de la calculatrice (statique et stylisable)
const StaticCalculator = ({ styleConfig }: { styleConfig: ComponentStyle }) => {
    return (
        <div className="w-full h-full p-2 rounded-lg flex flex-col" style={{ backgroundColor: styleConfig.backgroundColor }}>
            <div className="w-full h-1/6 rounded-md mb-2 flex items-end justify-end p-2 text-2xl text-right overflow-hidden" style={{ backgroundColor: styleConfig.displayColor, color: styleConfig.displayTextColor }}>
                0
            </div>
            <div className="grid grid-cols-4 gap-2 flex-1">
                <button className="rounded-md text-lg flex items-center justify-center" style={{ backgroundColor: styleConfig.buttonColor, color: styleConfig.buttonTextColor }}><Delete size={18} /></button>
                <button className="col-span-2 rounded-md text-lg" style={{ backgroundColor: styleConfig.clearColor, color: styleConfig.clearTextColor }}>C</button>
                <button className="rounded-md text-lg" style={{ backgroundColor: styleConfig.operatorColor, color: styleConfig.operatorTextColor }}>/</button>
                <button className="rounded-md text-lg" style={{ backgroundColor: styleConfig.buttonColor, color: styleConfig.buttonTextColor }}>7</button>
                <button className="rounded-md text-lg" style={{ backgroundColor: styleConfig.buttonColor, color: styleConfig.buttonTextColor }}>8</button>
                <button className="rounded-md text-lg" style={{ backgroundColor: styleConfig.buttonColor, color: styleConfig.buttonTextColor }}>9</button>
                <button className="rounded-md text-lg" style={{ backgroundColor: styleConfig.operatorColor, color: styleConfig.operatorTextColor }}>*</button>
                <button className="rounded-md text-lg" style={{ backgroundColor: styleConfig.buttonColor, color: styleConfig.buttonTextColor }}>4</button>
                <button className="rounded-md text-lg" style={{ backgroundColor: styleConfig.buttonColor, color: styleConfig.buttonTextColor }}>5</button>
                <button className="rounded-md text-lg" style={{ backgroundColor: styleConfig.buttonColor, color: styleConfig.buttonTextColor }}>6</button>
                <button className="rounded-md text-lg" style={{ backgroundColor: styleConfig.operatorColor, color: styleConfig.operatorTextColor }}>-</button>
                <button className="rounded-md text-lg" style={{ backgroundColor: styleConfig.buttonColor, color: styleConfig.buttonTextColor }}>1</button>
                <button className="rounded-md text-lg" style={{ backgroundColor: styleConfig.buttonColor, color: styleConfig.buttonTextColor }}>2</button>
                <button className="rounded-md text-lg" style={{ backgroundColor: styleConfig.buttonColor, color: styleConfig.buttonTextColor }}>3</button>
                <button className="rounded-md text-lg" style={{ backgroundColor: styleConfig.operatorColor, color: styleConfig.operatorTextColor }}>+</button>
                <button className="col-span-2 rounded-md text-lg" style={{ backgroundColor: styleConfig.buttonColor, color: styleConfig.buttonTextColor }}>0</button>
                <button className="rounded-md text-lg" style={{ backgroundColor: styleConfig.buttonColor, color: styleConfig.buttonTextColor }}>.</button>
                <button className="rounded-md text-lg" style={{ backgroundColor: styleConfig.equalColor, color: styleConfig.equalTextColor }}>=</button>
            </div>
        </div>
    );
};


interface ComponentRendererProps {
  component: Component;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (id: string, updates: Partial<Component>) => void;
  onRemove: (id: string) => void;
  onDuplicate: (id: string) => void;
  inlineEditingId: string | null;
  setInlineEditingId: (id: string | null) => void;
}

const InlineEditorToolbar: React.FC<{
    component: Component;
    onUpdate: (id: string, updates: Partial<Component>) => void;
    onStopEditing: () => void;
}> = ({ component, onUpdate, onStopEditing }) => {

    const applyStyle = (style: Partial<React.CSSProperties>) => {
        onUpdate(component.id, {
            config: {
                ...component.config,
                style: { ...(component.config.style || {}), ...style }
            }
        });
    };

    const toggleStyle = (property: keyof React.CSSProperties, valueA: any, valueB: any) => {
        const currentStyle = component.config.style || {};
        applyStyle({ [property]: currentStyle[property] === valueA ? valueB : valueA });
    };

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        applyStyle({ color: e.target.value });
    };

    return (
        <div
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max max-w-sm bg-white p-1 rounded-lg shadow-lg border border-slate-200 flex items-center space-x-1 text-slate-700 flex-wrap z-30"
            onMouseDown={(e) => e.preventDefault()} // Empêche le onBlur du textarea
        >
            <button className="p-1.5 hover:bg-slate-200 rounded" title="Gras" onClick={() => toggleStyle('fontWeight', 'bold', 'normal')}><Bold size={16} /></button>
            <button className="p-1.5 hover:bg-slate-200 rounded" title="Italique" onClick={() => toggleStyle('fontStyle', 'italic', 'normal')}><Italic size={16} /></button>
            <button className="p-1.5 hover:bg-slate-200 rounded" title="Souligné" onClick={() => toggleStyle('textDecoration', 'underline', 'none')}><Underline size={16} /></button>
            <button className="p-1.5 hover:bg-slate-200 rounded" title="Barré" onClick={() => toggleStyle('textDecoration', 'line-through', 'none')}><Strikethrough size={16} /></button>

            <div className="w-px h-5 bg-slate-300 mx-1"></div>

            <button className="p-1.5 hover:bg-slate-200 rounded" title="Aligner à gauche" onClick={() => applyStyle({ textAlign: 'left' })}><AlignLeft size={16} /></button>
            <button className="p-1.5 hover:bg-slate-200 rounded" title="Centrer" onClick={() => applyStyle({ textAlign: 'center' })}><AlignCenter size={16} /></button>
            <button className="p-1.5 hover:bg-slate-200 rounded" title="Aligner à droite" onClick={() => applyStyle({ textAlign: 'right' })}><AlignRight size={16} /></button>

            <div className="w-px h-5 bg-slate-300 mx-1"></div>

            <label className="p-1.5 hover:bg-slate-200 rounded cursor-pointer" title="Couleur du texte">
                <Palette size={16} />
                <input
                    type="color"
                    value={component.config.style?.color || '#000000'}
                    onChange={handleColorChange}
                    className="w-0 h-0 opacity-0 absolute"
                />
            </label>

            <div className="flex-grow"></div>
            <button onClick={onStopEditing} className="p-1.5 hover:bg-slate-200 rounded" title="Fermer"><X size={16} /></button>
        </div>
    );
};


export const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  component, isSelected, onSelect, onUpdate, onRemove, onDuplicate,
  inlineEditingId, setInlineEditingId
}) => {
  const isEditingInline = component.id === inlineEditingId;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const motionRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (isEditingInline && textareaRef.current) {
        textareaRef.current.focus();
        const el = textareaRef.current;
        el.style.height = 'auto';
        el.style.height = `${el.scrollHeight}px`;
    }
  }, [isEditingInline]);

  // Gère le clic en dehors pour fermer l'éditeur
  useEffect(() => {
    if (!isEditingInline) return;

    const handleClickOutside = (event: MouseEvent) => {
        if (motionRef.current && !motionRef.current.contains(event.target as Node)) {
            setInlineEditingId(null);
        }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditingInline, setInlineEditingId]);

  const handleDoubleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (['paragraphe', 'h1', 'textarea', 'checkbox'].includes(component.type)) {
          setInlineEditingId(component.id);
      }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    const propertyToUpdate = component.type === 'checkbox' ? 'label' : 'value';

    onUpdate(component.id, {
        config: { ...component.config, [propertyToUpdate]: newText }
    });

    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  };

  const renderComponentContent = () => {
    const style = {
        width: '100%', height: '100%',
        ...component.config.style,
        overflow: 'hidden',
        boxSizing: 'border-box' as const,
        pointerEvents: 'none' as const,
    };

    switch (component.type) {
      case 'paragraphe': case 'h1':
        return <div style={style}>{String(component.config.value || '')}</div>;
      case 'button':
        return <button style={style}>{String(component.config.value || '')}</button>;
      case 'input': case 'inputDate': case 'inputTime':
        return <input {...component.config.attributes} style={style} readOnly />;
      case 'textarea':
        return <textarea {...component.config.attributes} value={String(component.config.value || '')} style={style} readOnly />;
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
        return (
            <div style={{ ...style, display: 'flex', alignItems: 'center' }}>
                <input type="checkbox" checked={component.config.checked} readOnly style={{ marginRight: '8px' }} />
                <span style={{ color: component.config.style?.color, fontFamily: component.config.style?.fontFamily }}>
                    {component.config.label}
                </span>
            </div>
        );
      case 'calculator':
        return <StaticCalculator styleConfig={component.config.style as ComponentStyle} />;
      case 'divPannel': case 'ficheClient':
        return <div style={style}></div>;
      default:
        return <div style={{...style, border: '1px dashed red'}}>Composant inconnu: {component.type}</div>;
    }
  };

  const editingText = component.type === 'checkbox' ? component.config.label : component.config.value;

  return (
    <motion.div
      ref={motionRef}
      drag={!isEditingInline}
      onDragEnd={(event, info) => {
        onUpdate(component.id, {
          position: {
            x: component.position.x + info.offset.x,
            y: component.position.y + info.offset.y,
          }
        });
      }}
      dragMomentum={false}
      style={{
        position: 'absolute',
        x: component.position.x,
        y: component.position.y,
        width: component.size.width,
        height: isEditingInline ? 'auto' : component.size.height,
        minHeight: isEditingInline ? component.size.height : undefined,
        zIndex: isSelected ? (isEditingInline ? 20 : 10) : 1,
        cursor: isEditingInline ? 'default' : 'grab',
      }}
      whileDrag={{ cursor: 'grabbing' }}
      onMouseDown={onSelect}
      onDoubleClick={handleDoubleClick}
      className={`group transition-all duration-200 ${isSelected && !isEditingInline ? 'outline outline-2 outline-offset-2 outline-blue-500' : ''}`}
    >
      {isEditingInline && (
        <InlineEditorToolbar
            component={component}
            onUpdate={onUpdate}
            onStopEditing={() => setInlineEditingId(null)}
        />
      )}
      <div className="w-full h-full relative">
        {isEditingInline ? (
            <textarea
                ref={textareaRef}
                value={String(editingText || '')}
                onChange={handleTextChange}
                onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                        setInlineEditingId(null);
                    }
                }}
                className="w-full h-full p-0 m-0 border-none outline-none focus:ring-0 resize-none bg-transparent block"
                style={{ ...component.config.style, cursor: 'text' }}
            />
        ) : (
            renderComponentContent()
        )}
      </div>

      {isSelected && !isEditingInline && (
        <div className="absolute -top-7 left-0 flex items-center space-x-1 bg-blue-600 text-white px-2 py-1 rounded text-xs z-20">
          <span>{component.type}</span>
          <button onClick={() => onDuplicate(component.id)} className="ml-2 hover:bg-blue-700 p-0.5 rounded" title="Dupliquer"><Copy size={14} /></button>
          <button onClick={() => onRemove(component.id)} className="hover:bg-blue-700 p-0.5 rounded" title="Supprimer"><Trash2 size={14} /></button>
        </div>
      )}
    </motion.div>
  );
};