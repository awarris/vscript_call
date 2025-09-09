import React, { useState } from 'react';
import { Plus, Home, Edit3, Trash2, X, Eye, Settings, Copy } from 'lucide-react';
import { ScriptPage } from '../../types';

interface PageManagerProps {
  pages: ScriptPage[];
  currentPageId: string;
  onAddPage: (name: string, description?: string) => void;
  onUpdatePage: (pageId: string, updates: Partial<ScriptPage>) => void;
  onRemovePage: (pageId: string) => void;
  onNavigateToPage: (pageId: string) => void;
  onClose: () => void;
}

export const PageManager: React.FC<PageManagerProps> = ({
  pages,
  currentPageId,
  onAddPage,
  onUpdatePage,
  onRemovePage,
  onNavigateToPage,
  onClose,
}) => {
  const [showNewPageForm, setShowNewPageForm] = useState(false);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [newPageData, setNewPageData] = useState({ name: '', description: '' });
  const [editPageData, setEditPageData] = useState({ name: '', description: '' });

  const handleCreatePage = () => {
    if (newPageData.name.trim()) {
      onAddPage(newPageData.name, newPageData.description);
      setNewPageData({ name: '', description: '' });
      setShowNewPageForm(false);
    }
  };

  const handleUpdatePage = () => {
    if (editingPageId && editPageData.name.trim()) {
      onUpdatePage(editingPageId, {
        name: editPageData.name,
        description: editPageData.description
      });
      setEditingPageId(null);
      setEditPageData({ name: '', description: '' });
    }
  };

  const startEditing = (page: ScriptPage) => {
    setEditingPageId(page.id);
    setEditPageData({ name: page.name, description: page.description || '' });
  };

  const setAsHomePage = (pageId: string) => {
    // Retirer le statut de page d'accueil de toutes les pages
    pages.forEach(page => {
      if (page.isHomePage && page.id !== pageId) {
        onUpdatePage(page.id, { isHomePage: false });
      }
    });
    // Définir la nouvelle page d'accueil
    onUpdatePage(pageId, { isHomePage: true });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gestionnaire de Pages</h2>
            <p className="text-sm text-gray-500 mt-1">
              Gérez les pages de votre script interactif
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Pages List */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Pages ({pages.length})
              </h3>
              <button
                onClick={() => setShowNewPageForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Nouvelle Page</span>
              </button>
            </div>

            {/* New Page Form */}
            {showNewPageForm && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-3">Créer une nouvelle page</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-1">
                      Nom de la page *
                    </label>
                    <input
                      type="text"
                      value={newPageData.name}
                      onChange={(e) => setNewPageData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: Page de contact"
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-1">
                      Description (optionnel)
                    </label>
                    <textarea
                      value={newPageData.description}
                      onChange={(e) => setNewPageData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Description de la page..."
                      rows={2}
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCreatePage}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Créer
                    </button>
                    <button
                      onClick={() => {
                        setShowNewPageForm(false);
                        setNewPageData({ name: '', description: '' });
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Pages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pages.map(page => (
                <div
                  key={page.id}
                  className={`p-4 border-2 rounded-xl transition-all duration-200 ${
                    currentPageId === page.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  {editingPageId === page.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editPageData.name}
                        onChange={(e) => setEditPageData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-2 py-1 text-lg font-semibold border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <textarea
                        value={editPageData.description}
                        onChange={(e) => setEditPageData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Description..."
                        rows={2}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={handleUpdatePage}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                        >
                          Sauvegarder
                        </button>
                        <button
                          onClick={() => setEditingPageId(null)}
                          className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400 transition-colors"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {page.isHomePage && (
                            <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              <Home className="h-3 w-3" />
                              <span>Accueil</span>
                            </div>
                          )}
                          <h4 className="text-lg font-semibold text-gray-900">{page.name}</h4>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => onNavigateToPage(page.id)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                            title="Voir la page"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => startEditing(page)}
                            className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                            title="Modifier"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          {!page.isHomePage && (
                            <button
                              onClick={() => onRemovePage(page.id)}
                              className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {page.description && (
                        <p className="text-sm text-gray-600 mb-3">{page.description}</p>
                      )}

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Créée le {page.createdAt.toLocaleDateString()}</span>
                        {!page.isHomePage && (
                          <button
                            onClick={() => setAsHomePage(page.id)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Définir comme accueil
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Page Preview/Settings */}
          <div className="w-80 border-l border-gray-200 p-6 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Paramètres de Page
            </h3>
            
            {currentPageId && (
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">Page Actuelle</h4>
                  <p className="text-sm text-gray-600">
                    {pages.find(p => p.id === currentPageId)?.name}
                  </p>
                </div>

                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Actions Rapides</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => onNavigateToPage(currentPageId)}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      <span>Aller à cette page</span>
                    </button>
                    <button
                      onClick={() => {
                        const page = pages.find(p => p.id === currentPageId);
                        if (page) startEditing(page);
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit3 className="h-4 w-4" />
                      <span>Modifier les détails</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">Statistiques</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Total des pages: {pages.length}</div>
                    <div>Page d'accueil: {pages.find(p => p.isHomePage)?.name}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};