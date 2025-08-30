import { EObject } from '@tripsnek/tmf';
import { TUtils } from '@tripsnek/tmf';
import { EStructuralFeature } from '@tripsnek/tmf';
import { BasicEList } from '@tripsnek/tmf';
import { EClass } from '@tripsnek/tmf';
import { EList } from '@tripsnek/tmf';
import { EEnum } from '@tripsnek/tmf';
import { EDataType } from '@tripsnek/tmf';
import { EObjectImpl } from '@tripsnek/tmf';

import { TripplanningPackageInitializer } from './tripplanning-package-initializer.js';
import { EPackage } from '@tripsnek/tmf';
import { EPackageImpl } from '@tripsnek/tmf';
import { EAttribute } from '@tripsnek/tmf';
import { EFactory } from '@tripsnek/tmf';
import { EReference } from '@tripsnek/tmf';
import { EOperation } from '@tripsnek/tmf';
import { EcorePackage } from '@tripsnek/tmf';
import { LocationType } from './api/location-type.js';
import { PersonalInterest } from './api/personal-interest.js';
export class TripplanningPackage extends EPackageImpl {
  public static I_DED_ENTITY = 0;
  public static I_DED_ENTITY_FEATURE_COUNT = 1;
  public static I_DED_ENTITY__ID = 0;
  public static LOCATION = 1;
  public static LOCATION_FEATURE_COUNT = 6;
  public static LOCATION__NAME = 1;
  public static LOCATION__ADDRESS = 2;
  public static LOCATION__TYPE = 3;
  public static LOCATION__LATITUDE = 4;
  public static LOCATION__LONGITUDE = 5;
  public static TRAVELER = 2;
  public static TRAVELER_FEATURE_COUNT = 4;
  public static TRAVELER__NAME = 1;
  public static TRAVELER__EMAIL = 2;
  public static TRAVELER__INTERESTS = 3;
  public static TRIP_SEGMENT = 3;
  public static TRIP_SEGMENT_FEATURE_COUNT = 5;
  public static TRIP_SEGMENT__DESTINATION_NIGHTS = 0;
  public static TRIP_SEGMENT__TRIP = 1;
  public static TRIP_SEGMENT__ORIGIN = 2;
  public static TRIP_SEGMENT__DESTINATION = 3;
  public static TRIP_SEGMENT__NAME = 4;
  public static TRIP = 4;
  public static TRIP_FEATURE_COUNT = 9;
  public static TRIP__SEGMENTS = 1;
  public static TRIP__NAME = 2;
  public static TRIP__START_DATE = 3;
  public static TRIP__END_DATE = 4;
  public static TRIP__PARTICIPANTS = 5;
  public static TRIP__DESCRIPTION = 6;
  public static TRIP__BUDGET_DOLLARS = 7;
  public static TRIP__TENTATIVE = 8;
  public static LOCATION_TYPE = 5;
  public static PERSONAL_INTEREST = 6;

  /** Singleton */
  public static _eINSTANCE: TripplanningPackage = TripplanningPackage.init();

  //if the singleton is initialized
  private static isInited = false;

  static eNS_URI = 'http://example.org/tripplanning';
  static eNAME = 'tripplanning';
  static eNS_PREFIX = 'tripplanning';

  /** Provides static access to EClass and EStructuralFeature instances */
  public static Literals = class {
    static I_DED_ENTITY: EClass =
      TripplanningPackage._eINSTANCE.getIDedEntity();
    static I_DED_ENTITY__ID: EAttribute =
      TripplanningPackage._eINSTANCE.getIDedEntity_Id();
    static LOCATION: EClass = TripplanningPackage._eINSTANCE.getLocation();
    static LOCATION__NAME: EAttribute =
      TripplanningPackage._eINSTANCE.getLocation_Name();
    static LOCATION__ADDRESS: EAttribute =
      TripplanningPackage._eINSTANCE.getLocation_Address();
    static LOCATION__TYPE: EAttribute =
      TripplanningPackage._eINSTANCE.getLocation_Type();
    static LOCATION__LATITUDE: EAttribute =
      TripplanningPackage._eINSTANCE.getLocation_Latitude();
    static LOCATION__LONGITUDE: EAttribute =
      TripplanningPackage._eINSTANCE.getLocation_Longitude();
    static TRAVELER: EClass = TripplanningPackage._eINSTANCE.getTraveler();
    static TRAVELER__NAME: EAttribute =
      TripplanningPackage._eINSTANCE.getTraveler_Name();
    static TRAVELER__EMAIL: EAttribute =
      TripplanningPackage._eINSTANCE.getTraveler_Email();
    static TRAVELER__INTERESTS: EAttribute =
      TripplanningPackage._eINSTANCE.getTraveler_Interests();
    static TRIP_SEGMENT: EClass =
      TripplanningPackage._eINSTANCE.getTripSegment();
    static TRIP_SEGMENT__DESTINATION_NIGHTS: EAttribute =
      TripplanningPackage._eINSTANCE.getTripSegment_DestinationNights();
    static TRIP_SEGMENT__TRIP: EReference =
      TripplanningPackage._eINSTANCE.getTripSegment_Trip();
    static TRIP_SEGMENT__ORIGIN: EReference =
      TripplanningPackage._eINSTANCE.getTripSegment_Origin();
    static TRIP_SEGMENT__DESTINATION: EReference =
      TripplanningPackage._eINSTANCE.getTripSegment_Destination();
    static TRIP_SEGMENT__NAME: EAttribute =
      TripplanningPackage._eINSTANCE.getTripSegment_Name();
    static TRIP: EClass = TripplanningPackage._eINSTANCE.getTrip();
    static TRIP__SEGMENTS: EReference =
      TripplanningPackage._eINSTANCE.getTrip_Segments();
    static TRIP__NAME: EAttribute =
      TripplanningPackage._eINSTANCE.getTrip_Name();
    static TRIP__START_DATE: EAttribute =
      TripplanningPackage._eINSTANCE.getTrip_StartDate();
    static TRIP__END_DATE: EAttribute =
      TripplanningPackage._eINSTANCE.getTrip_EndDate();
    static TRIP__PARTICIPANTS: EReference =
      TripplanningPackage._eINSTANCE.getTrip_Participants();
    static TRIP__DESCRIPTION: EAttribute =
      TripplanningPackage._eINSTANCE.getTrip_Description();
    static TRIP__BUDGET_DOLLARS: EAttribute =
      TripplanningPackage._eINSTANCE.getTrip_BudgetDollars();
    static TRIP__TENTATIVE: EAttribute =
      TripplanningPackage._eINSTANCE.getTrip_Tentative();
    static LOCATION_TYPE: EEnum =
      TripplanningPackage._eINSTANCE.getLocationType();
    static PERSONAL_INTEREST: EEnum =
      TripplanningPackage._eINSTANCE.getPersonalInterest();
  };

  //flags that keep track of whether package is initialized
  private isCreated = false;
  private isInitialized = false;

  private iDedEntityEClass!: EClass;
  private locationEClass!: EClass;
  private travelerEClass!: EClass;
  private tripSegmentEClass!: EClass;
  private tripEClass!: EClass;
  private locationTypeEEnum!: EEnum;
  private personalInterestEEnum!: EEnum;

  //causes EPackage.Registry registration event
  //hard-coded URI, since referring to the static eNS_URI field in constructor can cause issues
  constructor() {
    super('tripplanning', 'http://example.org/tripplanning', 'tripplanning');
  }

  /**
   * Invoked once. Initializes the Singleton.
   *
   * NOTE: Lots of differences here with the EMF version, which interacts with the package Registry,
   * other packages from the same model to register interdependencies, and freezes the package meta-data.
   */
  private static init(): TripplanningPackage {
    if (TripplanningPackage.isInited) return this._eINSTANCE;
    // Obtain or create and register package
    const theTripplanningPackage = new TripplanningPackage();
    //this is necessary specifically for EcorePackage generation, which needs to refer to itself
    this._eINSTANCE = theTripplanningPackage;
    TripplanningPackage.isInited = true;

    // Create package meta-data objects
    theTripplanningPackage.createPackageContents();

    // Initialize created meta-data
    // theTripplanningPackage.initializePackageContents();
    return this._eINSTANCE;
  }

  static get eINSTANCE(): TripplanningPackage {
    TripplanningPackageInitializer.registerAll();
    return this._eINSTANCE;
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

  public getIDedEntity(): EClass {
    return this.iDedEntityEClass;
  }
  public getIDedEntity_Id(): EAttribute {
    return <EAttribute>this.iDedEntityEClass.getEStructuralFeatures().get(0);
  }
  public getLocation(): EClass {
    return this.locationEClass;
  }
  public getLocation_Name(): EAttribute {
    return <EAttribute>this.locationEClass.getEStructuralFeatures().get(0);
  }
  public getLocation_Address(): EAttribute {
    return <EAttribute>this.locationEClass.getEStructuralFeatures().get(1);
  }
  public getLocation_Type(): EAttribute {
    return <EAttribute>this.locationEClass.getEStructuralFeatures().get(2);
  }
  public getLocation_Latitude(): EAttribute {
    return <EAttribute>this.locationEClass.getEStructuralFeatures().get(3);
  }
  public getLocation_Longitude(): EAttribute {
    return <EAttribute>this.locationEClass.getEStructuralFeatures().get(4);
  }
  public getTraveler(): EClass {
    return this.travelerEClass;
  }
  public getTraveler_Name(): EAttribute {
    return <EAttribute>this.travelerEClass.getEStructuralFeatures().get(0);
  }
  public getTraveler_Email(): EAttribute {
    return <EAttribute>this.travelerEClass.getEStructuralFeatures().get(1);
  }
  public getTraveler_Interests(): EAttribute {
    return <EAttribute>this.travelerEClass.getEStructuralFeatures().get(2);
  }
  public getTripSegment(): EClass {
    return this.tripSegmentEClass;
  }
  public getTripSegment_DestinationNights(): EAttribute {
    return <EAttribute>this.tripSegmentEClass.getEStructuralFeatures().get(0);
  }
  public getTripSegment_Trip(): EReference {
    return <EReference>this.tripSegmentEClass.getEStructuralFeatures().get(1);
  }
  public getTripSegment_Origin(): EReference {
    return <EReference>this.tripSegmentEClass.getEStructuralFeatures().get(2);
  }
  public getTripSegment_Destination(): EReference {
    return <EReference>this.tripSegmentEClass.getEStructuralFeatures().get(3);
  }
  public getTripSegment_Name(): EAttribute {
    return <EAttribute>this.tripSegmentEClass.getEStructuralFeatures().get(4);
  }
  public getTrip(): EClass {
    return this.tripEClass;
  }
  public getTrip_Segments(): EReference {
    return <EReference>this.tripEClass.getEStructuralFeatures().get(0);
  }
  public getTrip_Name(): EAttribute {
    return <EAttribute>this.tripEClass.getEStructuralFeatures().get(1);
  }
  public getTrip_StartDate(): EAttribute {
    return <EAttribute>this.tripEClass.getEStructuralFeatures().get(2);
  }
  public getTrip_EndDate(): EAttribute {
    return <EAttribute>this.tripEClass.getEStructuralFeatures().get(3);
  }
  public getTrip_Participants(): EReference {
    return <EReference>this.tripEClass.getEStructuralFeatures().get(4);
  }
  public getTrip_Description(): EAttribute {
    return <EAttribute>this.tripEClass.getEStructuralFeatures().get(5);
  }
  public getTrip_BudgetDollars(): EAttribute {
    return <EAttribute>this.tripEClass.getEStructuralFeatures().get(6);
  }
  public getTrip_Tentative(): EAttribute {
    return <EAttribute>this.tripEClass.getEStructuralFeatures().get(7);
  }
  public getLocationType(): EEnum {
    return this.locationTypeEEnum;
  }
  public getPersonalInterest(): EEnum {
    return this.personalInterestEEnum;
  }

  public createPackageContents(): void {
    if (this.isCreated) return;
    this.isCreated = true;
    this.iDedEntityEClass = this.createEClass(TripplanningPackage.I_DED_ENTITY);
    this.createEAttribute(
      this.iDedEntityEClass,
      TripplanningPackage.I_DED_ENTITY__ID
    );
    this.locationEClass = this.createEClass(TripplanningPackage.LOCATION);
    this.createEAttribute(
      this.locationEClass,
      TripplanningPackage.LOCATION__NAME
    );
    this.createEAttribute(
      this.locationEClass,
      TripplanningPackage.LOCATION__ADDRESS
    );
    this.createEAttribute(
      this.locationEClass,
      TripplanningPackage.LOCATION__TYPE
    );
    this.createEAttribute(
      this.locationEClass,
      TripplanningPackage.LOCATION__LATITUDE
    );
    this.createEAttribute(
      this.locationEClass,
      TripplanningPackage.LOCATION__LONGITUDE
    );
    this.travelerEClass = this.createEClass(TripplanningPackage.TRAVELER);
    this.createEAttribute(
      this.travelerEClass,
      TripplanningPackage.TRAVELER__NAME
    );
    this.createEAttribute(
      this.travelerEClass,
      TripplanningPackage.TRAVELER__EMAIL
    );
    this.createEAttribute(
      this.travelerEClass,
      TripplanningPackage.TRAVELER__INTERESTS
    );
    this.tripSegmentEClass = this.createEClass(
      TripplanningPackage.TRIP_SEGMENT
    );
    this.createEAttribute(
      this.tripSegmentEClass,
      TripplanningPackage.TRIP_SEGMENT__DESTINATION_NIGHTS
    );
    this.createEReference(
      this.tripSegmentEClass,
      TripplanningPackage.TRIP_SEGMENT__TRIP
    );
    this.createEReference(
      this.tripSegmentEClass,
      TripplanningPackage.TRIP_SEGMENT__ORIGIN
    );
    this.createEReference(
      this.tripSegmentEClass,
      TripplanningPackage.TRIP_SEGMENT__DESTINATION
    );
    this.createEAttribute(
      this.tripSegmentEClass,
      TripplanningPackage.TRIP_SEGMENT__NAME
    );
    this.tripEClass = this.createEClass(TripplanningPackage.TRIP);
    this.createEReference(this.tripEClass, TripplanningPackage.TRIP__SEGMENTS);
    this.createEAttribute(this.tripEClass, TripplanningPackage.TRIP__NAME);
    this.createEAttribute(
      this.tripEClass,
      TripplanningPackage.TRIP__START_DATE
    );
    this.createEAttribute(this.tripEClass, TripplanningPackage.TRIP__END_DATE);
    this.createEReference(
      this.tripEClass,
      TripplanningPackage.TRIP__PARTICIPANTS
    );
    this.createEAttribute(
      this.tripEClass,
      TripplanningPackage.TRIP__DESCRIPTION
    );
    this.createEAttribute(
      this.tripEClass,
      TripplanningPackage.TRIP__BUDGET_DOLLARS
    );
    this.createEAttribute(this.tripEClass, TripplanningPackage.TRIP__TENTATIVE);
    this.locationTypeEEnum = this.createEEnum(
      TripplanningPackage.LOCATION_TYPE
    );
    this.personalInterestEEnum = this.createEEnum(
      TripplanningPackage.PERSONAL_INTEREST
    );
  }

  public initializePackageContents(): void {
    if (this.isInitialized) return;
    this.isInitialized = true;

    //reusable handle for eoperations, used for adding parameters
    let op: EOperation;
    this.initEClass(this.iDedEntityEClass, 'IDedEntity', true, false, true);
    this.initEAttribute(
      this.getIDedEntity_Id(),
      this.getEcorePackage().getEString(),
      'id',
      '',
      0,
      1,
      '',
      false,
      false,
      true,
      true, //TODO: isUnsettable,
      true,
      false, //TODO: isUnique
      false, //TODO: isDerived
      false //TODO: isOrdered;
    );
    this.locationEClass.getESuperTypes().add(this.getIDedEntity());
    this.initEClass(this.locationEClass, 'Location', false, false, true);
    this.initEAttribute(
      this.getLocation_Name(),
      this.getEcorePackage().getEString(),
      'name',
      '',
      0,
      1,
      '',
      false,
      false,
      true,
      true, //TODO: isUnsettable,
      false,
      false, //TODO: isUnique
      false, //TODO: isDerived
      false //TODO: isOrdered;
    );
    this.initEAttribute(
      this.getLocation_Address(),
      this.getEcorePackage().getEString(),
      'address',
      '',
      0,
      1,
      '',
      false,
      false,
      true,
      true, //TODO: isUnsettable,
      false,
      false, //TODO: isUnique
      false, //TODO: isDerived
      false //TODO: isOrdered;
    );
    this.initEAttribute(
      this.getLocation_Type(),
      this.getLocationType(),
      'type',
      '',
      0,
      1,
      '',
      false,
      false,
      true,
      true, //TODO: isUnsettable,
      false,
      false, //TODO: isUnique
      false, //TODO: isDerived
      false //TODO: isOrdered;
    );
    this.initEAttribute(
      this.getLocation_Latitude(),
      this.getEcorePackage().getEDouble(),
      'latitude',
      '',
      0,
      1,
      '',
      false,
      false,
      true,
      true, //TODO: isUnsettable,
      false,
      false, //TODO: isUnique
      false, //TODO: isDerived
      false //TODO: isOrdered;
    );
    this.initEAttribute(
      this.getLocation_Longitude(),
      this.getEcorePackage().getEDouble(),
      'longitude',
      '',
      0,
      1,
      '',
      false,
      false,
      true,
      true, //TODO: isUnsettable,
      false,
      false, //TODO: isUnique
      false, //TODO: isDerived
      false //TODO: isOrdered;
    );
    this.travelerEClass.getESuperTypes().add(this.getIDedEntity());
    this.initEClass(this.travelerEClass, 'Traveler', false, false, true);
    this.initEAttribute(
      this.getTraveler_Name(),
      this.getEcorePackage().getEString(),
      'name',
      '',
      0,
      1,
      '',
      false,
      false,
      true,
      true, //TODO: isUnsettable,
      false,
      false, //TODO: isUnique
      false, //TODO: isDerived
      false //TODO: isOrdered;
    );
    this.initEAttribute(
      this.getTraveler_Email(),
      this.getEcorePackage().getEString(),
      'email',
      '',
      0,
      1,
      '',
      false,
      false,
      true,
      true, //TODO: isUnsettable,
      false,
      false, //TODO: isUnique
      false, //TODO: isDerived
      false //TODO: isOrdered;
    );
    this.initEAttribute(
      this.getTraveler_Interests(),
      this.getPersonalInterest(),
      'interests',
      '',
      0,
      -1,
      '',
      false,
      false,
      true,
      true, //TODO: isUnsettable,
      false,
      false, //TODO: isUnique
      false, //TODO: isDerived
      false //TODO: isOrdered;
    );
    this.initEClass(this.tripSegmentEClass, 'TripSegment', false, false, true);
    this.initEAttribute(
      this.getTripSegment_DestinationNights(),
      this.getEcorePackage().getEInt(),
      'destinationNights',
      '',
      0,
      1,
      '',
      false,
      false,
      true,
      true, //TODO: isUnsettable,
      false,
      false, //TODO: isUnique
      false, //TODO: isDerived
      false //TODO: isOrdered;
    );
    this.initEReference(
      this.getTripSegment_Trip(),
      this.getTrip(),
      this.getTrip_Segments(),
      'trip',
      '',
      0,
      1,
      '', //TODO: Container Class
      false,
      false,
      true,
      false,
      false,
      true, //TODO: isUnsettable
      false, //TODO: isUnique
      false, //TODO: isDerived
      false //TODO: isOrdered
    );
    this.initEReference(
      this.getTripSegment_Origin(),
      this.getLocation(),
      undefined,
      'origin',
      '',
      0,
      1,
      '', //TODO: Container Class
      false,
      false,
      true,
      false,
      false,
      true, //TODO: isUnsettable
      false, //TODO: isUnique
      false, //TODO: isDerived
      false //TODO: isOrdered
    );
    this.initEReference(
      this.getTripSegment_Destination(),
      this.getLocation(),
      undefined,
      'destination',
      '',
      0,
      1,
      '', //TODO: Container Class
      false,
      false,
      true,
      false,
      false,
      true, //TODO: isUnsettable
      false, //TODO: isUnique
      false, //TODO: isDerived
      false //TODO: isOrdered
    );
    this.initEAttribute(
      this.getTripSegment_Name(),
      this.getEcorePackage().getEString(),
      'name',
      '',
      0,
      1,
      '',
      false,
      false,
      true,
      true, //TODO: isUnsettable,
      false,
      false, //TODO: isUnique
      false, //TODO: isDerived
      false //TODO: isOrdered;
    );
    this.tripEClass.getESuperTypes().add(this.getIDedEntity());
    this.initEClass(this.tripEClass, 'Trip', false, false, true);
    this.initEReference(
      this.getTrip_Segments(),
      this.getTripSegment(),
      this.getTripSegment_Trip(),
      'segments',
      '',
      0,
      -1,
      '', //TODO: Container Class
      false,
      false,
      true,
      true,
      false,
      true, //TODO: isUnsettable
      false, //TODO: isUnique
      false, //TODO: isDerived
      false //TODO: isOrdered
    );
    this.initEAttribute(
      this.getTrip_Name(),
      this.getEcorePackage().getEString(),
      'name',
      '',
      0,
      1,
      '',
      false,
      false,
      true,
      true, //TODO: isUnsettable,
      false,
      false, //TODO: isUnique
      false, //TODO: isDerived
      false //TODO: isOrdered;
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
      true, //TODO: isUnsettable,
      false,
      false, //TODO: isUnique
      false, //TODO: isDerived
      false //TODO: isOrdered;
    );
    this.initEAttribute(
      this.getTrip_EndDate(),
      this.getEcorePackage().getEDate(),
      'endDate',
      '',
      0,
      1,
      '',
      false,
      false,
      true,
      true, //TODO: isUnsettable,
      false,
      false, //TODO: isUnique
      false, //TODO: isDerived
      false //TODO: isOrdered;
    );
    this.initEReference(
      this.getTrip_Participants(),
      this.getTraveler(),
      undefined,
      'participants',
      '',
      0,
      -1,
      '', //TODO: Container Class
      false,
      false,
      true,
      false,
      false,
      true, //TODO: isUnsettable
      false, //TODO: isUnique
      false, //TODO: isDerived
      false //TODO: isOrdered
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
      true, //TODO: isUnsettable,
      false,
      false, //TODO: isUnique
      false, //TODO: isDerived
      false //TODO: isOrdered;
    );
    this.initEAttribute(
      this.getTrip_BudgetDollars(),
      this.getEcorePackage().getEDouble(),
      'budgetDollars',
      '',
      0,
      1,
      '',
      false,
      false,
      true,
      true, //TODO: isUnsettable,
      false,
      false, //TODO: isUnique
      false, //TODO: isDerived
      false //TODO: isOrdered;
    );
    this.initEAttribute(
      this.getTrip_Tentative(),
      this.getEcorePackage().getEBoolean(),
      'tentative',
      '',
      0,
      1,
      '',
      false,
      false,
      true,
      true, //TODO: isUnsettable,
      false,
      false, //TODO: isUnique
      false, //TODO: isDerived
      false //TODO: isOrdered;
    );
    this.initEEnum(this.locationTypeEEnum, 'LocationType');
    this.addEEnumLiteral(this.locationTypeEEnum, 'City', 0);
    this.addEEnumLiteral(this.locationTypeEEnum, 'Attraction', 1);
    this.addEEnumLiteral(this.locationTypeEEnum, 'Hotel', 2);
    this.addEEnumLiteral(this.locationTypeEEnum, 'Restaurant', 3);
    this.initEEnum(this.personalInterestEEnum, 'PersonalInterest');
    this.addEEnumLiteral(this.personalInterestEEnum, 'NaturalBeauty', 0);
    this.addEEnumLiteral(this.personalInterestEEnum, 'MajorCities', 1);
    this.addEEnumLiteral(this.personalInterestEEnum, 'Cuisine', 2);
    this.addEEnumLiteral(this.personalInterestEEnum, 'Wine', 3);
    this.addEEnumLiteral(this.personalInterestEEnum, 'Ocean', 4);
    this.addEEnumLiteral(this.personalInterestEEnum, 'Nightlife', 5);
    this.addEEnumLiteral(this.personalInterestEEnum, 'Museums', 6);
  }
}
