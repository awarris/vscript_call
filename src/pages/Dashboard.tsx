// chemin: vscript_call/src/pages/Dashboard.tsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit, Bot } from 'lucide-react';
import { useScripts } from '../hooks/useScripts';

/**
 * Page d'accueil (Dashboard) pour lister, créer et gérer tous les scripts.
 */
export const Dashboard: React.FC = () => {
  const { scripts, isLoading, addScript, deleteScript } = useScripts();
  const [newScriptName, setNewScriptName] = useState('');
  const navigate = useNavigate();

  const handleCreateScript = () => {
    const name = newScriptName.trim() || `Nouveau Script ${scripts.length + 1}`;
    const newScriptId = addScript(name);
    navigate(`/editor/${newScriptId}`);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>;
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto py-12 px-4">
        <header className="mb-10 text-center">
            <Bot size={48} className="mx-auto text-blue-600" />
          <h1 className="text-4xl font-bold text-slate-800 mt-4">V-Script Creator</h1>
          <p className="text-slate-500 mt-2">Gérez vos scripts interactifs ou créez-en un nouveau.</p>
        </header>

        <div className="bg-white p-6 rounded-xl shadow-lg mb-10 border border-slate-200">
          <h2 className="text-xl font-semibold mb-4 text-slate-700">Créer un nouveau script</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newScriptName}
              onChange={(e) => setNewScriptName(e.target.value)}
              placeholder="Nom de votre nouveau script..."
              className="flex-grow px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => e.key === 'Enter' && handleCreateScript()}
            />
            <button
              onClick={handleCreateScript}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 shadow-sm"
            >
              <Plus size={20} />
              <span>Créer</span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-700">Scripts existants</h2>
          {scripts.length > 0 ? scripts.map(script => (
            <div key={script.id} className="bg-white p-5 rounded-xl shadow-lg border border-slate-200 flex items-center justify-between hover:border-blue-500 transition-colors">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">{script.name}</h3>
                <p className="text-sm text-slate-500">{script.description}</p>
                 <p className="text-xs text-slate-400 mt-1">Dernière modification: {new Date(script.updatedAt).toLocaleString()}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Link
                  to={`/editor/${script.id}`}
                  className="p-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  title="Éditer"
                >
                  <Edit size={18} />
                </Link>
                <button
                  onClick={() => {
                    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${script.name}" ?`)) {
                      deleteScript(script.id);
                    }
                  }}
                  className="p-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
                  title="Supprimer"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          )) : (
            <div className="text-center py-10 bg-white rounded-xl border border-dashed">
                <p className="text-slate-500">Aucun script trouvé. Créez votre premier script !</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};