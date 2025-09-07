import { EObject } from '@tripsnek/tmf';
import { TUtils } from '@tripsnek/tmf';
import { EStructuralFeature } from '@tripsnek/tmf';
import { BasicEList } from '@tripsnek/tmf';
import { EClass } from '@tripsnek/tmf';
import { EList } from '@tripsnek/tmf';
import { EEnum } from '@tripsnek/tmf';
import { EDataType } from '@tripsnek/tmf';
import { EObjectImpl } from '@tripsnek/tmf';
import { Trip } from '../api/trip.js';
import { Location } from '../api/location.js';

import { TripSegmentGen } from '../gen/trip-segment-gen.js';
import { TripSegment } from '../api/trip-segment.js';

/**
 * Editable Impl class.
 */
export class TripSegmentImpl extends TripSegmentGen {}
