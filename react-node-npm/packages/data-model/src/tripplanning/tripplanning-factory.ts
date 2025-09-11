import { EObject } from '@tripsnek/tmf';
import { TUtils } from '@tripsnek/tmf';
import { EStructuralFeature } from '@tripsnek/tmf';
import { BasicEList } from '@tripsnek/tmf';
import { EClass } from '@tripsnek/tmf';
import { EList } from '@tripsnek/tmf';
import { EEnum } from '@tripsnek/tmf';
import { EDataType } from '@tripsnek/tmf';
import { EObjectImpl } from '@tripsnek/tmf';

import { EReference } from '@tripsnek/tmf';
import { EAttribute } from '@tripsnek/tmf';
import { EFactory } from '@tripsnek/tmf';
import { TripplanningPackage } from './tripplanning-package.js';

import { Trip } from './api/trip.js';
import { TripImpl } from './impl/trip-impl.js';
import { TripSegment } from './api/trip-segment.js';
import { TripSegmentImpl } from './impl/trip-segment-impl.js';
import { Traveler } from './api/traveler.js';
import { TravelerImpl } from './impl/traveler-impl.js';
import { Location } from './api/location.js';
import { LocationImpl } from './impl/location-impl.js';
import { Activity } from './api/activity.js';
import { ActivityImpl } from './impl/activity-impl.js';
import { TripplanningPackageInitializer} from './tripplanning-package-initializer.js';

export class TripplanningFactory implements EFactory {
  /* Singleton */
  public static _eINSTANCE: TripplanningFactory = TripplanningFactory.init();
  public static init(): TripplanningFactory {
    if (!TripplanningFactory._eINSTANCE) {
      TripplanningFactory._eINSTANCE = new TripplanningFactory();
    }

    return TripplanningFactory._eINSTANCE;
  }
  
  static get eINSTANCE(): TripplanningFactory {
    TripplanningPackageInitializer.registerAll();
    return this._eINSTANCE;
  }
  

  public create(eClass: EClass): EObject {
    switch (eClass.getClassifierId()) {
      case TripplanningPackage.TRIP:
        return this.createTrip();
      case TripplanningPackage.TRIP_SEGMENT:
        return this.createTripSegment();
      case TripplanningPackage.TRAVELER:
        return this.createTraveler();
      case TripplanningPackage.LOCATION:
        return this.createLocation();
      case TripplanningPackage.ACTIVITY:
        return this.createActivity();
      default:
        throw new Error(
          "The class '" + eClass.getName() + "' is not a valid classifier"
        );
    }
  }

  public createTrip(): Trip {
    return new TripImpl();
  }
  public createTripSegment(): TripSegment {
    return new TripSegmentImpl();
  }
  public createTraveler(): Traveler {
    return new TravelerImpl();
  }
  public createLocation(): Location {
    return new LocationImpl();
  }
  public createActivity(): Activity {
    return new ActivityImpl();
  }
}
