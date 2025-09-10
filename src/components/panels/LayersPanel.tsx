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

  // Dictionnaire pour mapper les types de composants à des icônes
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
        className={`group flex items-center justify-between pr-3 cursor-pointer transition-colors rounded-md ${
          isSelected ? 'bg-blue-100 dark:bg-blue-vs-800' : 'hover:bg-slate-50 dark:hover:bg-gray-vs-700'
        }`}
        style={{ paddingLeft: `${level * 24}px` }} // Augmentation de l'indentation
      >
        <div className="flex items-center space-x-2 truncate py-2">
          {isContainer ? (
            <button 
              onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }} 
              className="p-0.5 -ml-1 text-gray-vs-500 dark:text-gray-vs-400 hover:bg-slate-200 dark:hover:bg-gray-vs-600 rounded"
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          ) : (
            // Espace réservé pour l'alignement
            <div className="w-5 h-5"></div>
          )}
          <IconComponent className={`h-5 w-5 flex-shrink-0 ${isSelected ? 'text-blue-600 dark:text-blue-vs-300' : 'text-slate-500 dark:text-gray-vs-400'}`} />
          <span className={`text-sm truncate ${isSelected ? 'font-semibold text-slate-800 dark:text-white' : 'text-slate-700 dark:text-gray-vs-200'}`}>
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
        <ul className="pl-6 border-l border-slate-200 dark:border-gray-vs-700 ml-3">
          {children.length > 0 ? (
            children.map(child => (
              <LayerItem
                key={child.id}
                component={child}
                allComponents={allComponents}
                selectedComponentId={selectedComponentId}
                onSelectComponent={onSelectComponent}
                onRemoveComponent={onRemoveComponent}
                level={level + 1}
              />
            ))
          ) : (
            <li className="text-xs text-slate-400 dark:text-gray-vs-500 italic py-1" style={{ paddingLeft: `${(level + 1) * 24}px` }}>
              Conteneur vide
            </li>
          )}
        </ul>
      )}
    </>
  );
};

interface LayersPanelProps {
  components: Component[];
  allComponents: Component[]; // Ajouté pour passer aux enfants
  selectedComponentId: string | null;
  onSelectComponent: (id: string | null) => void;
  onRemoveComponent: (id: string) => void;
}

export const LayersPanel: React.FC<LayersPanelProps> = ({ components, allComponents, selectedComponentId, onSelectComponent, onRemoveComponent }) => {
  // On inverse la liste pour afficher le dernier élément ajouté en haut (comme dans les logiciels de design)
  const rootComponents = [...components].filter(c => !c.parentId).reverse();

  return (
    <div className="h-full flex flex-col">
      {components.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-slate-500 dark:text-gray-vs-400">
            <Icons.Layers className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm font-medium">Aucun élément sur la page</p>
            <p className="text-xs mt-1">Ajoutez des composants depuis l'onglet "Composants".</p>
          </div>
        </div>
      ) : (
        <ul className="space-y-1 py-2">
          {rootComponents.map(component => (
            <LayerItem
              key={component.id}
              component={component}
              allComponents={allComponents}
              selectedComponentId={selectedComponentId}
              onSelectComponent={onSelectComponent}
              onRemoveComponent={onRemoveComponent}
              level={0}
            />
          ))}
        </ul>
      )}
    </div>
  );
};