// app.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  EEnumImpl
} from '@tripsnek/tmf';
import { TripplanningFactory, TripplanningPackage } from '@tmf-example/data-model';

interface ModelInstance {
  id: number;
  eObject: EObject;
  label: string;
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
  selector: 'app-tmf-editor',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],  
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
  referenceDialogTitle = '';
  
  private nextId = 1;

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

  getInstantiableClasses(): EClass[] {
    if (!this.ePackage) return [];
    
    const classes: EClass[] = [];
    this.ePackage.getEClassifiers().forEach(classifier => {
      const eclass = classifier as EClass;
      
      if (classifier instanceof EClassImpl && 
          !classifier.isAbstract() && 
          !classifier.isInterface()) {
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
    this.instances.forEach(instance => {
      instance.eObject.eClass().getEReferences().forEach(ref => {
        if (ref.isContainment() && 
            ref.getEType() === this.selectedEClass) {
          containers.push({ instance, reference: ref });
        }
      });
    });
    return containers;
  }

  createInstance() {
    if (!this.selectedEClass || !this.eFactory) return;
    
    const eObject = this.eFactory.create(this.selectedEClass);
    const instance: ModelInstance = {
      id: this.nextId++,
      eObject,
      label: this.generateInstanceLabel(eObject),
      children: [],
      expanded: true
    };
    
    this.instances.push(instance);
    
    if (this.selectedContainer) {
      const { instance: container, reference } = this.selectedContainer;
      this.addToContainer(container, reference, instance);
    } else {
      this.rootInstances.push(instance);
    }
    
    this.selectedInstance = instance;
    this.hideCreateDialog();
  }

  private addToContainer(container: ModelInstance, reference: EReference, instance: ModelInstance) {
    if (reference.isMany()) {
      const list = container.eObject.eGet(reference);
      list.add(instance.eObject);
    } else {
      container.eObject.eSet(reference, instance.eObject);
    }
    container.children.push(instance);
    this.updateInstanceLabel(container);
  }

  deleteInstance() {
    if (!this.selectedInstance) return;
    
    // Remove from parent if contained
    const parent = this.findParentInstance(this.selectedInstance);
    if (parent) {
      const index = parent.children.indexOf(this.selectedInstance);
      if (index > -1) parent.children.splice(index, 1);
      
      // Remove from model
      parent.eObject.eClass().getEReferences().forEach(ref => {
        if (ref.isContainment()) {
          if (ref.isMany()) {
            const list = parent.eObject.eGet(ref);
            list.remove(this.selectedInstance!.eObject);
          } else if (parent.eObject.eGet(ref) === this.selectedInstance!.eObject) {
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

  private findParentInTree(node: ModelInstance, target: ModelInstance): ModelInstance | null {
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
    return Array.from(eClass.getEAllAttributes());
  }

  getReferences(): EReference[] {
    if (!this.selectedInstance) return [];
    return Array.from(this.selectedInstance.eObject.eClass().getEAllReferences());
  }

  getAttributeValue(attr: EAttribute): any {
    return this.selectedInstance?.eObject.eGet(attr);
  }

  setAttributeValue(attr: EAttribute, event: any) {
    if (!this.selectedInstance) return;
    
    let value = event.target.value;
    if (event.target.type === 'checkbox') {
      value = event.target.checked;
    } else if (event.target.type === 'number') {
      value = parseFloat(value);
    }
    
    this.selectedInstance.eObject.eSet(attr, value);
    this.updateInstanceLabel(this.selectedInstance);
  }

  getReferenceValue(ref: EReference): EObject | undefined {
    if (!this.selectedInstance || ref.isMany()) return undefined;
    return this.selectedInstance.eObject.eGet(ref);
  }

  getReferenceValues(ref: EReference): EObject[] {
    if (!this.selectedInstance || !ref.isMany()) return [];
    const list = this.selectedInstance.eObject.eGet(ref);
    return Array.from(list);
  }

  showAddReferenceDialog(ref: EReference) {
    this.currentReference = ref;
    this.referenceDialogTitle = `Add ${ref.getName()}`;
    this.showReferenceDialog = true;
  }

  showSetReferenceDialog(ref: EReference) {
    this.currentReference = ref;
    this.referenceDialogTitle = `Set ${ref.getName()}`;
    this.showReferenceDialog = true;
  }

  getValidReferenceTargets(): ModelInstance[] {
    if (!this.currentReference) return [];
    
    const targetType = this.currentReference.getEType();
    return this.instances.filter(instance => 
      instance !== this.selectedInstance &&
      (instance.eObject.eClass() === targetType ||
       instance.eObject.eClass().getESuperTypes().contains(targetType)) &&
      (!this.currentReference!.isContainment() || !instance.eObject.eContainer())
    );
  }

  applyReference() {
    if (!this.selectedInstance || !this.currentReference || !this.selectedReferenceTarget) return;
    
    if (this.currentReference.isMany()) {
      const list = this.selectedInstance.eObject.eGet(this.currentReference);
      list.add(this.selectedReferenceTarget.eObject);
    } else {
      this.selectedInstance.eObject.eSet(this.currentReference, this.selectedReferenceTarget.eObject);
    }
    
    if (this.currentReference.isContainment()) {
      this.selectedInstance.children.push(this.selectedReferenceTarget);
      const parentIndex = this.rootInstances.indexOf(this.selectedReferenceTarget);
      if (parentIndex > -1) {
        this.rootInstances.splice(parentIndex, 1);
      }
    }
    
    this.hideReferenceDialog();
  }

  removeReference(ref: EReference, target: EObject) {
    if (!this.selectedInstance) return;
    
    if (ref.isMany()) {
      const list = this.selectedInstance.eObject.eGet(ref);
      list.remove(target);
      
      if (ref.isContainment()) {
        const targetInstance = this.instances.find(i => i.eObject === target);
        if (targetInstance) {
          const index = this.selectedInstance.children.indexOf(targetInstance);
          if (index > -1) this.selectedInstance.children.splice(index, 1);
          this.rootInstances.push(targetInstance);
        }
      }
    }
  }

  clearReference(ref: EReference) {
    if (!this.selectedInstance) return;
    
    const current = this.selectedInstance.eObject.eGet(ref);
    this.selectedInstance.eObject.eSet(ref, null);
    
    if (ref.isContainment() && current) {
      const targetInstance = this.instances.find(i => i.eObject === current);
      if (targetInstance) {
        const index = this.selectedInstance.children.indexOf(targetInstance);
        if (index > -1) this.selectedInstance.children.splice(index, 1);
        this.rootInstances.push(targetInstance);
      }
    }
  }

  getInstanceLabel(eObject?: EObject): string {
    if(!eObject) return 'Unknown'
    const instance = this.instances.find(i => i.eObject === eObject);
    return instance?.label || 'Unknown';
  }

  private generateInstanceLabel(eObject: EObject): string {
    // Try common name attributes
    const nameAttrs = ['name', 'title', 'label', 'id'];
    for (const attrName of nameAttrs) {
      const attr = eObject.eClass().getEStructuralFeature(attrName);
      if (attr && attr instanceof EAttributeImpl) {
        const value = eObject.eGet(attr);
        if (value) return String(value);
      }
    }
    
    return `${eObject.eClass().getName()} #${this.nextId}`;
  }

  private updateInstanceLabel(instance: ModelInstance) {
    instance.label = this.generateInstanceLabel(instance.eObject);
  }

  getAttributeType(attr: EAttribute): string {
    const type = attr.getEType();
    return type.getName();
  }

  isStringType(attr: EAttribute): boolean {
    const typeName = attr.getEType().getName();
    return typeName === 'EString' || typeName === 'String';
  }

  isNumberType(attr: EAttribute): boolean {
    const typeName = attr.getEType().getName();
    return ['EInt', 'ELong', 'EFloat', 'EDouble', 'EBigDecimal', 'EBigInteger'].includes(typeName);
  }

  isBooleanType(attr: EAttribute): boolean {
    const typeName = attr.getEType().getName();
    return typeName === 'EBoolean' || typeName === 'Boolean';
  }

  isDateType(attr: EAttribute): boolean {
    const typeName = attr.getEType().getName();
    return typeName === 'EDate' || typeName === 'Date';
  }

  isEnumType(attr: EAttribute): boolean {
    return attr.getEType() instanceof EEnumImpl;
  }

  getEnumLiterals(attr: EAttribute): string[] {
    const type = attr.getEType();
    if (type instanceof EEnumImpl) {
      return Array.from(type.getELiterals()).map(lit => lit.getLiteral());
    }
    return [];
  }

  showCreateDialog() {
    this.showCreateInstanceDialog = true;
    this.selectedEClass = null;
    this.selectedContainer = null;
  }

  hideCreateDialog() {
    this.showCreateInstanceDialog = false;
    this.selectedEClass = null;
    this.selectedContainer = null;
  }

  hideReferenceDialog() {
    this.showReferenceDialog = false;
    this.currentReference = null;
    this.selectedReferenceTarget = null;
  }
}