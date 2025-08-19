import { EObject } from '@tripsnek/tmf';
import { TUtils } from '@tripsnek/tmf';
import { EStructuralFeature } from '@tripsnek/tmf';
import { BasicEList } from '@tripsnek/tmf';
import { EClass } from '@tripsnek/tmf';
import { EList } from '@tripsnek/tmf';
import { EEnum } from '@tripsnek/tmf';
import { EDataType } from '@tripsnek/tmf';
import { EObjectImpl } from '@tripsnek/tmf';
import { Trip } from '../api/trip';

import { TripplanningPackage } from '../tripplanning-package';
import { TripWaypoint } from '../api/trip-waypoint';

/**
 * This file is source-code generated and should never be edited. It implements
 * the core TMF functionality for TripWaypoint.
 */
export abstract class TripWaypointGen extends EObjectImpl implements TripWaypoint {
  /** feature declarations */
  protected city!: string;
  protected nights!: number;
  protected trip!: Trip;



  //======================================================================
  // Getters and Setters


  public getCity(): string {
    return this.city;
  }

  public setCity(newCity: string): void {
    this.basicSetCity(newCity);
  }

  public getNights(): number {
    return this.nights;
  }

  public setNights(newNights: number): void {
    this.basicSetNights(newNights);
  }

  public getTrip(): Trip {
    return this.trip;
  }

  public setTrip(newTrip: Trip): void {
    if (this.trip !== newTrip) {
      if (this.trip) {
        this.trip.eInverseRemove(this, TripplanningPackage.TRIP__WAYPOINTS);
      }
      if (newTrip) {
        newTrip.eInverseAdd(this, TripplanningPackage.TRIP__WAYPOINTS);
      }
    }
    this.basicSetTrip(newTrip);
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
      case TripplanningPackage.TRIP_WAYPOINT__CITY:
        return this.getCity();
      case TripplanningPackage.TRIP_WAYPOINT__NIGHTS:
        return this.getNights();
      case TripplanningPackage.TRIP_WAYPOINT__TRIP:
        return this.getTrip();
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
      case TripplanningPackage.TRIP_WAYPOINT__CITY:
        this.setCity(newValue);
        return;
      case TripplanningPackage.TRIP_WAYPOINT__NIGHTS:
        this.setNights(newValue);
        return;
      case TripplanningPackage.TRIP_WAYPOINT__TRIP:
        this.setTrip(newValue);
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
      case TripplanningPackage.TRIP_WAYPOINT__CITY:
        return this.getCity === undefined;
      case TripplanningPackage.TRIP_WAYPOINT__NIGHTS:
        return this.getNights === undefined;
      case TripplanningPackage.TRIP_WAYPOINT__TRIP:
        return this.getTrip === undefined;
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
      case TripplanningPackage.TRIP_WAYPOINT__CITY:
        this.setCity(undefined!);
        return;
      case TripplanningPackage.TRIP_WAYPOINT__NIGHTS:
        this.setNights(undefined!);
        return;
      case TripplanningPackage.TRIP_WAYPOINT__TRIP:
        this.setTrip(undefined!);
        return;
    }
    return super.eUnset(featureID);
  }

  //======================================================================
  // Basic setters (allow EOpposite enforcement without triggering infinite cycles)


  public basicSetCity(newCity: string): void {
    this.city = newCity;
  }

  public basicSetNights(newNights: number): void {
    this.nights = newNights;
  }

  public basicSetTrip(newTrip: Trip): void {
    this.trip = newTrip;
  }

  //======================================================================
  // Inverse Adders (if needed)
  public override eInverseAdd(otherEnd: EObject, featureID: number): void {
    switch (featureID) {
      case TripplanningPackage.TRIP_WAYPOINT__TRIP:
        if (this.trip)
          this.trip.eInverseRemove(
            this,
            TripplanningPackage.TRIP__WAYPOINTS
          );
        return this.basicSetTrip(<Trip>otherEnd);
    }
    return super.eInverseAdd(otherEnd, featureID);
  }


  //======================================================================
  // Inverse Removers (if needed)
  public override eInverseRemove(otherEnd: EObject, featureID: number): void {
    switch (featureID) {
      case TripplanningPackage.TRIP_WAYPOINT__TRIP:
        return this.basicSetTrip(undefined!);
    }
    return super.eInverseRemove(otherEnd, featureID);
  }

  //======================================================================
  // eClass()

  public override eClass(): EClass {
    return TripplanningPackage.Literals.TRIP_WAYPOINT;
  }
}