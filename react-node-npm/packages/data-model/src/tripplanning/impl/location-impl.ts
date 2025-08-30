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
import { LocationType } from "../api/location-type.js";

import { LocationGen } from "../gen/location-gen.js";
import { Location } from "../api/location.js";

/**
 * Editable Impl class.
 */
export class LocationImpl extends LocationGen {}
