import { EObject } from '@tripsnek/tmf';
import { TUtils } from '@tripsnek/tmf';
import { EStructuralFeature } from '@tripsnek/tmf';
import { BasicEList } from '@tripsnek/tmf';
import { EClass } from '@tripsnek/tmf';
import { EList } from '@tripsnek/tmf';
import { EEnum } from '@tripsnek/tmf';
import { EDataType } from '@tripsnek/tmf';
import { EObjectImpl } from '@tripsnek/tmf';

import { IDedEntity } from './i-ded-entity';
import { PersonalInterest } from './personal-interest';
import { TripplanningPackage } from '../tripplanning-package';

/**
 * Source-gen API for Traveler.
 */
export interface Traveler extends IDedEntity {
  getName(): string;
  setName(newName: string): void;
  getEmail(): string;
  setEmail(newEmail: string): void;
  getInterests(): EList<PersonalInterest>;
}
