// chemin: vscript_call/src/types/index.ts

/**
 * Définit la structure d'un composant visuel sur le canevas.
 * Chaque composant a un type, une configuration, une position, une taille et est lié à une page.
 */
export interface Component {
  id: string;
  type: string;
  config: ComponentConfig;
  position: { x: number; y: number };
  size: { width: number; height: number };
  parentId?: string; // Optionnel, pour les composants imbriqués
  pageId: string;
}

/**
 * Configuration spécifique d'un composant.
 * Contient le contenu (texte, options) et le style.
 */
export interface ComponentConfig {
  text?: string;
  placeholder?: string;
  options?: string[];
  label?: string;
  required?: boolean;
  style?: ComponentStyle;
  validation?: ValidationRule[];
  targetPageId?: string; // Pour les actions de navigation (ex: boutons)
}

/**
 * Propriétés de style d'un composant.
 * Permet de personnaliser l'apparence.
 */
export interface ComponentStyle {
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  padding?: number;
  margin?: number;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  textAlign?: 'left' | 'center' | 'right';
  boxShadow?: string;
  opacity?: number;
}

/**
 * Règle de validation pour les champs de saisie.
 */
export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern';
  value?: string | number;
  message: string;
}

/**
 * Représente une règle de workflow (logique interactive).
 * Un workflow est déclenché par un événement et exécute une ou plusieurs actions,
 * potentiellement sous certaines conditions.
 */
export interface WorkflowRule {
  id: string;
  name: string;
  description?: string;
  pageId: string;
  trigger: WorkflowTrigger;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
}

/**
 * Le déclencheur d'un workflow (ex: clic sur un bouton).
 */
export interface WorkflowTrigger {
  type: 'onClick' | 'onChange' | 'onSubmit' | 'onPageLoad';
  componentId?: string;
}

/**
 * Une condition qui doit être remplie pour qu'un workflow s'exécute.
 */
export interface WorkflowCondition {
  id: string; // ID unique pour la condition
  variableId: string;
  operator: 'equals' | 'notEquals' | 'greaterThan' | 'lessThan' | 'contains';
  value: any;
}

/**
 * Une action à exécuter par un workflow.
 */
export interface WorkflowAction {
  id: string; // ID unique pour l'action
  type: 'navigate' | 'setVariable' | 'showMessage' | 'callWebhook' | 'toggleComponentVisibility';
  config: {
    // Pour 'navigate'
    pageId?: string;
    // Pour 'setVariable'
    variableId?: string;
    value?: any; // Valeur statique
    // NOUVEAU: Pour récupérer une valeur dynamiquement depuis un composant
    valueFrom?: {
      componentId: string;
      property: 'value'; // ex: la valeur d'un champ de saisie
    };
    // Pour 'showMessage'
    message?: string;
    // Pour 'callWebhook'
    webhookUrl?: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    // Pour 'toggleComponentVisibility'
    componentId?: string;
    visibility?: 'show' | 'hide' | 'toggle';
  };
}


/**
 * Une variable globale pour stocker des données dans le script.
 */
export interface GlobalVariable {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  defaultValue: any;
  description?: string;
}

/**
 * Décrit un composant disponible dans la palette de la bibliothèque.
 */
export interface ComponentLibraryItem {
  id: string;
  name: string;
  category: 'input' | 'display' | 'layout' | 'action' | 'advanced';
  icon: string; // Nom de l'icône Lucide
  description: string;
  defaultConfig: ComponentConfig;
  defaultSize: { width: number, height: number };
}

/**
 * Représente une page du script.
 */
export interface ScriptPage {
  id: string;
  name: string;
  description?: string;
  isHomePage: boolean;
  backgroundColor?: string;
  backgroundImage?: string;
  createdAt: string; // Utiliser string pour la sérialisation JSON
  updatedAt: string; // Utiliser string pour la sérialisation JSON
}

/**
 * La structure principale du script, contenant l'ensemble des données.
 */
export interface Script {
  id: string;
  name: string;
  description?: string;
  pages: ScriptPage[];
  components: Component[];
  workflowRules: WorkflowRule[];
  globalVariables: GlobalVariable[];
  settings: ScriptSettings;
  createdAt: string; // Utiliser string pour la sérialisation JSON
  updatedAt: string; // Utiliser string pour la sérialisation JSON
}

/**
 * Paramètres globaux du script (thème, couleurs, etc.).
 */
export interface ScriptSettings {
  theme: 'light' | 'dark' | 'custom';
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  customCSS?: string;
}

/**
 * Type pour les éléments glissés depuis la palette ou sur le canevas.
 */
export interface DragItem {
  type: 'component' | 'new-component';
  id?: string; // Pour les composants existants
  componentType?: string; // Pour les nouveaux composants
  config?: ComponentConfig;
  size?: { width: number; height: number };
}

/**
 * Type pour l'état de l'historique (undo/redo).
 */
export interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}