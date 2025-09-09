// chemin: vscript_call/src/components/panels/PageManager.tsx

import React, { useState } from 'react';
import { Plus, Home, Edit3, Trash2 } from 'lucide-react';
import { Script, ScriptPage } from '../../types';
import { generateId } from '../../utils/helpers';

interface PageManagerProps {
  script: Script;
  setScript: React.Dispatch<React.SetStateAction<Script>>;
  currentPageId: string;
  setCurrentPageId: (pageId: string) => void;
}

export const PageManager: React.FC<PageManagerProps> = ({
  script,
  setScript,
  currentPageId,
  setCurrentPageId,
}) => {
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleAddPage = () => {
    const newPage: ScriptPage = {
      id: generateId(),
      name: `Nouvelle Page ${script.pages.length + 1}`,
      description: '',
      isHomePage: script.pages.length === 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      backgroundColor: '#ffffff',
    };
    setScript(prev => ({
      ...prev,
      pages: [...prev.pages, newPage],
    }));
    setCurrentPageId(newPage.id);
  };

  const handleRemovePage = (pageId: string) => {
    if (script.pages.length <= 1) {
      alert("Vous ne pouvez pas supprimer la dernière page.");
      return;
    }

    // Logique complexe de suppression pour s'assurer qu'il reste une page d'accueil
    // et que la page courante est valide.
    setScript(prev => {
      let newPages = prev.pages.filter(p => p.id !== pageId);
      const pageRemoved = prev.pages.find(p => p.id === pageId);

      // Si on a supprimé la page d'accueil, on en définit une nouvelle
      if (pageRemoved?.isHomePage && newPages.length > 0) {
        newPages[0].isHomePage = true;
      }

      // Si on a supprimé la page courante, on navigue vers la nouvelle page d'accueil
      if (currentPageId === pageId) {
        setCurrentPageId(newPages[0]?.id || '');
      }

      return {
        ...prev,
        pages: newPages,
        // Supprimer aussi les composants associés à cette page
        components: prev.components.filter(c => c.pageId !== pageId),
      };
    });
  };

  const handleUpdatePageName = (pageId: string) => {
    setScript(prev => ({
      ...prev,
      pages: prev.pages.map(p =>
        p.id === pageId ? { ...p, name: editingName, updatedAt: new Date().toISOString() } : p
      ),
    }));
    setEditingPageId(null);
  };

  const handleSetHomePage = (pageId: string) => {
    setScript(prev => ({
      ...prev,
      pages: prev.pages.map(p => ({
        ...p,
        isHomePage: p.id === pageId
      }))
    }));
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleAddPage}
        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus size={18} />
        <span>Ajouter une page</span>
      </button>

      <div className="space-y-2">
        {script.pages.map(page => (
          <div
            key={page.id}
            onClick={() => setCurrentPageId(page.id)}
            className={`p-3 border rounded-lg cursor-pointer transition-all ${currentPageId === page.id
                ? 'bg-blue-50 border-blue-500'
                : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
          >
            <div className="flex items-center justify-between">
              {editingPageId === page.id ? (
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onBlur={() => handleUpdatePageName(page.id)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUpdatePageName(page.id)}
                  className="text-sm font-semibold w-full -m-1 p-1 rounded-md"
                  autoFocus
                />
              ) : (
                <div className="flex items-center space-x-2">
                  {page.isHomePage && <Home size={14} className="text-green-600" />}
                  <span className="text-sm font-semibold text-slate-800">{page.name}</span>
                </div>
              )}

              <div className="flex items-center space-x-1">
                <button onClick={(e) => {
                  e.stopPropagation();
                  setEditingPageId(page.id);
                  setEditingName(page.name);
                }} className="p-1 hover:bg-slate-200 rounded-full"><Edit3 size={14} /></button>
                <button onClick={(e) => { e.stopPropagation(); handleRemovePage(page.id); }} className="p-1 hover:bg-red-100 rounded-full text-red-500"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};