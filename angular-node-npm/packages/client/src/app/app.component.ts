// app.component.ts
import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
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
} from "@tripsnek/tmf";
import {
  TripplanningFactory,
  TripplanningPackage,
} from "@tmf-example/data-model";

interface ModelInstance {
  eObject: EObject;
  children: ModelInstance[];
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
  imports: [CommonModule, FormsModule],
})
export class TMFReflectiveEditorComponent implements OnInit {
  ePackage: EPackage | null = null;
  eFactory: EFactory | null = null;

  instances: ModelInstance[] = [];
  rootInstances: ModelInstance[] = [];
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

  ngOnInit() {
    // In a real application, this would be injected or loaded
    this.loadMetamodel();
  }

  loadMetamodel() {
    // This would normally load the actual metamodel
    // For now, we'll assume it's available via injection or import
    this.ePackage = TripplanningPackage.eINSTANCE;
    this.eFactory = TripplanningFactory.eINSTANCE;
  }

  // Get only root EClasses (not contained by any other EClass)
  getRootEClasses(): EClass[] {
    if (!this.ePackage) return [];

    const allClasses: EClass[] = [];
    const containedClasses = new Set<EClass>();

    // First, collect all non-abstract, non-interface classes
    this.ePackage.getEClassifiers().forEach((classifier) => {
      if (
        classifier instanceof EClassImpl &&
        !classifier.isAbstract() &&
        !classifier.isInterface()
      ) {
        allClasses.push(classifier);
      }
    });

    // Then, find which classes are contained by others
    allClasses.forEach((eClass) => {
      eClass.getEAllReferences().forEach((ref) => {
        if (ref.isContainment()) {
          const targetType = ref.getEType();
          if (targetType instanceof EClassImpl) {
            containedClasses.add(targetType);
            // Also add all subtypes
            allClasses.forEach((otherClass) => {
              if (otherClass.getEAllSuperTypes().contains(targetType)) {
                containedClasses.add(otherClass);
              }
            });
          }
        }
      });
    });

    // Return classes that are not contained by any other class
    return allClasses.filter((c) => !containedClasses.has(c));
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
      return this.getRootEClasses();
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
    return this.getRootEClasses().includes(eClass);
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

    const instance: ModelInstance = {
      eObject,
      children: [],
      expanded: true,
    };

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

      // Make sure parent is expanded to show new child
      this.containmentParent.expanded = true;
    } else if (this.selectedContainer) {
      const { instance: container, reference } = this.selectedContainer;
      this.addToContainer(container, reference, instance);
    } else {
      // Root instance
      this.rootInstances.push(instance);
    }

    this.selectedInstance = instance;
    this.hideCreateDialog();
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
    const rootIndex = this.rootInstances.indexOf(instance);
    if (rootIndex > -1) {
      this.rootInstances.splice(rootIndex, 1);
    }
  }

  // Update the tree structure based on containment references
  private updateInstanceTree(parent: ModelInstance) {
    parent.children = [];

    parent.eObject
      .eClass()
      .getEAllReferences()
      .forEach((ref) => {
        if (ref.isContainment()) {
          if (ref.isMany()) {
            const list = parent.eObject.eGet(ref);
            list.forEach((childEObject: EObject) => {
              const childInstance = this.instances.find(
                (i) => i.eObject === childEObject
              );
              if (childInstance && !parent.children.includes(childInstance)) {
                parent.children.push(childInstance);
              }
            });
          } else {
            const childEObject = parent.eObject.eGet(ref);
            if (childEObject) {
              const childInstance = this.instances.find(
                (i) => i.eObject === childEObject
              );
              if (childInstance && !parent.children.includes(childInstance)) {
                parent.children.push(childInstance);
              }
            }
          }
        }
      });
  }

  deleteInstance() {
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
      const index = this.rootInstances.indexOf(this.selectedInstance);
      if (index > -1) this.rootInstances.splice(index, 1);
    }

    const index = this.instances.indexOf(this.selectedInstance);
    if (index > -1) this.instances.splice(index, 1);

    this.selectedInstance = null;
  }

  private findParentInstance(instance: ModelInstance): ModelInstance | null {
    for (const root of this.rootInstances) {
      const parent = this.findParentInTree(root, instance);
      if (parent) return parent;
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
  }

  // Select an instance in the tree when clicking on a reference
  selectReferenceTarget(eObject: EObject | undefined) {
    if (!eObject) return;

    const instance = this.instances.find((i) => i.eObject === eObject);
    if (instance) {
      this.selectedInstance = instance;
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

    this.rootInstances.forEach((root) => expandPath(root));
  }

  toggleExpanded(instance: ModelInstance, event: Event) {
    event.stopPropagation();
    instance.expanded = !instance.expanded;
  }

  getEClassName(eObject: EObject): string {
    return eObject.eClass().getName();
  }

  getAttributes(): EAttribute[] {
    if (!this.selectedInstance) return [];
    const eClass = this.selectedInstance.eObject.eClass();
    return eClass.getEAllAttributes().elements();
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

    this.selectedInstance.eObject.eSet(attr, value);
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
    this.isContainmentCreation = true;
    this.containmentReference = ref;
    this.containmentParent = this.selectedInstance;
    this.selectedEClass = null;
    this.selectedContainer = null; // Clear any previous container selection
    this.showCreateInstanceDialog = true;
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
      const parentIndex = this.rootInstances.indexOf(selectedReferenceTarget);
      if (parentIndex > -1) {
        this.rootInstances.splice(parentIndex, 1);
      }
    }

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
          this.rootInstances.push(targetInstance);
        }
      }
    }
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
        this.rootInstances.push(targetInstance);
      }
    }
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
}
