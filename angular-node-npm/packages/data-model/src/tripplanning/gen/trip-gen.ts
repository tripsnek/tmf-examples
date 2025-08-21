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
import { TripSegment } from '../api/trip-segment';
import { Traveller } from '../api/traveller';

import { TripplanningPackage } from '../tripplanning-package';
import { Trip } from '../api/trip';
import { IDedEntityGen } from './i-ded-entity-gen';
import { IDedEntityImpl } from '../impl/i-ded-entity-impl';

/**
 * This file is source-code generated and should never be edited. It implements
 * the core TMF functionality for Trip.
 */
export abstract class TripGen extends IDedEntityImpl implements Trip {
  /** feature declarations */
  protected segments: EList<TripSegment> = new BasicEList<TripSegment>(
    undefined,
    this,
    TripplanningPackage.TRIP__SEGMENTS,
    TripplanningPackage.TRIP_SEGMENT__TRIP
  );
  protected name!: string;
  protected startDate!: Date;
  protected endDate!: Date;
  protected participants: EList<Traveller> = new BasicEList<Traveller>(
    undefined,
    this,
    TripplanningPackage.TRIP__PARTICIPANTS,
    undefined
  );
  protected description!: string;
  protected budgetDollars!: number;
  protected tentative!: boolean;



  //======================================================================
  // Getters and Setters


  public getSegments(): EList<TripSegment> {
    return this.segments;
  }

  public getName(): string {
    return this.name;
  }

  public setName(newName: string): void {
    this.basicSetName(newName);
  }

  public getStartDate(): Date {
    return this.startDate;
  }

  public setStartDate(newStartDate: Date): void {
    this.basicSetStartDate(newStartDate);
  }

  public getEndDate(): Date {
    return this.endDate;
  }

  public setEndDate(newEndDate: Date): void {
    this.basicSetEndDate(newEndDate);
  }

  public getParticipants(): EList<Traveller> {
    return this.participants;
  }

  public getDescription(): string {
    return this.description;
  }

  public setDescription(newDescription: string): void {
    this.basicSetDescription(newDescription);
  }

  public getBudgetDollars(): number {
    return this.budgetDollars;
  }

  public setBudgetDollars(newBudgetDollars: number): void {
    this.basicSetBudgetDollars(newBudgetDollars);
  }

  public isTentative(): boolean {
    return this.tentative;
  }

  public setTentative(newTentative: boolean): void {
    this.basicSetTentative(newTentative);
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
      case TripplanningPackage.TRIP__SEGMENTS:
        return this.getSegments();
      case TripplanningPackage.TRIP__NAME:
        return this.getName();
      case TripplanningPackage.TRIP__START_DATE:
        return this.getStartDate();
      case TripplanningPackage.TRIP__END_DATE:
        return this.getEndDate();
      case TripplanningPackage.TRIP__PARTICIPANTS:
        return this.getParticipants();
      case TripplanningPackage.TRIP__DESCRIPTION:
        return this.getDescription();
      case TripplanningPackage.TRIP__BUDGET_DOLLARS:
        return this.getBudgetDollars();
      case TripplanningPackage.TRIP__TENTATIVE:
        return this.isTentative();
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
      case TripplanningPackage.TRIP__SEGMENTS:
        this.getSegments().clear();
        this.getSegments().addAll(newValue);
        return;
      case TripplanningPackage.TRIP__NAME:
        this.setName(newValue);
        return;
      case TripplanningPackage.TRIP__START_DATE:
        this.setStartDate(newValue);
        return;
      case TripplanningPackage.TRIP__END_DATE:
        this.setEndDate(newValue);
        return;
      case TripplanningPackage.TRIP__PARTICIPANTS:
        this.getParticipants().clear();
        this.getParticipants().addAll(newValue);
        return;
      case TripplanningPackage.TRIP__DESCRIPTION:
        this.setDescription(newValue);
        return;
      case TripplanningPackage.TRIP__BUDGET_DOLLARS:
        this.setBudgetDollars(newValue);
        return;
      case TripplanningPackage.TRIP__TENTATIVE:
        this.setTentative(newValue);
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
      case TripplanningPackage.TRIP__SEGMENTS:
        return !this.getSegments().isEmpty();
      case TripplanningPackage.TRIP__NAME:
        return this.getName() != null;
      case TripplanningPackage.TRIP__START_DATE:
        return this.getStartDate() != null;
      case TripplanningPackage.TRIP__END_DATE:
        return this.getEndDate() != null;
      case TripplanningPackage.TRIP__PARTICIPANTS:
        return !this.getParticipants().isEmpty();
      case TripplanningPackage.TRIP__DESCRIPTION:
        return this.getDescription() != null;
      case TripplanningPackage.TRIP__BUDGET_DOLLARS:
        return this.getBudgetDollars() != null;
      case TripplanningPackage.TRIP__TENTATIVE:
        return this.isTentative() != null;
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
      case TripplanningPackage.TRIP__SEGMENTS:
        this.getSegments().clear();
        return;
      case TripplanningPackage.TRIP__NAME:
        this.setName(undefined!);
        return;
      case TripplanningPackage.TRIP__START_DATE:
        this.setStartDate(undefined!);
        return;
      case TripplanningPackage.TRIP__END_DATE:
        this.setEndDate(undefined!);
        return;
      case TripplanningPackage.TRIP__PARTICIPANTS:
        this.getParticipants().clear();
        return;
      case TripplanningPackage.TRIP__DESCRIPTION:
        this.setDescription(undefined!);
        return;
      case TripplanningPackage.TRIP__BUDGET_DOLLARS:
        this.setBudgetDollars(undefined!);
        return;
      case TripplanningPackage.TRIP__TENTATIVE:
        this.setTentative(undefined!);
        return;
    }
    return super.eUnset(featureID);
  }

  //======================================================================
  // Basic setters (allow EOpposite enforcement without triggering infinite cycles)


  public basicSetName(newName: string): void {
    this.name = newName;
  }

  public basicSetStartDate(newStartDate: Date): void {
    this.startDate = newStartDate;
  }

  public basicSetEndDate(newEndDate: Date): void {
    this.endDate = newEndDate;
  }

  public basicSetDescription(newDescription: string): void {
    this.description = newDescription;
  }

  public basicSetBudgetDollars(newBudgetDollars: number): void {
    this.budgetDollars = newBudgetDollars;
  }

  public basicSetTentative(newTentative: boolean): void {
    this.tentative = newTentative;
  }

  //======================================================================
  // Inverse Adders (if needed)
  public override eInverseAdd(otherEnd: EObject, featureID: number): void {
    switch (featureID) {
      case TripplanningPackage.TRIP__SEGMENTS:
        return (<EList<EObject>>this.getSegments()).basicAdd(otherEnd);
    }
    return super.eInverseAdd(otherEnd, featureID);
  }


  //======================================================================
  // Inverse Removers (if needed)
  public override eInverseRemove(otherEnd: EObject, featureID: number): void {
    switch (featureID) {
      case TripplanningPackage.TRIP__SEGMENTS:
        return (<EList<EObject>>this.getSegments()).basicRemove(otherEnd);
    }
    return super.eInverseRemove(otherEnd, featureID);
  }

  //======================================================================
  // eClass()

  public override eClass(): EClass {
    return TripplanningPackage.Literals.TRIP;
  }
}