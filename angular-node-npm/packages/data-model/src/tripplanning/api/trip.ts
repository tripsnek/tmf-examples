import { EObject } from '@tripsnek/tmf';
import { TUtils } from '@tripsnek/tmf';
import { EStructuralFeature } from '@tripsnek/tmf';
import { BasicEList } from '@tripsnek/tmf';
import { EClass } from '@tripsnek/tmf';
import { EList } from '@tripsnek/tmf';
import { EEnum } from '@tripsnek/tmf';
import { EDataType } from '@tripsnek/tmf';
import { EObjectImpl } from '@tripsnek/tmf';

import { TripWaypoint } from './trip-waypoint';
import { TripplanningPackage } from '../tripplanning-package';

/**
 * Source-gen API for Trip.
 */
export interface Trip extends EObject {
  getWaypoints(): EList<TripWaypoint>;
  getDescription(): string;
  setDescription(newDescription: string): void;
  getStartDate(): Date;
  setStartDate(newStartDate: Date): void;
}
