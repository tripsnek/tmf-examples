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
import { TripplanningPackage } from './tripplanning-package';

import { Trip } from './api/trip';
import { TripImpl } from './impl/trip-impl';
import { TripSegment } from './api/trip-segment';
import { TripSegmentImpl } from './impl/trip-segment-impl';
import { Traveller } from './api/traveller';
import { TravellerImpl } from './impl/traveller-impl';
import { Location } from './api/location';
import { LocationImpl } from './impl/location-impl';
import { Activity } from './api/activity';
import { ActivityImpl } from './impl/activity-impl';

export class TripplanningFactory extends EFactory {
  /* Singleton */
  public static eINSTANCE: TripplanningFactory = TripplanningFactory.init();
  public static init(): TripplanningFactory {
    if (!TripplanningFactory.eINSTANCE) {
      TripplanningFactory.eINSTANCE = new TripplanningFactory();
    }

    //inject the factory instance into the package, so that it can be retrieved reflectively
    TripplanningPackage.eINSTANCE.setEFactoryInstance(this.eINSTANCE);
    return TripplanningFactory.eINSTANCE;
  }

  public override create(eClass: EClass): any {
    switch (eClass.getClassifierId()) {
      case TripplanningPackage.TRIP:
        return this.createTrip();
      case TripplanningPackage.TRIP_SEGMENT:
        return this.createTripSegment();
      case TripplanningPackage.TRAVELLER:
        return this.createTraveller();
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
  public createTraveller(): Traveller {
    return new TravellerImpl();
  }
  public createLocation(): Location {
    return new LocationImpl();
  }
  public createActivity(): Activity {
    return new ActivityImpl();
  }
}
