// chemin: vscript_call/src/components/panels/LayersPanel.tsx

import React from 'react';
import * as Icons from 'lucide-react';
import { Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { Component } from '../../types';

interface LayerItemProps {
  component: Component;
  allComponents: Component[];
  selectedComponentId: string | null;
  onSelectComponent: (id: string | null) => void;
  onRemoveComponent: (id: string) => void;
  level: number;
}

const LayerItem: React.FC<LayerItemProps> = ({ component, allComponents, selectedComponentId, onSelectComponent, onRemoveComponent, level }) => {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const children = allComponents.filter(c => c.parentId === component.id);
  const isContainer = component.type === 'container';
  const isSelected = component.id === selectedComponentId;

  const typeToIcon: { [key: string]: string } = {
    paragraphe: 'Pilcrow', h1: 'Heading1', button: 'MousePointerClick',
    input: 'Keyboard', textarea: 'Textarea', image: 'Image',
    select: 'ChevronDownSquare', checkbox: 'CheckSquare', inputDate: 'Calendar',
    inputTime: 'Clock', divPannel: 'RectangleHorizontal', iframe: 'Globe',
    ficheClient: 'UserSquare', calculator: 'Calculator', container: 'Container',
  };
  const IconComponent = Icons[typeToIcon[component.type] as keyof typeof Icons] as React.ElementType || Icons.Box;

  return (
    <>
      <li
        onClick={() => onSelectComponent(component.id)}
        className={`group flex items-center justify-between pr-3 cursor-pointer transition-colors ${
          isSelected ? 'bg-blue-100' : 'hover:bg-slate-50'
        }`}
        style={{ paddingLeft: `${level * 16 + 12}px` }}
      >
        <div className="flex items-center space-x-2 truncate py-2">
          {isContainer && (
            <button onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }} className="p-0.5 -ml-1">
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          )}
          <IconComponent className={`h-5 w-5 flex-shrink-0 ${isSelected ? 'text-blue-600' : 'text-slate-500'} ${!isContainer && 'ml-4'}`} />
          <span className={`text-sm truncate ${isSelected ? 'font-semibold text-slate-800' : 'text-slate-700'}`}>
            {component.type}
          </span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onRemoveComponent(component.id); }}
          className="p-1 text-slate-400 hover:text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          title="Supprimer"
        >
          <Trash2 size={14} />
        </button>
      </li>
      {isContainer && isExpanded && (
        <ul>
          {children.map(child => (
            <LayerItem
              key={child.id}
              component={child}
              allComponents={allComponents}
              selectedComponentId={selectedComponentId}
              onSelectComponent={onSelectComponent}
              onRemoveComponent={onRemoveComponent}
              level={level + 1}
            />
          ))}
        </ul>
      )}
    </>
  );
};

interface LayersPanelProps {
  components: Component[];
  selectedComponentId: string | null;
  onSelectComponent: (id: string | null) => void;
  onRemoveComponent: (id: string) => void;
}

export const LayersPanel: React.FC<LayersPanelProps> = ({ components, selectedComponentId, onSelectComponent, onRemoveComponent }) => {
  const rootComponents = [...components].filter(c => !c.parentId).reverse();

  return (
    <aside className="w-64 bg-white border-l border-slate-200 flex flex-col shadow-lg flex-shrink-0">
      <header className="p-4 border-b border-slate-200">
        <h2 className="text-base font-semibold text-slate-800">Éléments de la Page</h2>
      </header>
      <div className="flex-1 overflow-y-auto">
        {components.length === 0 ? (
          <p className="p-4 text-sm text-slate-500 text-center mt-4">Aucun élément sur cette page.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {rootComponents.map(component => (
              <LayerItem
                key={component.id}
                component={component}
                allComponents={components}
                selectedComponentId={selectedComponentId}
                onSelectComponent={onSelectComponent}
                onRemoveComponent={onRemoveComponent}
                level={0}
              />
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
};