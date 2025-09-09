// chemin: vscript_call/src/components/PreviewPane/PreviewPane.tsx

import React, { useState, useEffect } from 'react';
import { Component, Script } from '../../types';
import { getDeviceWidth } from '../../utils/helpers';

interface PreviewPaneProps {
  script: Script;
  currentPageId: string;
  device: 'mobile' | 'tablet' | 'desktop';
  onNavigateToPage: (pageId: string) => void;
}

export const PreviewPane: React.FC<PreviewPaneProps> = ({
  script,
  currentPageId,
  device,
  onNavigateToPage,
}) => {
  const [variables, setVariables] = useState<Record<string, any>>({});
  
  const currentPage = script.pages.find(p => p.id === currentPageId);
  const components = script.components.filter(c => c.pageId === currentPageId);

  useEffect(() => {
    const initialVariables: Record<string, any> = {};
    script.globalVariables.forEach(variable => {
      initialVariables[variable.name] = variable.defaultValue;
    });
    setVariables(initialVariables);
  }, [script.globalVariables]);

  const renderPreviewComponent = (component: Component) => {
    const style = {
      ...component.config.style,
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: component.config.style?.textAlign === 'center' ? 'center' : 'flex-start',
    };

    const handleClick = () => {
      if (component.type === 'button' && component.config.targetPageId) {
        onNavigateToPage(component.config.targetPageId);
      }
      // Logique d'exécution de workflow à ajouter ici
    };

    switch (component.type) {
      case 'text':
        return <div style={style}>{component.config.text}</div>;
      case 'button':
        return <button style={style} onClick={handleClick}>{component.config.text}</button>;
      case 'input':
        return <input type="text" placeholder={component.config.placeholder} style={style} />;
      default:
        return <div style={style}>Preview: {component.type}</div>;
    }
  };

  const canvasWidth = getDeviceWidth(device);

  return (
    <div className="flex-1 bg-slate-100 overflow-auto p-8 flex justify-center items-center">
      <div
        className="bg-white rounded-xl shadow-2xl border border-slate-200 relative overflow-hidden"
        style={{
          width: canvasWidth,
          minHeight: '600px',
          backgroundColor: currentPage?.backgroundColor || '#ffffff',
          backgroundImage: currentPage?.backgroundImage ? `url(${currentPage.backgroundImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {components.map(component => (
          <div
            key={component.id}
            style={{
              position: 'absolute',
              left: component.position.x,
              top: component.position.y,
              width: component.size.width,
              height: component.size.height,
            }}
          >
            {renderPreviewComponent(component)}
          </div>
        ))}

        {/* Panneau de débogage des variables */}
        {Object.keys(variables).length > 0 && (
          <div className="absolute bottom-4 right-4 bg-slate-800 bg-opacity-80 text-white p-3 rounded-lg text-xs backdrop-blur-sm">
            <div className="font-semibold mb-2 text-blue-300">Variables</div>
            {Object.entries(variables).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span>{key}:</span>
                <span className="ml-2 text-emerald-300">{JSON.stringify(value)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};