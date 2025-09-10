// chemin: src/types/index.ts

/**
 * Style d'un composant, flexible pour accepter n'importe quelle propriété CSS.
 */
export interface ComponentStyle {
  [key: string]: any;
  // Styles spécifiques pour la calculatrice
  backgroundColor?: string;
  displayColor?: string;
  displayTextColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  operatorColor?: string;
  operatorTextColor?: string;
  clearColor?: string;
  clearTextColor?: string;
  equalColor?: string;
  equalTextColor?: string;
}

/**
 * Configuration d'un composant.
 * Elle est maintenant un objet flexible pour stocker n'importe quelle structure.
 */
export interface ComponentConfig {
  value?: any;
  text?: string;
  placeholder?: string;
  label?: string; // Libellé optionnel pour tous les composants
  style?: ComponentStyle;
  labelStyle?: ComponentStyle; // Styles spécifiques pour le libellé
  targetPageId?: string;
  visible?: boolean; // Pour la visibilité par défaut
  // Permet de stocker n'importe quelle autre propriété (src, alt, options, attributes, etc.)
  [key: string]: any;
}

/**
 * Définit la structure d'un composant visuel sur le canevas.
 */
export interface Component {
  id: string;
  type: string;
  config: ComponentConfig;
  position: { x: number; y: number };
  size: { width: number; height: number };
  pageId: string;
  parentId?: string;
}

export type WorkflowTriggerType =
  | 'onClick'
  | 'onDoubleClick'
  | 'onMouseEnter'
  | 'onMouseLeave'
  | 'onChange'
  | 'onPageLoad';

export interface WorkflowTrigger {
  type: WorkflowTriggerType;
  componentId?: string;
}

export interface WorkflowCondition {
  id: string;
  variableId: string;
  operator: 'equals' | 'notEquals' | 'greaterThan' | 'lessThan' | 'contains';
  value: any;
}

export type WorkflowActionType = 'navigate' | 'setVariable' | 'showMessage' | 'executeCode' | 'setVisibility';

export interface WorkflowAction {
  id: string;
  type: WorkflowActionType;
  config: {
    pageId?: string;
    variableId?: string;
    value?: any;
    valueFrom?: {
      componentId: string;
      property: 'value';
    };
    message?: string;
    code?: string;
    targetComponentId?: string; // Pour setVisibility
    visible?: boolean;         // Pour setVisibility
  };
}

export interface WorkflowRule {
  id: string;
  name: string;
  pageId: string;
  trigger: WorkflowTrigger;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
}

export interface GlobalVariable {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean';
  defaultValue: any;
  description?: string;
  componentId?: string;
}

export interface ComponentLibraryItem {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  defaultConfig: ComponentConfig;
  defaultSize: { width: number; height: number };
}

export interface ScriptPage {
  id: string;
  name: string;
  description?: string;
  isHomePage: boolean;
  backgroundColor?: string;
  backgroundImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Script {
  id: string;
  name: string;
  description?: string;
  pages: ScriptPage[];
  components: Component[];
  workflowRules: WorkflowRule[];
  globalVariables: GlobalVariable[];
  conversation: { role: 'ia' | 'user'; content: string }[]; // Pour le chat IA
  settings: {
    fontFamily: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DragItem {
  type: 'component' | 'new-component';
  id?: string;
  componentType?: string;
  config?: ComponentConfig;
  size?: { width: number; height: number };
}

export interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}