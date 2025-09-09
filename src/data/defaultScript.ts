// chemin: src/data/defaultScript.ts

import { Script, ScriptPage } from '../types';
import { generateId } from '../utils/helpers';

/**
 * Crée un script entièrement vide avec juste une page d'accueil.
 * @param scriptName - Le nom du nouveau script.
 */
export const createNewEmptyScript = (scriptName: string): Script => {
  const homePageId = generateId();
  const homePage: ScriptPage = {
    id: homePageId,
    name: 'Page d\'accueil',
    description: 'Ceci est la première page de votre script.',
    isHomePage: true,
    backgroundColor: '#ffffff',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return {
    id: generateId(),
    name: scriptName,
    description: 'Une courte description de votre nouveau script.',
    pages: [homePage],
    components: [],
    workflowRules: [],
    globalVariables: [],
    settings: {
      fontFamily: 'Inter, sans-serif'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

/**
 * Crée un script de vente complet et interactif pour un centre d'appel.
 * Ce script sert de modèle de démonstration détaillé.
 * @param scriptName - Le nom à donner au script de démo.
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
            { id: pageIds.accueil, name: 'Accueil & Qualification', description: 'Première étape pour qualifier le prospect.', isHomePage: true, backgroundColor: '#f0fdf4', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { id: pageIds.presentation, name: 'Présentation de l\'offre', description: 'Détail de l\'offre commerciale.', isHomePage: false, backgroundColor: '#eff6ff', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { id: pageIds.objection, name: 'Traitement d\'objection', description: 'Arguments pour répondre aux hésitations.', isHomePage: false, backgroundColor: '#fffbeb', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { id: pageIds.rdv, name: 'Prise de RDV', description: 'Confirmation de la prise de rendez-vous.', isHomePage: false, backgroundColor: '#f0fdfa', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { id: pageIds.fin, name: 'Fin de l\'appel', description: 'Conclusion de la conversation.', isHomePage: false, backgroundColor: '#f1f5f9', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        ],
        components: [
            // --- Page 1: Accueil & Qualification ---
            { id: componentIds.accueilTitre, pageId: pageIds.accueil, type: 'text', position: { x: 40, y: 30 }, size: { width: 500, height: 50 }, config: { text: 'Qualification du Prospect', style: { fontSize: 28, fontWeight: 'bold' } } },
            { id: 'comp-accueil-nom-label', pageId: pageIds.accueil, type: 'text', position: { x: 40, y: 100 }, size: { width: 200, height: 30 }, config: { text: 'Nom du prospect :', style: { fontSize: 16 } } },
            { id: componentIds.accueilNomInput, pageId: pageIds.accueil, type: 'input', position: { x: 40, y: 140 }, size: { width: 300, height: 40 }, config: { placeholder: 'Entrez le nom...', style: { borderWidth: 1, borderRadius: 8, padding: 10, borderColor: '#cbd5e1' } } },
            { id: 'comp-accueil-interet-label', pageId: pageIds.accueil, type: 'text', position: { x: 40, y: 220 }, size: { width: 400, height: 30 }, config: { text: 'Le prospect est-il intéressé ?', style: { fontSize: 16 } } },
            { id: componentIds.accueilBtnInteresse, pageId: pageIds.accueil, type: 'button', position: { x: 40, y: 270 }, size: { width: 140, height: 40 }, config: { text: '✅ Intéressé', style: { backgroundColor: '#22c55e', textColor: 'white', borderRadius: 8, textAlign: 'center' } } },
            { id: componentIds.accueilBtnPasInteresse, pageId: pageIds.accueil, type: 'button', position: { x: 200, y: 270 }, size: { width: 140, height: 40 }, config: { text: '❌ Pas intéressé', style: { backgroundColor: '#ef4444', textColor: 'white', borderRadius: 8, textAlign: 'center' } } },
            
            // --- Page 2: Présentation de l'offre ---
            { id: componentIds.presentationTitre, pageId: pageIds.presentation, type: 'text', position: { x: 40, y: 30 }, size: { width: 600, height: 50 }, config: { text: 'Présentation de l\'Offre Éco+', style: { fontSize: 28, fontWeight: 'bold' } } },
            { id: componentIds.presentationTexte, pageId: pageIds.presentation, type: 'text', position: { x: 40, y: 100 }, size: { width: 600, height: 120 }, config: { text: 'Notre offre permet de réduire votre facture de 20% en moyenne grâce à nos panneaux solaires. Souhaitez-vous planifier un rdv avec un expert pour un bilan gratuit et sans engagement ?', style: { fontSize: 16, textAlign: 'left' } } },
            { id: componentIds.presentationBtnRdv, pageId: pageIds.presentation, type: 'button', position: { x: 40, y: 250 }, size: { width: 160, height: 40 }, config: { text: 'Planifier un RDV', style: { backgroundColor: '#3b82f6', textColor: 'white', borderRadius: 8, textAlign: 'center' } } },
            { id: componentIds.presentationBtnRefus, pageId: pageIds.presentation, type: 'button', position: { x: 220, y: 250 }, size: { width: 160, height: 40 }, config: { text: 'Je ne suis pas sûr', style: { backgroundColor: '#f97316', textColor: 'white', borderRadius: 8, textAlign: 'center' } } },
            
            // --- Page 3: Traitement d'objection ---
            { id: componentIds.objectionTitre, pageId: pageIds.objection, type: 'text', position: { x: 40, y: 30 }, size: { width: 500, height: 50 }, config: { text: 'Traitement de l\'objection', style: { fontSize: 28, fontWeight: 'bold' } } },
            { id: componentIds.objectionArgumentaire, pageId: pageIds.objection, type: 'text', position: { x: 40, y: 100 }, size: { width: 600, height: 100 }, config: { text: 'Je comprends votre hésitation. C\'est justement pour cela que le rendez-vous est gratuit et sans engagement. Il permet simplement de faire un bilan complet de vos économies potentielles.', style: { fontSize: 16 } } },
            { id: componentIds.objectionBtnRdv, pageId: pageIds.objection, type: 'button', position: { x: 40, y: 220 }, size: { width: 180, height: 40 }, config: { text: 'D\'accord, planifions-le', style: { backgroundColor: '#3b82f6', textColor: 'white', borderRadius: 8, textAlign: 'center' } } },
            { id: componentIds.objectionBtnFin, pageId: pageIds.objection, type: 'button', position: { x: 240, y: 220 }, size: { width: 160, height: 40 }, config: { text: 'Non, merci', style: { backgroundColor: '#64748b', textColor: 'white', borderRadius: 8, textAlign: 'center' } } },

            // --- Page 4: Prise de RDV ---
            { id: componentIds.rdvTitre, pageId: pageIds.rdv, type: 'text', position: { x: 40, y: 30 }, size: { width: 500, height: 50 }, config: { text: 'Confirmation du RDV', style: { fontSize: 28, fontWeight: 'bold' } } },
            { id: componentIds.rdvConfirmation, pageId: pageIds.rdv, type: 'text', position: { x: 40, y: 100 }, size: { width: 600, height: 60 }, config: { text: 'Parfait ! Le rendez-vous est noté. Votre expert vous contactera pour confirmer le créneau. Merci de votre confiance.', style: { fontSize: 16 } } },
            { id: componentIds.rdvBtnFin, pageId: pageIds.rdv, type: 'button', position: { x: 40, y: 200 }, size: { width: 160, height: 40 }, config: { text: 'Terminer l\'appel', style: { backgroundColor: '#64748b', textColor: 'white', borderRadius: 8, textAlign: 'center' } } },

            // --- Page 5: Fin de l'appel ---
            { id: componentIds.finTitre, pageId: pageIds.fin, type: 'text', position: { x: 40, y: 150 }, size: { width: 600, height: 50 }, config: { text: 'Fin de l\'appel.', style: { fontSize: 32, fontWeight: 'bold', textAlign: 'center' } } },
        ],
        // --- WORKFLOW COMPLET POUR LE SCÉNARIO DE TEST ---
        workflowRules: [
            // WF-1: Met à jour la variable `nomProspect` à chaque fois que l'agent tape dans le champ.
            {
                id: 'wf-update-name', name: 'MAJ Nom Prospect', pageId: pageIds.accueil,
                trigger: { type: 'onChange', componentId: componentIds.accueilNomInput }, conditions: [],
                actions: [{ id: generateId(), type: 'setVariable', config: { variableId: varIds.nomProspect, valueFrom: { componentId: componentIds.accueilNomInput, property: 'value' } } }]
            },
            // WF-2: Si l'agent clique sur "Intéressé"
            {
                id: 'wf-interesse', name: 'Clic: Intéressé', pageId: pageIds.accueil,
                trigger: { type: 'onClick', componentId: componentIds.accueilBtnInteresse }, conditions: [],
                actions: [
                    { id: generateId(), type: 'setVariable', config: { variableId: varIds.interet, value: true } },
                    { id: generateId(), type: 'navigate', config: { pageId: pageIds.presentation } }
                ]
            },
            // WF-3: Si l'agent clique sur "Pas intéressé"
            {
                id: 'wf-pas-interesse', name: 'Clic: Pas intéressé', pageId: pageIds.accueil,
                trigger: { type: 'onClick', componentId: componentIds.accueilBtnPasInteresse }, conditions: [],
                actions: [
                    { id: generateId(), type: 'setVariable', config: { variableId: varIds.interet, value: false } },
                    { id: generateId(), type: 'navigate', config: { pageId: pageIds.objection } }
                ]
            },
            // WF-4: Depuis la page Présentation, l'agent clique sur "Planifier un RDV"
            {
                id: 'wf-go-rdv', name: 'Clic: Planifier RDV', pageId: pageIds.presentation,
                trigger: { type: 'onClick', componentId: componentIds.presentationBtnRdv }, conditions: [],
                actions: [{ id: generateId(), type: 'navigate', config: { pageId: pageIds.rdv } }]
            },
            // WF-5: Depuis la page Présentation, le prospect hésite ("Je ne suis pas sûr")
            {
                id: 'wf-go-objection', name: 'Clic: Pas sûr', pageId: pageIds.presentation,
                trigger: { type: 'onClick', componentId: componentIds.presentationBtnRefus }, conditions: [],
                actions: [{ id: generateId(), type: 'navigate', config: { pageId: pageIds.objection } }]
            },
            // WF-6: Sur la page Objection, le prospect accepte finalement le RDV
            {
                id: 'wf-objection-to-rdv', name: 'Clic: Accepte RDV après objection', pageId: pageIds.objection,
                trigger: { type: 'onClick', componentId: componentIds.objectionBtnRdv }, conditions: [],
                actions: [{ id: generateId(), type: 'navigate', config: { pageId: pageIds.rdv } }]
            },
            // WF-7: Sur la page Objection, le prospect refuse définitivement
            {
                id: 'wf-objection-to-fin', name: 'Clic: Refuse RDV après objection', pageId: pageIds.objection,
                trigger: { type: 'onClick', componentId: componentIds.objectionBtnFin }, conditions: [],
                actions: [{ id: generateId(), type: 'navigate', config: { pageId: pageIds.fin } }]
            },
            // WF-8: Sur la page de confirmation du RDV, l'agent termine l'appel
            {
                id: 'wf-rdv-to-fin', name: 'Clic: Terminer après RDV', pageId: pageIds.rdv,
                trigger: { type: 'onClick', componentId: componentIds.rdvBtnFin }, conditions: [],
                actions: [{ id: generateId(), type: 'navigate', config: { pageId: pageIds.fin } }]
            },
            // WF-9: Un workflow de "survol" pour afficher une aide contextuelle
            {
                id: 'wf-tooltip', name: 'Survol: Aide', pageId: pageIds.presentation,
                trigger: { type: 'onMouseEnter', componentId: componentIds.presentationTitre }, conditions: [],
                actions: [{ id: generateId(), type: 'showMessage', config: { message: 'Ceci est l\'offre principale à présenter. Mettez en avant les 20% d\'économie.' } }]
            }
        ]
    };
};