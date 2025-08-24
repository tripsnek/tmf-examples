import { EObject } from '@tripsnek/tmf';
import { TUtils } from '@tripsnek/tmf';
import { EStructuralFeature } from '@tripsnek/tmf';
import { BasicEList } from '@tripsnek/tmf';
import { EClass } from '@tripsnek/tmf';
import { EList } from '@tripsnek/tmf';
import { EEnum } from '@tripsnek/tmf';
import { EDataType } from '@tripsnek/tmf';
import { EObjectImpl } from '@tripsnek/tmf';
import { Location } from '../api/location';

import { TripplanningPackage } from '../tripplanning-package';
import { Activity } from '../api/activity';
import { LocationGen } from './location-gen';
import { LocationImpl } from '../impl/location-impl';

/**
 * This file is source-code generated and should never be edited. It implements
 * the core TMF functionality for Activity.
 */
export abstract class ActivityGen extends EObjectImpl implements Activity {
  /** feature declarations */
  protected location!: Location;
  protected durationHrs!: number;
  protected name!: string;



  //======================================================================
  // Getters and Setters


  public getLocation(): Location {
    return this.location;
  }

  public setLocation(newLocation: Location): void {
    this.basicSetLocation(newLocation);
  }

  public getDurationHrs(): number {
    return this.durationHrs;
  }

  public setDurationHrs(newDurationHrs: number): void {
    this.basicSetDurationHrs(newDurationHrs);
  }

  public getName(): string {
    return this.name;
  }

  public setName(newName: string): void {
    this.basicSetName(newName);
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
      case TripplanningPackage.ACTIVITY__LOCATION:
        return this.getLocation();
      case TripplanningPackage.ACTIVITY__DURATION_HRS:
        return this.getDurationHrs();
      case TripplanningPackage.ACTIVITY__NAME:
        return this.getName();
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
      case TripplanningPackage.ACTIVITY__LOCATION:
        this.setLocation(newValue);
        return;
      case TripplanningPackage.ACTIVITY__DURATION_HRS:
        this.setDurationHrs(newValue);
        return;
      case TripplanningPackage.ACTIVITY__NAME:
        this.setName(newValue);
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
      case TripplanningPackage.ACTIVITY__LOCATION:
        return this.getLocation() != null;
      case TripplanningPackage.ACTIVITY__DURATION_HRS:
        return this.getDurationHrs() != null;
      case TripplanningPackage.ACTIVITY__NAME:
        return this.getName() != null;
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
      case TripplanningPackage.ACTIVITY__LOCATION:
        this.setLocation(undefined!);
        return;
      case TripplanningPackage.ACTIVITY__DURATION_HRS:
        this.setDurationHrs(undefined!);
        return;
      case TripplanningPackage.ACTIVITY__NAME:
        this.setName(undefined!);
        return;
    }
    return super.eUnset(featureID);
  }

  //======================================================================
  // Basic setters (allow EOpposite enforcement without triggering infinite cycles)


  public basicSetLocation(newLocation: Location): void {
    this.location = newLocation;
  }

  public basicSetDurationHrs(newDurationHrs: number): void {
    this.durationHrs = newDurationHrs;
  }

  public basicSetName(newName: string): void {
    this.name = newName;
  }

  //======================================================================
  // Inverse Adders (if needed)


  //======================================================================
  // Inverse Removers (if needed)

  //======================================================================
  // eClass()

  public override eClass(): EClass {
    return TripplanningPackage.Literals.ACTIVITY;
  }
}