import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  EPackage,
  EClass,
  EFactory,
  EObject,
  EAttribute,
  EReference,
  EClassImpl,
  EAttributeImpl,
  EEnumImpl,
  EList,
  TUtils,
} from '@tripsnek/tmf';
import {
  TripplanningFactory,
  TripplanningPackage,
} from '@tmf-example/data-model';
import { crudService, ConnectionStatus } from './services/crud.service';
import { ProxyResolver } from './services/proxy-resolver';
import clsx from 'clsx';
import './App.css';

// Interfaces
interface RootClassNode {
  eClass: EClass;
  instances: ModelInstanceWrapper[];
  expanded: boolean;
}

interface ModelInstanceWrapper {
  eObject: EObject;
  children: ModelInstanceWrapper[];
  expanded: boolean;
  isDirty: boolean;
  isNew: boolean;
}

const App: React.FC = () => {
  // Core state
  const [ePackage, setEPackage] = useState<EPackage | null>(null);
  const [eFactory, setEFactory] = useState<EFactory | null>(null);
  const [instances, setInstances] = useState<ModelInstanceWrapper[]>([]);
  const [rootClasses, setRootClasses] = useState<EClass[]>([]);
  const [rootClassNodes, setRootClassNodes] = useState<RootClassNode[]>([]);
  const [selectedInstance, setSelectedInstance] = useState<ModelInstanceWrapper | null>(null);
  
  // Dialog state
  const [showCreateInstanceDialog, setShowCreateInstanceDialog] = useState(false);
  const [showReferenceDialog, setShowReferenceDialog] = useState(false);
  const [selectedEClass, setSelectedEClass] = useState<EClass | null>(null);
  const [selectedContainer, setSelectedContainer] = useState<any>(null);
  
  // Reference dialog state
  const [currentReference, setCurrentReference] = useState<EReference | null>(null);
  const [selectedReferenceTargetIndex, setSelectedReferenceTargetIndex] = useState(-1);
  const [validReferenceTargets, setValidReferenceTargets] = useState<ModelInstanceWrapper[]>([]);
  const [referenceDialogTitle, setReferenceDialogTitle] = useState('');
  
  // Containment creation state
  const [isContainmentCreation, setIsContainmentCreation] = useState(false);
  const [containmentReference, setContainmentReference] = useState<EReference | null>(null);
  const [containmentParent, setContainmentParent] = useState<ModelInstanceWrapper | null>(null);
  
  // Connection state
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    connected: false,
    message: 'Checking connection...',
  });
  
  // Saving state
  const [isSaving, setIsSaving] = useState(false);
  
  // Refs for property inputs
  const propertyInputRefs = useRef<(HTMLInputElement | HTMLSelectElement | null)[]>([]);
  
  // Connection checking interval
  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 5000);
    return () => clearInterval(interval);
  }, []);
  
  // Initialize metamodel on mount
  useEffect(() => {
    loadMetamodel();
  }, []);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        saveAllDirtyInstances();
      } else if (event.key === 'Delete' || event.keyCode === 46) {
        event.preventDefault();
        if (selectedInstance) {
          deleteInstance(selectedInstance);
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedInstance]);
  
  // Focus first property input when selection changes
  useEffect(() => {
    if (selectedInstance && propertyInputRefs.current.length > 0) {
      const firstInput = propertyInputRefs.current[0];
      if (firstInput && !firstInput.hasAttribute('data-focused')) {
        setTimeout(() => {
          firstInput.focus();
          firstInput.setAttribute('data-focused', 'true');
        }, 100);
      }
    }
  }, [selectedInstance]);
  
  const checkConnection = async () => {
    const status = await crudService.checkConnection();
    if (status) {
      setConnectionStatus({
        connected: true,
        message: 'Connected to CRUD server',
        lastChecked: new Date(),
      });
    } else {
      setConnectionStatus({
        connected: false,
        message: 'Server not available',
        lastChecked: new Date(),
      });
    }
  };
  
  const checkServerAndLoadData = async () => {
    const hasUnsavedChanges = instances.some((inst) => inst.isDirty || inst.isNew);
    
    if (hasUnsavedChanges) {
      if (!confirm('You have unsaved changes. Refreshing will lose these changes. Continue?')) {
        return;
      }
    }
    
    const status = await crudService.checkConnection();
    if (status) {
      await loadInstancesFromServer();
    }
  };
  
  const loadInstancesFromServer = async () => {
    try {
      const instanceMap = await crudService.loadAllRootInstances(rootClasses);
      
      // Clear existing instances
      const newInstances: ModelInstanceWrapper[] = [];
      const newRootClassNodes = [...rootClassNodes];
      newRootClassNodes.forEach((node) => (node.instances = []));
      
      // Process loaded instances
      instanceMap.forEach((eObjects, eClass) => {
        const rootNode = newRootClassNodes.find((node) => node.eClass === eClass);
        if (rootNode) {
          eObjects.forEach((eObject) => {
            const instance: ModelInstanceWrapper = {
              eObject,
              children: [],
              expanded: false,
              isDirty: false,
              isNew: false,
            };
            newInstances.push(instance);
            rootNode.instances.push(instance);
            
            // Build containment tree
            buildContainmentTree(instance, newInstances);
          });
        }
      });
      
      setInstances(newInstances);
      setRootClassNodes(newRootClassNodes);
      
      console.log(`Loaded ${newInstances.length} instances from server`);
      
      // Resolve all proxy references
      resolveAllProxies(newInstances);
    } catch (error) {
      console.error('Failed to load instances from server:', error);
    }
  };
  
  const buildContainmentTree = (instance: ModelInstanceWrapper, allInstances: ModelInstanceWrapper[]) => {
    instance.eObject.eClass().getEAllReferences().forEach((ref) => {
      if (ref.isContainment()) {
        if (ref.isMany()) {
          const list = instance.eObject.eGet(ref) as EList<EObject>;
          if (list) {
            list.forEach((childEObject) => {
              const childInstance: ModelInstanceWrapper = {
                eObject: childEObject,
                children: [],
                expanded: false,
                isDirty: false,
                isNew: false,
              };
              instance.children.push(childInstance);
              allInstances.push(childInstance);
              buildContainmentTree(childInstance, allInstances);
            });
          }
        } else {
          const childEObject = instance.eObject.eGet(ref) as EObject;
          if (childEObject) {
            const childInstance: ModelInstanceWrapper = {
              eObject: childEObject,
              children: [],
              expanded: false,
              isDirty: false,
              isNew: false,
            };
            instance.children.push(childInstance);
            allInstances.push(childInstance);
            buildContainmentTree(childInstance, allInstances);
          }
        }
      }
    });
  };
  
  const resolveAllProxies = (allInstances: ModelInstanceWrapper[]) => {
    console.log('Resolving proxy references...');
    
    const rootEObjects: EObject[] = [];
    rootClassNodes.forEach((node) => {
      node.instances.forEach((instance) => {
        rootEObjects.push(instance.eObject);
      });
    });
    
    if (rootEObjects.length === 0) {
      console.log('No objects to resolve proxies for');
      return;
    }
    
    const resolvedCount = ProxyResolver.resolveProxies(rootEObjects);
    
    if (resolvedCount > 0) {
      console.log(`Proxy resolution complete: ${resolvedCount} proxies resolved`);
      
      if (selectedInstance) {
        setSelectedInstance(null);
        setTimeout(() => setSelectedInstance(selectedInstance), 0);
      }
    } else {
      const unresolvedCount = ProxyResolver.countProxies(rootEObjects);
      if (unresolvedCount > 0) {
        console.warn(`${unresolvedCount} proxies remain unresolved`);
        const report = ProxyResolver.getUnresolvedProxyReport(rootEObjects);
        report.forEach((line) => console.warn(line));
      }
    }
  };
  
  const resolveProxiesForInstance = (instance: ModelInstanceWrapper) => {
    const existingRootEObjects: EObject[] = [];
    rootClassNodes.forEach((node) => {
      node.instances.forEach((inst) => {
        if (inst !== instance) {
          existingRootEObjects.push(inst.eObject);
        }
      });
    });
    
    const resolvedCount = ProxyResolver.resolveProxiesForObject(
      instance.eObject,
      existingRootEObjects
    );
    
    if (resolvedCount > 0) {
      console.log(`Resolved ${resolvedCount} proxies for instance ${getInstanceLabel(instance.eObject)}`);
    }
  };
  
  const loadMetamodel = () => {
    const pkg = TripplanningPackage.eINSTANCE;
    const factory = TripplanningFactory.eINSTANCE;
    
    setEPackage(pkg);
    setEFactory(factory);
    
    const classes = TUtils.getRootEClasses(pkg);
    setRootClasses(classes);
    
    // Initialize root class nodes
    const nodes = classes.map((eClass) => ({
      eClass,
      instances: [],
      expanded: true,
    }));
    setRootClassNodes(nodes);
  };
  
  const markDirty = (instance: ModelInstanceWrapper) => {
    console.log('Marking instance as dirty:', getInstanceLabel(instance.eObject));
    instance.isDirty = true;
    
    const parent = findParentInstance(instance);
    if (parent) {
      markDirty(parent);
    }
    
    // Trigger re-render
    setInstances([...instances]);
  };
  
  const getRootContainer = (instance: ModelInstanceWrapper): ModelInstanceWrapper => {
    const parent = findParentInstance(instance);
    return parent ? getRootContainer(parent) : instance;
  };
  
  const saveInstance = async (instance: ModelInstanceWrapper) => {
    if (!instance.isDirty && !instance.isNew) return;
    
    setIsSaving(true);
    
    try {
      await crudService.saveInstance(instance.eObject, instance.isNew);
      clearDirtyAndNewFlags(instance);
      setInstances([...instances]);
      setIsSaving(false);
      console.log('Instance saved successfully');
    } catch (error) {
      setIsSaving(false);
      console.error('Failed to save instance:', error);
      alert('Failed to save instance. Check console for details.');
    }
  };
  
  const saveAllDirtyInstances = async () => {
    const dirtyRoots = new Set<ModelInstanceWrapper>();
    
    instances.forEach((instance) => {
      if (instance.isDirty || instance.isNew) {
        const root = getRootContainer(instance);
        dirtyRoots.add(root);
      }
    });
    
    if (dirtyRoots.size === 0) return;
    
    setIsSaving(true);
    
    let saveCount = 0;
    const totalSaves = dirtyRoots.size;
    
    for (const rootInstance of dirtyRoots) {
      try {
        await crudService.saveInstance(rootInstance.eObject, rootInstance.isNew);
        clearDirtyAndNewFlags(rootInstance);
        saveCount++;
        
        if (saveCount === totalSaves) {
          setInstances([...instances]);
          setIsSaving(false);
          console.log(`Successfully saved ${totalSaves} instances`);
        }
      } catch (error) {
        saveCount++;
        console.error('Failed to save instance:', error);
        
        if (saveCount === totalSaves) {
          setInstances([...instances]);
          setIsSaving(false);
          alert('Some instances failed to save. Check console for details.');
        }
      }
    }
  };
  
  const hasAnyDirtyInstances = (): boolean => {
    return instances.some((instance) => instance.isDirty || instance.isNew);
  };
  
  const clearDirtyAndNewFlags = (instance: ModelInstanceWrapper) => {
    instance.isDirty = false;
    instance.isNew = false;
    instance.children.forEach((child) => clearDirtyAndNewFlags(child));
  };
  
  const findParentInstance = (instance: ModelInstanceWrapper): ModelInstanceWrapper | null => {
    for (const rootNode of rootClassNodes) {
      for (const rootInstance of rootNode.instances) {
        const parent = findParentInTree(rootInstance, instance);
        if (parent) return parent;
      }
    }
    return null;
  };
  
  const findParentInTree = (
    node: ModelInstanceWrapper,
    target: ModelInstanceWrapper
  ): ModelInstanceWrapper | null => {
    if (node.children.includes(target)) return node;
    for (const child of node.children) {
      const parent = findParentInTree(child, target);
      if (parent) return parent;
    }
    return null;
  };
  
  const deleteInstance = async (instanceToDelete: ModelInstanceWrapper) => {
    const rootInstance = getRootContainer(instanceToDelete);
    
    if (connectionStatus.connected && !rootInstance.isNew) {
      if (instanceToDelete === rootInstance) {
        try {
          await crudService.deleteInstance(instanceToDelete.eObject);
          performCompleteInstanceDeletion(instanceToDelete);
        } catch (error) {
          console.error('Failed to delete from server:', error);
          alert('Failed to delete from server. Check console for details.');
        }
      } else {
        const parent = findParentInstance(instanceToDelete);
        if (parent) {
          markDirty(parent);
        }
        performCompleteInstanceDeletion(instanceToDelete);
      }
    } else {
      performCompleteInstanceDeletion(instanceToDelete);
    }
  };
  
  const performCompleteInstanceDeletion = (instanceToDelete: ModelInstanceWrapper) => {
    const objectsToDelete: EObject[] = [];
    collectAllObjectsToDelete(instanceToDelete, objectsToDelete);
    
    removeInstanceAndChildrenFromTree(instanceToDelete);
    
    objectsToDelete.forEach((obj) => {
      deleteObjectReferences(obj);
    });
    
    saveAllDirtyInstances();
    
    if (selectedInstance === instanceToDelete) {
      setSelectedInstance(null);
    }
  };
  
  const collectAllObjectsToDelete = (
    instance: ModelInstanceWrapper,
    objectsToDelete: EObject[]
  ) => {
    objectsToDelete.push(instance.eObject);
    instance.children.forEach((child) => {
      collectAllObjectsToDelete(child, objectsToDelete);
    });
  };
  
  const removeInstanceAndChildrenFromTree = (instanceToDelete: ModelInstanceWrapper) => {
    [...instanceToDelete.children].forEach((child) => {
      removeInstanceAndChildrenFromTree(child);
    });
    
    const parent = findParentInstance(instanceToDelete);
    if (parent) {
      const index = parent.children.indexOf(instanceToDelete);
      if (index > -1) parent.children.splice(index, 1);
      
      parent.eObject.eClass().getEReferences().forEach((ref) => {
        if (ref.isContainment()) {
          if (ref.isMany()) {
            const list = parent.eObject.eGet(ref) as EList<EObject>;
            list.remove(instanceToDelete.eObject);
          } else if (parent.eObject.eGet(ref) === instanceToDelete.eObject) {
            parent.eObject.eSet(ref, null);
          }
        }
      });
    } else {
      const eClass = instanceToDelete.eObject.eClass();
      const rootNode = rootClassNodes.find((node) => node.eClass === eClass);
      if (rootNode) {
        const index = rootNode.instances.indexOf(instanceToDelete);
        if (index > -1) rootNode.instances.splice(index, 1);
      }
    }
    
    const index = instances.indexOf(instanceToDelete);
    if (index > -1) {
      const newInstances = [...instances];
      newInstances.splice(index, 1);
      setInstances(newInstances);
    }
  };
  
  const deleteObjectReferences = (theObject: EObject) => {
    instances.forEach((inst) => {
      inst.eObject.eClass().getEAllReferences().forEach((ref) => {
        if (!ref.isContainment()) {
          if (ref.isMany()) {
            const list = inst.eObject.eGet(ref) as EList<EObject>;
            const index = list.indexOf(theObject);
            if (index >= 0) {
              list.remove(theObject);
              markDirty(inst);
            }
          } else {
            const value = inst.eObject.eGet(ref);
            if (value === theObject) {
              inst.eObject.eUnset(ref);
              markDirty(inst);
            }
          }
        }
      });
    });
  };
  
  const selectInstance = (instance: ModelInstanceWrapper) => {
    setSelectedInstance(instance);
    clearFocusAttributes();
  };
  
  const clearFocusAttributes = () => {
    propertyInputRefs.current.forEach((input) => {
      if (input) {
        input.removeAttribute('data-focused');
      }
    });
  };
  
  const toggleExpanded = (instance: ModelInstanceWrapper, event: React.MouseEvent) => {
    event.stopPropagation();
    instance.expanded = !instance.expanded;
    setInstances([...instances]);
  };
  
  const toggleRootClassExpanded = (node: RootClassNode, event: React.MouseEvent) => {
    event.stopPropagation();
    node.expanded = !node.expanded;
    setRootClassNodes([...rootClassNodes]);
  };
  
  const getEClassName = (eObject: EObject): string => {
    return eObject.eClass().getName();
  };
  
  const getInstanceLabel = (eObject?: EObject): string => {
    if (!eObject) return 'Unknown';
    
    const proxyIndicator = eObject.eIsProxy && eObject.eIsProxy() ? ' [PROXY]' : '';
    
    const nameAttr = eObject.eClass().getEStructuralFeature('name');
    if (nameAttr && nameAttr instanceof EAttributeImpl) {
      const value = eObject.eGet(nameAttr);
      if (value) return String(value) + proxyIndicator;
    }
    
    const container = eObject.eContainer();
    
    if (container) {
      const containerLabel = getInstanceLabel(container);
      const containingFeature = eObject.eContainingFeature();
      
      if (containingFeature && containingFeature.isMany()) {
        const list = container.eGet(containingFeature) as EList<EObject>;
        const index = list.indexOf(eObject);
        return `${containingFeature.getName()}.${index}${proxyIndicator}`;
      } else if (containingFeature) {
        return `${containingFeature.getName()}${proxyIndicator}`;
      }
    }
    
    return generateIntrinsicLabel(eObject) + proxyIndicator;
  };
  
  const generateIntrinsicLabel = (eObject: EObject): string => {
    const idAttr = eObject.eClass().getEStructuralFeature('id');
    if (idAttr && idAttr instanceof EAttributeImpl) {
      const value = eObject.eGet(idAttr);
      if (value) return String(value);
    }
    
    return eObject.eClass().getName();
  };
  
  const getAttributes = (): EAttribute[] => {
    if (!selectedInstance) return [];
    const eClass = selectedInstance.eObject.eClass();
    const attributes = eClass.getEAllAttributes().elements();
    
    return attributes.sort((a, b) => {
      const aName = a.getName();
      const bName = b.getName();
      
      if (aName === 'name') return -1;
      if (bName === 'name') return 1;
      if (aName === 'id') return -1;
      if (bName === 'id') return 1;
      
      return aName.localeCompare(bName);
    });
  };
  
  const getReferences = (): EReference[] => {
    if (!selectedInstance) return [];
    return selectedInstance.eObject.eClass().getEAllReferences().elements();
  };
  
  const getAttributeValue = (attr: EAttribute): any => {
    if (!selectedInstance) return null;
    
    if (attr.isMany()) {
      return null;
    }
    
    const value = selectedInstance.eObject.eGet(attr);
    return value || '';
  };
  
  const getAttributeValues = (attr: EAttribute): any[] => {
    if (!selectedInstance || !attr.isMany()) return [];
    
    const list = selectedInstance.eObject.eGet(attr) as EList<any>;
    return list ? list.elements() : [];
  };
  
  const setAttributeValue = (attr: EAttribute, event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!selectedInstance) return;
    
    let value: any = event.target.value;
    if (event.target.type === 'checkbox') {
      value = (event.target as HTMLInputElement).checked;
    } else if (event.target.type === 'number') {
      value = parseFloat(value);
    }
    
    console.log('Setting attribute value:', {
      attribute: attr.getName(),
      value,
      instanceLabel: getInstanceLabel(selectedInstance.eObject),
    });
    
    selectedInstance.eObject.eSet(attr, value);
    markDirty(selectedInstance);
  };
  
  const addAttributeValue = (attr: EAttribute, inputElement: HTMLInputElement | HTMLSelectElement) => {
    if (!selectedInstance || !attr.isMany() || !inputElement) return;
    
    let value: any = inputElement.value;
    if (!value) return;
    
    if (isNumberType(attr)) {
      value = parseFloat(value);
    }
    
    const list = selectedInstance.eObject.eGet(attr) as EList<any>;
    if (!(list as any).add) {
      const currentValues = list.elements();
      currentValues.push(value);
      selectedInstance.eObject.eSet(attr, currentValues);
    } else {
      list.add(value);
    }
    
    markDirty(selectedInstance);
    inputElement.value = '';
  };
  
  const removeAttributeValue = (attr: EAttribute, index: number) => {
    if (!selectedInstance || !attr.isMany()) return;
    
    const list = selectedInstance.eObject.eGet(attr) as EList<any>;
    if (list && (list as any).remove) {
      const values = list.elements();
      if (index >= 0 && index < values.length) {
        list.remove(values[index]);
        markDirty(selectedInstance);
      }
    }
  };
  
  const getReferenceValue = (ref: EReference): EObject | undefined => {
    if (!selectedInstance || ref.isMany()) return undefined;
    const value = selectedInstance.eObject.eGet(ref) as EObject;
    
    if (value && value.eIsProxy && value.eIsProxy()) {
      console.debug(`Reference ${ref.getName()} contains unresolved proxy: ${value.fullId()}`);
    }
    
    return value;
  };
  
  const getReferenceValues = (ref: EReference): EObject[] => {
    if (!selectedInstance || !ref.isMany()) return [];
    const list = selectedInstance.eObject.eGet(ref) as EList<EObject>;
    const values = list.elements();
    
    values.forEach((value, index) => {
      if (value && value.eIsProxy && value.eIsProxy()) {
        console.debug(`Reference ${ref.getName()}[${index}] contains unresolved proxy: ${value.fullId()}`);
      }
    });
    
    return values;
  };
  
  const getAttributeType = (attr: EAttribute): string => {
    const type = attr.getEType();
    return type.getName();
  };
  
  const isStringType = (attr: EAttribute): boolean => {
    const typeName = attr.getEType().getName();
    return typeName === 'EString' || typeName === 'String';
  };
  
  const isNumberType = (attr: EAttribute): boolean => {
    const typeName = attr.getEType().getName();
    return ['EInt', 'ELong', 'EFloat', 'EDouble', 'EBigDecimal', 'EBigInteger'].includes(typeName);
  };
  
  const isBooleanType = (attr: EAttribute): boolean => {
    const typeName = attr.getEType().getName();
    return typeName === 'EBoolean' || typeName === 'Boolean';
  };
  
  const isDateType = (attr: EAttribute): boolean => {
    const typeName = attr.getEType().getName();
    return typeName === 'EDate' || typeName === 'Date';
  };
  
  const isEnumType = (attr: EAttribute): boolean => {
    return attr.getEType() instanceof EEnumImpl;
  };
  
  const getEnumLiterals = (attr: EAttribute): string[] => {
    const type = attr.getEType();
    if (type instanceof EEnumImpl) {
      return type.getELiterals().elements().map((lit) => lit.getLiteral());
    }
    return [];
  };
  
  const getAvailableClasses = (): EClass[] => {
    if (isContainmentCreation && containmentReference) {
      const targetType = containmentReference.getEType();
      if (!(targetType instanceof EClassImpl)) return [];
      
      const compatibleClasses: EClass[] = [];
      ePackage!.getEClassifiers().forEach((classifier) => {
        if (
          classifier instanceof EClassImpl &&
          !classifier.isAbstract() &&
          !classifier.isInterface()
        ) {
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
    } else {
      return rootClasses;
    }
  };
  
  const createInstanceForRootClass = (eClass: EClass) => {
    if (!eFactory) return;
    
    const eObject = eFactory.create(eClass);
    
    if (hasIdAttribute(eClass)) {
      const idAttribute = eClass.getEAllAttributes().find((attr) => attr.getName() === 'id');
      if (idAttribute) {
        const generatedId = getNextIdForEClass(eClass);
        eObject.eSet(idAttribute, generatedId);
      }
    }
    
    const instance: ModelInstanceWrapper = {
      eObject,
      children: [],
      expanded: true,
      isDirty: true,
      isNew: true,
    };
    
    console.log('Created new root instance:', {
      className: eClass.getName(),
      isDirty: instance.isDirty,
      isNew: instance.isNew,
    });
    
    const newInstances = [...instances, instance];
    setInstances(newInstances);
    
    const rootNode = rootClassNodes.find((node) => node.eClass === eClass);
    if (rootNode) {
      rootNode.instances.push(instance);
      rootNode.expanded = true;
      setRootClassNodes([...rootClassNodes]);
    }
    
    setSelectedInstance(instance);
    clearFocusAttributes();
    
    setTimeout(() => {
      resolveProxiesForInstance(instance);
    }, 0);
  };
  
  const hasIdAttribute = (eClass: EClass): boolean => {
    return eClass.getEAllAttributes().some((attr) => attr.getName() === 'id');
  };
  
  const getNextIdForEClass = (eClass: EClass): string => {
    const allIds = new Set<string>();
    for (const s of instances) {
      if (s.eObject.eClass() == eClass && eClass.getEIDAttribute()) {
        allIds.add(s.eObject.eGet(eClass.getEIDAttribute()!) as string);
      }
    }
    let count = 1;
    const className = eClass.getName();
    let id = '';
    while (!id) {
      const toTest = `${className}_${count}`;
      if (!allIds.has(toTest)) id = toTest;
      count++;
    }
    return id;
  };
  
  const createInstance = () => {
    if (!selectedEClass || !eFactory) return;
    
    const eObject = eFactory.create(selectedEClass);
    
    if (!isContainmentCreation && isRootEClass(selectedEClass) && hasIdAttribute(selectedEClass)) {
      const idAttribute = selectedEClass.getEAllAttributes().find((attr) => attr.getName() === 'id');
      if (idAttribute) {
        const generatedId = getNextIdForEClass(selectedEClass);
        eObject.eSet(idAttribute, generatedId);
      }
    }
    
    const isNewRoot = !isContainmentCreation && !selectedContainer;
    
    const instance: ModelInstanceWrapper = {
      eObject,
      children: [],
      expanded: true,
      isDirty: isNewRoot,
      isNew: isNewRoot,
    };
    
    console.log('Created instance:', {
      className: selectedEClass.getName(),
      isNewRoot,
      isDirty: instance.isDirty,
      isNew: instance.isNew,
      isContainmentCreation,
      hasSelectedContainer: !!selectedContainer,
    });
    
    const newInstances = [...instances, instance];
    setInstances(newInstances);
    
    if (isContainmentCreation && containmentParent && containmentReference) {
      if (containmentReference.isMany()) {
        const list = containmentParent.eObject.eGet(containmentReference) as EList<EObject>;
        list.add(eObject);
      } else {
        containmentParent.eObject.eSet(containmentReference, eObject);
      }
      
      if (!containmentParent.children.includes(instance)) {
        containmentParent.children.push(instance);
      }
      
      markDirty(containmentParent);
      containmentParent.expanded = true;
    } else if (selectedContainer) {
      const { instance: container, reference } = selectedContainer;
      addToContainer(container, reference, instance);
      markDirty(container);
    } else {
      const rootNode = rootClassNodes.find((node) => node.eClass === selectedEClass);
      if (rootNode) {
        rootNode.instances.push(instance);
        rootNode.expanded = true;
        setRootClassNodes([...rootClassNodes]);
      }
    }
    
    setSelectedInstance(instance);
    hideCreateDialog();
    clearFocusAttributes();
    
    setTimeout(() => {
      resolveProxiesForInstance(instance);
    }, 0);
  };
  
  const isRootEClass = (eClass: EClass): boolean => {
    return rootClasses.includes(eClass);
  };
  
  const addToContainer = (
    container: ModelInstanceWrapper,
    reference: EReference,
    instance: ModelInstanceWrapper
  ) => {
    if (reference.isMany()) {
      const list = container.eObject.eGet(reference) as EList<EObject>;
      list.add(instance.eObject);
    } else {
      container.eObject.eSet(reference, instance.eObject);
    }
    
    if (!container.children.includes(instance)) {
      container.children.push(instance);
    }
    
    rootClassNodes.forEach((node) => {
      const index = node.instances.indexOf(instance);
      if (index > -1) {
        node.instances.splice(index, 1);
      }
    });
  };
  
  const showCreateContainmentDialog = (ref: EReference) => {
    const availableClasses = getAvailableClassesForReference(ref);
    
    if (availableClasses.length === 1) {
      createContainmentDirectly(ref, availableClasses[0]);
    } else {
      setIsContainmentCreation(true);
      setContainmentReference(ref);
      setContainmentParent(selectedInstance);
      setSelectedEClass(null);
      setSelectedContainer(null);
      setShowCreateInstanceDialog(true);
    }
  };
  
  const getAvailableClassesForReference = (ref: EReference): EClass[] => {
    const targetType = ref.getEType();
    if (!(targetType instanceof EClassImpl)) return [];
    
    const compatibleClasses: EClass[] = [];
    ePackage!.getEClassifiers().forEach((classifier) => {
      if (
        classifier instanceof EClassImpl &&
        !classifier.isAbstract() &&
        !classifier.isInterface()
      ) {
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
  };
  
  const createContainmentDirectly = (ref: EReference, eClass: EClass) => {
    if (!eFactory || !selectedInstance) return;
    
    const eObject = eFactory.create(eClass);
    const instance: ModelInstanceWrapper = {
      eObject,
      children: [],
      expanded: true,
      isDirty: false,
      isNew: false,
    };
    
    const newInstances = [...instances, instance];
    setInstances(newInstances);
    
    if (ref.isMany()) {
      const list = selectedInstance.eObject.eGet(ref) as EList<EObject>;
      list.add(eObject);
    } else {
      selectedInstance.eObject.eSet(ref, eObject);
    }
    
    if (!selectedInstance.children.includes(instance)) {
      selectedInstance.children.push(instance);
    }
    
    markDirty(selectedInstance);
    selectedInstance.expanded = true;
    
    setSelectedInstance(instance);
    clearFocusAttributes();
  };
  
  const showAddReferenceDialog = (ref: EReference) => {
    setCurrentReference(ref);
    setReferenceDialogTitle(`Add ${ref.getName()}`);
    setValidReferenceTargets(getValidReferenceTargets(ref));
    setSelectedReferenceTargetIndex(-1);
    setShowReferenceDialog(true);
  };
  
  const showSetReferenceDialog = (ref: EReference) => {
    setCurrentReference(ref);
    setReferenceDialogTitle(`Set ${ref.getName()}`);
    setValidReferenceTargets(getValidReferenceTargets(ref));
    setSelectedReferenceTargetIndex(-1);
    setShowReferenceDialog(true);
  };
  
  const getValidReferenceTargets = (ref?: EReference): ModelInstanceWrapper[] => {
    if (!ref) return [];
    
    const targetType = ref.getEType();
    return instances.filter(
      (instance) =>
        instance !== selectedInstance &&
        !instance.eObject.eIsProxy() &&
        (instance.eObject.eClass() === targetType ||
          instance.eObject.eClass().getESuperTypes().contains(targetType)) &&
        (!ref.isContainment() || !instance.eObject.eContainer())
    );
  };
  
  const applyReference = () => {
    if (
      !selectedInstance ||
      !currentReference ||
      selectedReferenceTargetIndex === -1
    )
      return;
    
    const selectedReferenceTarget = validReferenceTargets[selectedReferenceTargetIndex];
    if (!selectedReferenceTarget) return;
    
    if (currentReference.isMany()) {
      const list = selectedInstance.eObject.eGet(currentReference) as EList<EObject>;
      list.add(selectedReferenceTarget.eObject);
    } else {
      selectedInstance.eObject.eSet(currentReference, selectedReferenceTarget.eObject);
    }
    
    if (currentReference.isContainment()) {
      selectedInstance.children.push(selectedReferenceTarget);
      rootClassNodes.forEach((node) => {
        const index = node.instances.indexOf(selectedReferenceTarget);
        if (index > -1) {
          node.instances.splice(index, 1);
        }
      });
    }
    
    markDirty(selectedInstance);
    hideReferenceDialog();
  };
  
  const removeReference = (ref: EReference, target: EObject, event?: React.MouseEvent) => {
    if (event) event.stopPropagation();
    if (!selectedInstance) return;
    
    if (ref.isMany()) {
      const list = selectedInstance.eObject.eGet(ref) as EList<EObject>;
      list.remove(target);
      
      if (ref.isContainment()) {
        const targetInstance = instances.find((i) => i.eObject === target);
        if (targetInstance) {
          const index = selectedInstance.children.indexOf(targetInstance);
          if (index > -1) selectedInstance.children.splice(index, 1);
          
          const eClass = target.eClass();
          const rootNode = rootClassNodes.find((node) => node.eClass === eClass);
          if (rootNode) {
            rootNode.instances.push(targetInstance);
          }
        }
      }
    }
    
    markDirty(selectedInstance);
  };
  
  const clearReference = (ref: EReference, event?: React.MouseEvent) => {
    if (event) event.stopPropagation();
    if (!selectedInstance) return;
    
    const current = selectedInstance.eObject.eGet(ref) as EObject;
    selectedInstance.eObject.eSet(ref, null);
    
    if (ref.isContainment() && current) {
      const targetInstance = instances.find((i) => i.eObject === current);
      if (targetInstance) {
        const index = selectedInstance.children.indexOf(targetInstance);
        if (index > -1) selectedInstance.children.splice(index, 1);
        
        const eClass = current.eClass();
        const rootNode = rootClassNodes.find((node) => node.eClass === eClass);
        if (rootNode) {
          rootNode.instances.push(targetInstance);
        }
      }
    }
    
    markDirty(selectedInstance);
  };
  
  const selectReferenceTarget = (eObject: EObject | undefined) => {
    if (!eObject) return;
    
    const instance = instances.find((i) => i.eObject === eObject);
    if (instance) {
      setSelectedInstance(instance);
      clearFocusAttributes();
      expandToInstance(instance);
    }
  };
  
  const expandToInstance = (target: ModelInstanceWrapper) => {
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
    
    rootClassNodes.forEach((rootNode) => {
      rootNode.instances.forEach((root) => expandPath(root));
      if (rootNode.instances.includes(target)) {
        rootNode.expanded = true;
      }
    });
    
    setInstances([...instances]);
    setRootClassNodes([...rootClassNodes]);
  };
  
  const showCreateDialog = () => {
    setIsContainmentCreation(false);
    setContainmentReference(null);
    setContainmentParent(null);
    setShowCreateInstanceDialog(true);
    setSelectedEClass(null);
    setSelectedContainer(null);
  };
  
  const hideCreateDialog = () => {
    setShowCreateInstanceDialog(false);
    setSelectedEClass(null);
    setSelectedContainer(null);
    setIsContainmentCreation(false);
    setContainmentReference(null);
    setContainmentParent(null);
  };
  
  const hideReferenceDialog = () => {
    setShowReferenceDialog(false);
    setCurrentReference(null);
    setSelectedReferenceTargetIndex(-1);
    setValidReferenceTargets([]);
  };
  
  const shouldShowSaveButton = (instance: ModelInstanceWrapper): boolean => {
    if (!connectionStatus.connected) return false;
    const root = getRootContainer(instance);
    return root.isDirty || root.isNew;
  };
  
  const shouldShowDeleteButton = (instance: ModelInstanceWrapper): boolean => {
    const root = getRootContainer(instance);
    return !root.isDirty && !root.isNew;
  };
  
  const isRootNew = (instance: ModelInstanceWrapper): boolean => {
    const root = getRootContainer(instance);
    return root.isNew;
  };
  
  const isDirtyNotNew = (instance: ModelInstanceWrapper): boolean => {
    const root = getRootContainer(instance);
    return instance.isDirty && !root.isNew;
  };
  
  // Tree node component
  const TreeNode: React.FC<{ instance: ModelInstanceWrapper; level: number }> = ({ instance, level }) => (
    <div className="tree-node" style={{ marginLeft: `${level * 20}px` }}>
      <div
        className={clsx('tree-node-content', {
          selected: selectedInstance === instance,
        })}
        onClick={() => selectInstance(instance)}
      >
        {instance.children.length > 0 && (
          <span className="tree-toggle" onClick={(e) => toggleExpanded(instance, e)}>
            {instance.expanded ? '▼' : '▶'}
          </span>
        )}
        <span className="tree-label">
          {isRootNew(instance) && connectionStatus.connected && <span className="new-indicator">*</span>}
          {isDirtyNotNew(instance) && connectionStatus.connected && <span className="dirty-indicator">*</span>}
          {getInstanceLabel(instance.eObject)}
        </span>
        <span className="tree-type">{getEClassName(instance.eObject)}</span>
        
        {connectionStatus.connected && (
          <span className="tree-node-actions">
            {shouldShowSaveButton(instance) && connectionStatus.connected && (
              <button
                className="btn btn-sm btn-primary tree-node-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  saveInstance(getRootContainer(instance));
                }}
                disabled={isSaving}
                title="Save changes"
              >
                Save
              </button>
            )}
            
            {shouldShowDeleteButton(instance) && (
              <button
                className="btn btn-sm btn-danger tree-node-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteInstance(instance);
                }}
                title="Delete instance"
              >
                ×
              </button>
            )}
          </span>
        )}
      </div>
      
      {instance.expanded && (
        <div className="tree-children">
          {instance.children.map((child, index) => (
            <TreeNode key={index} instance={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
  
  return (
    <div className="tmf-editor">
      {/* Header */}
      <header className="editor-header">
        <div className="header-content">
          <div className="logo">TMF</div>
          <h1>Reflective Model Editor</h1>
          {ePackage && (
            <div className="package-info">
              <span className="package-name">EPackage: {ePackage.getName()}</span>
            </div>
          )}
          <div className={clsx('connection-status', { connected: connectionStatus.connected })}>
            <span className="status-indicator"></span>
            <span className="status-text">{connectionStatus.message}</span>
          </div>
        </div>
      </header>
      
      <div className="editor-body">
        {/* Tree Panel */}
        <aside className="tree-panel">
          <div className="panel-header">
            <h2>Model Instances</h2>
            <div className="panel-actions">
              {hasAnyDirtyInstances() && connectionStatus.connected && (
                <button
                  className="btn btn-primary"
                  onClick={saveAllDirtyInstances}
                  disabled={isSaving}
                >
                  {isSaving && <span className="icon">⏳</span>}
                  {isSaving ? 'Saving...' : 'Save All'}
                </button>
              )}
            </div>
          </div>
          
          <div className="tree-content">
            {rootClassNodes.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <p>No model loaded</p>
                <small>Load a metamodel to get started</small>
              </div>
            ) : (
              <div className="tree">
                {rootClassNodes.map((rootNode, index) => (
                  <div key={index} className="root-class-node">
                    <div className="root-class-header">
                      {rootNode.instances.length > 0 && (
                        <span
                          className="tree-toggle"
                          onClick={(e) => toggleRootClassExpanded(rootNode, e)}
                        >
                          {rootNode.expanded ? '▼' : '▶'}
                        </span>
                      )}
                      <span className="root-class-label">{rootNode.eClass.getName()}s</span>
                      <button
                        className="btn btn-sm btn-primary root-create-btn"
                        onClick={() => createInstanceForRootClass(rootNode.eClass)}
                      >
                        + Create
                      </button>
                    </div>
                    
                    {rootNode.expanded && (
                      <div className="tree-children">
                        {rootNode.instances.map((instance, idx) => (
                          <TreeNode key={idx} instance={instance} level={1} />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
        
        {/* Properties Panel */}
        <main className="properties-panel">
          <div className="panel-header">
            <h2>Properties</h2>
          </div>
          
          <div className="properties-content">
            {!selectedInstance ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <p>Select an instance</p>
                <small>Choose an instance from the tree to view its properties</small>
              </div>
            ) : (
              <div className="property-groups" style={{ maxWidth: '500px' }}>
                <div className="instance-info">
                  <span className="instance-type">{getEClassName(selectedInstance.eObject)}</span>
                  {connectionStatus.connected && (
                    <div>
                      {isRootNew(selectedInstance) && <span className="badge badge-new">New</span>}
                      {isDirtyNotNew(selectedInstance) && <span className="badge badge-dirty">Modified</span>}
                    </div>
                  )}
                </div>
                
                {/* Attributes Group */}
                {getAttributes().length > 0 && (
                  <div className="property-group">
                    <div className="group-header">
                      <span className="group-icon">📝</span>
                      <h3>Attributes</h3>
                    </div>
                    <div className="group-content">
                      {getAttributes().map((attr, i) => (
                        <div key={i} className="property-field">
                          <label className="property-label">
                            {attr.getName()}
                            {attr.isId() && <span className="property-meta">(ID)</span>}
                            {attr.isMany() && (
                              <span className="property-meta">
                                [{attr.getLowerBound()}..{attr.getUpperBound() === -1 ? '*' : attr.getUpperBound()}]
                              </span>
                            )}
                            <span className="property-type">{getAttributeType(attr)}</span>
                          </label>
                          <div className="property-control">
                            {attr.isMany() ? (
                              <div className="reference-list">
                                {getAttributeValues(attr).map((value, j) => (
                                  <div key={j} className="reference-item">
                                    <span className="reference-label">{value}</span>
                                    <button
                                      className="btn btn-sm btn-danger"
                                      onClick={() => removeAttributeValue(attr, j)}
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                                {isStringType(attr) && (
                                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <input
                                      type="text"
                                      className="form-input"
                                      ref={(el) => (propertyInputRefs.current[i] = el)}
                                      placeholder="New value"
                                      onKeyUp={(e) => {
                                        if (e.key === 'Enter') {
                                          addAttributeValue(attr, e.currentTarget);
                                        }
                                      }}
                                    />
                                    <button
                                      className="btn btn-sm btn-primary"
                                      onClick={(e) => {
                                        const input = propertyInputRefs.current[i];
                                        if (input) addAttributeValue(attr, input);
                                      }}
                                    >
                                      + Add
                                    </button>
                                  </div>
                                )}
                                {isNumberType(attr) && (
                                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <input
                                      type="number"
                                      className="form-input"
                                      ref={(el) => (propertyInputRefs.current[i] = el)}
                                      placeholder="New value"
                                      onKeyUp={(e) => {
                                        if (e.key === 'Enter') {
                                          addAttributeValue(attr, e.currentTarget);
                                        }
                                      }}
                                    />
                                    <button
                                      className="btn btn-sm btn-primary"
                                      onClick={() => {
                                        const input = propertyInputRefs.current[i];
                                        if (input) addAttributeValue(attr, input);
                                      }}
                                    >
                                      + Add
                                    </button>
                                  </div>
                                )}
                                {isEnumType(attr) && (
                                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <select
                                      className="form-select"
                                      ref={(el) => (propertyInputRefs.current[i] = el)}
                                    >
                                      {getEnumLiterals(attr).map((literal) => (
                                        <option key={literal} value={literal}>
                                          {literal}
                                        </option>
                                      ))}
                                    </select>
                                    <button
                                      className="btn btn-sm btn-primary"
                                      onClick={() => {
                                        const input = propertyInputRefs.current[i];
                                        if (input) addAttributeValue(attr, input);
                                      }}
                                    >
                                      + Add
                                    </button>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <>
                                {isStringType(attr) && (
                                  <input
                                    type="text"
                                    className="form-input"
                                    ref={(el) => (propertyInputRefs.current[i] = el)}
                                    value={getAttributeValue(attr)}
                                    onChange={(e) => setAttributeValue(attr, e)}
                                  />
                                )}
                                {isNumberType(attr) && (
                                  <input
                                    type="number"
                                    className="form-input"
                                    ref={(el) => (propertyInputRefs.current[i] = el)}
                                    value={getAttributeValue(attr)}
                                    onChange={(e) => setAttributeValue(attr, e)}
                                  />
                                )}
                                {isBooleanType(attr) && (
                                  <input
                                    type="checkbox"
                                    className="form-checkbox"
                                    ref={(el) => (propertyInputRefs.current[i] = el)}
                                    checked={getAttributeValue(attr)}
                                    onChange={(e) => setAttributeValue(attr, e)}
                                  />
                                )}
                                {isDateType(attr) && (
                                  <input
                                    type="date"
                                    className="form-input"
                                    ref={(el) => (propertyInputRefs.current[i] = el)}
                                    value={getAttributeValue(attr)}
                                    onChange={(e) => setAttributeValue(attr, e)}
                                  />
                                )}
                                {isEnumType(attr) && (
                                  <select
                                    className="form-select"
                                    ref={(el) => (propertyInputRefs.current[i] = el)}
                                    value={getAttributeValue(attr)}
                                    onChange={(e) => setAttributeValue(attr, e)}
                                  >
                                    {getEnumLiterals(attr).map((literal) => (
                                      <option key={literal} value={literal}>
                                        {literal}
                                      </option>
                                    ))}
                                  </select>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* References Group */}
                {getReferences().length > 0 && (
                  <div className="property-group">
                    <div className="group-header">
                      <span className="group-icon">🔗</span>
                      <h3>References</h3>
                    </div>
                    <div className="group-content">
                      {getReferences().map((ref) => (
                        !ref.isContainer() && (
                          <div key={ref.getName()} className="property-field">
                            <label className="property-label">
                              {ref.getName()}
                              {ref.isContainment() && <span className="property-meta">(containment)</span>}
                              {ref.isMany() && (
                                <span className="property-meta">
                                  [{ref.getLowerBound()}..{ref.getUpperBound() === -1 ? '*' : ref.getUpperBound()}]
                                </span>
                              )}
                              <span className="property-type">{ref.getEType().getName()}</span>
                            </label>
                            
                            <div className="reference-control">
                              {ref.isMany() ? (
                                <div className="reference-list">
                                  {getReferenceValues(ref).map((target, idx) => (
                                    <div
                                      key={idx}
                                      className="reference-item"
                                      onClick={() => selectReferenceTarget(target)}
                                    >
                                      <span className="reference-label" style={{ cursor: 'pointer' }}>
                                        {getInstanceLabel(target)}
                                      </span>
                                      <button
                                        className="btn btn-sm btn-danger"
                                        onClick={(e) => removeReference(ref, target, e)}
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ))}
                                  {ref.isContainment() ? (
                                    <button
                                      className="btn btn-sm btn-primary"
                                      onClick={() => showCreateContainmentDialog(ref)}
                                    >
                                      + Create {ref.getName()}
                                    </button>
                                  ) : (
                                    <button
                                      className="btn btn-sm btn-primary"
                                      onClick={() => showAddReferenceDialog(ref)}
                                    >
                                      + Add {ref.getName()}
                                    </button>
                                  )}
                                </div>
                              ) : (
                                <div className="reference-single">
                                  {getReferenceValue(ref) && (
                                    <div
                                      className="reference-item"
                                      onClick={() => selectReferenceTarget(getReferenceValue(ref))}
                                    >
                                      <span className="reference-label" style={{ cursor: 'pointer' }}>
                                        {getInstanceLabel(getReferenceValue(ref))}
                                      </span>
                                      <button
                                        className="btn btn-sm btn-danger"
                                        onClick={(e) => clearReference(ref, e)}
                                      >
                                        ×
                                      </button>
                                    </div>
                                  )}
                                  {!getReferenceValue(ref) && (
                                    ref.isContainment() ? (
                                      <button
                                        className="btn btn-sm btn-primary"
                                        onClick={() => showCreateContainmentDialog(ref)}
                                      >
                                        Create {ref.getName()}
                                      </button>
                                    ) : (
                                      <button
                                        className="btn btn-sm btn-primary"
                                        onClick={() => showSetReferenceDialog(ref)}
                                      >
                                        Set {ref.getName()}
                                      </button>
                                    )
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
      
      {/* Create Instance Dialog */}
      {showCreateInstanceDialog && (
        <div className="dialog">
          <div className="dialog-backdrop" onClick={hideCreateDialog}></div>
          <div className="dialog-content">
            <div className="dialog-header">
              <h3>
                {isContainmentCreation
                  ? `Create ${containmentReference?.getName()}`
                  : 'Create New Instance'}
              </h3>
              <button className="dialog-close" onClick={hideCreateDialog}>
                ×
              </button>
            </div>
            
            <div className="dialog-body">
              <div className="form-group">
                <label>Select Class Type</label>
                <div className="class-grid">
                  {getAvailableClasses().map((eClass) => (
                    <div
                      key={eClass.getName()}
                      className={clsx('class-card', {
                        selected: selectedEClass === eClass,
                      })}
                      onClick={() => setSelectedEClass(eClass)}
                    >
                      <div className="class-name">{eClass.getName()}</div>
                      <div className="class-info">
                        <span>{eClass.getEAttributes().size()} attributes</span>
                        <span>{eClass.getEReferences().size()} references</span>
                      </div>
                      <div className="class-badges">
                        {eClass.isAbstract() && <span className="badge badge-abstract">abstract</span>}
                        {eClass.isInterface() && <span className="badge badge-interface">interface</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="dialog-footer">
              <button className="btn btn-secondary" onClick={hideCreateDialog}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                disabled={!selectedEClass}
                onClick={createInstance}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Reference Dialog */}
      {showReferenceDialog && (
        <div className="dialog">
          <div className="dialog-backdrop" onClick={hideReferenceDialog}></div>
          <div className="dialog-content">
            <div className="dialog-header">
              <h3>{referenceDialogTitle}</h3>
              <button className="dialog-close" onClick={hideReferenceDialog}>
                ×
              </button>
            </div>
            
            <div className="dialog-body">
              <div className="form-group">
                <label>Select Target Instance</label>
                <select
                  className="form-select"
                  value={selectedReferenceTargetIndex}
                  onChange={(e) => setSelectedReferenceTargetIndex(parseInt(e.target.value))}
                >
                  <option value={-1}>Select an instance...</option>
                  {validReferenceTargets.map((instance, i) => (
                    <option key={i} value={i}>
                      {getInstanceLabel(instance.eObject)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="dialog-footer">
              <button className="btn btn-secondary" onClick={hideReferenceDialog}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                disabled={selectedReferenceTargetIndex === -1}
                onClick={applyReference}
              >
                {currentReference?.isMany() ? 'Add' : 'Set'} Reference
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;