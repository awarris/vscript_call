// chemin: vscript_call/src/components/panels/ComponentPalette.tsx

import React from 'react';
import * as Icons from 'lucide-react';
import { useDrag } from 'react-dnd';
import { ComponentLibraryItem, ComponentConfig } from '../../types';

// La bibliothèque de composants disponibles, enrichie avec des tailles par défaut
const componentLibrary: ComponentLibraryItem[] = [
    // ... (copier le contenu de l'ancien componentLibrary)
    {
        id: 'text',
        name: 'Texte',
        category: 'display',
        icon: 'Type',
        description: 'Affiche un texte statique',
        defaultConfig: {
            text: 'Texte par défaut',
            style: { fontSize: 16, textColor: '#374151', padding: 8 }
        },
        defaultSize: { width: 200, height: 40 }
    },
    {
        id: 'button',
        name: 'Bouton',
        category: 'action',
        icon: 'MousePointerClick',
        description: 'Un bouton cliquable pour les actions',
        defaultConfig: {
            text: 'Cliquez-moi',
            style: { backgroundColor: '#3B82F6', textColor: '#ffffff', borderRadius: 8, padding: 12, textAlign: 'center' }
        },
        defaultSize: { width: 150, height: 40 }
    },
    {
        id: 'input',
        name: 'Champ Texte',
        category: 'input',
        icon: 'Keyboard',
        description: 'Un champ pour la saisie de texte',
        defaultConfig: {
            placeholder: 'Saisir du texte...',
            style: { borderColor: '#D1D5DB', borderWidth: 1, borderRadius: 6, padding: 10 }
        },
        defaultSize: { width: 220, height: 40 }
    },
    // Ajoutez ici d'autres composants comme 'select', 'checkbox', 'divPanel', etc.
];

// Sous-composant pour un élément draggable de la palette
const DraggableComponent: React.FC<{ item: ComponentLibraryItem }> = ({ item }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'new-component',
    item: { 
      type: 'new-component', 
      componentType: item.id, 
      config: item.defaultConfig,
      size: item.defaultSize
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // Récupère dynamiquement le composant icône à partir de son nom
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
  onAddComponent: (type: string, config: ComponentConfig, size: {width: number, height: number}) => string;
}

export const ComponentPalette: React.FC<ComponentPaletteProps> = () => {
  const categories = Array.from(new Set(componentLibrary.map(item => item.category)));

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