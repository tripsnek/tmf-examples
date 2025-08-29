import { EObject } from "@tripsnek/tmf";
import { TUtils } from "@tripsnek/tmf";
import { EStructuralFeature } from "@tripsnek/tmf";
import { BasicEList } from "@tripsnek/tmf";
import { EClass } from "@tripsnek/tmf";
import { EList } from "@tripsnek/tmf";
import { EEnum } from "@tripsnek/tmf";
import { EDataType } from "@tripsnek/tmf";
import { EObjectImpl } from "@tripsnek/tmf";

import { Location } from "./location.js";
import { TripplanningPackage } from "../tripplanning-package.js";

/**
 * Source-gen API for Activity.
 */
export interface Activity extends EObject {
  getLocation(): Location;
  setLocation(newLocation: Location): void;
  getDurationHrs(): number;
  setDurationHrs(newDurationHrs: number): void;
  getName(): string;
  setName(newName: string): void;
}
