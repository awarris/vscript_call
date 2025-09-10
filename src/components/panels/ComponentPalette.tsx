// chemin: src/components/panels/ComponentPalette.tsx

import React from 'react';
import * as Icons from 'lucide-react';
import { useDrag } from 'react-dnd';
import { ComponentLibraryItem, ComponentConfig } from '../../types';

// La liste des outils, sans le 'visibilityCheckbox'
const newTools = [
  { "type": "paragraphe", "value": "Votre texte ici...", "style": { "padding": "10px", "fontSize": "16px", "lineHeight": "1.5", "color": "#222" } },
  { "type": "h1", "value": "Titre de niveau 1", "style": { "fontSize": "2.25rem", "fontWeight": "700", "color": "#1e293b" } },
  { "type": "button", "value": "Cliquez ici", "style": { "backgroundColor": "#3b82f6", "color": "white", "border": "none", "padding": "12px 24px", "textAlign": "center", "fontSize": "16px", "borderRadius": "8px", "cursor": "pointer" } },
  { "type": "input", "value": "", "attributes": { "type": "text", "placeholder": "Saisissez du texte" }, "style": { "padding": "8px", "border": "1px solid #cbd5e1", "borderRadius": "6px", "width": "200px" } },
  { "type": "textarea", "value": "", "attributes": { "rows": 4, "placeholder": "Écrivez votre message..." }, "style": { "padding": "10px", "border": "1px solid #cbd5e1", "borderRadius": "6px", "width": "300px", "height": "100px" } },
  { "type": "image", "src": "https://via.placeholder.com/300x200.png?text=Image", "alt": "placeholder image", "style": { "width": "300px", "height": "200px", "objectFit": "cover" } },
  { "type": "select", "name": "listederoulante", "style": { "padding": "10px 12px", "border": "1px solid #d1d5db", "borderRadius": "6px", "width": "220px" }, "options": [{ "value": "option1", "label": "Option 1" }, { "value": "option2", "label": "Option 2" }] },
  { "type": "checkbox", "label": "Accepter les conditions", "checked": false, "style": {} },
  { "type": "inputDate", "value": "", "style": { "border": "1px solid #cbd5e1", "padding": "8px", "borderRadius": "6px" } },
  { "type": "inputTime", "value": "12:00", "style": { "border": "1px solid #cbd5e1", "padding": "8px", "borderRadius": "6px" } },
  { "type": "divPannel", "style": { "width": "400px", "height": "300px", "minHeight": "50px", "border": "1px dashed #9ca3af", "backgroundColor": "#f8fafc", "borderRadius": "8px" } },
  { "type": "iframe", "src": "https://www.wikipedia.org", "style": { "width": "400px", "height": "300px", "border": "none" } },
  { "type": "ficheClient", "title": "Fiche Client", "style": { "width": "470px", "height": "400px", "border": "1px solid #e2e8f0", "borderRadius": "8px", "padding": "20px", "backgroundColor": "#f8fafc" } },
  { "type": "calculator", "style": { "width": "240px", "height": "360px", "backgroundColor": "#f1f5f9", "displayColor": "#e2e8f0", "displayTextColor": "#0f172a", "buttonColor": "#ffffff", "buttonTextColor": "#0f172a", "operatorColor": "#fefce8", "operatorTextColor": "#0f172a", "clearColor": "#fecaca", "clearTextColor": "#0f172a", "equalColor": "#2563eb", "equalTextColor": "#ffffff" } },
  { "type": "container", "style": { "width": "400px", "height": "300px", "backgroundColor": "#ffffff", "border": "1px solid #e2e8f0", "borderRadius": "8px", "padding": "10px" } },
];

const componentLibrary: ComponentLibraryItem[] = newTools.map(tool => {
  const typeToIcon: { [key: string]: string } = {
    paragraphe: 'Pilcrow', h1: 'Heading1', button: 'MousePointerClick',
    input: 'Keyboard', textarea: 'Textarea', image: 'Image',
    select: 'ChevronDownSquare', checkbox: 'CheckSquare', inputDate: 'Calendar',
    inputTime: 'Clock', divPannel: 'RectangleHorizontal', iframe: 'Globe',
    ficheClient: 'UserSquare', calculator: 'Calculator', container: 'Container',
  };

  const originalStyle = tool.style || {};
  const cleanStyle: { [key: string]: any } = {};
  const forbiddenKeys = ['position', 'top', 'left', 'zIndex', 'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft'];

  for (const key in originalStyle) {
    if (!forbiddenKeys.includes(key)) {
      cleanStyle[key] = originalStyle[key];
    }
  }

  const { type, ...restOfTool } = tool;
  const config: ComponentConfig = {
    ...restOfTool,
    style: cleanStyle,
    visible: true, // Tous les composants sont visibles par défaut
  };

  return {
    id: tool.type,
    name: tool.type.charAt(0).toUpperCase() + tool.type.slice(1).replace(/_/g, ' '),
    category: ['paragraphe', 'h1', 'image'].includes(tool.type) ? 'Affichage' : ['button', 'input', 'textarea', 'select', 'checkbox', 'inputDate', 'inputTime'].includes(tool.type) ? 'Formulaire' : 'Avancé',
    icon: typeToIcon[tool.type] || 'Box',
    description: `Composant de type ${tool.type}`,
    defaultConfig: config,
    defaultSize: {
      width: parseInt(tool.style?.width || '0', 10) || (tool.type === 'calculator' ? 240 : 250),
      height: parseInt(tool.style?.height || '0', 10) || (tool.type === 'calculator' ? 360 : (tool.type === 'textarea' ? 100 : 50)),
    },
  };
});

const DraggableComponent: React.FC<{ item: ComponentLibraryItem }> = ({ item }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'new-component',
    item: {
      type: 'new-component',
      componentType: item.id,
      config: item.defaultConfig,
      size: item.defaultSize
    },
    collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
  }));

  const IconComponent = Icons[item.icon as keyof typeof Icons] as React.ElementType || Icons.Box;

  return (
    <div
      ref={drag}
      className={`p-3 border border-slate-200 rounded-lg flex items-center space-x-3 cursor-grab active:cursor-grabbing hover:bg-slate-50 hover:border-blue-400 transition-all ${isDragging ? 'opacity-50' : ''}`}
    >
      <IconComponent className="h-6 w-6 text-slate-500" />
      <div>
        <p className="text-sm font-semibold text-slate-800">{item.name}</p>
        <p className="text-xs text-slate-500">{item.description}</p>
      </div>
    </div>
  );
};

interface ComponentPaletteProps {
  onAddComponent: (type: string, config: ComponentConfig, size: { width: number, height: number }) => string;
}

export const ComponentPalette: React.FC<ComponentPaletteProps> = () => {
  const categories = [...new Set(componentLibrary.map(item => item.category))];

  return (
    <div className="space-y-6">
      {categories.map(category => (
        <div key={category}>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            {category}
          </h3>
          <div className="space-y-2">
            {componentLibrary
              .filter(item => item.category === category)
              .map(item => <DraggableComponent key={item.id} item={item} />)
            }
          </div>
        </div>
      ))}
    </div>
  );
};

