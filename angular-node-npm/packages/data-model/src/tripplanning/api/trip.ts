import { EObject } from "@tripsnek/tmf";
import { TUtils } from "@tripsnek/tmf";
import { EStructuralFeature } from "@tripsnek/tmf";
import { BasicEList } from "@tripsnek/tmf";
import { EClass } from "@tripsnek/tmf";
import { EList } from "@tripsnek/tmf";
import { EEnum } from "@tripsnek/tmf";
import { EDataType } from "@tripsnek/tmf";
import { EObjectImpl } from "@tripsnek/tmf";

import { IDedEntity } from "./i-ded-entity.js";
import { TripSegment } from "./trip-segment.js";
import { Traveler } from "./traveler.js";
import { TripplanningPackage } from "../tripplanning-package.js";

/**
 * Source-gen API for Trip.
 */
export interface Trip extends IDedEntity {
  getSegments(): EList<TripSegment>;
  getName(): string;
  setName(newName: string): void;
  getStartDate(): Date;
  setStartDate(newStartDate: Date): void;
  getEndDate(): Date;
  setEndDate(newEndDate: Date): void;
  getParticipants(): EList<Traveler>;
  getDescription(): string;
  setDescription(newDescription: string): void;
  getBudgetDollars(): number;
  setBudgetDollars(newBudgetDollars: number): void;
  isTentative(): boolean;
  setTentative(newTentative: boolean): void;
}
