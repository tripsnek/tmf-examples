/**
 */
package tripplanning;

import org.eclipse.emf.ecore.EAttribute;
import org.eclipse.emf.ecore.EClass;
import org.eclipse.emf.ecore.EEnum;
import org.eclipse.emf.ecore.EPackage;
import org.eclipse.emf.ecore.EReference;

/**
 * <!-- begin-user-doc -->
 * The <b>Package</b> for the model.
 * It contains accessors for the meta objects to represent
 * <ul>
 *   <li>each class,</li>
 *   <li>each feature of each class,</li>
 *   <li>each operation of each class,</li>
 *   <li>each enum,</li>
 *   <li>and each data type</li>
 * </ul>
 * <!-- end-user-doc -->
 * @see tripplanning.TripplanningFactory
 * @model kind="package"
 * @generated
 */
public interface TripplanningPackage extends EPackage {
	/**
	 * The package name.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	String eNAME = "tripplanning";

	/**
	 * The package namespace URI.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	String eNS_URI = "http://example.org/tripplanning";

	/**
	 * The package namespace name.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	String eNS_PREFIX = "tripplanning";

	/**
	 * The singleton instance of the package.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	TripplanningPackage eINSTANCE = tripplanning.impl.TripplanningPackageImpl.init();

	/**
	 * The meta object id for the '{@link tripplanning.impl.IDedEntityImpl <em>IDed Entity</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see tripplanning.impl.IDedEntityImpl
	 * @see tripplanning.impl.TripplanningPackageImpl#getIDedEntity()
	 * @generated
	 */
	int IDED_ENTITY = 3;

	/**
	 * The feature id for the '<em><b>Id</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int IDED_ENTITY__ID = 0;

	/**
	 * The number of structural features of the '<em>IDed Entity</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int IDED_ENTITY_FEATURE_COUNT = 1;

	/**
	 * The number of operations of the '<em>IDed Entity</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int IDED_ENTITY_OPERATION_COUNT = 0;

	/**
	 * The meta object id for the '{@link tripplanning.impl.TripImpl <em>Trip</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see tripplanning.impl.TripImpl
	 * @see tripplanning.impl.TripplanningPackageImpl#getTrip()
	 * @generated
	 */
	int TRIP = 0;

	/**
	 * The feature id for the '<em><b>Id</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TRIP__ID = IDED_ENTITY__ID;

	/**
	 * The feature id for the '<em><b>Segments</b></em>' containment reference list.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TRIP__SEGMENTS = IDED_ENTITY_FEATURE_COUNT + 0;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TRIP__NAME = IDED_ENTITY_FEATURE_COUNT + 1;

	/**
	 * The feature id for the '<em><b>Start Date</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TRIP__START_DATE = IDED_ENTITY_FEATURE_COUNT + 2;

	/**
	 * The feature id for the '<em><b>End Date</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TRIP__END_DATE = IDED_ENTITY_FEATURE_COUNT + 3;

	/**
	 * The feature id for the '<em><b>Participants</b></em>' reference list.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TRIP__PARTICIPANTS = IDED_ENTITY_FEATURE_COUNT + 4;

	/**
	 * The feature id for the '<em><b>Description</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TRIP__DESCRIPTION = IDED_ENTITY_FEATURE_COUNT + 5;

	/**
	 * The feature id for the '<em><b>Budget Dollars</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TRIP__BUDGET_DOLLARS = IDED_ENTITY_FEATURE_COUNT + 6;

	/**
	 * The feature id for the '<em><b>Tentative</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TRIP__TENTATIVE = IDED_ENTITY_FEATURE_COUNT + 7;

	/**
	 * The number of structural features of the '<em>Trip</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TRIP_FEATURE_COUNT = IDED_ENTITY_FEATURE_COUNT + 8;

	/**
	 * The number of operations of the '<em>Trip</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TRIP_OPERATION_COUNT = IDED_ENTITY_OPERATION_COUNT + 0;

	/**
	 * The meta object id for the '{@link tripplanning.impl.TripSegmentImpl <em>Trip Segment</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see tripplanning.impl.TripSegmentImpl
	 * @see tripplanning.impl.TripplanningPackageImpl#getTripSegment()
	 * @generated
	 */
	int TRIP_SEGMENT = 1;

	/**
	 * The feature id for the '<em><b>Destination Nights</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TRIP_SEGMENT__DESTINATION_NIGHTS = 0;

	/**
	 * The feature id for the '<em><b>Trip</b></em>' container reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TRIP_SEGMENT__TRIP = 1;

	/**
	 * The feature id for the '<em><b>Origin</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TRIP_SEGMENT__ORIGIN = 2;

	/**
	 * The feature id for the '<em><b>Destination</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TRIP_SEGMENT__DESTINATION = 3;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TRIP_SEGMENT__NAME = 4;

	/**
	 * The number of structural features of the '<em>Trip Segment</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TRIP_SEGMENT_FEATURE_COUNT = 5;

	/**
	 * The number of operations of the '<em>Trip Segment</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TRIP_SEGMENT_OPERATION_COUNT = 0;

	/**
	 * The meta object id for the '{@link tripplanning.impl.TravelerImpl <em>Traveler</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see tripplanning.impl.TravelerImpl
	 * @see tripplanning.impl.TripplanningPackageImpl#getTraveler()
	 * @generated
	 */
	int TRAVELER = 2;

	/**
	 * The feature id for the '<em><b>Id</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TRAVELER__ID = IDED_ENTITY__ID;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TRAVELER__NAME = IDED_ENTITY_FEATURE_COUNT + 0;

	/**
	 * The feature id for the '<em><b>Email</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TRAVELER__EMAIL = IDED_ENTITY_FEATURE_COUNT + 1;

	/**
	 * The feature id for the '<em><b>Interests</b></em>' attribute list.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TRAVELER__INTERESTS = IDED_ENTITY_FEATURE_COUNT + 2;

	/**
	 * The number of structural features of the '<em>Traveler</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TRAVELER_FEATURE_COUNT = IDED_ENTITY_FEATURE_COUNT + 3;

	/**
	 * The number of operations of the '<em>Traveler</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TRAVELER_OPERATION_COUNT = IDED_ENTITY_OPERATION_COUNT + 0;

	/**
	 * The meta object id for the '{@link tripplanning.impl.LocationImpl <em>Location</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see tripplanning.impl.LocationImpl
	 * @see tripplanning.impl.TripplanningPackageImpl#getLocation()
	 * @generated
	 */
	int LOCATION = 4;

	/**
	 * The feature id for the '<em><b>Id</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LOCATION__ID = IDED_ENTITY__ID;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LOCATION__NAME = IDED_ENTITY_FEATURE_COUNT + 0;

	/**
	 * The feature id for the '<em><b>Address</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LOCATION__ADDRESS = IDED_ENTITY_FEATURE_COUNT + 1;

	/**
	 * The feature id for the '<em><b>Type</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LOCATION__TYPE = IDED_ENTITY_FEATURE_COUNT + 2;

	/**
	 * The feature id for the '<em><b>Latitude</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LOCATION__LATITUDE = IDED_ENTITY_FEATURE_COUNT + 3;

	/**
	 * The feature id for the '<em><b>Longitude</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LOCATION__LONGITUDE = IDED_ENTITY_FEATURE_COUNT + 4;

	/**
	 * The number of structural features of the '<em>Location</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LOCATION_FEATURE_COUNT = IDED_ENTITY_FEATURE_COUNT + 5;

	/**
	 * The number of operations of the '<em>Location</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LOCATION_OPERATION_COUNT = IDED_ENTITY_OPERATION_COUNT + 0;

	/**
	 * The meta object id for the '{@link tripplanning.LocationType <em>Location Type</em>}' enum.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see tripplanning.LocationType
	 * @see tripplanning.impl.TripplanningPackageImpl#getLocationType()
	 * @generated
	 */
	int LOCATION_TYPE = 5;

	/**
	 * The meta object id for the '{@link tripplanning.PersonalInterest <em>Personal Interest</em>}' enum.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see tripplanning.PersonalInterest
	 * @see tripplanning.impl.TripplanningPackageImpl#getPersonalInterest()
	 * @generated
	 */
	int PERSONAL_INTEREST = 6;


	/**
	 * Returns the meta object for class '{@link tripplanning.Trip <em>Trip</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Trip</em>'.
	 * @see tripplanning.Trip
	 * @generated
	 */
	EClass getTrip();

	/**
	 * Returns the meta object for the containment reference list '{@link tripplanning.Trip#getSegments <em>Segments</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the containment reference list '<em>Segments</em>'.
	 * @see tripplanning.Trip#getSegments()
	 * @see #getTrip()
	 * @generated
	 */
	EReference getTrip_Segments();

	/**
	 * Returns the meta object for the attribute '{@link tripplanning.Trip#getName <em>Name</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Name</em>'.
	 * @see tripplanning.Trip#getName()
	 * @see #getTrip()
	 * @generated
	 */
	EAttribute getTrip_Name();

	/**
	 * Returns the meta object for the attribute '{@link tripplanning.Trip#getStartDate <em>Start Date</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Start Date</em>'.
	 * @see tripplanning.Trip#getStartDate()
	 * @see #getTrip()
	 * @generated
	 */
	EAttribute getTrip_StartDate();

	/**
	 * Returns the meta object for the attribute '{@link tripplanning.Trip#getEndDate <em>End Date</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>End Date</em>'.
	 * @see tripplanning.Trip#getEndDate()
	 * @see #getTrip()
	 * @generated
	 */
	EAttribute getTrip_EndDate();

	/**
	 * Returns the meta object for the reference list '{@link tripplanning.Trip#getParticipants <em>Participants</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the reference list '<em>Participants</em>'.
	 * @see tripplanning.Trip#getParticipants()
	 * @see #getTrip()
	 * @generated
	 */
	EReference getTrip_Participants();

	/**
	 * Returns the meta object for the attribute '{@link tripplanning.Trip#getDescription <em>Description</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Description</em>'.
	 * @see tripplanning.Trip#getDescription()
	 * @see #getTrip()
	 * @generated
	 */
	EAttribute getTrip_Description();

	/**
	 * Returns the meta object for the attribute '{@link tripplanning.Trip#getBudgetDollars <em>Budget Dollars</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Budget Dollars</em>'.
	 * @see tripplanning.Trip#getBudgetDollars()
	 * @see #getTrip()
	 * @generated
	 */
	EAttribute getTrip_BudgetDollars();

	/**
	 * Returns the meta object for the attribute '{@link tripplanning.Trip#isTentative <em>Tentative</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Tentative</em>'.
	 * @see tripplanning.Trip#isTentative()
	 * @see #getTrip()
	 * @generated
	 */
	EAttribute getTrip_Tentative();

	/**
	 * Returns the meta object for class '{@link tripplanning.TripSegment <em>Trip Segment</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Trip Segment</em>'.
	 * @see tripplanning.TripSegment
	 * @generated
	 */
	EClass getTripSegment();

	/**
	 * Returns the meta object for the attribute '{@link tripplanning.TripSegment#getDestinationNights <em>Destination Nights</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Destination Nights</em>'.
	 * @see tripplanning.TripSegment#getDestinationNights()
	 * @see #getTripSegment()
	 * @generated
	 */
	EAttribute getTripSegment_DestinationNights();

	/**
	 * Returns the meta object for the container reference '{@link tripplanning.TripSegment#getTrip <em>Trip</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the container reference '<em>Trip</em>'.
	 * @see tripplanning.TripSegment#getTrip()
	 * @see #getTripSegment()
	 * @generated
	 */
	EReference getTripSegment_Trip();

	/**
	 * Returns the meta object for the reference '{@link tripplanning.TripSegment#getOrigin <em>Origin</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the reference '<em>Origin</em>'.
	 * @see tripplanning.TripSegment#getOrigin()
	 * @see #getTripSegment()
	 * @generated
	 */
	EReference getTripSegment_Origin();

	/**
	 * Returns the meta object for the reference '{@link tripplanning.TripSegment#getDestination <em>Destination</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the reference '<em>Destination</em>'.
	 * @see tripplanning.TripSegment#getDestination()
	 * @see #getTripSegment()
	 * @generated
	 */
	EReference getTripSegment_Destination();

	/**
	 * Returns the meta object for the attribute '{@link tripplanning.TripSegment#getName <em>Name</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Name</em>'.
	 * @see tripplanning.TripSegment#getName()
	 * @see #getTripSegment()
	 * @generated
	 */
	EAttribute getTripSegment_Name();

	/**
	 * Returns the meta object for class '{@link tripplanning.Traveler <em>Traveler</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Traveler</em>'.
	 * @see tripplanning.Traveler
	 * @generated
	 */
	EClass getTraveler();

	/**
	 * Returns the meta object for the attribute '{@link tripplanning.Traveler#getName <em>Name</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Name</em>'.
	 * @see tripplanning.Traveler#getName()
	 * @see #getTraveler()
	 * @generated
	 */
	EAttribute getTraveler_Name();

	/**
	 * Returns the meta object for the attribute '{@link tripplanning.Traveler#getEmail <em>Email</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Email</em>'.
	 * @see tripplanning.Traveler#getEmail()
	 * @see #getTraveler()
	 * @generated
	 */
	EAttribute getTraveler_Email();

	/**
	 * Returns the meta object for the attribute list '{@link tripplanning.Traveler#getInterests <em>Interests</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute list '<em>Interests</em>'.
	 * @see tripplanning.Traveler#getInterests()
	 * @see #getTraveler()
	 * @generated
	 */
	EAttribute getTraveler_Interests();

	/**
	 * Returns the meta object for class '{@link tripplanning.IDedEntity <em>IDed Entity</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>IDed Entity</em>'.
	 * @see tripplanning.IDedEntity
	 * @generated
	 */
	EClass getIDedEntity();

	/**
	 * Returns the meta object for the attribute '{@link tripplanning.IDedEntity#getId <em>Id</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Id</em>'.
	 * @see tripplanning.IDedEntity#getId()
	 * @see #getIDedEntity()
	 * @generated
	 */
	EAttribute getIDedEntity_Id();

	/**
	 * Returns the meta object for class '{@link tripplanning.Location <em>Location</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Location</em>'.
	 * @see tripplanning.Location
	 * @generated
	 */
	EClass getLocation();

	/**
	 * Returns the meta object for the attribute '{@link tripplanning.Location#getName <em>Name</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Name</em>'.
	 * @see tripplanning.Location#getName()
	 * @see #getLocation()
	 * @generated
	 */
	EAttribute getLocation_Name();

	/**
	 * Returns the meta object for the attribute '{@link tripplanning.Location#getAddress <em>Address</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Address</em>'.
	 * @see tripplanning.Location#getAddress()
	 * @see #getLocation()
	 * @generated
	 */
	EAttribute getLocation_Address();

	/**
	 * Returns the meta object for the attribute '{@link tripplanning.Location#getType <em>Type</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Type</em>'.
	 * @see tripplanning.Location#getType()
	 * @see #getLocation()
	 * @generated
	 */
	EAttribute getLocation_Type();

	/**
	 * Returns the meta object for the attribute '{@link tripplanning.Location#getLatitude <em>Latitude</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Latitude</em>'.
	 * @see tripplanning.Location#getLatitude()
	 * @see #getLocation()
	 * @generated
	 */
	EAttribute getLocation_Latitude();

	/**
	 * Returns the meta object for the attribute '{@link tripplanning.Location#getLongitude <em>Longitude</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Longitude</em>'.
	 * @see tripplanning.Location#getLongitude()
	 * @see #getLocation()
	 * @generated
	 */
	EAttribute getLocation_Longitude();

	/**
	 * Returns the meta object for enum '{@link tripplanning.LocationType <em>Location Type</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for enum '<em>Location Type</em>'.
	 * @see tripplanning.LocationType
	 * @generated
	 */
	EEnum getLocationType();

	/**
	 * Returns the meta object for enum '{@link tripplanning.PersonalInterest <em>Personal Interest</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for enum '<em>Personal Interest</em>'.
	 * @see tripplanning.PersonalInterest
	 * @generated
	 */
	EEnum getPersonalInterest();

	/**
	 * Returns the factory that creates the instances of the model.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the factory that creates the instances of the model.
	 * @generated
	 */
	TripplanningFactory getTripplanningFactory();

	/**
	 * <!-- begin-user-doc -->
	 * Defines literals for the meta objects that represent
	 * <ul>
	 *   <li>each class,</li>
	 *   <li>each feature of each class,</li>
	 *   <li>each operation of each class,</li>
	 *   <li>each enum,</li>
	 *   <li>and each data type</li>
	 * </ul>
	 * <!-- end-user-doc -->
	 * @generated
	 */
	interface Literals {
		/**
		 * The meta object literal for the '{@link tripplanning.impl.TripImpl <em>Trip</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see tripplanning.impl.TripImpl
		 * @see tripplanning.impl.TripplanningPackageImpl#getTrip()
		 * @generated
		 */
		EClass TRIP = eINSTANCE.getTrip();

		/**
		 * The meta object literal for the '<em><b>Segments</b></em>' containment reference list feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EReference TRIP__SEGMENTS = eINSTANCE.getTrip_Segments();

		/**
		 * The meta object literal for the '<em><b>Name</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute TRIP__NAME = eINSTANCE.getTrip_Name();

		/**
		 * The meta object literal for the '<em><b>Start Date</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute TRIP__START_DATE = eINSTANCE.getTrip_StartDate();

		/**
		 * The meta object literal for the '<em><b>End Date</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute TRIP__END_DATE = eINSTANCE.getTrip_EndDate();

		/**
		 * The meta object literal for the '<em><b>Participants</b></em>' reference list feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EReference TRIP__PARTICIPANTS = eINSTANCE.getTrip_Participants();

		/**
		 * The meta object literal for the '<em><b>Description</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute TRIP__DESCRIPTION = eINSTANCE.getTrip_Description();

		/**
		 * The meta object literal for the '<em><b>Budget Dollars</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute TRIP__BUDGET_DOLLARS = eINSTANCE.getTrip_BudgetDollars();

		/**
		 * The meta object literal for the '<em><b>Tentative</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute TRIP__TENTATIVE = eINSTANCE.getTrip_Tentative();

		/**
		 * The meta object literal for the '{@link tripplanning.impl.TripSegmentImpl <em>Trip Segment</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see tripplanning.impl.TripSegmentImpl
		 * @see tripplanning.impl.TripplanningPackageImpl#getTripSegment()
		 * @generated
		 */
		EClass TRIP_SEGMENT = eINSTANCE.getTripSegment();

		/**
		 * The meta object literal for the '<em><b>Destination Nights</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute TRIP_SEGMENT__DESTINATION_NIGHTS = eINSTANCE.getTripSegment_DestinationNights();

		/**
		 * The meta object literal for the '<em><b>Trip</b></em>' container reference feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EReference TRIP_SEGMENT__TRIP = eINSTANCE.getTripSegment_Trip();

		/**
		 * The meta object literal for the '<em><b>Origin</b></em>' reference feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EReference TRIP_SEGMENT__ORIGIN = eINSTANCE.getTripSegment_Origin();

		/**
		 * The meta object literal for the '<em><b>Destination</b></em>' reference feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EReference TRIP_SEGMENT__DESTINATION = eINSTANCE.getTripSegment_Destination();

		/**
		 * The meta object literal for the '<em><b>Name</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute TRIP_SEGMENT__NAME = eINSTANCE.getTripSegment_Name();

		/**
		 * The meta object literal for the '{@link tripplanning.impl.TravelerImpl <em>Traveler</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see tripplanning.impl.TravelerImpl
		 * @see tripplanning.impl.TripplanningPackageImpl#getTraveler()
		 * @generated
		 */
		EClass TRAVELER = eINSTANCE.getTraveler();

		/**
		 * The meta object literal for the '<em><b>Name</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute TRAVELER__NAME = eINSTANCE.getTraveler_Name();

		/**
		 * The meta object literal for the '<em><b>Email</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute TRAVELER__EMAIL = eINSTANCE.getTraveler_Email();

		/**
		 * The meta object literal for the '<em><b>Interests</b></em>' attribute list feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute TRAVELER__INTERESTS = eINSTANCE.getTraveler_Interests();

		/**
		 * The meta object literal for the '{@link tripplanning.impl.IDedEntityImpl <em>IDed Entity</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see tripplanning.impl.IDedEntityImpl
		 * @see tripplanning.impl.TripplanningPackageImpl#getIDedEntity()
		 * @generated
		 */
		EClass IDED_ENTITY = eINSTANCE.getIDedEntity();

		/**
		 * The meta object literal for the '<em><b>Id</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute IDED_ENTITY__ID = eINSTANCE.getIDedEntity_Id();

		/**
		 * The meta object literal for the '{@link tripplanning.impl.LocationImpl <em>Location</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see tripplanning.impl.LocationImpl
		 * @see tripplanning.impl.TripplanningPackageImpl#getLocation()
		 * @generated
		 */
		EClass LOCATION = eINSTANCE.getLocation();

		/**
		 * The meta object literal for the '<em><b>Name</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute LOCATION__NAME = eINSTANCE.getLocation_Name();

		/**
		 * The meta object literal for the '<em><b>Address</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute LOCATION__ADDRESS = eINSTANCE.getLocation_Address();

		/**
		 * The meta object literal for the '<em><b>Type</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute LOCATION__TYPE = eINSTANCE.getLocation_Type();

		/**
		 * The meta object literal for the '<em><b>Latitude</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute LOCATION__LATITUDE = eINSTANCE.getLocation_Latitude();

		/**
		 * The meta object literal for the '<em><b>Longitude</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute LOCATION__LONGITUDE = eINSTANCE.getLocation_Longitude();

		/**
		 * The meta object literal for the '{@link tripplanning.LocationType <em>Location Type</em>}' enum.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see tripplanning.LocationType
		 * @see tripplanning.impl.TripplanningPackageImpl#getLocationType()
		 * @generated
		 */
		EEnum LOCATION_TYPE = eINSTANCE.getLocationType();

		/**
		 * The meta object literal for the '{@link tripplanning.PersonalInterest <em>Personal Interest</em>}' enum.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see tripplanning.PersonalInterest
		 * @see tripplanning.impl.TripplanningPackageImpl#getPersonalInterest()
		 * @generated
		 */
		EEnum PERSONAL_INTEREST = eINSTANCE.getPersonalInterest();

	}

} //TripplanningPackage
