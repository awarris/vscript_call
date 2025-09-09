// chemin: vscript_call/src/App.tsx

import React, { useState, useCallback, useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { VerticalMenu } from './components/layout/VerticalMenu';
import { SidePanel } from './components/layout/SidePanel';
import { Toolbar } from './components/Toolbar/Toolbar';
import { Canvas } from './components/Canvas/Canvas';
import { PreviewPane } from './components/PreviewPane/PreviewPane';
import { PageManager } from './components/panels/PageManager';
import { ComponentPalette } from './components/panels/ComponentPalette';
import { PropertiesPanel } from './components/panels/PropertiesPanel';
import { WorkflowPanel } from './components/panels/WorkflowPanel';
import { VariablesPanel } from './components/panels/VariablesPanel';
import { Component, ComponentConfig, ScriptPage, Script } from './types';
import { generateId, importScriptFromJSON } from './utils/helpers';
import { useHistoryState } from './hooks/useHistoryState';

// --- SCRIPT PAR DÉFAUT ---
// Cette fonction crée un script de vente complet pour un centre d'appel.
const createInitialScript = (): Script => {
    // --- IDs uniques pour les pages, composants, variables et workflows ---
    // Utiliser des IDs fixes permet de lier facilement les éléments entre eux.
    const pageIds = {
        accueil: 'page-accueil',
        presentation: 'page-presentation',
        objection: 'page-objection',
        rdv: 'page-rdv',
        fin: 'page-fin',
    };

    const varIds = {
        nomProspect: 'var-nom-prospect',
        interet: 'var-interet',
    };

    const componentIds = {
        // Page Accueil
        accueilTitre: 'comp-accueil-titre',
        accueilNomLabel: 'comp-accueil-nom-label',
        accueilNomInput: 'comp-accueil-nom-input',
        accueilInteretLabel: 'comp-accueil-interet-label',
        accueilBtnInteresse: 'comp-accueil-btn-interesse',
        accueilBtnPasInteresse: 'comp-accueil-btn-pas-interesse',
        // Page Présentation
        presentationTitre: 'comp-presentation-titre',
        presentationTexte: 'comp-presentation-texte',
        presentationBtnRdv: 'comp-presentation-btn-rdv',
        presentationBtnRefus: 'comp-presentation-btn-refus',
        // Page Objection
        objectionTitre: 'comp-objection-titre',
        objectionArgumentaire: 'comp-objection-argumentaire',
        objectionBtnRdv: 'comp-objection-btn-rdv-apres',
        objectionBtnFin: 'comp-objection-btn-fin',
        // Page RDV
        rdvTitre: 'comp-rdv-titre',
        rdvConfirmation: 'comp-rdv-confirmation',
        rdvBtnFin: 'comp-rdv-btn-fin',
        // Page Fin
        finTitre: 'comp-fin-titre',
    };

    // --- Définition du script ---
    return {
        id: 'script-call-center-v1',
        name: 'Script Vente Énergie',
        description: 'Script de vente pour les offres d\'énergie renouvelable.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        settings: {
            theme: 'light',
            primaryColor: '#16a34a', // Vert
            secondaryColor: '#f97316', // Orange
            fontFamily: 'Inter, sans-serif'
        },

        // --- VARIABLES GLOBALES ---
        // Elles stockent les informations clés de l'appel.
        globalVariables: [
            { id: varIds.nomProspect, name: 'nomProspect', type: 'string', defaultValue: '', description: 'Nom du contact' },
            { id: varIds.interet, name: 'estInteresse', type: 'boolean', defaultValue: false, description: 'Le prospect est-il intéressé ?' }
        ],

        // --- PAGES DU SCRIPT ---
        // Chaque page représente une étape de l'appel.
        pages: [
            { id: pageIds.accueil, name: 'Accueil & Qualification', isHomePage: true, backgroundColor: '#f0fdf4', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { id: pageIds.presentation, name: 'Présentation de l\'offre', isHomePage: false, backgroundColor: '#eff6ff', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { id: pageIds.objection, name: 'Traitement d\'objection', isHomePage: false, backgroundColor: '#fffbeb', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { id: pageIds.rdv, name: 'Prise de RDV', isHomePage: false, backgroundColor: '#f0fdfa', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { id: pageIds.fin, name: 'Fin de l\'appel', isHomePage: false, backgroundColor: '#f1f5f9', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        ],

        // --- COMPOSANTS VISUELS PAR PAGE ---
        components: [
            // -- Page 1: Accueil & Qualification --
            { id: componentIds.accueilTitre, pageId: pageIds.accueil, type: 'text', position: { x: 40, y: 30 }, size: { width: 500, height: 50 }, config: { text: 'Qualification du Prospect', style: { fontSize: 28, fontWeight: 'bold' } } },
            { id: componentIds.accueilNomLabel, pageId: pageIds.accueil, type: 'text', position: { x: 40, y: 100 }, size: { width: 200, height: 30 }, config: { text: 'Nom du prospect :', style: { fontSize: 16 } } },
            { id: componentIds.accueilNomInput, pageId: pageIds.accueil, type: 'input', position: { x: 40, y: 140 }, size: { width: 300, height: 40 }, config: { placeholder: 'Entrez le nom...', style: { borderWidth: 1, borderRadius: 8, padding: 10, borderColor: '#cbd5e1' } } },
            { id: componentIds.accueilInteretLabel, pageId: pageIds.accueil, type: 'text', position: { x: 40, y: 220 }, size: { width: 400, height: 30 }, config: { text: 'Après votre présentation, le prospect est-il intéressé ?', style: { fontSize: 16 } } },
            { id: componentIds.accueilBtnInteresse, pageId: pageIds.accueil, type: 'button', position: { x: 40, y: 270 }, size: { width: 140, height: 40 }, config: { text: '✅ Intéressé', style: { backgroundColor: '#22c55e', textColor: 'white', borderRadius: 8, textAlign: 'center' } } },
            { id: componentIds.accueilBtnPasInteresse, pageId: pageIds.accueil, type: 'button', position: { x: 200, y: 270 }, size: { width: 140, height: 40 }, config: { text: '❌ Pas intéressé', style: { backgroundColor: '#ef4444', textColor: 'white', borderRadius: 8, textAlign: 'center' } } },
            
            // -- Page 2: Présentation de l'offre --
            { id: componentIds.presentationTitre, pageId: pageIds.presentation, type: 'text', position: { x: 40, y: 30 }, size: { width: 600, height: 50 }, config: { text: 'Présentation de l\'Offre Éco+', style: { fontSize: 28, fontWeight: 'bold' } } },
            { id: componentIds.presentationTexte, pageId: pageIds.presentation, type: 'text', position: { x: 40, y: 100 }, size: { width: 600, height: 120 }, config: { text: 'Notre offre Éco+ permet de réduire votre facture de 20% en moyenne. L\'installation est prise en charge. Souhaitez-vous planifier un rdv avec un expert pour un bilan gratuit et sans engagement ?', style: { fontSize: 16, textAlign: 'left' } } },
            { id: componentIds.presentationBtnRdv, pageId: pageIds.presentation, type: 'button', position: { x: 40, y: 250 }, size: { width: 160, height: 40 }, config: { text: 'Planifier un RDV', style: { backgroundColor: '#3b82f6', textColor: 'white', borderRadius: 8, textAlign: 'center' } } },
            { id: componentIds.presentationBtnRefus, pageId: pageIds.presentation, type: 'button', position: { x: 220, y: 250 }, size: { width: 160, height: 40 }, config: { text: 'Je ne suis pas sûr', style: { backgroundColor: '#f97316', textColor: 'white', borderRadius: 8, textAlign: 'center' } } },
            
            // -- Page 3: Traitement d'objection --
            { id: componentIds.objectionTitre, pageId: pageIds.objection, type: 'text', position: { x: 40, y: 30 }, size: { width: 500, height: 50 }, config: { text: 'Traitement de l\'objection', style: { fontSize: 28, fontWeight: 'bold' } } },
            { id: componentIds.objectionArgumentaire, pageId: pageIds.objection, type: 'text', position: { x: 40, y: 100 }, size: { width: 600, height: 100 }, config: { text: 'Je comprends votre hésitation. C\'est justement pour cela que le rendez-vous est gratuit et sans engagement. Il permet simplement de faire un bilan complet de vos économies potentielles. Ça ne prend que 20 minutes.', style: { fontSize: 16 } } },
            { id: componentIds.objectionBtnRdv, pageId: pageIds.objection, type: 'button', position: { x: 40, y: 220 }, size: { width: 180, height: 40 }, config: { text: 'D\'accord, planifions-le', targetPageId: pageIds.rdv, style: { backgroundColor: '#3b82f6', textColor: 'white', borderRadius: 8, textAlign: 'center' } } },
            { id: componentIds.objectionBtnFin, pageId: pageIds.objection, type: 'button', position: { x: 240, y: 220 }, size: { width: 160, height: 40 }, config: { text: 'Non, merci', targetPageId: pageIds.fin, style: { backgroundColor: '#64748b', textColor: 'white', borderRadius: 8, textAlign: 'center' } } },

            // -- Page 4: Prise de RDV --
            { id: componentIds.rdvTitre, pageId: pageIds.rdv, type: 'text', position: { x: 40, y: 30 }, size: { width: 500, height: 50 }, config: { text: 'Confirmation du RDV', style: { fontSize: 28, fontWeight: 'bold' } } },
            { id: componentIds.rdvConfirmation, pageId: pageIds.rdv, type: 'text', position: { x: 40, y: 100 }, size: { width: 600, height: 60 }, config: { text: 'Parfait ! Le rendez-vous est bien noté. Votre expert vous contactera pour confirmer le créneau. Merci de votre confiance.', style: { fontSize: 16 } } },
            { id: componentIds.rdvBtnFin, pageId: pageIds.rdv, type: 'button', position: { x: 40, y: 200 }, size: { width: 160, height: 40 }, config: { text: 'Terminer l\'appel', targetPageId: pageIds.fin, style: { backgroundColor: '#64748b', textColor: 'white', borderRadius: 8, textAlign: 'center' } } },

            // -- Page 5: Fin de l'appel --
            { id: componentIds.finTitre, pageId: pageIds.fin, type: 'text', position: { x: 40, y: 150 }, size: { width: 600, height: 50 }, config: { text: 'Fin de l\'appel.', style: { fontSize: 32, fontWeight: 'bold', textAlign: 'center' } } },
        ],

        // --- WORKFLOWS (LOGIQUE) ---
        // C'est ici que la magie opère, en connectant les actions aux composants.
        workflowRules: [
            // WF-1: Met à jour la variable `nomProspect` à chaque fois que le texte du champ change.
            {
                id: 'workflow-update-name', name: 'Mettre à jour le nom du prospect', pageId: pageIds.accueil,
                trigger: { type: 'onChange', componentId: componentIds.accueilNomInput },
                conditions: [],
                actions: [
                    { id: generateId(), type: 'setVariable', config: { variableId: varIds.nomProspect, valueFrom: { componentId: componentIds.accueilNomInput, property: 'value' } } }
                ]
            },
            // WF-2: Si l'agent clique sur "Intéressé"
            {
                id: 'workflow-interesse', name: 'Navigation si intéressé', pageId: pageIds.accueil,
                trigger: { type: 'onClick', componentId: componentIds.accueilBtnInteresse },
                conditions: [],
                actions: [
                    // Action 1: Met la variable `estInteresse` à `true`
                    { id: generateId(), type: 'setVariable', config: { variableId: varIds.interet, value: true } },
                    // Action 2: Navigue vers la page de présentation
                    { id: generateId(), type: 'navigate', config: { pageId: pageIds.presentation } }
                ]
            },
            // WF-3: Si l'agent clique sur "Pas intéressé"
            {
                id: 'workflow-pas-interesse', name: 'Navigation si pas intéressé', pageId: pageIds.accueil,
                trigger: { type: 'onClick', componentId: componentIds.accueilBtnPasInteresse },
                conditions: [],
                actions: [
                     // Action 1: Met la variable `estInteresse` à `false`
                    { id: generateId(), type: 'setVariable', config: { variableId: varIds.interet, value: false } },
                    // Action 2: Navigue vers la page de traitement d'objection
                    { id: generateId(), type: 'navigate', config: { pageId: pageIds.objection } }
                ]
            },
            // WF-4: Depuis la page Présentation, l'agent clique sur "Prendre RDV"
            {
                id: 'workflow-go-to-rdv', name: 'Navigation vers prise de RDV', pageId: pageIds.presentation,
                trigger: { type: 'onClick', componentId: componentIds.presentationBtnRdv },
                conditions: [],
                actions: [
                    { id: generateId(), type: 'navigate', config: { pageId: pageIds.rdv } }
                ]
            },
            // WF-5: Depuis la page Présentation, le prospect hésite
            {
                id: 'workflow-go-to-objection', name: 'Navigation vers objection', pageId: pageIds.presentation,
                trigger: { type: 'onClick', componentId: componentIds.presentationBtnRefus },
                conditions: [],
                actions: [
                    { id: generateId(), type: 'navigate', config: { pageId: pageIds.objection } }
                ]
            },
        ]
    };
};

// --- COMPOSANT APP PRINCIPAL ---
function App() {
  const {
    state: script,
    setState: setScript,
    resetState: resetScript,
    undo,
    redo,
    canUndo,
    canRedo
  } = useHistoryState<Script>(createInitialScript());
  
  const [currentPageId, setCurrentPageId] = useState<string>('page-accueil');
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [activePanel, setActivePanel] = useState<string>('pages');

  // Utilisation de useMemo pour optimiser et ne recalculer que si nécessaire
  const currentPage = useMemo(() => script.pages.find(page => page.id === currentPageId), [script.pages, currentPageId]);
  const currentPageComponents = useMemo(() => script.components.filter(comp => comp.pageId === currentPageId), [script.components, currentPageId]);
  const selectedComponent = useMemo(() => script.components.find(c => c.id === selectedComponentId), [script.components, selectedComponentId]);

  const handleUpdateScript = useCallback((newScript: Script) => {
    resetScript(newScript);
    const homePage = newScript.pages.find(p => p.isHomePage) || newScript.pages[0];
    if (homePage) {
      setCurrentPageId(homePage.id);
    }
  }, [resetScript]);

  const updateScriptDetails = useCallback((updates: Partial<Script>) => {
    setScript(prev => ({ ...prev, ...updates, updatedAt: new Date().toISOString() }));
  }, [setScript]);

  const addComponent = useCallback((type: string, config: ComponentConfig, size: {width: number, height: number}, position?: { x: number; y: number }) => {
    const newComponent: Component = {
      id: generateId(),
      type,
      config,
      position: position || { x: 50, y: 50 },
      size,
      pageId: currentPageId
    };
    setScript(prev => ({ ...prev, components: [...prev.components, newComponent] }));
    setSelectedComponentId(newComponent.id);
    return newComponent.id;
  }, [currentPageId, setScript]);

  const updateComponent = useCallback((id: string, updates: Partial<Component>) => {
    setScript(prev => ({
      ...prev,
      components: prev.components.map(comp => comp.id === id ? { ...comp, ...updates } : comp)
    }));
  }, [setScript]);

  const removeComponent = useCallback((id: string) => {
    setScript(prev => ({
      ...prev,
      components: prev.components.filter(comp => comp.id !== id)
    }));
    if (selectedComponentId === id) {
      setSelectedComponentId(null);
    }
  }, [selectedComponentId, setScript]);

  const duplicateComponent = useCallback((id: string) => {
    const componentToDuplicate = script.components.find(comp => comp.id === id);
    if (componentToDuplicate) {
      const newComponent: Component = {
        ...componentToDuplicate,
        id: generateId(),
        position: {
          x: componentToDuplicate.position.x + 20,
          y: componentToDuplicate.position.y + 20
        }
      };
      setScript(prev => ({ ...prev, components: [...prev.components, newComponent] }));
    }
  }, [script.components, setScript]);
  
  const handleNavigateToPage = useCallback((pageId: string) => {
    if (script.pages.find(page => page.id === pageId)) {
        setCurrentPageId(pageId);
        setSelectedComponentId(null);
    }
  }, [script.pages]);


  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen bg-slate-100 font-sans">
        <VerticalMenu activePanel={activePanel} setActivePanel={setActivePanel} />
        <SidePanel activePanel={activePanel}>
          {activePanel === 'components' && <ComponentPalette onAddComponent={addComponent} />}
          {activePanel === 'pages' && (
            <PageManager
              script={script}
              setScript={setScript}
              currentPageId={currentPageId}
              setCurrentPageId={setCurrentPageId}
            />
           )}
          {activePanel === 'workflows' && (
            <WorkflowPanel 
                script={script} 
                setScript={setScript} 
                currentPageId={currentPageId} 
            />
          )}
          {activePanel === 'variables' && (
            <VariablesPanel 
                script={script} 
                setScript={setScript} 
            />
          )}
          {activePanel === 'properties' && (
            <PropertiesPanel
                selectedComponent={selectedComponent}
                onUpdateComponent={updateComponent}
                pages={script.pages}
                currentPageId={currentPageId}
            />
           )}
        </SidePanel>
        <main className="flex-1 flex flex-col overflow-hidden">
          <Toolbar
            script={script}
            onUpdateScript={updateScriptDetails}
            onImportScript={handleUpdateScript}
            isPreviewMode={isPreviewMode}
            onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
            currentDevice={device}
            onDeviceChange={setDevice}
            undo={undo}
            redo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
          />
          <div className="flex-1 overflow-auto">
            {isPreviewMode ? (
              <PreviewPane
                script={script}
                currentPageId={currentPageId}
                device={device}
                onNavigateToPage={handleNavigateToPage}
              />
            ) : (
              <Canvas
                components={currentPageComponents}
                onUpdateComponent={updateComponent}
                onRemoveComponent={removeComponent}
                onDuplicateComponent={duplicateComponent}
                selectedComponentId={selectedComponentId}
                onSelectComponent={setSelectedComponentId}
                device={device}
                onAddComponent={addComponent}
                currentPage={currentPage}
                onUpdatePage={(updates) => {
                    setScript(prev => ({
                        ...prev,
                        pages: prev.pages.map(p => p.id === currentPageId ? {...p, ...updates} : p)
                    }))
                }}
              />
            )}
          </div>
        </main>
      </div>
    </DndProvider>
  );
}

export default App;