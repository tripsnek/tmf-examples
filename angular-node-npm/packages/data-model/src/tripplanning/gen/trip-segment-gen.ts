import { EObject } from "@tripsnek/tmf";
import { TUtils } from "@tripsnek/tmf";
import { EStructuralFeature } from "@tripsnek/tmf";
import { BasicEList } from "@tripsnek/tmf";
import { EClass } from "@tripsnek/tmf";
import { EList } from "@tripsnek/tmf";
import { EEnum } from "@tripsnek/tmf";
import { EDataType } from "@tripsnek/tmf";
import { EObjectImpl } from "@tripsnek/tmf";
import { Trip } from "../api/trip";
import { Location } from "../api/location";
import { Activity } from "../api/activity";

import { TripplanningPackage } from "../tripplanning-package";
import { TripSegment } from "../api/trip-segment";

/**
 * This file is source-code generated and should never be edited. It implements
 * the core TMF functionality for TripSegment.
 */
export abstract class TripSegmentGen
  extends EObjectImpl
  implements TripSegment
{
  /** feature declarations */
  protected destinationNights!: number;
  protected trip!: Trip;
  protected origin!: Location;
  protected destination!: Location;
  protected activities: EList<Activity> = new BasicEList<Activity>(
    undefined,
    this,
    TripplanningPackage.TRIP_SEGMENT__ACTIVITIES,
    undefined
  );
  protected name!: string;

  //======================================================================
  // Getters and Setters

  public getDestinationNights(): number {
    return this.destinationNights;
  }

  public setDestinationNights(newDestinationNights: number): void {
    this.basicSetDestinationNights(newDestinationNights);
  }

  public getTrip(): Trip {
    return this.trip;
  }

  public setTrip(newTrip: Trip): void {
    if (this.trip !== newTrip) {
      if (this.trip) {
        this.trip.eInverseRemove(this, TripplanningPackage.TRIP__SEGMENTS);
      }
      if (newTrip) {
        newTrip.eInverseAdd(this, TripplanningPackage.TRIP__SEGMENTS);
      }
    }
    this.basicSetTrip(newTrip);
  }

  public getOrigin(): Location {
    return this.origin;
  }

  public setOrigin(newOrigin: Location): void {
    this.basicSetOrigin(newOrigin);
  }

  public getDestination(): Location {
    return this.destination;
  }

  public setDestination(newDestination: Location): void {
    this.basicSetDestination(newDestination);
  }

  public getActivities(): EList<Activity> {
    return this.activities;
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
      typeof feature === "number"
        ? feature
        : (<EStructuralFeature>feature).getFeatureID();
    switch (featureID) {
      case TripplanningPackage.TRIP_SEGMENT__DESTINATION_NIGHTS:
        return this.getDestinationNights();
      case TripplanningPackage.TRIP_SEGMENT__TRIP:
        return this.getTrip();
      case TripplanningPackage.TRIP_SEGMENT__ORIGIN:
        return this.getOrigin();
      case TripplanningPackage.TRIP_SEGMENT__DESTINATION:
        return this.getDestination();
      case TripplanningPackage.TRIP_SEGMENT__ACTIVITIES:
        return this.getActivities();
      case TripplanningPackage.TRIP_SEGMENT__NAME:
        return this.getName();
    }
    return super.eGet(featureID);
  }

  /**
   * eSet() - provides ability to reflectively set all features.
   */
  public override eSet(
    feature: number | EStructuralFeature,
    newValue: any
  ): void {
    const featureID: number =
      typeof feature === "number"
        ? feature
        : (<EStructuralFeature>feature).getFeatureID();
    switch (featureID) {
      case TripplanningPackage.TRIP_SEGMENT__DESTINATION_NIGHTS:
        this.setDestinationNights(newValue);
        return;
      case TripplanningPackage.TRIP_SEGMENT__TRIP:
        this.setTrip(newValue);
        return;
      case TripplanningPackage.TRIP_SEGMENT__ORIGIN:
        this.setOrigin(newValue);
        return;
      case TripplanningPackage.TRIP_SEGMENT__DESTINATION:
        this.setDestination(newValue);
        return;
      case TripplanningPackage.TRIP_SEGMENT__ACTIVITIES:
        this.getActivities().clear();
        this.getActivities().addAll(newValue);
        return;
      case TripplanningPackage.TRIP_SEGMENT__NAME:
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
      typeof feature === "number"
        ? feature
        : (<EStructuralFeature>feature).getFeatureID();
    switch (featureID) {
      case TripplanningPackage.TRIP_SEGMENT__DESTINATION_NIGHTS:
        return this.getDestinationNights() != null;
      case TripplanningPackage.TRIP_SEGMENT__TRIP:
        return this.getTrip() != null;
      case TripplanningPackage.TRIP_SEGMENT__ORIGIN:
        return this.getOrigin() != null;
      case TripplanningPackage.TRIP_SEGMENT__DESTINATION:
        return this.getDestination() != null;
      case TripplanningPackage.TRIP_SEGMENT__ACTIVITIES:
        return !this.getActivities().isEmpty();
      case TripplanningPackage.TRIP_SEGMENT__NAME:
        return this.getName() != null;
    }
    return super.eIsSet(featureID);
  }

  /**
   * eUnset() - provides ability to reflectively unset any feature.
   */
  public override eUnset(feature: number | EStructuralFeature): void {
    const featureID: number =
      typeof feature === "number"
        ? feature
        : (<EStructuralFeature>feature).getFeatureID();
    switch (featureID) {
      case TripplanningPackage.TRIP_SEGMENT__DESTINATION_NIGHTS:
        this.setDestinationNights(undefined!);
        return;
      case TripplanningPackage.TRIP_SEGMENT__TRIP:
        this.setTrip(undefined!);
        return;
      case TripplanningPackage.TRIP_SEGMENT__ORIGIN:
        this.setOrigin(undefined!);
        return;
      case TripplanningPackage.TRIP_SEGMENT__DESTINATION:
        this.setDestination(undefined!);
        return;
      case TripplanningPackage.TRIP_SEGMENT__ACTIVITIES:
        this.getActivities().clear();
        return;
      case TripplanningPackage.TRIP_SEGMENT__NAME:
        this.setName(undefined!);
        return;
    }
    return super.eUnset(featureID);
  }

  //======================================================================
  // Basic setters (allow EOpposite enforcement without triggering infinite cycles)

  public basicSetDestinationNights(newDestinationNights: number): void {
    this.destinationNights = newDestinationNights;
  }

  public basicSetTrip(newTrip: Trip): void {
    this.eBasicSetContainer(newTrip, TripplanningPackage.TRIP__SEGMENTS);
    this.trip = newTrip;
  }

  public basicSetOrigin(newOrigin: Location): void {
    this.origin = newOrigin;
  }

  public basicSetDestination(newDestination: Location): void {
    this.destination = newDestination;
  }

  public basicSetName(newName: string): void {
    this.name = newName;
  }

  //======================================================================
  // Inverse Adders (if needed)
  public override eInverseAdd(otherEnd: EObject, featureID: number): void {
    switch (featureID) {
      case TripplanningPackage.TRIP_SEGMENT__TRIP:
        if (this.trip)
          this.trip.eInverseRemove(this, TripplanningPackage.TRIP__SEGMENTS);
        return this.basicSetTrip(<Trip>otherEnd);
    }
    return super.eInverseAdd(otherEnd, featureID);
  }

  //======================================================================
  // Inverse Removers (if needed)
  public override eInverseRemove(otherEnd: EObject, featureID: number): void {
    switch (featureID) {
      case TripplanningPackage.TRIP_SEGMENT__TRIP:
        return this.basicSetTrip(undefined!);
    }
    return super.eInverseRemove(otherEnd, featureID);
  }

  //======================================================================
  // eClass()

  public override eClass(): EClass {
    return TripplanningPackage.Literals.TRIP_SEGMENT;
  }
}
