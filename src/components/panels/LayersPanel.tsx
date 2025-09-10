// chemin: src/components/panels/LayersPanel.tsx

import React from 'react';
import * as Icons from 'lucide-react';
import { Trash2 } from 'lucide-react';
import { Component } from '../../types';

interface LayersPanelProps {
  components: Component[];
  selectedComponentId: string | null;
  onSelectComponent: (id: string | null) => void;
  onRemoveComponent: (id: string) => void;
}

export const LayersPanel: React.FC<LayersPanelProps> = ({
  components,
  selectedComponentId,
  onSelectComponent,
  onRemoveComponent,
}) => {
  // Map pour associer un type de composant à une icône
  const typeToIcon: { [key: string]: string } = {
    paragraphe: 'Pilcrow', h1: 'Heading1', button: 'MousePointerClick',
    input: 'Keyboard', textarea: 'Textarea', image: 'Image',
    select: 'ChevronDownSquare', checkbox: 'CheckSquare', inputDate: 'Calendar',
    inputTime: 'Clock', divPannel: 'RectangleHorizontal', iframe: 'Globe',
    ficheClient: 'UserSquare', calculator: 'Calculator',
  };

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
            {/* On inverse la liste pour voir les derniers éléments ajoutés en premier */}
            {[...components].reverse().map(component => {
              const IconComponent = Icons[typeToIcon[component.type] as keyof typeof Icons] as React.ElementType || Icons.Box;
              const isSelected = component.id === selectedComponentId;
              return (
                <li
                  key={component.id}
                  onClick={() => onSelectComponent(component.id)}
                  className={`group flex items-center justify-between p-3 cursor-pointer transition-colors ${
                    isSelected ? 'bg-blue-100' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3 truncate">
                    <IconComponent className={`h-5 w-5 flex-shrink-0 ${isSelected ? 'text-blue-600' : 'text-slate-500'}`} />
                    <span className={`text-sm truncate ${isSelected ? 'font-semibold text-slate-800' : 'text-slate-700'}`}>
                      {component.type}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Empêche la sélection du composant lors du clic sur le bouton
                      onRemoveComponent(component.id);
                    }}
                    className="p-1 text-slate-400 hover:text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Supprimer"
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
};