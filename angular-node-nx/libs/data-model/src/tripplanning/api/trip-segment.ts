import { EObject } from '@tripsnek/tmf';
import { TUtils } from '@tripsnek/tmf';
import { EStructuralFeature } from '@tripsnek/tmf';
import { BasicEList } from '@tripsnek/tmf';
import { EClass } from '@tripsnek/tmf';
import { EList } from '@tripsnek/tmf';
import { EEnum } from '@tripsnek/tmf';
import { EDataType } from '@tripsnek/tmf';
import { EObjectImpl } from '@tripsnek/tmf';

import { Trip } from './trip';
import { Location } from './location';
import { TripplanningPackage } from '../tripplanning-package';

/**
 * Source-gen API for TripSegment.
 */
export interface TripSegment extends EObject {
  getDestinationNights(): number;
  setDestinationNights(newDestinationNights: number): void;
  getTrip(): Trip;
  setTrip(newTrip: Trip): void;
  getOrigin(): Location;
  setOrigin(newOrigin: Location): void;
  getDestination(): Location;
  setDestination(newDestination: Location): void;
  getName(): string;
  setName(newName: string): void;
}
