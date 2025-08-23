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
import { ProxyResolver } from './services/proxy-resolver';


//root nodes of the tree, one for each EClass that is a root container
interface RootClassNode {
  eClass: EClass;
  instances: ModelInstanceWrapper[];
  expanded: boolean;
}

//wrappers for each EObject instance
interface ModelInstanceWrapper {
  eObject: EObject;
  children: ModelInstanceWrapper[];
  expanded: boolean;
  isDirty: boolean;
  isNew: boolean;  // Track if this instance is new (not yet saved to server)
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

  instances: ModelInstanceWrapper[] = [];
  rootClasses: EClass[] = [];
  rootClassNodes: RootClassNode[] = [];
  selectedInstance: ModelInstanceWrapper | null = null;

  showCreateInstanceDialog = false;
  showReferenceDialog = false;
  selectedEClass: EClass | null = null;
  selectedContainer: any = null;

  currentReference: EReference | null = null;
  selectedReferenceTarget: ModelInstanceWrapper | null = null;
  selectedReferenceTargetIndex: number = -1;
  validReferenceTargets: ModelInstanceWrapper[] = [];
  referenceDialogTitle = "";

  // For containment creation
  isContainmentCreation = false;
  containmentReference: EReference | null = null;
  containmentParent: ModelInstanceWrapper | null = null;

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
              const instance: ModelInstanceWrapper = {
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
        
        // IMPORTANT: Resolve all proxy references after loading all instances
        this.resolveAllProxies();
      },
      error => {
        console.error('Failed to load instances from server:', error);
      }
    );
  }

  /**
   * Resolves all proxy references in the loaded model.
   * This is called after initial load and can be called manually if needed.
   */
  private resolveAllProxies() {
    console.log('Resolving proxy references...');
    
    // Get all root EObjects from the model instances
    const rootEObjects: EObject[] = [];
    this.rootClassNodes.forEach(node => {
      node.instances.forEach(instance => {
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
      
      // If the selected instance was affected, refresh the UI
      if (this.selectedInstance) {
        // Trigger change detection by reselecting
        const current = this.selectedInstance;
        this.selectedInstance = null;
        setTimeout(() => {
          this.selectedInstance = current;
        }, 0);
      }
    } else {
      const unresolvedCount = ProxyResolver.countProxies(rootEObjects);
      if (unresolvedCount > 0) {
        console.warn(`${unresolvedCount} proxies remain unresolved`);
        // Optional: Get detailed report for debugging
        const report = ProxyResolver.getUnresolvedProxyReport(rootEObjects);
        report.forEach(line => console.warn(line));
      }
    }
  }

  /**
   * Resolves proxies for a newly created or loaded instance
   */
  private resolveProxiesForInstance(instance: ModelInstanceWrapper) {
    // Get all existing root EObjects
    const existingRootEObjects: EObject[] = [];
    this.rootClassNodes.forEach(node => {
      node.instances.forEach(inst => {
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
      console.log(`Resolved ${resolvedCount} proxies for instance ${this.getInstanceLabel(instance.eObject)}`);
    }
  }

  private buildContainmentTree(instance: ModelInstanceWrapper) {
    instance.eObject.eClass().getEAllReferences().forEach(ref => {
      if (ref.isContainment()) {
        if (ref.isMany()) {
          const list = instance.eObject.eGet(ref) as EList<EObject>;
          if (list) {
            list.forEach(childEObject => {
              const childInstance: ModelInstanceWrapper = {
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
            const childInstance: ModelInstanceWrapper = {
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
  markDirty(instance: ModelInstanceWrapper) {
    console.log('Marking instance as dirty:', this.getInstanceLabel(instance.eObject));
    instance.isDirty = true;
    
    // Mark all containers up to root as dirty
    const parent = this.findParentInstance(instance);
    if (parent) {
      this.markDirty(parent);
    }
  }

  // Get the root container of an instance
  getRootContainer(instance: ModelInstanceWrapper): ModelInstanceWrapper {
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
  saveInstance(instance: ModelInstanceWrapper) {
    if (!instance.isDirty && !instance.isNew) return;

    this.isSaving = true;

    // For new instances, always use create (POST)
    // For existing dirty instances, use update (PUT)
    this.crudService.saveInstance(instance.eObject, instance.isNew).subscribe(
      savedEObject => {

        //NOTE: if the server might have altered the instance, here is where you would want to synchronize
        //the object and it's contents to your existing UI objects, either by updating them in place or
        //by replacing them entirely
        
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

  // New method: Save all dirty instances
  saveAllDirtyInstances() {
    // Get all root instances that are dirty or new
    const dirtyRoots = new Set<ModelInstanceWrapper>();
    
    this.instances.forEach(instance => {
      if (instance.isDirty || instance.isNew) {
        const root = this.getRootContainer(instance);
        dirtyRoots.add(root);
      }
    });

    if (dirtyRoots.size === 0) return;

    this.isSaving = true;
    
    // Save all dirty roots
    let saveCount = 0;
    const totalSaves = dirtyRoots.size;
    
    dirtyRoots.forEach(rootInstance => {
      this.crudService.saveInstance(rootInstance.eObject, rootInstance.isNew).subscribe(
        savedEObject => {
          this.clearDirtyAndNewFlags(rootInstance);
          saveCount++;
          
          if (saveCount === totalSaves) {
            this.isSaving = false;
            console.log(`Successfully saved ${totalSaves} instances`);
          }
        },
        error => {
          saveCount++;
          console.error('Failed to save instance:', error);
          
          if (saveCount === totalSaves) {
            this.isSaving = false;
            alert('Some instances failed to save. Check console for details.');
          }
        }
      );
    });
  }

  // Check if any instance in the entire tree is dirty
  hasAnyDirtyInstances(): boolean {
    return this.instances.some(instance => instance.isDirty || instance.isNew);
  }

  private clearDirtyAndNewFlags(instance: ModelInstanceWrapper) {
    instance.isDirty = false;
    instance.isNew = false;
    instance.children.forEach(child => this.clearDirtyAndNewFlags(child));
  }

  private clearDirtyFlags(instance: ModelInstanceWrapper) {
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
    
    const instance: ModelInstanceWrapper = {
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
    
    // Resolve proxies for the new instance (in case it has references)
    setTimeout(() => {
      this.resolveProxiesForInstance(instance);
    }, 0);
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

    const instance: ModelInstanceWrapper = {
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
    
    // Resolve proxies for the new instance
    setTimeout(() => {
      this.resolveProxiesForInstance(instance);
    }, 0);
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
    container: ModelInstanceWrapper,
    reference: EReference,
    instance: ModelInstanceWrapper
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

  // Enhanced deleteInstance method with recursive deletion and reference cleanup
  deleteInstance(instanceToDelete?: ModelInstanceWrapper) {
    const targetInstance = instanceToDelete || this.selectedInstance;
    if (!targetInstance) return;

    const rootInstance = this.getRootContainer(targetInstance);
    
    // If connected to server and the root is not new (has been saved), delete from server
    if (this.connectionStatus.connected && !rootInstance.isNew) {
      // only allow deleting root instances from server
      if (targetInstance === rootInstance) {
        this.crudService.deleteInstance(targetInstance.eObject).subscribe(
          () => {
            this.performCompleteInstanceDeletion(targetInstance);
          },
          error => {
            console.error('Failed to delete from server:', error);
            alert('Failed to delete from server. Check console for details.');
          }
        );
      } else {
        // For contained instances, mark parent as dirty and remove locally
        const parent = this.findParentInstance(targetInstance);
        if (parent) {
          this.markDirty(parent);
        }
        this.performCompleteInstanceDeletion(targetInstance);
      }
    } else {
      // Instance is new (not saved) or no server connection - just remove locally
      this.performCompleteInstanceDeletion(targetInstance);
    }
  }

  private performCompleteInstanceDeletion(instanceToDelete: ModelInstanceWrapper) {
    // Step 1: Collect all objects that will be deleted (including children)
    const objectsToDelete: EObject[] = [];
    this.collectAllObjectsToDelete(instanceToDelete, objectsToDelete);

    // Step 2: Remove all instances from the instances list and tree structure
    this.removeInstanceAndChildrenFromTree(instanceToDelete);

    // Step 3: After all deletion is done, recursively invoke deleteObjectReferences
    objectsToDelete.forEach(obj => {
      this.deleteObjectReferences(obj);
    });

    // Step 4: save all dirty objects, since they could have been made dirty by deletion
    this.saveAllDirtyInstances();

    // Clear selection if the deleted instance was selected
    if (this.selectedInstance === instanceToDelete) {
      this.selectedInstance = null;
    }
  }

  private collectAllObjectsToDelete(instance: ModelInstanceWrapper, objectsToDelete: EObject[]) {
    objectsToDelete.push(instance.eObject);
    
    // Recursively collect all children
    instance.children.forEach(child => {
      this.collectAllObjectsToDelete(child, objectsToDelete);
    });
  }

  private removeInstanceAndChildrenFromTree(instanceToDelete: ModelInstanceWrapper) {
    // First, recursively remove all children
    [...instanceToDelete.children].forEach(child => {
      this.removeInstanceAndChildrenFromTree(child);
    });

    // Remove from parent if contained
    const parent = this.findParentInstance(instanceToDelete);
    if (parent) {
      const index = parent.children.indexOf(instanceToDelete);
      if (index > -1) parent.children.splice(index, 1);

      // Remove from model
      parent.eObject
        .eClass()
        .getEReferences()
        .forEach((ref) => {
          if (ref.isContainment()) {
            if (ref.isMany()) {
              const list = parent.eObject.eGet(ref);
              list.remove(instanceToDelete.eObject);
            } else if (
              parent.eObject.eGet(ref) === instanceToDelete.eObject
            ) {
              parent.eObject.eSet(ref, null);
            }
          }
        });
    } else {
      // Remove from root class node
      const eClass = instanceToDelete.eObject.eClass();
      const rootNode = this.getRootClassNode(eClass);
      if (rootNode) {
        const index = rootNode.instances.indexOf(instanceToDelete);
        if (index > -1) rootNode.instances.splice(index, 1);
      }
    }

    // Remove from main instances list
    const index = this.instances.indexOf(instanceToDelete);
    if (index > -1) this.instances.splice(index, 1);
  }

  private deleteObjectReferences(theObject: EObject) {
    this.instances.forEach((inst) => {
      inst.eObject
        .eClass()
        .getEAllReferences()
        .forEach((ref) => {
          if (!ref.isContainment()) {
            if (ref.isMany()) {
              const list = inst.eObject.eGet(ref) as EList<EObject>;
              const index = list.indexOf(theObject);
              if (index >= 0) {
                list.remove(theObject);
                this.markDirty(inst);
              }
            } else {
              const value = inst.eObject.eGet(ref);
              if (value === theObject) {
                inst.eObject.eUnset(ref);
                this.markDirty(inst);
              }
            }
          }
        });
    });
  }

  // Helper methods for button display logic
  shouldShowSaveButton(instance: ModelInstanceWrapper): boolean {
    if (!this.connectionStatus.connected) return false;
    const root = this.getRootContainer(instance);
    return root.isDirty || root.isNew;
  }

  shouldShowDeleteButton(instance: ModelInstanceWrapper): boolean {
    const root = this.getRootContainer(instance);
    return !root.isDirty && !root.isNew;
  }

  private findParentInstance(instance: ModelInstanceWrapper): ModelInstanceWrapper | null {
    for (const rootNode of this.rootClassNodes) {
      for (const rootInstance of rootNode.instances) {
        const parent = this.findParentInTree(rootInstance, instance);
        if (parent) return parent;
      }
    }
    return null;
  }

  private findParentInTree(
    node: ModelInstanceWrapper,
    target: ModelInstanceWrapper
  ): ModelInstanceWrapper | null {
    if (node.children.includes(target)) return node;
    for (const child of node.children) {
      const parent = this.findParentInTree(child, target);
      if (parent) return parent;
    }
    return null;
  }

  selectInstance(instance: ModelInstanceWrapper) {
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

  private expandToInstance(target: ModelInstanceWrapper) {
    // Find and expand all parents
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

    this.rootClassNodes.forEach((rootNode) => {
      rootNode.instances.forEach((root) => expandPath(root));
      // Also check if target is a direct child of rootNode
      if (rootNode.instances.includes(target)) {
        rootNode.expanded = true;
      }
    });
  }

  toggleExpanded(instance: ModelInstanceWrapper, event: Event) {
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
    const value = this.selectedInstance.eObject.eGet(ref);
    
    // Check if it's a proxy and add visual indicator
    if (value && value.eIsProxy && value.eIsProxy()) {
      console.debug(`Reference ${ref.getName()} contains unresolved proxy: ${value.fullId()}`);
    }
    
    return value;
  }

  getReferenceValues(ref: EReference): EObject[] {
    if (!this.selectedInstance || !ref.isMany()) return [];
    const list = this.selectedInstance.eObject.eGet(ref) as EList<EObject>;
    const values = list.elements();
    
    // Check for proxies in the list
    values.forEach((value, index) => {
      if (value && value.eIsProxy && value.eIsProxy()) {
        console.debug(`Reference ${ref.getName()}[${index}] contains unresolved proxy: ${value.fullId()}`);
      }
    });
    
    return values;
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
    const instance: ModelInstanceWrapper = {
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

  getValidReferenceTargets(): ModelInstanceWrapper[] {
    if (!this.currentReference) return [];

    const targetType = this.currentReference.getEType();
    return this.instances.filter(
      (instance) =>
        instance !== this.selectedInstance &&
        !instance.eObject.eIsProxy() && // Filter out proxies as reference targets
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
    
    // Add indicator if this is a proxy
    const proxyIndicator = eObject.eIsProxy && eObject.eIsProxy() ? " [PROXY]" : "";

    // Try 'name' attribute first
    const nameAttr = eObject.eClass().getEStructuralFeature("name");
    if (nameAttr && nameAttr instanceof EAttributeImpl) {
      const value = eObject.eGet(nameAttr);
      if (value) return String(value) + proxyIndicator;
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
        return `${containingFeature.getName()}.${index}${proxyIndicator}`;
      } else if (containingFeature) {
        return `${containingFeature.getName()}${proxyIndicator}`;
      }
    }

    // Object has no container - use intrinsic label
    return this.generateIntrinsicLabel(eObject) + proxyIndicator;
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
  shouldShowSaveButtonForSelected(): boolean {
    if (!this.selectedInstance || !this.connectionStatus.connected) {
      return false;
    }
    
    const rootContainer = this.getRootContainer(this.selectedInstance);
    return rootContainer.isDirty || rootContainer.isNew;
  }

  // Helper method to check if instance root is new
  isRootNew(instance: ModelInstanceWrapper): boolean {
    const root = this.getRootContainer(instance);
    return root.isNew;
  }

  // Helper method to check if instance is dirty and root is not new
  isDirtyNotNew(instance: ModelInstanceWrapper): boolean {
    const root = this.getRootContainer(instance);
    return instance.isDirty && !root.isNew;
  }
  
  // Debug method to manually trigger proxy resolution
  debugResolveProxies() {
    console.log('=== Manual Proxy Resolution Triggered ===');
    this.resolveAllProxies();
  }
}