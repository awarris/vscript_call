// chemin: vscript_call/src/data/defaultScript.ts

import { Script } from '../types';
import { generateId } from '../utils/helpers';

/**
 * Crée un script de vente complet et interactif pour un centre d'appel.
 * Ce script sert de modèle par défaut pour tout nouveau projet.
 * @param scriptName - Le nom à donner au nouveau script.
 * @returns Un objet Script complet.
 */
export const createDefaultScript = (scriptName: string): Script => {
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
        accueilTitre: 'comp-accueil-titre',
        accueilNomInput: 'comp-accueil-nom-input',
        accueilBtnInteresse: 'comp-accueil-btn-interesse',
        accueilBtnPasInteresse: 'comp-accueil-btn-pas-interesse',
        presentationTitre: 'comp-presentation-titre',
        presentationTexte: 'comp-presentation-texte',
        presentationBtnRdv: 'comp-presentation-btn-rdv',
        presentationBtnRefus: 'comp-presentation-btn-refus',
        objectionTitre: 'comp-objection-titre',
        objectionArgumentaire: 'comp-objection-argumentaire',
        objectionBtnRdv: 'comp-objection-btn-rdv-apres',
        objectionBtnFin: 'comp-objection-btn-fin',
        rdvTitre: 'comp-rdv-titre',
        rdvConfirmation: 'comp-rdv-confirmation',
        rdvBtnFin: 'comp-rdv-btn-fin',
        finTitre: 'comp-fin-titre',
    };

    return {
        id: generateId(),
        name: scriptName,
        description: 'Script de vente pour les offres d\'énergie renouvelable.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        settings: {
            fontFamily: 'Inter, sans-serif'
        },
        globalVariables: [
            { id: varIds.nomProspect, name: 'nomProspect', type: 'string', defaultValue: '', description: 'Nom du contact' },
            { id: varIds.interet, name: 'estInteresse', type: 'boolean', defaultValue: false, description: 'Le prospect est-il intéressé ?' }
        ],
        pages: [
            { id: pageIds.accueil, name: 'Accueil & Qualification', isHomePage: true, backgroundColor: '#f0fdf4', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { id: pageIds.presentation, name: 'Présentation de l\'offre', isHomePage: false, backgroundColor: '#eff6ff', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { id: pageIds.objection, name: 'Traitement d\'objection', isHomePage: false, backgroundColor: '#fffbeb', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { id: pageIds.rdv, name: 'Prise de RDV', isHomePage: false, backgroundColor: '#f0fdfa', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { id: pageIds.fin, name: 'Fin de l\'appel', isHomePage: false, backgroundColor: '#f1f5f9', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        ],
        components: [
            { id: componentIds.accueilTitre, pageId: pageIds.accueil, type: 'text', position: { x: 40, y: 30 }, size: { width: 500, height: 50 }, config: { text: 'Qualification du Prospect', style: { fontSize: 28, fontWeight: 'bold' } } },
            { id: 'comp-accueil-nom-label', pageId: pageIds.accueil, type: 'text', position: { x: 40, y: 100 }, size: { width: 200, height: 30 }, config: { text: 'Nom du prospect :', style: { fontSize: 16 } } },
            { id: componentIds.accueilNomInput, pageId: pageIds.accueil, type: 'input', position: { x: 40, y: 140 }, size: { width: 300, height: 40 }, config: { placeholder: 'Entrez le nom...', style: { borderWidth: 1, borderRadius: 8, padding: 10, borderColor: '#cbd5e1' } } },
            { id: 'comp-accueil-interet-label', pageId: pageIds.accueil, type: 'text', position: { x: 40, y: 220 }, size: { width: 400, height: 30 }, config: { text: 'Le prospect est-il intéressé ?', style: { fontSize: 16 } } },
            { id: componentIds.accueilBtnInteresse, pageId: pageIds.accueil, type: 'button', position: { x: 40, y: 270 }, size: { width: 140, height: 40 }, config: { text: '✅ Intéressé', style: { backgroundColor: '#22c55e', textColor: 'white', borderRadius: 8, textAlign: 'center' } } },
            { id: componentIds.accueilBtnPasInteresse, pageId: pageIds.accueil, type: 'button', position: { x: 200, y: 270 }, size: { width: 140, height: 40 }, config: { text: '❌ Pas intéressé', style: { backgroundColor: '#ef4444', textColor: 'white', borderRadius: 8, textAlign: 'center' } } },
            { id: componentIds.presentationTitre, pageId: pageIds.presentation, type: 'text', position: { x: 40, y: 30 }, size: { width: 600, height: 50 }, config: { text: 'Présentation de l\'Offre Éco+', style: { fontSize: 28, fontWeight: 'bold' } } },
            { id: componentIds.presentationTexte, pageId: pageIds.presentation, type: 'text', position: { x: 40, y: 100 }, size: { width: 600, height: 120 }, config: { text: 'Notre offre permet de réduire votre facture de 20%. Souhaitez-vous planifier un rdv avec un expert pour un bilan gratuit ?', style: { fontSize: 16, textAlign: 'left' } } },
            { id: componentIds.presentationBtnRdv, pageId: pageIds.presentation, type: 'button', position: { x: 40, y: 250 }, size: { width: 160, height: 40 }, config: { text: 'Planifier un RDV', style: { backgroundColor: '#3b82f6', textColor: 'white', borderRadius: 8, textAlign: 'center' } } },
            { id: componentIds.presentationBtnRefus, pageId: pageIds.presentation, type: 'button', position: { x: 220, y: 250 }, size: { width: 160, height: 40 }, config: { text: 'Je ne suis pas sûr', style: { backgroundColor: '#f97316', textColor: 'white', borderRadius: 8, textAlign: 'center' } } },
            { id: componentIds.objectionTitre, pageId: pageIds.objection, type: 'text', position: { x: 40, y: 30 }, size: { width: 500, height: 50 }, config: { text: 'Traitement de l\'objection', style: { fontSize: 28, fontWeight: 'bold' } } },
            { id: componentIds.objectionArgumentaire, pageId: pageIds.objection, type: 'text', position: { x: 40, y: 100 }, size: { width: 600, height: 100 }, config: { text: 'Je comprends. Sachez que le rendez-vous est gratuit et sans engagement. Il permet de faire un bilan complet de vos économies potentielles.', style: { fontSize: 16 } } },
            { id: componentIds.objectionBtnRdv, pageId: pageIds.objection, type: 'button', position: { x: 40, y: 220 }, size: { width: 180, height: 40 }, config: { text: 'D\'accord, planifions-le', targetPageId: pageIds.rdv, style: { backgroundColor: '#3b82f6', textColor: 'white', borderRadius: 8, textAlign: 'center' } } },
            { id: componentIds.objectionBtnFin, pageId: pageIds.objection, type: 'button', position: { x: 240, y: 220 }, size: { width: 160, height: 40 }, config: { text: 'Non, merci', targetPageId: pageIds.fin, style: { backgroundColor: '#64748b', textColor: 'white', borderRadius: 8, textAlign: 'center' } } },
            { id: componentIds.rdvTitre, pageId: pageIds.rdv, type: 'text', position: { x: 40, y: 30 }, size: { width: 500, height: 50 }, config: { text: 'Confirmation du RDV', style: { fontSize: 28, fontWeight: 'bold' } } },
            { id: componentIds.rdvConfirmation, pageId: pageIds.rdv, type: 'text', position: { x: 40, y: 100 }, size: { width: 600, height: 60 }, config: { text: 'Parfait ! Le rendez-vous est noté. Merci de votre confiance.', style: { fontSize: 16 } } },
            { id: componentIds.rdvBtnFin, pageId: pageIds.rdv, type: 'button', position: { x: 40, y: 200 }, size: { width: 160, height: 40 }, config: { text: 'Terminer l\'appel', targetPageId: pageIds.fin, style: { backgroundColor: '#64748b', textColor: 'white', borderRadius: 8, textAlign: 'center' } } },
            { id: componentIds.finTitre, pageId: pageIds.fin, type: 'text', position: { x: 40, y: 150 }, size: { width: 600, height: 50 }, config: { text: 'Fin de l\'appel.', style: { fontSize: 32, fontWeight: 'bold', textAlign: 'center' } } },
        ],
        workflowRules: [
            {
                id: 'wf-update-name', name: 'MAJ Nom Prospect', pageId: pageIds.accueil,
                trigger: { type: 'onChange', componentId: componentIds.accueilNomInput }, conditions: [],
                actions: [{ id: generateId(), type: 'setVariable', config: { variableId: varIds.nomProspect, valueFrom: { componentId: componentIds.accueilNomInput, property: 'value' } } }]
            },
            {
                id: 'wf-interesse', name: 'Clic: Intéressé', pageId: pageIds.accueil,
                trigger: { type: 'onClick', componentId: componentIds.accueilBtnInteresse }, conditions: [],
                actions: [
                    { id: generateId(), type: 'setVariable', config: { variableId: varIds.interet, value: true } },
                    { id: generateId(), type: 'navigate', config: { pageId: pageIds.presentation } }
                ]
            },
            {
                id: 'wf-pas-interesse', name: 'Clic: Pas intéressé', pageId: pageIds.accueil,
                trigger: { type: 'onClick', componentId: componentIds.accueilBtnPasInteresse }, conditions: [],
                actions: [
                    { id: generateId(), type: 'setVariable', config: { variableId: varIds.interet, value: false } },
                    { id: generateId(), type: 'navigate', config: { pageId: pageIds.objection } }
                ]
            },
            {
                id: 'wf-go-rdv', name: 'Clic: Planifier RDV', pageId: pageIds.presentation,
                trigger: { type: 'onClick', componentId: componentIds.presentationBtnRdv }, conditions: [],
                actions: [{ id: generateId(), type: 'navigate', config: { pageId: pageIds.rdv } }]
            },
            {
                id: 'wf-go-objection', name: 'Clic: Pas sûr', pageId: pageIds.presentation,
                trigger: { type: 'onClick', componentId: componentIds.presentationBtnRefus }, conditions: [],
                actions: [{ id: generateId(), type: 'navigate', config: { pageId: pageIds.objection } }]
            },
            {
                id: 'wf-tooltip', name: 'Survol: Aide', pageId: pageIds.presentation,
                trigger: { type: 'onMouseEnter', componentId: componentIds.presentationTitre }, conditions: [],
                actions: [{ id: generateId(), type: 'showMessage', config: { message: 'Ceci est l\'offre principale à présenter.' } }]
            }
        ]
    };
};