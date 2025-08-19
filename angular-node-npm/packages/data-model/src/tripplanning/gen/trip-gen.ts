import { EObject } from '@tripsnek/tmf';
import { TUtils } from '@tripsnek/tmf';
import { EStructuralFeature } from '@tripsnek/tmf';
import { BasicEList } from '@tripsnek/tmf';
import { EClass } from '@tripsnek/tmf';
import { EList } from '@tripsnek/tmf';
import { EEnum } from '@tripsnek/tmf';
import { EDataType } from '@tripsnek/tmf';
import { EObjectImpl } from '@tripsnek/tmf';
import { TripWaypoint } from '../api/trip-waypoint';

import { TripplanningPackage } from '../tripplanning-package';
import { Trip } from '../api/trip';

/**
 * This file is source-code generated and should never be edited. It implements
 * the core TMF functionality for Trip.
 */
export abstract class TripGen extends EObjectImpl implements Trip {
  /** feature declarations */
  protected waypoints: EList<TripWaypoint> = new BasicEList<TripWaypoint>(
    undefined,
    this,
    TripplanningPackage.TRIP__WAYPOINTS,
    TripplanningPackage.TRIP_WAYPOINT__TRIP
  );
  protected description!: string;
  protected startDate!: Date;



  //======================================================================
  // Getters and Setters


  public getWaypoints(): EList<TripWaypoint> {
    return this.waypoints;
  }

  public getDescription(): string {
    return this.description;
  }

  public setDescription(newDescription: string): void {
    this.basicSetDescription(newDescription);
  }

  public getStartDate(): Date {
    return this.startDate;
  }

  public setStartDate(newStartDate: Date): void {
    this.basicSetStartDate(newStartDate);
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
      case TripplanningPackage.TRIP__WAYPOINTS:
        return this.getWaypoints();
      case TripplanningPackage.TRIP__DESCRIPTION:
        return this.getDescription();
      case TripplanningPackage.TRIP__START_DATE:
        return this.getStartDate();
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
      case TripplanningPackage.TRIP__WAYPOINTS:
        this.getWaypoints().clear();
        this.getWaypoints().addAll(newValue);
        return;
      case TripplanningPackage.TRIP__DESCRIPTION:
        this.setDescription(newValue);
        return;
      case TripplanningPackage.TRIP__START_DATE:
        this.setStartDate(newValue);
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
      case TripplanningPackage.TRIP__WAYPOINTS:
        return this.getWaypoints().isEmpty();
      case TripplanningPackage.TRIP__DESCRIPTION:
        return this.getDescription === undefined;
      case TripplanningPackage.TRIP__START_DATE:
        return this.getStartDate === undefined;
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
      case TripplanningPackage.TRIP__WAYPOINTS:
        this.getWaypoints().clear();
        return;
      case TripplanningPackage.TRIP__DESCRIPTION:
        this.setDescription(undefined!);
        return;
      case TripplanningPackage.TRIP__START_DATE:
        this.setStartDate(undefined!);
        return;
    }
    return super.eUnset(featureID);
  }

  //======================================================================
  // Basic setters (allow EOpposite enforcement without triggering infinite cycles)


  public basicSetDescription(newDescription: string): void {
    this.description = newDescription;
  }

  public basicSetStartDate(newStartDate: Date): void {
    this.startDate = newStartDate;
  }

  //======================================================================
  // Inverse Adders (if needed)
  public override eInverseAdd(otherEnd: EObject, featureID: number): void {
    switch (featureID) {
      case TripplanningPackage.TRIP__WAYPOINTS:
        return (<EList<EObject>>this.getWaypoints()).basicAdd(otherEnd);
    }
    return super.eInverseAdd(otherEnd, featureID);
  }


  //======================================================================
  // Inverse Removers (if needed)
  public override eInverseRemove(otherEnd: EObject, featureID: number): void {
    switch (featureID) {
      case TripplanningPackage.TRIP__WAYPOINTS:
        return (<EList<EObject>>this.getWaypoints()).basicRemove(otherEnd);
    }
    return super.eInverseRemove(otherEnd, featureID);
  }

  //======================================================================
  // eClass()

  public override eClass(): EClass {
    return TripplanningPackage.Literals.TRIP;
  }
}