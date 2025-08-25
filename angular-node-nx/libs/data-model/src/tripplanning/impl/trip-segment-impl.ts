import { EObject } from '@tripsnek/tmf';
import { TUtils } from '@tripsnek/tmf';
import { EStructuralFeature } from '@tripsnek/tmf';
import { BasicEList } from '@tripsnek/tmf';
import { EClass } from '@tripsnek/tmf';
import { EList } from '@tripsnek/tmf';
import { EEnum } from '@tripsnek/tmf';
import { EDataType } from '@tripsnek/tmf';
import { EObjectImpl } from '@tripsnek/tmf';
import { Trip } from '../api/trip';
import { Location } from '../api/location';

import { TripSegmentGen } from '../gen/trip-segment-gen';
import { TripSegment } from '../api/trip-segment';

/**
 * Editable Impl class.
 */
export class TripSegmentImpl extends TripSegmentGen {}
