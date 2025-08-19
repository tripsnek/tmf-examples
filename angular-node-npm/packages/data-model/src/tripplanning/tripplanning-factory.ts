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
import { TripWaypoint } from './api/trip-waypoint';
import { TripWaypointImpl } from './impl/trip-waypoint-impl';

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
      case TripplanningPackage.TRIP_WAYPOINT:
        return this.createTripWaypoint();
      default:
        throw new Error(
          "The class '" + eClass.getName() + "' is not a valid classifier"
        );
    }
  }

  public createTrip(): Trip {
    return new TripImpl();
  }
  public createTripWaypoint(): TripWaypoint {
    return new TripWaypointImpl();
  }
}
