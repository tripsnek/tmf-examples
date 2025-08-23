// app.component.ts
import { Component, OnInit, ViewChildren, QueryList, ElementRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';
import {
  EPackage,
  EClass,
  EFactory,
  EObject,
  EStructuralFeature,
  EAttribute,
  EReference,
  EClassImpl,
  EAttributeImpl,
  EEnumImpl,
  EList,
  TUtils,
} from "@tripsnek/tmf";
import {
  TripplanningFactory,
  TripplanningPackage,
} from "@tmf-example/data-model";
import { CrudService, ConnectionStatus } from './services/crud.service';

interface ModelInstance {
  eObject: EObject;
  children: ModelInstance[];
  expanded: boolean;
  isDirty: boolean;
  isNew: boolean;  // Track if this instance is new (not yet saved to server)
}

interface RootClassNode {
  eClass: EClass;
  instances: ModelInstance[];
  expanded: boolean;
}

interface PropertyGroup {
  title: string;
  icon: string;
  properties: Property[];
}

interface Property {
  name: string;
  type: string;
  value: any;
  feature: EStructuralFeature;
  isReference: boolean;
  isContainment: boolean;
  isMany: boolean;
}

@Component({
  selector: "app-tmf-editor",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  providers: [CrudService]
})
export class TMFReflectiveEditorComponent implements OnInit {
  @ViewChildren('propertyInput') propertyInputs!: QueryList<ElementRef>;

  ePackage: EPackage | null = null;
  eFactory: EFactory | null = null;

  instances: ModelInstance[] = [];
  rootClasses: EClass[] = [];
  rootClassNodes: RootClassNode[] = [];
  selectedInstance: ModelInstance | null = null;

  showCreateInstanceDialog = false;
  showReferenceDialog = false;
  selectedEClass: EClass | null = null;
  selectedContainer: any = null;

  currentReference: EReference | null = null;
  selectedReferenceTarget: ModelInstance | null = null;
  selectedReferenceTargetIndex: number = -1;
  validReferenceTargets: ModelInstance[] = [];
  referenceDialogTitle = "";

  // For containment creation
  isContainmentCreation = false;
  containmentReference: EReference | null = null;
  containmentParent: ModelInstance | null = null;

  // Counters for auto-generating IDs for root EClasses
  private eClassCounters = new Map<string, number>();

  // Server connection status
  connectionStatus: ConnectionStatus = {
    connected: false,
    message: 'Checking connection...'
  };

  // Saving state
  isSaving = false;

  constructor(private crudService: CrudService) {}

  ngOnInit() {
    // Load metamodel
    this.loadMetamodel();

    // Subscribe to connection status
    this.crudService.connectionStatus$.subscribe(status => {
      this.connectionStatus = status;
    });

    // Check server and load data
    this.checkServerAndLoadData();
  }

  ngAfterViewChecked() {
    // Focus on the first property input when properties become visible
    if (this.selectedInstance && this.propertyInputs && this.propertyInputs.length > 0) {
      const firstInput = this.propertyInputs.first;
      if (firstInput && firstInput.nativeElement && 
          !firstInput.nativeElement.hasAttribute('data-focused')) {
        setTimeout(() => {
          firstInput.nativeElement.focus();
          firstInput.nativeElement.setAttribute('data-focused', 'true');
        }, 100);
      }
    }
  }

  checkServerAndLoadData() {
    // Check if there are any unsaved changes
    const hasUnsavedChanges = this.instances.some(inst => inst.isDirty || inst.isNew);
    
    if (hasUnsavedChanges) {
      if (!confirm('You have unsaved changes. Refreshing will lose these changes. Continue?')) {
        return;
      }
    }

    this.crudService.checkConnection().subscribe(status => {
      if (status) {
        // Server is connected, load instances
        this.loadInstancesFromServer();
      }
    });
  }

  loadInstancesFromServer() {
    this.crudService.loadAllRootInstances(this.rootClasses).subscribe(
      instanceMap => {
        // Clear existing instances
        this.instances = [];
        this.rootClassNodes.forEach(node => node.instances = []);

        // Process loaded instances
        instanceMap.forEach((eObjects, eClass) => {
          const rootNode = this.getRootClassNode(eClass);
          if (rootNode) {
            eObjects.forEach(eObject => {
              const instance: ModelInstance = {
                eObject,
                children: [],
                expanded: false,
                isDirty: false,  // Loaded instances are not dirty
                isNew: false     // Loaded instances are not new
              };
              this.instances.push(instance);
              rootNode.instances.push(instance);
              
              // Build containment tree
              this.buildContainmentTree(instance);
            });
          }
        });

        console.log(`Loaded ${this.instances.length} instances from server`);
      },
      error => {
        console.error('Failed to load instances from server:', error);
      }
    );
  }

  private buildContainmentTree(instance: ModelInstance) {
    instance.eObject.eClass().getEAllReferences().forEach(ref => {
      if (ref.isContainment()) {
        if (ref.isMany()) {
          const list = instance.eObject.eGet(ref) as EList<EObject>;
          if (list) {
            list.forEach(childEObject => {
              const childInstance: ModelInstance = {
                eObject: childEObject,
                children: [],
                expanded: false,
                isDirty: false,
                isNew: false
              };
              instance.children.push(childInstance);
              this.instances.push(childInstance);
              // Recursively build tree
              this.buildContainmentTree(childInstance);
            });
          }
        } else {
          const childEObject = instance.eObject.eGet(ref) as EObject;
          if (childEObject) {
            const childInstance: ModelInstance = {
              eObject: childEObject,
              children: [],
              expanded: false,
              isDirty: false,
              isNew: false
            };
            instance.children.push(childInstance);
            this.instances.push(childInstance);
            // Recursively build tree
            this.buildContainmentTree(childInstance);
          }
        }
      }
    });
  }

  loadMetamodel() {
    // This would normally load the actual metamodel
    // For now, we'll assume it's available via injection or import
    this.ePackage = TripplanningPackage.eINSTANCE;
    this.eFactory = TripplanningFactory.eINSTANCE;
    
    this.rootClasses = TUtils.getRootEClasses(this.ePackage);

    // Initialize root class nodes
    this.initializeRootClassNodes();
  }

  initializeRootClassNodes() {
    this.rootClassNodes = this.rootClasses.map(eClass => ({
      eClass,
      instances: [],
      expanded: true
    }));
  }

  getRootClassNode(eClass: EClass): RootClassNode | undefined {
    return this.rootClassNodes.find(node => node.eClass === eClass);
  }

  // Mark instance and all containers as dirty
  markDirty(instance: ModelInstance) {
    console.log('Marking instance as dirty:', this.getInstanceLabel(instance.eObject));
    instance.isDirty = true;
    
    // Mark all containers up to root as dirty
    const parent = this.findParentInstance(instance);
    if (parent) {
      this.markDirty(parent);
    }
  }

  // Get the root container of an instance
  getRootContainer(instance: ModelInstance): ModelInstance {
    const parent = this.findParentInstance(instance);
    return parent ? this.getRootContainer(parent) : instance;
  }

  // Save the root container of the selected instance
  saveSelectedInstance() {
    if (!this.selectedInstance) return;

    const rootInstance = this.getRootContainer(this.selectedInstance);
    this.saveInstance(rootInstance);
  }

  // Save a specific instance to the server
  saveInstance(instance: ModelInstance) {
    if (!instance.isDirty && !instance.isNew) return;

    this.isSaving = true;

    // For new instances, always use create (POST)
    // For existing dirty instances, use update (PUT)
    this.crudService.saveInstance(instance.eObject, instance.isNew).subscribe(
      savedEObject => {
        // Update the instance with the saved object (this ensures we have the server-assigned ID if any)
        const oldEObject = instance.eObject;
        instance.eObject = savedEObject;
        
        // Update the reference in all places where this object is referenced
        this.updateObjectReferences(oldEObject, savedEObject);
        
        // Clear flags after successful save
        instance.isDirty = false;
        instance.isNew = false;

        // Clear dirty and new flags for all children (they're saved as part of the aggregate)
        this.clearDirtyAndNewFlags(instance);

        this.isSaving = false;
        console.log('Instance saved successfully');
      },
      error => {
        this.isSaving = false;
        console.error('Failed to save instance:', error);
        alert('Failed to save instance. Check console for details.');
      }
    );
  }

  private clearDirtyAndNewFlags(instance: ModelInstance) {
    instance.isDirty = false;
    instance.isNew = false;
    instance.children.forEach(child => this.clearDirtyAndNewFlags(child));
  }

  private updateObjectReferences(oldEObject: EObject, newEObject: EObject) {
    // Update any references to this object throughout the model
    this.instances.forEach(inst => {
      inst.eObject.eClass().getEAllReferences().forEach(ref => {
        if (!ref.isContainment()) {
          if (ref.isMany()) {
            const list = inst.eObject.eGet(ref) as EList<EObject>;
            const index = list.indexOf(oldEObject);
            if (index >= 0) {
              list.set(index, newEObject);
            }
          } else {
            const value = inst.eObject.eGet(ref);
            if (value === oldEObject) {
              inst.eObject.eSet(ref, newEObject);
            }
          }
        }
      });
    });
  }

  private clearDirtyFlags(instance: ModelInstance) {
    instance.isDirty = false;
    instance.children.forEach(child => this.clearDirtyFlags(child));
  }

  // Get classes available for creation (root classes or classes for containment)
  getAvailableClasses(): EClass[] {
    if (this.isContainmentCreation && this.containmentReference) {
      // For containment creation, show classes compatible with the reference type
      const targetType = this.containmentReference.getEType();
      if (!(targetType instanceof EClassImpl)) return [];

      const compatibleClasses: EClass[] = [];
      this.ePackage!.getEClassifiers().forEach((classifier) => {
        if (
          classifier instanceof EClassImpl &&
          !classifier.isAbstract() &&
          !classifier.isInterface()
        ) {
          // Check if this class is compatible with the reference type
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
      // For root creation, show only root classes
      return this.rootClasses;
    }
  }

  getInstantiableClasses(): EClass[] {
    if (!this.ePackage) return [];

    const classes: EClass[] = [];
    this.ePackage.getEClassifiers().forEach((classifier) => {
      const eclass = classifier as EClass;

      if (
        classifier instanceof EClassImpl &&
        !classifier.isAbstract() &&
        !classifier.isInterface()
      ) {
        classes.push(classifier);
      }
    });
    return classes;
  }

  selectEClass(eClass: EClass) {
    this.selectedEClass = eClass;
  }

  getPossibleContainers() {
    if (!this.selectedEClass) return [];

    const containers: any[] = [];
    this.instances.forEach((instance) => {
      instance.eObject
        .eClass()
        .getEReferences()
        .forEach((ref) => {
          if (ref.isContainment() && ref.getEType() === this.selectedEClass) {
            containers.push({ instance, reference: ref });
          }
        });
    });
    return containers;
  }

  private isRootEClass(eClass: EClass): boolean {
    return this.rootClasses.includes(eClass);
  }

  private hasIdAttribute(eClass: EClass): boolean {
    return eClass.getEAllAttributes().some((attr) => attr.getName() === "id");
  }

  private getNextIdForEClass(eClass: EClass): string {
    const className = eClass.getName();
    const currentCount = this.eClassCounters.get(className) || 0;
    const nextCount = currentCount + 1;
    this.eClassCounters.set(className, nextCount);
    return `${className}_${nextCount}`;
  }

  createInstance() {
    if (!this.selectedEClass || !this.eFactory) return;

    const eObject = this.eFactory.create(this.selectedEClass);

    // Auto-generate ID for root EClasses that have an ID attribute
    if (
      !this.isContainmentCreation &&
      this.isRootEClass(this.selectedEClass) &&
      this.hasIdAttribute(this.selectedEClass)
    ) {
      const idAttribute = this.selectedEClass
        .getEAllAttributes()
        .find((attr) => attr.getName() === "id");
      if (idAttribute) {
        const generatedId = this.getNextIdForEClass(this.selectedEClass);
        eObject.eSet(idAttribute, generatedId);
      }
    }

    // Determine if this is a new root instance
    const isNewRoot = !this.isContainmentCreation && !this.selectedContainer;
    
    const instance: ModelInstance = {
      eObject,
      children: [],
      expanded: true,
      isDirty: isNewRoot,  // Root instances start dirty
      isNew: isNewRoot     // Only root instances that are created at the top level are "new"
    };

    console.log('Created instance:', {
      className: this.selectedEClass.getName(),
      isNewRoot,
      isDirty: instance.isDirty,
      isNew: instance.isNew,
      isContainmentCreation: this.isContainmentCreation,
      hasSelectedContainer: !!this.selectedContainer
    });

    this.instances.push(instance);

    if (
      this.isContainmentCreation &&
      this.containmentParent &&
      this.containmentReference
    ) {
      // Creating a new instance for a containment reference
      if (this.containmentReference.isMany()) {
        const list = this.containmentParent.eObject.eGet(
          this.containmentReference
        );
        list.add(eObject);
      } else {
        this.containmentParent.eObject.eSet(this.containmentReference, eObject);
      }

      // Add to parent's children in the tree
      if (!this.containmentParent.children.includes(instance)) {
        this.containmentParent.children.push(instance);
      }

      // Mark parent as dirty (this will propagate up to root)
      this.markDirty(this.containmentParent);

      // Make sure parent is expanded to show new child
      this.containmentParent.expanded = true;
    } else if (this.selectedContainer) {
      const { instance: container, reference } = this.selectedContainer;
      this.addToContainer(container, reference, instance);
      this.markDirty(container);
    } else {
      // Root instance - add to appropriate root class node
      const rootNode = this.getRootClassNode(this.selectedEClass);
      if (rootNode) {
        rootNode.instances.push(instance);
        rootNode.expanded = true;
      }
    }

    this.selectedInstance = instance;
    this.hideCreateDialog();
    
    // Clear focus attributes when new instance is selected
    this.clearFocusAttributes();
  }

  createInstanceForRootClass(eClass: EClass) {
    if (!this.eFactory) return;

    const eObject = this.eFactory.create(eClass);

    // Auto-generate ID for root EClasses that have an ID attribute
    if (this.hasIdAttribute(eClass)) {
      const idAttribute = eClass
        .getEAllAttributes()
        .find((attr) => attr.getName() === "id");
      if (idAttribute) {
        const generatedId = this.getNextIdForEClass(eClass);
        eObject.eSet(idAttribute, generatedId);
      }
    }

    const instance: ModelInstance = {
      eObject,
      children: [],
      expanded: true,
      isDirty: true,
      isNew: true
    };

    console.log('Created new root instance:', {
      className: eClass.getName(),
      isDirty: instance.isDirty,
      isNew: instance.isNew
    });

    this.instances.push(instance);

    // Add to appropriate root class node
    const rootNode = this.getRootClassNode(eClass);
    if (rootNode) {
      rootNode.instances.push(instance);
      rootNode.expanded = true;
    }

    this.selectedInstance = instance;
    
    // Clear focus attributes when new instance is selected
    this.clearFocusAttributes();
  }

  private clearFocusAttributes() {
    // Clear focus tracking attributes from all inputs
    if (this.propertyInputs) {
      this.propertyInputs.forEach(input => {
        input.nativeElement.removeAttribute('data-focused');
      });
    }
  }

  private addToContainer(
    container: ModelInstance,
    reference: EReference,
    instance: ModelInstance
  ) {
    if (reference.isMany()) {
      const list = container.eObject.eGet(reference);
      list.add(instance.eObject);
    } else {
      container.eObject.eSet(reference, instance.eObject);
    }

    // Update the tree structure
    if (!container.children.includes(instance)) {
      container.children.push(instance);
    }

    // Remove from root if it was there
    this.rootClassNodes.forEach(node => {
      const index = node.instances.indexOf(instance);
      if (index > -1) {
        node.instances.splice(index, 1);
      }
    });
  }

  deleteInstance() {
    if (!this.selectedInstance) return;

    const rootInstance = this.getRootContainer(this.selectedInstance);
    
    // If connected to server and the root is not new (has been saved), delete from server
    if (this.connectionStatus.connected && !rootInstance.isNew) {
      // For now, we'll only allow deleting root instances from server
      if (this.selectedInstance === rootInstance) {
        this.crudService.deleteInstance(this.selectedInstance.eObject).subscribe(
          () => {
            this.removeInstanceFromTree();
          },
          error => {
            console.error('Failed to delete from server:', error);
            alert('Failed to delete from server. Check console for details.');
          }
        );
      } else {
        // For contained instances, mark parent as dirty and remove locally
        const parent = this.findParentInstance(this.selectedInstance);
        if (parent) {
          this.markDirty(parent);
        }
        this.removeInstanceFromTree();
      }
    } else {
      // Instance is new (not saved) or no server connection - just remove locally
      this.removeInstanceFromTree();
    }
  }

  private removeInstanceFromTree() {
    if (!this.selectedInstance) return;

    // Remove from parent if contained
    const parent = this.findParentInstance(this.selectedInstance);
    if (parent) {
      const index = parent.children.indexOf(this.selectedInstance);
      if (index > -1) parent.children.splice(index, 1);

      // Remove from model
      parent.eObject
        .eClass()
        .getEReferences()
        .forEach((ref) => {
          if (ref.isContainment()) {
            if (ref.isMany()) {
              const list = parent.eObject.eGet(ref);
              list.remove(this.selectedInstance!.eObject);
            } else if (
              parent.eObject.eGet(ref) === this.selectedInstance!.eObject
            ) {
              parent.eObject.eSet(ref, null);
            }
          }
        });
    } else {
      // Remove from root class node
      const eClass = this.selectedInstance.eObject.eClass();
      const rootNode = this.getRootClassNode(eClass);
      if (rootNode) {
        const index = rootNode.instances.indexOf(this.selectedInstance);
        if (index > -1) rootNode.instances.splice(index, 1);
      }
    }

    const index = this.instances.indexOf(this.selectedInstance);
    if (index > -1) this.instances.splice(index, 1);

    this.selectedInstance = null;
  }

  private findParentInstance(instance: ModelInstance): ModelInstance | null {
    for (const rootNode of this.rootClassNodes) {
      for (const rootInstance of rootNode.instances) {
        const parent = this.findParentInTree(rootInstance, instance);
        if (parent) return parent;
      }
    }
    return null;
  }

  private findParentInTree(
    node: ModelInstance,
    target: ModelInstance
  ): ModelInstance | null {
    if (node.children.includes(target)) return node;
    for (const child of node.children) {
      const parent = this.findParentInTree(child, target);
      if (parent) return parent;
    }
    return null;
  }

  selectInstance(instance: ModelInstance) {
    this.selectedInstance = instance;
    this.clearFocusAttributes();
  }

  // Select an instance in the tree when clicking on a reference
  selectReferenceTarget(eObject: EObject | undefined) {
    if (!eObject) return;

    const instance = this.instances.find((i) => i.eObject === eObject);
    if (instance) {
      this.selectedInstance = instance;
      this.clearFocusAttributes();
      // Expand all parents to make it visible
      this.expandToInstance(instance);
    }
  }

  private expandToInstance(target: ModelInstance) {
    // Find and expand all parents
    const expandPath = (node: ModelInstance): boolean => {
      if (node === target) return true;

      for (const child of node.children) {
        if (expandPath(child)) {
          node.expanded = true;
          return true;
        }
      }
      return false;
    };

    this.rootClassNodes.forEach((rootNode) => {
      rootNode.instances.forEach((root) => expandPath(root));
      // Also check if target is a direct child of rootNode
      if (rootNode.instances.includes(target)) {
        rootNode.expanded = true;
      }
    });
  }

  toggleExpanded(instance: ModelInstance, event: Event) {
    event.stopPropagation();
    instance.expanded = !instance.expanded;
  }

  toggleRootClassExpanded(node: RootClassNode, event: Event) {
    event.stopPropagation();
    node.expanded = !node.expanded;
  }

  getEClassName(eObject: EObject): string {
    return eObject.eClass().getName();
  }

  getAttributes(): EAttribute[] {
    if (!this.selectedInstance) return [];
    const eClass = this.selectedInstance.eObject.eClass();
    const attributes = eClass.getEAllAttributes().elements();
    
    // Sort attributes to put 'name' first, then 'id', then the rest
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

  getReferences(): EReference[] {
    if (!this.selectedInstance) return [];
    return this.selectedInstance.eObject
      .eClass()
      .getEAllReferences()
      .elements();
  }

  getAttributeValue(attr: EAttribute): any {
    if (!this.selectedInstance) return null;

    if (attr.isMany()) {
      return null; // Handled by getAttributeValues
    }

    const value = this.selectedInstance.eObject.eGet(attr);
    return value || "";
  }

  getAttributeValues(attr: EAttribute): any[] {
    if (!this.selectedInstance || !attr.isMany()) return [];

    const list = this.selectedInstance.eObject.eGet(attr) as EList<any>;
    return list ? list.elements() : [];
  }

  setAttributeValue(attr: EAttribute, event: any) {
    if (!this.selectedInstance) return;

    let value = event.target.value;
    if (event.target.type === "checkbox") {
      value = event.target.checked;
    } else if (event.target.type === "number") {
      value = parseFloat(value);
    }

    console.log('Setting attribute value:', {
      attribute: attr.getName(),
      value,
      instanceLabel: this.getInstanceLabel(this.selectedInstance.eObject)
    });

    this.selectedInstance.eObject.eSet(attr, value);
    this.markDirty(this.selectedInstance);
  }

  addAttributeValue(attr: EAttribute, inputElement: any) {
    if (!this.selectedInstance || !attr.isMany() || !inputElement) return;

    let value = inputElement.value;
    if (!value) return;

    // Convert value based on type
    if (this.isNumberType(attr)) {
      value = parseFloat(value);
    }

    const list = this.selectedInstance.eObject.eGet(attr) as EList<any>;
    if (!list.add) {
      // If the list doesn't have an add method, we might need to create a new array
      const currentValues = list.elements();
      currentValues.push(value);
      this.selectedInstance.eObject.eSet(attr, currentValues);
    } else {
      list.add(value);
    }

    this.markDirty(this.selectedInstance);

    // Clear the input
    inputElement.value = "";
  }

  removeAttributeValue(attr: EAttribute, index: number) {
    if (!this.selectedInstance || !attr.isMany()) return;

    const list = this.selectedInstance.eObject.eGet(attr) as EList<any>;
    if (list && list.remove) {
      const values = list.elements();
      if (index >= 0 && index < values.length) {
        list.remove(values[index]);
        this.markDirty(this.selectedInstance);
      }
    }
  }

  getReferenceValue(ref: EReference): EObject | undefined {
    if (!this.selectedInstance || ref.isMany()) return undefined;
    return this.selectedInstance.eObject.eGet(ref);
  }

  getReferenceValues(ref: EReference): EObject[] {
    if (!this.selectedInstance || !ref.isMany()) return [];
    const list = this.selectedInstance.eObject.eGet(ref) as EList<EObject>;
    return list.elements();
  }

  // Show dialog to CREATE a new instance for a containment reference
  showCreateContainmentDialog(ref: EReference) {
    const availableClasses = this.getAvailableClassesForReference(ref);
    
    // If only one class is available, create it directly
    if (availableClasses.length === 1) {
      this.createContainmentDirectly(ref, availableClasses[0]);
    } else {
      // Show dialog for multiple choices
      this.isContainmentCreation = true;
      this.containmentReference = ref;
      this.containmentParent = this.selectedInstance;
      this.selectedEClass = null;
      this.selectedContainer = null;
      this.showCreateInstanceDialog = true;
    }
  }

  private getAvailableClassesForReference(ref: EReference): EClass[] {
    const targetType = ref.getEType();
    if (!(targetType instanceof EClassImpl)) return [];

    const compatibleClasses: EClass[] = [];
    this.ePackage!.getEClassifiers().forEach((classifier) => {
      if (
        classifier instanceof EClassImpl &&
        !classifier.isAbstract() &&
        !classifier.isInterface()
      ) {
        // Check if this class is compatible with the reference type
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

  private createContainmentDirectly(ref: EReference, eClass: EClass) {
    if (!this.eFactory || !this.selectedInstance) return;

    const eObject = this.eFactory.create(eClass);
    const instance: ModelInstance = {
      eObject,
      children: [],
      expanded: true,
      isDirty: false,  // Will be marked dirty through parent
      isNew: false     // Contained instances are not independently new - they're part of the aggregate
    };

    this.instances.push(instance);

    // Add to containment reference
    if (ref.isMany()) {
      const list = this.selectedInstance.eObject.eGet(ref);
      list.add(eObject);
    } else {
      this.selectedInstance.eObject.eSet(ref, eObject);
    }

    // Add to parent's children in the tree
    if (!this.selectedInstance.children.includes(instance)) {
      this.selectedInstance.children.push(instance);
    }

    // Mark parent as dirty (this will propagate up to root)
    this.markDirty(this.selectedInstance);

    // Make sure parent is expanded to show new child
    this.selectedInstance.expanded = true;

    // Select the new instance
    this.selectedInstance = instance;
    this.clearFocusAttributes();
  }

  // Show dialog to ADD an existing instance for a non-containment reference
  showAddReferenceDialog(ref: EReference) {
    this.currentReference = ref;
    this.referenceDialogTitle = `Add ${ref.getName()}`;
    this.validReferenceTargets = this.getValidReferenceTargets();
    this.selectedReferenceTargetIndex = -1;
    this.showReferenceDialog = true;
  }

  // Show dialog to SET an existing instance for a non-containment reference
  showSetReferenceDialog(ref: EReference) {
    this.currentReference = ref;
    this.referenceDialogTitle = `Set ${ref.getName()}`;
    this.validReferenceTargets = this.getValidReferenceTargets();
    this.selectedReferenceTargetIndex = -1;
    this.showReferenceDialog = true;
  }

  getValidReferenceTargets(): ModelInstance[] {
    if (!this.currentReference) return [];

    const targetType = this.currentReference.getEType();
    return this.instances.filter(
      (instance) =>
        instance !== this.selectedInstance &&
        (instance.eObject.eClass() === targetType ||
          instance.eObject.eClass().getESuperTypes().contains(targetType)) &&
        (!this.currentReference!.isContainment() ||
          !instance.eObject.eContainer())
    );
  }

  applyReference() {
    if (
      !this.selectedInstance ||
      !this.currentReference ||
      this.selectedReferenceTargetIndex === -1
    )
      return;

    const selectedReferenceTarget =
      this.validReferenceTargets[this.selectedReferenceTargetIndex];
    if (!selectedReferenceTarget) return;

    if (this.currentReference.isMany()) {
      const list = this.selectedInstance.eObject.eGet(this.currentReference);
      list.add(selectedReferenceTarget.eObject);
    } else {
      this.selectedInstance.eObject.eSet(
        this.currentReference,
        selectedReferenceTarget.eObject
      );
    }

    if (this.currentReference.isContainment()) {
      this.selectedInstance.children.push(selectedReferenceTarget);
      // Remove from root class node if it was there
      this.rootClassNodes.forEach(node => {
        const index = node.instances.indexOf(selectedReferenceTarget);
        if (index > -1) {
          node.instances.splice(index, 1);
        }
      });
    }

    this.markDirty(this.selectedInstance);
    this.hideReferenceDialog();
  }

  removeReference(ref: EReference, target: EObject, event?: Event) {
    if (event) event.stopPropagation();
    if (!this.selectedInstance) return;

    if (ref.isMany()) {
      const list = this.selectedInstance.eObject.eGet(ref);
      list.remove(target);

      if (ref.isContainment()) {
        const targetInstance = this.instances.find((i) => i.eObject === target);
        if (targetInstance) {
          const index = this.selectedInstance.children.indexOf(targetInstance);
          if (index > -1) this.selectedInstance.children.splice(index, 1);
          
          // Add back to appropriate root class node
          const eClass = target.eClass();
          const rootNode = this.getRootClassNode(eClass);
          if (rootNode) {
            rootNode.instances.push(targetInstance);
          }
        }
      }
    }

    this.markDirty(this.selectedInstance);
  }

  clearReference(ref: EReference, event?: Event) {
    if (event) event.stopPropagation();
    if (!this.selectedInstance) return;

    const current = this.selectedInstance.eObject.eGet(ref);
    this.selectedInstance.eObject.eSet(ref, null);

    if (ref.isContainment() && current) {
      const targetInstance = this.instances.find((i) => i.eObject === current);
      if (targetInstance) {
        const index = this.selectedInstance.children.indexOf(targetInstance);
        if (index > -1) this.selectedInstance.children.splice(index, 1);
        
        // Add back to appropriate root class node
        const eClass = current.eClass();
        const rootNode = this.getRootClassNode(eClass);
        if (rootNode) {
          rootNode.instances.push(targetInstance);
        }
      }
    }

    this.markDirty(this.selectedInstance);
  }

  // Get the dynamic label for an instance
  getInstanceLabel(eObject?: EObject): string {
    if (!eObject) return "Unknown";

    // Try 'name' attribute first
    const nameAttr = eObject.eClass().getEStructuralFeature("name");
    if (nameAttr && nameAttr instanceof EAttributeImpl) {
      const value = eObject.eGet(nameAttr);
      if (value) return String(value);
    }

    const container = eObject.eContainer();

    if (container) {
      // Object has a container - build hierarchical label
      const containerLabel = this.getInstanceLabel(container);
      const containingFeature = eObject.eContainingFeature();

      if (containingFeature && containingFeature.isMany()) {
        // Get the index in the containing list
        const list = container.eGet(containingFeature) as EList<EObject>;
        const index = list.indexOf(eObject);
        return `${containingFeature.getName()}.${index}`;
      } else if (containingFeature) {
        return `${containingFeature.getName()}`;
      }
    }

    // Object has no container - use intrinsic label
    return this.generateIntrinsicLabel(eObject);
  }

  private generateIntrinsicLabel(eObject: EObject): string {
    // Try 'id' attribute second
    const idAttr = eObject.eClass().getEStructuralFeature("id");
    if (idAttr && idAttr instanceof EAttributeImpl) {
      const value = eObject.eGet(idAttr);
      if (value) return String(value);
    }

    // Default to class name
    return eObject.eClass().getName();
  }

  getAttributeType(attr: EAttribute): string {
    const type = attr.getEType();
    return type.getName();
  }

  isStringType(attr: EAttribute): boolean {
    const typeName = attr.getEType().getName();
    return typeName === "EString" || typeName === "String";
  }

  isNumberType(attr: EAttribute): boolean {
    const typeName = attr.getEType().getName();
    return [
      "EInt",
      "ELong",
      "EFloat",
      "EDouble",
      "EBigDecimal",
      "EBigInteger",
    ].includes(typeName);
  }

  isBooleanType(attr: EAttribute): boolean {
    const typeName = attr.getEType().getName();
    return typeName === "EBoolean" || typeName === "Boolean";
  }

  isDateType(attr: EAttribute): boolean {
    const typeName = attr.getEType().getName();
    return typeName === "EDate" || typeName === "Date";
  }

  isEnumType(attr: EAttribute): boolean {
    return attr.getEType() instanceof EEnumImpl;
  }

  getEnumLiterals(attr: EAttribute): string[] {
    const type = attr.getEType();
    if (type instanceof EEnumImpl) {
      return type
        .getELiterals()
        .elements()
        .map((lit) => lit.getLiteral());
    }
    return [];
  }

  showCreateDialog() {
    this.isContainmentCreation = false;
    this.containmentReference = null;
    this.containmentParent = null;
    this.showCreateInstanceDialog = true;
    this.selectedEClass = null;
    this.selectedContainer = null;
  }

  hideCreateDialog() {
    this.showCreateInstanceDialog = false;
    this.selectedEClass = null;
    this.selectedContainer = null;
    this.isContainmentCreation = false;
    this.containmentReference = null;
    this.containmentParent = null;
  }

  hideReferenceDialog() {
    this.showReferenceDialog = false;
    this.currentReference = null;
    this.selectedReferenceTargetIndex = -1;
    this.validReferenceTargets = [];
  }

  compareInstances(a: any, b: any): boolean {
    return a === b;
  }

  // Helper method to check if should show save button
  shouldShowSaveButton(): boolean {
    if (!this.selectedInstance || !this.connectionStatus.connected) {
      return false;
    }
    
    const rootContainer = this.getRootContainer(this.selectedInstance);
    return rootContainer.isDirty || rootContainer.isNew;
  }

  // Helper method to check if instance root is new
  isRootNew(instance: ModelInstance): boolean {
    const root = this.getRootContainer(instance);
    return root.isNew;
  }

  // Helper method to check if instance is dirty and root is not new
  isDirtyNotNew(instance: ModelInstance): boolean {
    const root = this.getRootContainer(instance);
    return instance.isDirty && !root.isNew;
  }
}