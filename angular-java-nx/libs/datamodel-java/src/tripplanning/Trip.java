/**
 */
package tripplanning;

import java.util.Date;

import org.eclipse.emf.common.util.EList;

/**
 * <!-- begin-user-doc -->
 * A representation of the model object '<em><b>Trip</b></em>'.
 * <!-- end-user-doc -->
 *
 * <p>
 * The following features are supported:
 * </p>
 * <ul>
 *   <li>{@link tripplanning.Trip#getSegments <em>Segments</em>}</li>
 *   <li>{@link tripplanning.Trip#getName <em>Name</em>}</li>
 *   <li>{@link tripplanning.Trip#getStartDate <em>Start Date</em>}</li>
 *   <li>{@link tripplanning.Trip#getEndDate <em>End Date</em>}</li>
 *   <li>{@link tripplanning.Trip#getParticipants <em>Participants</em>}</li>
 *   <li>{@link tripplanning.Trip#getDescription <em>Description</em>}</li>
 *   <li>{@link tripplanning.Trip#getBudgetDollars <em>Budget Dollars</em>}</li>
 *   <li>{@link tripplanning.Trip#isTentative <em>Tentative</em>}</li>
 * </ul>
 *
 * @see tripplanning.TripplanningPackage#getTrip()
 * @model
 * @generated
 */
public interface Trip extends IDedEntity {
	/**
	 * Returns the value of the '<em><b>Segments</b></em>' containment reference list.
	 * The list contents are of type {@link tripplanning.TripSegment}.
	 * It is bidirectional and its opposite is '{@link tripplanning.TripSegment#getTrip <em>Trip</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the value of the '<em>Segments</em>' containment reference list.
	 * @see tripplanning.TripplanningPackage#getTrip_Segments()
	 * @see tripplanning.TripSegment#getTrip
	 * @model opposite="trip" containment="true"
	 * @generated
	 */
	EList<TripSegment> getSegments();

	/**
	 * Returns the value of the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the value of the '<em>Name</em>' attribute.
	 * @see #setName(String)
	 * @see tripplanning.TripplanningPackage#getTrip_Name()
	 * @model
	 * @generated
	 */
	String getName();

	/**
	 * Sets the value of the '{@link tripplanning.Trip#getName <em>Name</em>}' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @param value the new value of the '<em>Name</em>' attribute.
	 * @see #getName()
	 * @generated
	 */
	void setName(String value);

	/**
	 * Returns the value of the '<em><b>Start Date</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the value of the '<em>Start Date</em>' attribute.
	 * @see #setStartDate(Date)
	 * @see tripplanning.TripplanningPackage#getTrip_StartDate()
	 * @model
	 * @generated
	 */
	Date getStartDate();

	/**
	 * Sets the value of the '{@link tripplanning.Trip#getStartDate <em>Start Date</em>}' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @param value the new value of the '<em>Start Date</em>' attribute.
	 * @see #getStartDate()
	 * @generated
	 */
	void setStartDate(Date value);

	/**
	 * Returns the value of the '<em><b>End Date</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the value of the '<em>End Date</em>' attribute.
	 * @see #setEndDate(Date)
	 * @see tripplanning.TripplanningPackage#getTrip_EndDate()
	 * @model
	 * @generated
	 */
	Date getEndDate();

	/**
	 * Sets the value of the '{@link tripplanning.Trip#getEndDate <em>End Date</em>}' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @param value the new value of the '<em>End Date</em>' attribute.
	 * @see #getEndDate()
	 * @generated
	 */
	void setEndDate(Date value);

	/**
	 * Returns the value of the '<em><b>Participants</b></em>' reference list.
	 * The list contents are of type {@link tripplanning.Traveler}.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the value of the '<em>Participants</em>' reference list.
	 * @see tripplanning.TripplanningPackage#getTrip_Participants()
	 * @model
	 * @generated
	 */
	EList<Traveler> getParticipants();

	/**
	 * Returns the value of the '<em><b>Description</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the value of the '<em>Description</em>' attribute.
	 * @see #setDescription(String)
	 * @see tripplanning.TripplanningPackage#getTrip_Description()
	 * @model
	 * @generated
	 */
	String getDescription();

	/**
	 * Sets the value of the '{@link tripplanning.Trip#getDescription <em>Description</em>}' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @param value the new value of the '<em>Description</em>' attribute.
	 * @see #getDescription()
	 * @generated
	 */
	void setDescription(String value);

	/**
	 * Returns the value of the '<em><b>Budget Dollars</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the value of the '<em>Budget Dollars</em>' attribute.
	 * @see #setBudgetDollars(double)
	 * @see tripplanning.TripplanningPackage#getTrip_BudgetDollars()
	 * @model
	 * @generated
	 */
	double getBudgetDollars();

	/**
	 * Sets the value of the '{@link tripplanning.Trip#getBudgetDollars <em>Budget Dollars</em>}' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @param value the new value of the '<em>Budget Dollars</em>' attribute.
	 * @see #getBudgetDollars()
	 * @generated
	 */
	void setBudgetDollars(double value);

	/**
	 * Returns the value of the '<em><b>Tentative</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the value of the '<em>Tentative</em>' attribute.
	 * @see #setTentative(boolean)
	 * @see tripplanning.TripplanningPackage#getTrip_Tentative()
	 * @model
	 * @generated
	 */
	boolean isTentative();

	/**
	 * Sets the value of the '{@link tripplanning.Trip#isTentative <em>Tentative</em>}' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @param value the new value of the '<em>Tentative</em>' attribute.
	 * @see #isTentative()
	 * @generated
	 */
	void setTentative(boolean value);

} // Trip
