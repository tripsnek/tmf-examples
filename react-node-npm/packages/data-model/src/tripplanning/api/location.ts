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
import { LocationType } from "./location-type.js";
import { TripplanningPackage } from "../tripplanning-package.js";

/**
 * Source-gen API for Location.
 */
export interface Location extends IDedEntity {
  getName(): string;
  setName(newName: string): void;
  getAddress(): string;
  setAddress(newAddress: string): void;
  getType(): LocationType;
  setType(newType: LocationType): void;
  getLatitude(): number;
  setLatitude(newLatitude: number): void;
  getLongitude(): number;
  setLongitude(newLongitude: number): void;
}
