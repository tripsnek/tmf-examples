import { EObject } from '@tripsnek/tmf';
import { TUtils } from '@tripsnek/tmf';
import { EStructuralFeature } from '@tripsnek/tmf';
import { BasicEList } from '@tripsnek/tmf';
import { EClass } from '@tripsnek/tmf';
import { EList } from '@tripsnek/tmf';
import { EEnum } from '@tripsnek/tmf';
import { EDataType } from '@tripsnek/tmf';
import { EObjectImpl } from '@tripsnek/tmf';
import { IDedEntity } from '../api/i-ded-entity';
import { PersonalInterest } from '../api/personal-interest';

import { TripplanningPackage } from '../tripplanning-package';
import { Traveller } from '../api/traveller';
import { IDedEntityGen } from './i-ded-entity-gen';
import { IDedEntityImpl } from '../impl/i-ded-entity-impl';

/**
 * This file is source-code generated and should never be edited. It implements
 * the core TMF functionality for Traveller.
 */
export abstract class TravellerGen extends IDedEntityImpl implements Traveller {
  /** feature declarations */
  protected name!: string;
  protected email!: string;
  protected interests: EList<PersonalInterest> = new BasicEList<PersonalInterest>(
    undefined,
    this,
    TripplanningPackage.TRAVELLER__INTERESTS,
    undefined
  );



  //======================================================================
  // Getters and Setters


  public getName(): string {
    return this.name;
  }

  public setName(newName: string): void {
    this.basicSetName(newName);
  }

  public getEmail(): string {
    return this.email;
  }

  public setEmail(newEmail: string): void {
    this.basicSetEmail(newEmail);
  }

  public getInterests(): EList<PersonalInterest> {
    return this.interests;
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
      case TripplanningPackage.TRAVELLER__NAME:
        return this.getName();
      case TripplanningPackage.TRAVELLER__EMAIL:
        return this.getEmail();
      case TripplanningPackage.TRAVELLER__INTERESTS:
        return this.getInterests();
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
      case TripplanningPackage.TRAVELLER__NAME:
        this.setName(newValue);
        return;
      case TripplanningPackage.TRAVELLER__EMAIL:
        this.setEmail(newValue);
        return;
      case TripplanningPackage.TRAVELLER__INTERESTS:
        this.getInterests().clear();
        this.getInterests().addAll(newValue);
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
      case TripplanningPackage.TRAVELLER__NAME:
        return this.getName() != null;
      case TripplanningPackage.TRAVELLER__EMAIL:
        return this.getEmail() != null;
      case TripplanningPackage.TRAVELLER__INTERESTS:
        return !this.getInterests().isEmpty();
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
      case TripplanningPackage.TRAVELLER__NAME:
        this.setName(undefined!);
        return;
      case TripplanningPackage.TRAVELLER__EMAIL:
        this.setEmail(undefined!);
        return;
      case TripplanningPackage.TRAVELLER__INTERESTS:
        this.getInterests().clear();
        return;
    }
    return super.eUnset(featureID);
  }

  //======================================================================
  // Basic setters (allow EOpposite enforcement without triggering infinite cycles)


  public basicSetName(newName: string): void {
    this.name = newName;
  }

  public basicSetEmail(newEmail: string): void {
    this.email = newEmail;
  }

  //======================================================================
  // Inverse Adders (if needed)


  //======================================================================
  // Inverse Removers (if needed)

  //======================================================================
  // eClass()

  public override eClass(): EClass {
    return TripplanningPackage.Literals.TRAVELLER;
  }
}