
import { EObject } from '@tripsnek/tmf';
import { TUtils } from '@tripsnek/tmf';
import { EStructuralFeature } from '@tripsnek/tmf';
import { BasicEList } from '@tripsnek/tmf';
import { EClass } from '@tripsnek/tmf';
import { EList } from '@tripsnek/tmf';
import { EEnum } from '@tripsnek/tmf';
import { EDataType } from '@tripsnek/tmf';
import { EObjectImpl } from '@tripsnek/tmf';

import { EPackage } from '@tripsnek/tmf';
import { EPackageImpl } from '@tripsnek/tmf';
import { EAttribute } from '@tripsnek/tmf';
import { EFactory } from '@tripsnek/tmf';
import { EReference } from '@tripsnek/tmf';
import { EOperation } from '@tripsnek/tmf';
import { EcorePackage } from '@tripsnek/tmf';
export class TripplanningPackage extends EPackageImpl {
  public static TRIP_WAYPOINT = 0;
  public static TRIP_WAYPOINT_FEATURE_COUNT = 3;
  public static TRIP_WAYPOINT__CITY = 0;
  public static TRIP_WAYPOINT__NIGHTS = 1;
  public static TRIP_WAYPOINT__TRIP = 2;
  public static TRIP = 1;
  public static TRIP_FEATURE_COUNT = 3;
  public static TRIP__WAYPOINTS = 0;
  public static TRIP__DESCRIPTION = 1;
  public static TRIP__START_DATE = 2;

  /** Singleton */
  public static eINSTANCE: TripplanningPackage = TripplanningPackage.init();

  //if the singleton is initialized
  private static isInited = false;

  static eNS_URI =
    'http://example.org/tripplanning';
  static eNAME = 'tripplanning';
  static eNS_PREFIX = 'tripplanning';

  /** Provides static access to EClass and EStructuralFeature instances */
  public static Literals = class {
    static TRIP_WAYPOINT: EClass = TripplanningPackage.eINSTANCE.getTripWaypoint();
    static TRIP_WAYPOINT__CITY: EAttribute =
      TripplanningPackage.eINSTANCE.getTripWaypoint_City();
    static TRIP_WAYPOINT__NIGHTS: EAttribute =
      TripplanningPackage.eINSTANCE.getTripWaypoint_Nights();
    static TRIP_WAYPOINT__TRIP: EReference =
      TripplanningPackage.eINSTANCE.getTripWaypoint_Trip();
    static TRIP: EClass = TripplanningPackage.eINSTANCE.getTrip();
    static TRIP__WAYPOINTS: EReference =
      TripplanningPackage.eINSTANCE.getTrip_Waypoints();
    static TRIP__DESCRIPTION: EAttribute =
      TripplanningPackage.eINSTANCE.getTrip_Description();
    static TRIP__START_DATE: EAttribute =
      TripplanningPackage.eINSTANCE.getTrip_StartDate();
  };

  //flags that keep track of whether package is initialized
  private isCreated = false;
  private isInitialized = false;

  private tripWaypointEClass!: EClass;
  private tripEClass!: EClass;

  //causes EPackage.Registry registration event
  //hard-coded URI, since referring to the static eNS_URI field in constructor can cause issues
  constructor() {
    super(
      'tripplanning',
      'http://example.org/tripplanning'
    );
  }

  /**
   * Invoked once. Initializes the Singleton.
   *
   * NOTE: Lots of differences here with the EMF version, which interacts with the package Registry,
   * other packages from the same model to register interdependencies, and freezes the package meta-data.
   */
  private static init(): TripplanningPackage {
    if (TripplanningPackage.isInited) return this.eINSTANCE;
    // Obtain or create and register package
    const theTripplanningPackage = new TripplanningPackage();
    //this is necessary specifically for EcorePackage generation, which needs to refer to itself
    this.eINSTANCE = theTripplanningPackage;
    TripplanningPackage.isInited = true;

    // Create package meta-data objects
    theTripplanningPackage.createPackageContents();

    // Initialize created meta-data
    theTripplanningPackage.initializePackageContents();
    return theTripplanningPackage;
  }

  //this used to be direct lazy retrieval of the
  //factory instance from the corresponding .ts factory file, but
  //that was eliminated to avoid circular imports
  public override getEFactoryInstance(): EFactory {
    return this._eFactoryInstance;
  }

  /**
   * This will be invoked by the Factory when it is initialized, any invocations
   * afterwards will have no effect.
   */
  public override setEFactoryInstance(factoryInst: EFactory): void {
    if (!this._eFactoryInstance) this._eFactoryInstance = factoryInst;
  }

  public getTripWaypoint(): EClass {
    return this.tripWaypointEClass;
  }
  public getTripWaypoint_City(): EAttribute {
    return <EAttribute>this.tripWaypointEClass.getEStructuralFeatures().get(0);
  }
  public getTripWaypoint_Nights(): EAttribute {
    return <EAttribute>this.tripWaypointEClass.getEStructuralFeatures().get(1);
  }
  public getTripWaypoint_Trip(): EReference {
    return <EReference>this.tripWaypointEClass.getEStructuralFeatures().get(2);
  }
  public getTrip(): EClass {
    return this.tripEClass;
  }
  public getTrip_Waypoints(): EReference {
    return <EReference>this.tripEClass.getEStructuralFeatures().get(0);
  }
  public getTrip_Description(): EAttribute {
    return <EAttribute>this.tripEClass.getEStructuralFeatures().get(1);
  }
  public getTrip_StartDate(): EAttribute {
    return <EAttribute>this.tripEClass.getEStructuralFeatures().get(2);
  }

  public createPackageContents(): void {
    if (this.isCreated) return;
    this.isCreated = true;
    this.tripWaypointEClass = this.createEClass(TripplanningPackage.TRIP_WAYPOINT);
    this.createEAttribute(
      this.tripWaypointEClass,
      TripplanningPackage.TRIP_WAYPOINT__CITY
    );
    this.createEAttribute(
      this.tripWaypointEClass,
      TripplanningPackage.TRIP_WAYPOINT__NIGHTS
    );
    this.createEReference(
      this.tripWaypointEClass,
      TripplanningPackage.TRIP_WAYPOINT__TRIP
    );
    this.tripEClass = this.createEClass(TripplanningPackage.TRIP);
    this.createEReference(
      this.tripEClass,
      TripplanningPackage.TRIP__WAYPOINTS
    );
    this.createEAttribute(
      this.tripEClass,
      TripplanningPackage.TRIP__DESCRIPTION
    );
    this.createEAttribute(
      this.tripEClass,
      TripplanningPackage.TRIP__START_DATE
    );
  }

  public initializePackageContents(): void {
    if (this.isInitialized) return;
    this.isInitialized = true;

    //reusable handle for eoperations, used for adding parameters
    let op: EOperation;
    this.initEClass(
      this.tripWaypointEClass,
      'TripWaypoint',
      false,
      false,
      true
    );
    this.initEAttribute(
      this.getTripWaypoint_City(),
      this.getEcorePackage().getEString(),
      'city',
      '',
      0,
      1,
      '',
      false,
      false,
      true,
      true,
      false,
      false,
      false,
      false
    );
    this.initEAttribute(
      this.getTripWaypoint_Nights(),
      this.getEcorePackage().getEInt(),
      'nights',
      '',
      0,
      1,
      '',
      false,
      false,
      true,
      true,
      false,
      false,
      false,
      false
    );
    this.initEReference(
      this.getTripWaypoint_Trip(),
      this.getTrip(),
      this.getTrip_Waypoints(),
      'trip',
      '',
      0,
      1,
      '',
      false,
      false,
      true,
      false,
      false,
      true,
      false,
      false,
      false
    );
    this.initEClass(
      this.tripEClass,
      'Trip',
      false,
      false,
      true
    );
    this.initEReference(
      this.getTrip_Waypoints(),
      this.getTripWaypoint(),
      this.getTripWaypoint_Trip(),
      'waypoints',
      '',
      0,
      -1,
      '',
      false,
      false,
      true,
      false,
      false,
      true,
      false,
      false,
      false
    );
    this.initEAttribute(
      this.getTrip_Description(),
      this.getEcorePackage().getEString(),
      'description',
      '',
      0,
      1,
      '',
      false,
      false,
      true,
      true,
      false,
      false,
      false,
      false
    );
    this.initEAttribute(
      this.getTrip_StartDate(),
      this.getEcorePackage().getEDate(),
      'startDate',
      '',
      0,
      1,
      '',
      false,
      false,
      true,
      true,
      false,
      false,
      false,
      false
    );
  }
}
