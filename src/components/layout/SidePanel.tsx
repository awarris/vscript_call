// chemin: vscript_call/src/components/layout/SidePanel.tsx

import React from 'react';

interface SidePanelProps {
  activePanel: string;
  children: React.ReactNode;
}

// Un dictionnaire pour mapper les IDs de panneau à des titres lisibles
const panelTitles: { [key: string]: string } = {
  components: 'Composants',
  pages: 'Gestionnaire de Pages',
  workflows: 'Workflows',
  variables: 'Variables Globales',
  properties: 'Propriétés',
};

export const SidePanel: React.FC<SidePanelProps> = ({ activePanel, children }) => {
  const title = panelTitles[activePanel] || 'Panneau';

  return (
    <aside className="w-80 bg-white dark:bg-gray-vs-800 border-r border-slate-200 dark:border-gray-vs-700 flex flex-col shadow-lg">
      {/* En-tête du panneau */}
      <header className="p-4 border-b border-slate-200 dark:border-gray-vs-700">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">{title}</h2>
      </header>

      {/* Contenu dynamique du panneau */}
      <div className="flex-1 overflow-y-auto p-4">
        {children}
      </div>
    </aside>
  );
};