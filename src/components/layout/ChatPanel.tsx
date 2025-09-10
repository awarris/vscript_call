// chemin: vscript_call/src/components/layout/ChatPanel.tsx

import React from 'react';
import { Bot, Send, X } from 'lucide-react';
import { Script } from '../../types';

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  script: Script | null;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ isOpen, onClose, script }) => {
  if (!isOpen) {
    return null;
  }

  const conversation = script?.conversation || [
    { role: 'ia', content: "Bonjour ! Comment puis-je vous aider à construire votre script aujourd'hui ?" },
    { role: 'user', content: "Je voudrais créer une page de contact." },
    { role: 'ia', content: "Excellente idée. Vous pouvez commencer par glisser un composant 'input' pour le nom, un autre pour l'email, et un 'textarea' pour le message." },
  ];

  return (
    <div className="w-96 bg-white dark:bg-gray-vs-800 text-gray-vs-800 dark:text-white flex flex-col shadow-2xl z-40 animate-slide-in-from-left border-r border-gray-vs-200 dark:border-gray-vs-700">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-vs-200 dark:border-gray-vs-700 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <Bot className="text-green-vs-500" />
          <h2 className="text-lg font-bold">Assistant IA</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-gray-vs-400 hover:text-black dark:hover:text-white hover:bg-gray-vs-200 dark:hover:bg-gray-vs-700 rounded-full transition-colors"
          title="Fermer l'assistant"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-vs-50 dark:bg-gray-vs-900">
        {conversation.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'ia' && (
              <div className="w-8 h-8 rounded-full bg-green-vs-100 dark:bg-green-vs-800 flex items-center justify-center flex-shrink-0">
                <Bot size={20} className="text-green-vs-600 dark:text-green-vs-300" />
              </div>
            )}
            <div
              className={`max-w-xs md:max-w-sm px-4 py-2 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-blue-vs-500 text-white rounded-br-none'
                  : 'bg-white dark:bg-gray-vs-700 rounded-bl-none'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-vs-200 dark:border-gray-vs-700 flex-shrink-0">
        <div className="relative">
          <textarea
            rows={1}
            placeholder="Envoyer un message..."
            className="w-full bg-gray-vs-100 dark:bg-gray-vs-900 border border-gray-vs-300 dark:border-gray-vs-600 rounded-lg py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-green-vs-500 resize-none"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-vs-400 hover:text-green-vs-500 transition-colors">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};