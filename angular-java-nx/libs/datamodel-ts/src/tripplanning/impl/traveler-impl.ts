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
import { PersonalInterest } from '../api/personal-interest.js';

import { TravelerGen } from '../gen/traveler-gen.js';
import { Traveler } from '../api/traveler.js';

/**
 * Editable Impl class.
 */
export class TravelerImpl extends TravelerGen {}
