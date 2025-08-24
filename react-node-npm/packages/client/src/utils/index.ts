// Utility functions for the TMF React Client

import { 
  EObject, 
  EClass, 
  EAttribute, 
  EReference, 
  EList,
  EAttributeImpl,
  EClassImpl,
  EEnumImpl, 
  BasicEList
} from '@tripsnek/tmf';
import { ModelInstanceWrapper, PropertyType } from '../types';

/**
 * Generate a unique ID for an EClass instance
 */
export function generateUniqueId(eClass: EClass, existingInstances: ModelInstanceWrapper[]): string {
  const className = eClass.getName();
  const existingIds = new Set<string>();
  
  existingInstances.forEach((instance) => {
    if (instance.eObject.eClass() === eClass && eClass.getEIDAttribute()) {
      const id = instance.eObject.eGet(eClass.getEIDAttribute()!);
      if (id) existingIds.add(String(id));
    }
  });
  
  let count = 1;
  let id = '';
  while (!id) {
    const candidate = `${className}_${count}`;
    if (!existingIds.has(candidate)) {
      id = candidate;
    }
    count++;
  }
  
  return id;
}

/**
 * Get a human-readable label for an EObject
 */
export function getObjectLabel(eObject: EObject | undefined): string {
  if (!eObject) return 'Unknown';
  
  // Check if it's a proxy
  const proxyIndicator = eObject.eIsProxy && eObject.eIsProxy() ? ' [PROXY]' : '';
  
  // Try 'name' attribute first
  const nameAttr = eObject.eClass().getEStructuralFeature('name');
  if (nameAttr && nameAttr instanceof EAttributeImpl) {
    const value = eObject.eGet(nameAttr);
    if (value) return String(value) + proxyIndicator;
  }
  
  // Try 'id' attribute second
  const idAttr = eObject.eClass().getEStructuralFeature('id');
  if (idAttr && idAttr instanceof EAttributeImpl) {
    const value = eObject.eGet(idAttr);
    if (value) return String(value) + proxyIndicator;
  }
  
  // Check for container context
  const container = eObject.eContainer();
  if (container) {
    const containingFeature = eObject.eContainingFeature();
    if (containingFeature && containingFeature.isMany()) {
      const list = container.eGet(containingFeature) as EList<EObject>;
      const index = list.indexOf(eObject);
      return `${containingFeature.getName()}.${index}${proxyIndicator}`;
    } else if (containingFeature) {
      return `${containingFeature.getName()}${proxyIndicator}`;
    }
  }
  
  // Default to class name
  return eObject.eClass().getName() + proxyIndicator;
}

/**
 * Determine the property type of an attribute
 */
export function getPropertyType(attr: EAttribute): PropertyType {
  const typeName = attr.getEType().getName();
  
  if (typeName === 'EString' || typeName === 'String') {
    return PropertyType.STRING;
  }
  
  if (['EInt', 'ELong', 'EFloat', 'EDouble', 'EBigDecimal', 'EBigInteger'].includes(typeName)) {
    return PropertyType.NUMBER;
  }
  
  if (typeName === 'EBoolean' || typeName === 'Boolean') {
    return PropertyType.BOOLEAN;
  }
  
  if (typeName === 'EDate' || typeName === 'Date') {
    return PropertyType.DATE;
  }
  
  if (attr.getEType() instanceof EEnumImpl) {
    return PropertyType.ENUM;
  }
  
  return PropertyType.UNKNOWN;
}

/**
 * Get enum literal values for an enum attribute
 */
export function getEnumLiterals(attr: EAttribute): string[] {
  const type = attr.getEType();
  if (type instanceof EEnumImpl) {
    return type.getELiterals().elements().map((lit) => lit.getLiteral());
  }
  return [];
}

/**
 * Find all instances of a specific EClass
 */
export function findInstancesByClass(
  instances: ModelInstanceWrapper[],
  eClass: EClass
): ModelInstanceWrapper[] {
  return instances.filter((instance) => instance.eObject.eClass() === eClass);
}

/**
 * Find all valid reference targets for a given reference
 */
export function findValidReferenceTargets(
  instances: ModelInstanceWrapper[],
  reference: EReference,
  excludeInstance?: ModelInstanceWrapper
): ModelInstanceWrapper[] {
  const targetType = reference.getEType();
  
  return instances.filter((instance) => {
    // Exclude the source instance
    if (instance === excludeInstance) return false;
    
    // Exclude proxy objects
    if (instance.eObject.eIsProxy && instance.eObject.eIsProxy()) return false;
    
    // Check type compatibility
    const instanceClass = instance.eObject.eClass();
    const isCompatible = 
      instanceClass === targetType ||
      instanceClass.getESuperTypes().contains(targetType);
    
    // For containment references, exclude already contained objects
    if (reference.isContainment() && instance.eObject.eContainer()) {
      return false;
    }
    
    return isCompatible;
  });
}

/**
 * Get all root EClasses from a package
 */
export function getRootEClasses(ePackage: any): EClass[] {
  const rootClasses: EClass[] = [];
  
  ePackage.getEClassifiers().forEach((classifier: any) => {
    if (classifier instanceof EClassImpl && !classifier.isAbstract() && !classifier.isInterface()) {
      // Check if this class can be a root (not contained by others)
      let isRoot = true;
      ePackage.getEClassifiers().forEach((otherClassifier: any) => {
        if (otherClassifier instanceof EClassImpl && otherClassifier !== classifier) {
          otherClassifier.getEReferences().forEach((ref: EReference) => {
            if (ref.isContainment() && ref.getEType() === classifier) {
              isRoot = false;
            }
          });
        }
      });
      
      if (isRoot) {
        rootClasses.push(classifier);
      }
    }
  });
  
  return rootClasses;
}

/**
 * Get compatible classes for a reference
 */
export function getCompatibleClasses(
  ePackage: any,
  reference: EReference
): EClass[] {
  const targetType = reference.getEType();
  if (!(targetType instanceof EClassImpl)) return [];
  
  const compatibleClasses: EClass[] = [];
  
  ePackage.getEClassifiers().forEach((classifier: any) => {
    if (
      classifier instanceof EClassImpl &&
      !classifier.isAbstract() &&
      !classifier.isInterface()
    ) {
      // Check compatibility
      if (
        classifier === targetType ||
        classifier.getEAllSuperTypes().contains(targetType) ||
        targetType.getEAllSuperTypes().contains(classifier)
      ) {
        compatibleClasses.push(classifier);
      }
    }
  });
  
  return compatibleClasses;
}

/**
 * Sort attributes for display (name first, then id, then alphabetical)
 */
export function sortAttributes(attributes: EAttribute[]): EAttribute[] {
  return attributes.sort((a, b) => {
    const aName = a.getName();
    const bName = b.getName();
    
    if (aName === 'name') return -1;
    if (bName === 'name') return 1;
    if (aName === 'id') return -1;
    if (bName === 'id') return 1;
    
    return aName.localeCompare(bName);
  });
}

/**
 * Deep clone a model instance wrapper
 */
export function cloneInstanceWrapper(instance: ModelInstanceWrapper): ModelInstanceWrapper {
  return {
    eObject: instance.eObject,
    children: instance.children.map((child) => cloneInstanceWrapper(child)),
    expanded: instance.expanded,
    isDirty: instance.isDirty,
    isNew: instance.isNew,
  };
}

/**
 * Find an instance wrapper by its EObject
 */
export function findInstanceByEObject(
  instances: ModelInstanceWrapper[],
  eObject: EObject
): ModelInstanceWrapper | undefined {
  for (const instance of instances) {
    if (instance.eObject === eObject) {
      return instance;
    }
    
    const childResult = findInstanceByEObject(instance.children, eObject);
    if (childResult) {
      return childResult;
    }
  }
  
  return undefined;
}

/**
 * Expand tree path to a specific instance
 */
export function expandPathToInstance(
  rootNodes: any[],
  target: ModelInstanceWrapper
): void {
  const expandPath = (node: ModelInstanceWrapper): boolean => {
    if (node === target) return true;
    
    for (const child of node.children) {
      if (expandPath(child)) {
        node.expanded = true;
        return true;
      }
    }
    return false;
  };
  
  rootNodes.forEach((rootNode) => {
    if (rootNode.instances) {
      rootNode.instances.forEach((instance: ModelInstanceWrapper) => {
        if (expandPath(instance)) {
          rootNode.expanded = true;
        }
      });
    }
  });
}

/**
 * Format a value for display
 */
export function formatValue(value: any, propertyType: PropertyType): string {
  if (value === null || value === undefined) {
    return '';
  }
  
  switch (propertyType) {
    case PropertyType.DATE:
      if (value instanceof Date) {
        return value.toISOString().split('T')[0];
      }
      return String(value);
    
    case PropertyType.BOOLEAN:
      return value ? 'true' : 'false';
    
    case PropertyType.NUMBER:
      return String(value);
    
    default:
      return String(value);
  }
}

/**
 * Parse a value from input
 */
export function parseInputValue(value: string, propertyType: PropertyType): any {
  switch (propertyType) {
    case PropertyType.NUMBER:
      return parseFloat(value);
    
    case PropertyType.BOOLEAN:
      return value === 'true';
    
    case PropertyType.DATE:
      return new Date(value);
    
    default:
      return value;
  }
}

/**
 * Check if an instance has unsaved changes (including children)
 */
export function hasUnsavedChanges(instance: ModelInstanceWrapper): boolean {
  if (instance.isDirty || instance.isNew) {
    return true;
  }
  
  return instance.children.some((child) => hasUnsavedChanges(child));
}

/**
 * Count total instances in tree
 */
export function countInstances(instances: ModelInstanceWrapper[]): number {
  let count = instances.length;
  
  instances.forEach((instance) => {
    count += countInstances(instance.children);
  });
  
  return count;
}

/**
 * Export instances to JSON
 */
export function exportToJSON(instances: ModelInstanceWrapper[]): string {
  const exportData = instances.map((instance) => ({
    eClass: instance.eObject.eClass().getName(),
    data: instance.eObject,
  }));
  
  return JSON.stringify(exportData, null, 2);
}

/**
 * Validate an instance against its metamodel constraints
 */
export function validateInstance(instance: ModelInstanceWrapper): string[] {
  const errors: string[] = [];
  const eObject = instance.eObject;
  const eClass = eObject.eClass();
  
  // Check required attributes
  eClass.getEAllAttributes().forEach((attr) => {
    if (attr.getLowerBound() > 0) {
      const value = eObject.eGet(attr);
      if (!value || (Array.isArray(value) && value.length === 0)) {
        errors.push(`Required attribute '${attr.getName()}' is missing`);
      }
    }
  });
  
  // Check required references
  eClass.getEAllReferences().forEach((ref) => {
    if (ref.getLowerBound() > 0 && !ref.isContainer()) {
      const value = eObject.eGet(ref);
      if (!value || (value instanceof BasicEList && value.size() === 0)) {
        errors.push(`Required reference '${ref.getName()}' is missing`);
      }
    }
  });
  
  return errors;
}