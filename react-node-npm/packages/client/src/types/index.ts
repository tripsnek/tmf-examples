// Type definitions for the TMF React Client

import { EClass, EObject, EReference } from '@tripsnek/tmf';

/**
 * Wrapper for model instances in the UI tree
 */
export interface ModelInstanceWrapper {
  /** The wrapped EObject instance */
  eObject: EObject;
  /** Child instances (for containment) */
  children: ModelInstanceWrapper[];
  /** Whether this node is expanded in the tree */
  expanded: boolean;
  /** Whether this instance has unsaved changes */
  isDirty: boolean;
  /** Whether this is a newly created instance (not yet saved to server) */
  isNew: boolean;
}

/**
 * Root class node in the tree structure
 */
export interface RootClassNode {
  /** The EClass this node represents */
  eClass: EClass;
  /** Instances of this class */
  instances: ModelInstanceWrapper[];
  /** Whether this root node is expanded */
  expanded: boolean;
}

/**
 * Container reference for instance creation
 */
export interface ContainerReference {
  /** The container instance */
  instance: ModelInstanceWrapper;
  /** The containment reference */
  reference: EReference;
}

/**
 * Server connection status
 */
export interface ConnectionStatus {
  /** Whether connected to the server */
  connected: boolean;
  /** Status message */
  message: string;
  /** Last connection check time */
  lastChecked?: Date;
}

/**
 * Server status response
 */
export interface ServerStatus {
  /** Server status */
  status: string;
  /** Package name */
  package: string;
  /** Namespace URI */
  nsURI: string;
  /** Available root classes */
  rootClasses: Array<{
    name: string;
    abstract: boolean;
    instanceCount: number;
  }>;
}

/**
 * Dialog state for instance creation
 */
export interface CreateDialogState {
  /** Whether dialog is visible */
  show: boolean;
  /** Selected EClass for creation */
  selectedEClass: EClass | null;
  /** Container for the new instance */
  selectedContainer: ContainerReference | null;
  /** Whether creating for containment */
  isContainment: boolean;
  /** Containment reference if applicable */
  containmentReference: EReference | null;
  /** Parent for containment */
  containmentParent: ModelInstanceWrapper | null;
}

/**
 * Dialog state for reference management
 */
export interface ReferenceDialogState {
  /** Whether dialog is visible */
  show: boolean;
  /** The reference being edited */
  reference: EReference | null;
  /** Dialog title */
  title: string;
  /** Valid target instances */
  validTargets: ModelInstanceWrapper[];
  /** Selected target index */
  selectedIndex: number;
}

/**
 * Application state
 */
export interface AppState {
  /** Loaded EPackage */
  ePackage: any | null;
  /** EFactory for instance creation */
  eFactory: any | null;
  /** All model instances */
  instances: ModelInstanceWrapper[];
  /** Root EClasses */
  rootClasses: EClass[];
  /** Root class nodes for tree */
  rootClassNodes: RootClassNode[];
  /** Currently selected instance */
  selectedInstance: ModelInstanceWrapper | null;
  /** Server connection status */
  connectionStatus: ConnectionStatus;
  /** Whether currently saving */
  isSaving: boolean;
}

/**
 * Property type enumeration
 */
export enum PropertyType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  DATE = 'DATE',
  ENUM = 'ENUM',
  UNKNOWN = 'UNKNOWN'
}

/**
 * Action types for state updates
 */
export enum ActionType {
  SET_INSTANCES = 'SET_INSTANCES',
  ADD_INSTANCE = 'ADD_INSTANCE',
  REMOVE_INSTANCE = 'REMOVE_INSTANCE',
  UPDATE_INSTANCE = 'UPDATE_INSTANCE',
  MARK_DIRTY = 'MARK_DIRTY',
  CLEAR_DIRTY = 'CLEAR_DIRTY',
  SELECT_INSTANCE = 'SELECT_INSTANCE',
  TOGGLE_EXPANDED = 'TOGGLE_EXPANDED',
  SET_CONNECTION_STATUS = 'SET_CONNECTION_STATUS',
  SET_SAVING = 'SET_SAVING'
}

/**
 * Keyboard shortcut configuration
 */
export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description: string;
}

/**
 * Tree node render props
 */
export interface TreeNodeProps {
  instance: ModelInstanceWrapper;
  level: number;
  onSelect: (instance: ModelInstanceWrapper) => void;
  onToggleExpanded: (instance: ModelInstanceWrapper, event: React.MouseEvent) => void;
  onSave: (instance: ModelInstanceWrapper) => void;
  onDelete: (instance: ModelInstanceWrapper) => void;
  selectedInstance: ModelInstanceWrapper | null;
  connectionStatus: ConnectionStatus;
  isSaving: boolean;
}

/**
 * Property editor props
 */
export interface PropertyEditorProps {
  instance: ModelInstanceWrapper;
  onAttributeChange: (attr: any, value: any) => void;
  onReferenceAdd: (ref: any, target: EObject) => void;
  onReferenceRemove: (ref: any, target: EObject) => void;
  onShowCreateDialog: (ref: any) => void;
  onShowReferenceDialog: (ref: any) => void;
}

/**
 * Proxy resolution result
 */
export interface ProxyResolutionResult {
  /** Number of proxies resolved */
  resolvedCount: number;
  /** Number of unresolved proxies remaining */
  unresolvedCount: number;
  /** Error messages if any */
  errors: string[];
}