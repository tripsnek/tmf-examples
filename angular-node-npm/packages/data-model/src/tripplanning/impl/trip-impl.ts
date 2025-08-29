import { EObject } from "@tripsnek/tmf";
import { TUtils } from "@tripsnek/tmf";
import { EStructuralFeature } from "@tripsnek/tmf";
import { BasicEList } from "@tripsnek/tmf";
import { EClass } from "@tripsnek/tmf";
import { EList } from "@tripsnek/tmf";
import { EEnum } from "@tripsnek/tmf";
import { EDataType } from "@tripsnek/tmf";
import { EObjectImpl } from "@tripsnek/tmf";
import { IDedEntity } from "../api/i-ded-entity.js";
import { TripSegment } from "../api/trip-segment.js";
import { Traveler } from "../api/traveler.js";

import { TripGen } from "../gen/trip-gen.js";
import { Trip } from "../api/trip.js";

/**
 * Editable Impl class.
 */
export class TripImpl extends TripGen {}
