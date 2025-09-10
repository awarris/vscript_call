// chemin: vscript_call/src/components/panels/PropertiesPanel.tsx

import React from 'react';
import { Settings, Palette, Type, Link2, AlignCenter, AlignLeft, AlignRight, Bold, Italic, Underline, Globe, Image as ImageIcon } from 'lucide-react';
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

  // --- Fonctions utilitaires ---

  const updateConfig = (updates: Partial<Component['config']>) => {
    onUpdateComponent(selectedComponent.id, {
      config: { ...selectedComponent.config, ...updates },
    });
  };

  const updateStyle = (styleUpdates: Partial<ComponentStyle>) => {
    onUpdateComponent(selectedComponent.id, {
      config: {
        ...selectedComponent.config,
        style: { ...(selectedComponent.config.style || {}), ...styleUpdates },
      },
    });
  };

    const updateBorderStyle = (property: 'borderStyle' | 'borderColor' | 'borderWidth', value: any) => {
        updateStyle({ [property]: value });
    };


  const toggleStyle = (property: keyof React.CSSProperties, valueA: any, valueB: any) => {
    const currentStyle = selectedComponent.config.style || {};
    updateStyle({ [property]: currentStyle[property] === valueA ? valueB : valueA });
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

  // --- Sections de propriétés ---

  const renderContentSection = () => (
    <>
      {(['paragraphe', 'h1', 'button'].includes(selectedComponent.type)) && (
         <TextareaInput label="Contenu" value={selectedComponent.config.value || ''} onChange={val => updateConfig({ value: val })} />
      )}
       {selectedComponent.type === 'checkbox' && (
         <PropertyInput label="Libellé" value={selectedComponent.config.label || ''} onChange={val => updateConfig({ label: val })} />
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
                        <option key={page.id} value={page.id}>{page.name}</option>
                    ))}
                </select>
            </div>
        )}
    </>
  );
  
    const renderImageContentSection = () => (
        <div className="space-y-4">
            <PropertyInput
                label="URL de l'image (src)"
                value={selectedComponent.config.src || ''}
                onChange={val => updateConfig({ src: val })}
            />
            <PropertyInput
                label="Texte alternatif (alt)"
                value={selectedComponent.config.alt || ''}
                onChange={val => updateConfig({ alt: val })}
            />
        </div>
    );


  const renderIframeSection = () => (
    <div className="space-y-4">
      <PropertyInput
        label="URL de la source (src)"
        value={selectedComponent.config.src || ''}
        onChange={val => updateConfig({ src: val, htmlContent: '' })}
      />
      <TextareaInput
        label="Contenu HTML direct"
        value={selectedComponent.config.htmlContent || ''}
        onChange={val => updateConfig({ htmlContent: val, src: '' })}
      />
    </div>
  );

  const renderTypographySection = () => {
    const style = selectedComponent.config.style || {};
    const fontSize = parseInt(String(style.fontSize || '16').replace('px', ''), 10);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Police</label>
                    <select
                        value={style.fontFamily || "'Inter', sans-serif"}
                        onChange={e => updateStyle({ fontFamily: e.target.value })}
                        className="w-full text-xs bg-white border border-slate-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="'Inter', sans-serif">Inter</option>
                        <option value="'Arial', sans-serif">Arial</option>
                        <option value="'Georgia', serif">Georgia</option>
                        <option value="'Courier New', monospace">Courier</option>
                        <option value="'Times New Roman', serif">Times</option>
                    </select>
                </div>
                <NumberInput label="Taille" value={isNaN(fontSize) ? 16 : fontSize} onChange={val => updateStyle({ fontSize: `${val}px` })} />
                <ColorInput label="Couleur du texte" value={style.color || '#000000'} onChange={val => updateStyle({ color: val })} />
            </div>
             <div className="flex items-center space-x-2">
                <ToggleButton label="Gras" isActive={style.fontWeight === 'bold'} onClick={() => toggleStyle('fontWeight', 'bold', 'normal')}><Bold size={16} /></ToggleButton>
                <ToggleButton label="Italique" isActive={style.fontStyle === 'italic'} onClick={() => toggleStyle('fontStyle', 'italic', 'normal')}><Italic size={16} /></ToggleButton>
                <ToggleButton label="Souligné" isActive={style.textDecoration === 'underline'} onClick={() => toggleStyle('textDecoration', 'underline', 'none')}><Underline size={16} /></ToggleButton>
            </div>
            <div className="flex items-center space-x-2">
                <ToggleButton label="Gauche" isActive={!style.textAlign || style.textAlign === 'left'} onClick={() => updateStyle({ textAlign: 'left' })}><AlignLeft size={16} /></ToggleButton>
                <ToggleButton label="Centre" isActive={style.textAlign === 'center'} onClick={() => updateStyle({ textAlign: 'center' })}><AlignCenter size={16} /></ToggleButton>
                <ToggleButton label="Droite" isActive={style.textAlign === 'right'} onClick={() => updateStyle({ textAlign: 'right' })}><AlignRight size={16} /></ToggleButton>
            </div>
        </div>
    );
  };
    const renderImageAppearanceSection = () => {
        const style = selectedComponent.config.style || {};
        return (
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Ajustement</label>
                    <select
                        value={style.objectFit || 'cover'}
                        onChange={e => updateStyle({ objectFit: e.target.value })}
                        className="w-full text-xs bg-white border border-slate-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="cover">Remplir (Cover)</option>
                        <option value="contain">Contenir (Contain)</option>
                        <option value="fill">Étirer (Fill)</option>
                        <option value="none">Aucun (None)</option>
                        <option value="scale-down">Réduire (Scale Down)</option>
                    </select>
                </div>
                <NumberInput label="Opacité (%)" value={(style.opacity || 1) * 100} onChange={val => updateStyle({ opacity: val / 100 })} />
                <NumberInput label="Arrondi (px)" value={parseInt(String(style.borderRadius || '0').replace('px', ''), 10)} onChange={val => updateStyle({ borderRadius: `${val}px` })} />
                
                <div>
                    <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-4 mb-2">Bordure</h5>
                    <div className="grid grid-cols-2 gap-4">
                        <NumberInput label="Épaisseur (px)" value={parseInt(String(style.borderWidth || '0').replace('px', ''), 10)} onChange={val => updateBorderStyle('borderWidth', `${val}px`)} />
                        <ColorInput label="Couleur" value={style.borderColor || '#000000'} onChange={val => updateBorderStyle('borderColor', val)} />
                        <div className="col-span-2">
                             <label className="block text-xs font-semibold text-slate-700 mb-1">Style</label>
                            <select
                                value={style.borderStyle || 'none'}
                                onChange={e => updateBorderStyle('borderStyle', e.target.value)}
                                className="w-full text-xs bg-white border border-slate-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="none">Aucun</option>
                                <option value="solid">Solide</option>
                                <option value="dashed">Tirets</option>
                                <option value="dotted">Pointillés</option>
                                <option value="double">Double</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        );
    };


  const renderAppearanceSection = () => (
    <div className="grid grid-cols-2 gap-4">
        <ColorInput label="Fond" value={selectedComponent.config.style?.backgroundColor || '#ffffff'} onChange={val => updateStyle({ backgroundColor: val })} />
        <NumberInput label="Arrondi" value={parseInt(String(selectedComponent.config.style?.borderRadius || '0').replace('px',''), 10)} onChange={val => updateStyle({ borderRadius: `${val}px` })} />
        <NumberInput label="Padding" value={parseInt(String(selectedComponent.config.style?.padding || '0').replace('px',''), 10)} onChange={val => updateStyle({ padding: `${val}px` })} />
    </div>
  );

  const renderCalculatorStyles = () => (
    <div className="space-y-4">
        <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Couleurs Générales</h5>
        <div className="grid grid-cols-2 gap-4">
            <ColorInput label="Fond" value={selectedComponent.config.style?.backgroundColor || '#f1f5f9'} onChange={val => updateStyle({ backgroundColor: val })} />
            <ColorInput label="Écran" value={selectedComponent.config.style?.displayColor || '#e2e8f0'} onChange={val => updateStyle({ displayColor: val })} />
            <ColorInput label="Texte Écran" value={selectedComponent.config.style?.displayTextColor || '#0f172a'} onChange={val => updateStyle({ displayTextColor: val })} />
        </div>
        <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-4">Couleurs des Boutons</h5>
        <div className="grid grid-cols-2 gap-4">
            <ColorInput label="Chiffres" value={selectedComponent.config.style?.buttonColor || '#ffffff'} onChange={val => updateStyle({ buttonColor: val })} />
            <ColorInput label="Texte Chiffres" value={selectedComponent.config.style?.buttonTextColor || '#0f172a'} onChange={val => updateStyle({ buttonTextColor: val })} />
            <ColorInput label="Opérateurs" value={selectedComponent.config.style?.operatorColor || '#fefce8'} onChange={val => updateStyle({ operatorColor: val })} />
            <ColorInput label="Texte Opérateurs" value={selectedComponent.config.style?.operatorTextColor || '#0f172a'} onChange={val => updateStyle({ operatorTextColor: val })} />
            <ColorInput label="Effacer (C)" value={selectedComponent.config.style?.clearColor || '#fecaca'} onChange={val => updateStyle({ clearColor: val })} />
            <ColorInput label="Texte Effacer" value={selectedComponent.config.style?.clearTextColor || '#0f172a'} onChange={val => updateStyle({ clearTextColor: val })} />
            <ColorInput label="Égal (=)" value={selectedComponent.config.style?.equalColor || '#2563eb'} onChange={val => updateStyle({ equalColor: val })} />
            <ColorInput label="Texte Égal" value={selectedComponent.config.style?.equalTextColor || '#ffffff'} onChange={val => updateStyle({ equalTextColor: val })} />
        </div>
    </div>
  )

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

      {['paragraphe', 'h1', 'button', 'input', 'textarea', 'checkbox'].includes(selectedComponent.type) && (
        <Section title="Contenu" icon={Type}>
            {renderContentSection()}
        </Section>
      )}

      {selectedComponent.type === 'image' && (
          <Section title="Contenu de l'image" icon={ImageIcon}>
              {renderImageContentSection()}
          </Section>
      )}
      
      {selectedComponent.type === 'iframe' && (
        <Section title="Contenu Iframe" icon={Globe}>
          {renderIframeSection()}
        </Section>
      )}

      {(['paragraphe', 'textarea', 'h1', 'button', 'checkbox'].includes(selectedComponent.type)) && (
        <Section title="Typographie" icon={Type}>
            {renderTypographySection()}
        </Section>
      )}

      <Section title="Apparence" icon={Palette}>
        {selectedComponent.type === 'calculator' && renderCalculatorStyles()}
        {selectedComponent.type === 'image' && renderImageAppearanceSection()}
        {!['calculator', 'image'].includes(selectedComponent.type) && renderAppearanceSection()}
      </Section>

      <Section title="Disposition" icon={Settings}>
        {renderLayoutSection()}
      </Section>
    </div>
  );
};


// --- Sous-composants ---

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

const TextareaInput: React.FC<{ label: string; value: string; onChange: (value: string) => void }> = ({ label, value, onChange }) => (
    <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">{label}</label>
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
        />
    </div>
);


const NumberInput: React.FC<{ label: string; value: number; onChange: (value: number) => void }> = ({ label, value, onChange }) => (
    <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">{label}</label>
        <input
            type="number"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
    </div>
);

const ColorInput: React.FC<{ label: string; value: string; onChange: (value: string) => void }> = ({ label, value, onChange }) => (
    <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">{label}</label>
        <div className="flex items-center h-10 space-x-2 border border-slate-300 rounded-lg px-2">
            <input
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-6 h-6 p-0 border-none rounded cursor-pointer bg-transparent"
                style={{ appearance: 'none', WebkitAppearance: 'none' }}
            />
            <input
                type="text"
                value={value.toUpperCase()}
                onChange={(e) => onChange(e.target.value)}
                className="w-full text-sm font-mono outline-none border-none focus:ring-0 bg-transparent"
                onBlur={(e) => {
                    if (!/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                       onChange(value);
                    }
                }}
            />
        </div>
    </div>
);


const ToggleButton: React.FC<{ label: string; isActive: boolean; onClick: () => void; children: React.ReactNode }> = ({ label, isActive, onClick, children }) => (
    <button
        title={label}
        onClick={onClick}
        className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
    >
        {children}
    </button>
);