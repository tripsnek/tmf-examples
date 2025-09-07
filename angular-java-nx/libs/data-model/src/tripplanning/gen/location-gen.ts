import { EObject } from '@tripsnek/tmf';
import { TUtils } from '@tripsnek/tmf';
import { EStructuralFeature } from '@tripsnek/tmf';
import { BasicEList } from '@tripsnek/tmf';
import { EClass } from '@tripsnek/tmf';
import { EList } from '@tripsnek/tmf';
import { EEnum } from '@tripsnek/tmf';
import { EDataType } from '@tripsnek/tmf';
import { EObjectImpl } from '@tripsnek/tmf';
import { IDedEntity } from '../api/i-ded-entity.js';
import { LocationType } from '../api/location-type.js';

import { TripplanningPackage } from '../tripplanning-package.js';
import { Location } from '../api/location.js';
import { IDedEntityGen } from './i-ded-entity-gen.js';
import { IDedEntityImpl } from '../impl/i-ded-entity-impl.js';

/**
 * This file is source-code generated and should never be edited. It implements
 * the core TMF functionality for Location.
 */
export abstract class LocationGen extends IDedEntityImpl implements Location {
  /** feature declarations */
  protected name!: string;
  protected address!: string;
  protected type!: LocationType;
  protected latitude!: number;
  protected longitude!: number;

  //======================================================================
  // Getters and Setters

  public getName(): string {
    return this.name;
  }

  public setName(newName: string): void {
    this.basicSetName(newName);
  }

  public getAddress(): string {
    return this.address;
  }

  public setAddress(newAddress: string): void {
    this.basicSetAddress(newAddress);
  }

  public getType(): LocationType {
    return this.type;
  }

  public setType(newType: LocationType): void {
    this.basicSetType(newType);
  }

  public getLatitude(): number {
    return this.latitude;
  }

  public setLatitude(newLatitude: number): void {
    this.basicSetLatitude(newLatitude);
  }

  public getLongitude(): number {
    return this.longitude;
  }

  public setLongitude(newLongitude: number): void {
    this.basicSetLongitude(newLongitude);
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
      case TripplanningPackage.LOCATION__NAME:
        return this.getName();
      case TripplanningPackage.LOCATION__ADDRESS:
        return this.getAddress();
      case TripplanningPackage.LOCATION__TYPE:
        return this.getType();
      case TripplanningPackage.LOCATION__LATITUDE:
        return this.getLatitude();
      case TripplanningPackage.LOCATION__LONGITUDE:
        return this.getLongitude();
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
      typeof feature === 'number'
        ? feature
        : (<EStructuralFeature>feature).getFeatureID();
    switch (featureID) {
      case TripplanningPackage.LOCATION__NAME:
        this.setName(newValue);
        return;
      case TripplanningPackage.LOCATION__ADDRESS:
        this.setAddress(newValue);
        return;
      case TripplanningPackage.LOCATION__TYPE:
        this.setType(newValue);
        return;
      case TripplanningPackage.LOCATION__LATITUDE:
        this.setLatitude(newValue);
        return;
      case TripplanningPackage.LOCATION__LONGITUDE:
        this.setLongitude(newValue);
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
      case TripplanningPackage.LOCATION__NAME:
        return this.getName() != null;
      case TripplanningPackage.LOCATION__ADDRESS:
        return this.getAddress() != null;
      case TripplanningPackage.LOCATION__TYPE:
        return this.getType() != null;
      case TripplanningPackage.LOCATION__LATITUDE:
        return this.getLatitude() != null;
      case TripplanningPackage.LOCATION__LONGITUDE:
        return this.getLongitude() != null;
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
      case TripplanningPackage.LOCATION__NAME:
        this.setName(undefined!);
        return;
      case TripplanningPackage.LOCATION__ADDRESS:
        this.setAddress(undefined!);
        return;
      case TripplanningPackage.LOCATION__TYPE:
        this.setType(undefined!);
        return;
      case TripplanningPackage.LOCATION__LATITUDE:
        this.setLatitude(undefined!);
        return;
      case TripplanningPackage.LOCATION__LONGITUDE:
        this.setLongitude(undefined!);
        return;
    }
    return super.eUnset(featureID);
  }

  //======================================================================
  // Basic setters (allow EOpposite enforcement without triggering infinite cycles)

  public basicSetName(newName: string): void {
    this.name = newName;
  }

  public basicSetAddress(newAddress: string): void {
    this.address = newAddress;
  }

  public basicSetType(newType: LocationType): void {
    this.type = newType;
  }

  public basicSetLatitude(newLatitude: number): void {
    this.latitude = newLatitude;
  }

  public basicSetLongitude(newLongitude: number): void {
    this.longitude = newLongitude;
  }

  //======================================================================
  // Inverse Adders (if needed)

  //======================================================================
  // Inverse Removers (if needed)

  //======================================================================
  // eClass()

  public override eClass(): EClass {
    return TripplanningPackage.Literals.LOCATION;
  }
}
