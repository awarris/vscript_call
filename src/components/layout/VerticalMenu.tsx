// chemin: vscript_call/src/components/layout/VerticalMenu.tsx

import React, { useState } from 'react';
import { 
  LayoutGrid, 
  File, 
  Zap, 
  Database, 
  Settings, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

// Définition d'un type pour les éléments du menu pour plus de clarté
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

export const VerticalMenu: React.FC<VerticalMenuProps> = ({ activePanel, setActivePanel }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <nav 
      className={`bg-slate-800 text-white flex flex-col transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* En-tête du menu */}
      <div className="p-4 flex items-center justify-between border-b border-slate-700">
        {!isCollapsed && <h1 className="text-xl font-bold text-white">V-Script</h1>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-full hover:bg-slate-700"
          title={isCollapsed ? "Développer" : "Réduire"}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Liens de navigation */}
      <div className="flex-1 py-4">
        {menuItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActivePanel(id)}
            title={label}
            className={`flex items-center w-full px-4 py-3 text-sm font-medium transition-colors duration-200 ${
              activePanel === id 
                ? 'bg-blue-600 text-white' 
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            } ${isCollapsed ? 'justify-center' : ''}`}
          >
            <Icon size={20} className="flex-shrink-0" />
            {!isCollapsed && <span className="ml-4">{label}</span>}
          </button>
        ))}
      </div>

      {/* Pied de page du menu (optionnel) */}
      <div className="p-4 border-t border-slate-700">
        {/* Contenu futur du pied de page */}
      </div>
    </nav>
  );
};