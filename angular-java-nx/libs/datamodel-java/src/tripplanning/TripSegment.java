/**
 */
package tripplanning;

import org.eclipse.emf.common.util.EList;
import org.eclipse.emf.ecore.EObject;

/**
 * <!-- begin-user-doc -->
 * A representation of the model object '<em><b>Trip Segment</b></em>'.
 * <!-- end-user-doc -->
 *
 * <p>
 * The following features are supported:
 * </p>
 * <ul>
 *   <li>{@link tripplanning.TripSegment#getDestinationNights <em>Destination Nights</em>}</li>
 *   <li>{@link tripplanning.TripSegment#getTrip <em>Trip</em>}</li>
 *   <li>{@link tripplanning.TripSegment#getOrigin <em>Origin</em>}</li>
 *   <li>{@link tripplanning.TripSegment#getDestination <em>Destination</em>}</li>
 *   <li>{@link tripplanning.TripSegment#getActivities <em>Activities</em>}</li>
 *   <li>{@link tripplanning.TripSegment#getName <em>Name</em>}</li>
 * </ul>
 *
 * @see tripplanning.TripplanningPackage#getTripSegment()
 * @model
 * @generated
 */
public interface TripSegment extends EObject {
	/**
	 * Returns the value of the '<em><b>Destination Nights</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the value of the '<em>Destination Nights</em>' attribute.
	 * @see #setDestinationNights(int)
	 * @see tripplanning.TripplanningPackage#getTripSegment_DestinationNights()
	 * @model
	 * @generated
	 */
	int getDestinationNights();

	/**
	 * Sets the value of the '{@link tripplanning.TripSegment#getDestinationNights <em>Destination Nights</em>}' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @param value the new value of the '<em>Destination Nights</em>' attribute.
	 * @see #getDestinationNights()
	 * @generated
	 */
	void setDestinationNights(int value);

	/**
	 * Returns the value of the '<em><b>Trip</b></em>' container reference.
	 * It is bidirectional and its opposite is '{@link tripplanning.Trip#getSegments <em>Segments</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the value of the '<em>Trip</em>' container reference.
	 * @see #setTrip(Trip)
	 * @see tripplanning.TripplanningPackage#getTripSegment_Trip()
	 * @see tripplanning.Trip#getSegments
	 * @model opposite="segments" transient="false"
	 * @generated
	 */
	Trip getTrip();

	/**
	 * Sets the value of the '{@link tripplanning.TripSegment#getTrip <em>Trip</em>}' container reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @param value the new value of the '<em>Trip</em>' container reference.
	 * @see #getTrip()
	 * @generated
	 */
	void setTrip(Trip value);

	/**
	 * Returns the value of the '<em><b>Origin</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the value of the '<em>Origin</em>' reference.
	 * @see #setOrigin(Location)
	 * @see tripplanning.TripplanningPackage#getTripSegment_Origin()
	 * @model
	 * @generated
	 */
	Location getOrigin();

	/**
	 * Sets the value of the '{@link tripplanning.TripSegment#getOrigin <em>Origin</em>}' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @param value the new value of the '<em>Origin</em>' reference.
	 * @see #getOrigin()
	 * @generated
	 */
	void setOrigin(Location value);

	/**
	 * Returns the value of the '<em><b>Destination</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the value of the '<em>Destination</em>' reference.
	 * @see #setDestination(Location)
	 * @see tripplanning.TripplanningPackage#getTripSegment_Destination()
	 * @model
	 * @generated
	 */
	Location getDestination();

	/**
	 * Sets the value of the '{@link tripplanning.TripSegment#getDestination <em>Destination</em>}' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @param value the new value of the '<em>Destination</em>' reference.
	 * @see #getDestination()
	 * @generated
	 */
	void setDestination(Location value);

	/**
	 * Returns the value of the '<em><b>Activities</b></em>' containment reference list.
	 * The list contents are of type {@link tripplanning.Activity}.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the value of the '<em>Activities</em>' containment reference list.
	 * @see tripplanning.TripplanningPackage#getTripSegment_Activities()
	 * @model containment="true"
	 * @generated
	 */
	EList<Activity> getActivities();

	/**
	 * Returns the value of the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the value of the '<em>Name</em>' attribute.
	 * @see #setName(String)
	 * @see tripplanning.TripplanningPackage#getTripSegment_Name()
	 * @model
	 * @generated
	 */
	String getName();

	/**
	 * Sets the value of the '{@link tripplanning.TripSegment#getName <em>Name</em>}' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @param value the new value of the '<em>Name</em>' attribute.
	 * @see #getName()
	 * @generated
	 */
	void setName(String value);

} // TripSegment
