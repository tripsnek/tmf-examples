import { EObject } from '@tripsnek/tmf';
import { TUtils } from '@tripsnek/tmf';
import { EStructuralFeature } from '@tripsnek/tmf';
import { BasicEList } from '@tripsnek/tmf';
import { EClass } from '@tripsnek/tmf';
import { EList } from '@tripsnek/tmf';
import { EEnum } from '@tripsnek/tmf';
import { EDataType } from '@tripsnek/tmf';
import { EObjectImpl } from '@tripsnek/tmf';

import { TripplanningPackage } from '../tripplanning-package';
import { IDedEntity } from '../api/i-ded-entity';

/**
 * This file is source-code generated and should never be edited. It implements
 * the core TMF functionality for IDedEntity.
 */
export abstract class IDedEntityGen extends EObjectImpl implements IDedEntity {
  /** feature declarations */
  protected id!: string;



  //======================================================================
  // Getters and Setters


  public getId(): string {
    return this.id;
  }

  public setId(newId: string): void {
    this.basicSetId(newId);
  }

  //======================================================================
  // API Operations

  //======================================================================
  // Standard EObject behavior

  /**
   * eGet() - provides reflective access to all features.
   */
  public override eGet(feature: number | EStructuralFeature): any {
    const featureID: number =
      typeof feature === 'number'
        ? feature
        : (<EStructuralFeature>feature).getFeatureID();
    switch (featureID) {
      case TripplanningPackage.I_DED_ENTITY__ID:
        return this.getId();
    }
    return super.eGet(featureID);
  }


  /**
   * eSet() - provides ability to reflectively set all features.
   */
  public override eSet(feature: number | EStructuralFeature, newValue: any): void {
    const featureID: number =
      typeof feature === 'number'
        ? feature
        : (<EStructuralFeature>feature).getFeatureID();
    switch (featureID) {
      case TripplanningPackage.I_DED_ENTITY__ID:
        this.setId(newValue);
        return;
    }
    return super.eSet(featureID, newValue);
  }


  /**
   * eIsSet() - provides ability to reflectively check if any feature is set.
   */
  public override eIsSet(feature: number | EStructuralFeature): boolean {
    const featureID: number =
      typeof feature === 'number'
        ? feature
        : (<EStructuralFeature>feature).getFeatureID();
    switch (featureID) {
      case TripplanningPackage.I_DED_ENTITY__ID:
        return this.getId === undefined;
    }
    return super.eIsSet(featureID);
  }


  /**
   * eUnset() - provides ability to reflectively unset any feature.
   */
  public override eUnset(feature: number | EStructuralFeature): void {
    const featureID: number =
      typeof feature === 'number'
        ? feature
        : (<EStructuralFeature>feature).getFeatureID();
    switch (featureID) {
      case TripplanningPackage.I_DED_ENTITY__ID:
        this.setId(undefined!);
        return;
    }
    return super.eUnset(featureID);
  }

  //======================================================================
  // Basic setters (allow EOpposite enforcement without triggering infinite cycles)


  public basicSetId(newId: string): void {
    this.id = newId;
  }

  //======================================================================
  // Inverse Adders (if needed)


  //======================================================================
  // Inverse Removers (if needed)

  //======================================================================
  // eClass()

  public override eClass(): EClass {
    return TripplanningPackage.Literals.I_DED_ENTITY;
  }
}