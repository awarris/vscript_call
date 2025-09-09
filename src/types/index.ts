// chemin: vscript_call/src/types/index.ts

/**
 * Définit la structure d'un composant visuel sur le canevas.
 */
export interface Component {
  id: string;
  type: string;
  config: ComponentConfig;
  position: { x: number; y: number };
  size: { width: number; height: number };
  parentId?: string;
  pageId: string;
}

/**
 * Configuration spécifique d'un composant (contenu et style).
 */
export interface ComponentConfig {
  text?: string;
  placeholder?: string;
  options?: string[];
  label?: string;
  style?: ComponentStyle;
  targetPageId?: string; // Pour la navigation
}

/**
 * Propriétés de style d'un composant.
 */
export interface ComponentStyle {
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  padding?: number;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  textAlign?: 'left' | 'center' | 'right';
}

/**
 * Liste des déclencheurs de workflow possibles.
 */
export type WorkflowTriggerType = 
  | 'onClick' 
  | 'onDoubleClick' 
  | 'onMouseEnter' 
  | 'onMouseLeave'
  | 'onChange' 
  | 'onPageLoad';

/**
 * Le déclencheur d'un workflow (ex: un clic sur un bouton).
 */
export interface WorkflowTrigger {
  type: WorkflowTriggerType;
  componentId?: string;
}

/**
 * Condition pour l'exécution d'un workflow.
 */
export interface WorkflowCondition {
  id: string;
  variableId: string;
  operator: 'equals' | 'notEquals' | 'greaterThan' | 'lessThan' | 'contains';
  value: any;
}

/**
 * Action exécutée par un workflow.
 */
export interface WorkflowAction {
  id: string;
  type: 'navigate' | 'setVariable' | 'showMessage';
  config: {
    pageId?: string;
    variableId?: string;
    value?: any;
    valueFrom?: { // Pour récupérer dynamiquement la valeur d'un composant
      componentId: string;
      property: 'value';
    };
    message?: string;
  };
}

/**
 * Règle de workflow complète.
 */
export interface WorkflowRule {
  id: string;
  name: string;
  pageId: string;
  trigger: WorkflowTrigger;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
}

/**
 * Variable globale pour stocker des données.
 */
export interface GlobalVariable {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean';
  defaultValue: any;
  description?: string;
}

/**
 * Élément de la bibliothèque de composants.
 */
export interface ComponentLibraryItem {
  id: string;
  name: string;
  category: 'display' | 'action' | 'input' | 'layout';
  icon: string;
  description: string;
  defaultConfig: ComponentConfig;
  defaultSize: { width: number; height: number };
}

/**
 * Page d'un script.
 */
export interface ScriptPage {
  id: string;
  name: string;
  isHomePage: boolean;
  backgroundColor?: string;
  createdAt: string;
  updatedAt: string;
  description?: string;
}

/**
 * Structure principale d'un script.
 */
export interface Script {
  id: string;
  name: string;
  description?: string;
  pages: ScriptPage[];
  components: Component[];
  workflowRules: WorkflowRule[];
  globalVariables: GlobalVariable[];
  settings: {
    fontFamily: string;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Objet pour les éléments glissables.
 */
export interface DragItem {
  type: 'component' | 'new-component';
  id?: string;
  componentType?: string;
  config?: ComponentConfig;
  size?: { width: number; height: number };
}

/**
 * État de l'historique pour l'undo/redo.
 */
export interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}