// chemin: vscript_call/src/components/layout/VerticalMenu.tsx

import React from 'react';
import { 
  LayoutGrid, 
  File, 
  Zap, 
  Database, 
  Settings
} from 'lucide-react';

// Définition du type pour les éléments du menu pour plus de clarté
type MenuItem = {
  id: string;
  label: string;
  icon: React.ElementType;
};

// Liste des éléments du menu
const menuItems: MenuItem[] = [
  { id: 'components', label: 'Composants', icon: LayoutGrid },
  { id: 'pages', label: 'Pages', icon: File },
  { id: 'workflows', label: 'Workflows', icon: Zap },
  { id: 'variables', label: 'Variables', icon: Database },
  { id: 'properties', label: 'Propriétés', icon: Settings },
];

interface VerticalMenuProps {
  activePanel: string;
  setActivePanel: (panelId: string) => void;
}

/**
 * Le menu vertical a été transformé en une barre d'icônes compacte.
 * Il est maintenant destiné à être placé à côté des panneaux qu'il contrôle.
 */
export const VerticalMenu: React.FC<VerticalMenuProps> = ({ activePanel, setActivePanel }) => {
  return (
    <nav className="bg-slate-50 dark:bg-gray-vs-800 border-r border-l border-slate-200 dark:border-gray-vs-700 flex flex-col items-center py-4 space-y-2">
      {menuItems.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setActivePanel(id)}
          title={label}
          className={`flex items-center justify-center w-12 h-12 rounded-lg transition-colors duration-200 ${
            activePanel === id 
              ? 'bg-blue-600 text-white' 
              : 'text-slate-500 dark:text-gray-vs-300 hover:bg-slate-200 dark:hover:bg-gray-vs-700 hover:text-slate-700 dark:hover:text-white'
          }`}
        >
          <Icon size={22} />
        </button>
      ))}
    </nav>
  );
};