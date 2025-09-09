// chemin: vscript_call/src/components/panels/PropertiesPanel.tsx

import React from 'react';
import { Settings, Palette, Type, Link2, AlignCenter, AlignLeft, AlignRight, Bold, Italic } from 'lucide-react';
import { Component, ScriptPage, ComponentStyle } from '../../types';

interface PropertiesPanelProps {
  selectedComponent?: Component | null;
  onUpdateComponent: (id: string, updates: Partial<Component>) => void;
  pages: ScriptPage[];
  currentPageId: string;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedComponent,
  onUpdateComponent,
  pages,
  currentPageId,
}) => {
  if (!selectedComponent) {
    return (
      <div className="text-center py-12 text-slate-500">
        <Settings className="h-12 w-12 mx-auto mb-4 opacity-30" />
        <p className="text-sm font-medium">Aucun composant sélectionné</p>
        <p className="text-xs mt-1">Sélectionnez un composant sur le canevas pour voir ses propriétés.</p>
      </div>
    );
  }

  // --- Fonctions utilitaires pour mettre à jour les propriétés ---

  const updateConfig = (updates: any) => {
    onUpdateComponent(selectedComponent.id, {
      config: { ...selectedComponent.config, ...updates },
    });
  };

  const updateStyle = (styleUpdates: Partial<ComponentStyle>) => {
    onUpdateComponent(selectedComponent.id, {
      config: {
        ...selectedComponent.config,
        style: { ...selectedComponent.config.style, ...styleUpdates },
      },
    });
  };

  const updatePosition = (axis: 'x' | 'y', value: number) => {
    onUpdateComponent(selectedComponent.id, {
        position: { ...selectedComponent.position, [axis]: value }
    });
  };

  const updateSize = (dim: 'width' | 'height', value: number) => {
    onUpdateComponent(selectedComponent.id, {
        size: { ...selectedComponent.size, [dim]: value }
    });
  };

  // --- Rendu des sections de propriétés ---

  const renderContentSection = () => (
    <>
      {selectedComponent.config.text !== undefined && (
        <PropertyInput label="Texte" value={selectedComponent.config.text || ''} onChange={val => updateConfig({ text: val })} />
      )}
      {selectedComponent.config.placeholder !== undefined && (
        <PropertyInput label="Placeholder" value={selectedComponent.config.placeholder || ''} onChange={val => updateConfig({ placeholder: val })} />
      )}
       {selectedComponent.type === 'button' && (
            <div className="space-y-2 mt-4">
                <label className="block text-xs font-semibold text-slate-700 flex items-center">
                    <Link2 className="h-3 w-3 mr-1" />
                    Page de destination
                </label>
                <select
                    value={selectedComponent.config.targetPageId || ''}
                    onChange={(e) => updateConfig({ targetPageId: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Aucune navigation</option>
                    {pages.filter(p => p.id !== currentPageId).map(page => (
                        <option key={page.id} value={page.id}>
                        {page.name}
                        </option>
                    ))}
                </select>
            </div>
        )}
    </>
  );

  const renderStyleSection = () => (
    <div className="grid grid-cols-2 gap-4">
        <ColorInput label="Fond" value={selectedComponent.config.style?.backgroundColor || '#ffffff'} onChange={val => updateStyle({ backgroundColor: val })} />
        <ColorInput label="Texte" value={selectedComponent.config.style?.textColor || '#000000'} onChange={val => updateStyle({ textColor: val })} />
        <NumberInput label="Police" value={selectedComponent.config.style?.fontSize || 16} onChange={val => updateStyle({ fontSize: val })} />
        <NumberInput label="Arrondi" value={selectedComponent.config.style?.borderRadius || 0} onChange={val => updateStyle({ borderRadius: val })} />
        <NumberInput label="Padding" value={selectedComponent.config.style?.padding || 0} onChange={val => updateStyle({ padding: val })} />
    </div>
  );

  const renderLayoutSection = () => (
     <div className="grid grid-cols-2 gap-4">
        <NumberInput label="X" value={selectedComponent.position.x} onChange={val => updatePosition('x', val)} />
        <NumberInput label="Y" value={selectedComponent.position.y} onChange={val => updatePosition('y', val)} />
        <NumberInput label="Largeur" value={selectedComponent.size.width} onChange={val => updateSize('width', val)} />
        <NumberInput label="Hauteur" value={selectedComponent.size.height} onChange={val => updateSize('height', val)} />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
        <h3 className="font-semibold text-slate-800">{selectedComponent.type}</h3>
        <p className="text-xs text-slate-500">ID: {selectedComponent.id.slice(-6)}</p>
      </div>

      <Section title="Contenu" icon={Type}>
        {renderContentSection()}
      </Section>

      <Section title="Style" icon={Palette}>
        {renderStyleSection()}
      </Section>
      
      <Section title="Disposition" icon={Settings}>
        {renderLayoutSection()}
      </Section>
    </div>
  );
};


// --- Sous-composants pour les champs de propriétés ---

const Section: React.FC<{ title: string; icon: React.ElementType; children: React.ReactNode }> = ({ title, icon: Icon, children }) => (
  <div>
    <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center">
      <Icon className="h-4 w-4 mr-2 text-slate-500" />
      {title}
    </h4>
    <div className="space-y-3">{children}</div>
  </div>
);

const PropertyInput: React.FC<{ label: string; value: string; onChange: (value: string) => void }> = ({ label, value, onChange }) => (
    <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">{label}</label>
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
    </div>
);

const NumberInput: React.FC<{ label: string; value: number; onChange: (value: number) => void }> = ({ label, value, onChange }) => (
    <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">{label}</label>
        <input
            type="number"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value, 10))}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
    </div>
);

const ColorInput: React.FC<{ label: string; value: string; onChange: (value: string) => void }> = ({ label, value, onChange }) => (
    <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">{label}</label>
        <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-10 p-1 border border-slate-300 rounded-lg cursor-pointer"
        />
    </div>
);