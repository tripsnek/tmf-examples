/**
 */
package tripplanning;

import org.eclipse.emf.common.util.EList;

/**
 * <!-- begin-user-doc -->
 * A representation of the model object '<em><b>Traveler</b></em>'.
 * <!-- end-user-doc -->
 *
 * <p>
 * The following features are supported:
 * </p>
 * <ul>
 *   <li>{@link tripplanning.Traveler#getName <em>Name</em>}</li>
 *   <li>{@link tripplanning.Traveler#getEmail <em>Email</em>}</li>
 *   <li>{@link tripplanning.Traveler#getInterests <em>Interests</em>}</li>
 * </ul>
 *
 * @see tripplanning.TripplanningPackage#getTraveler()
 * @model
 * @generated
 */
public interface Traveler extends IDedEntity {
	/**
	 * Returns the value of the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the value of the '<em>Name</em>' attribute.
	 * @see #setName(String)
	 * @see tripplanning.TripplanningPackage#getTraveler_Name()
	 * @model
	 * @generated
	 */
	String getName();

	/**
	 * Sets the value of the '{@link tripplanning.Traveler#getName <em>Name</em>}' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @param value the new value of the '<em>Name</em>' attribute.
	 * @see #getName()
	 * @generated
	 */
	void setName(String value);

	/**
	 * Returns the value of the '<em><b>Email</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the value of the '<em>Email</em>' attribute.
	 * @see #setEmail(String)
	 * @see tripplanning.TripplanningPackage#getTraveler_Email()
	 * @model
	 * @generated
	 */
	String getEmail();

	/**
	 * Sets the value of the '{@link tripplanning.Traveler#getEmail <em>Email</em>}' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @param value the new value of the '<em>Email</em>' attribute.
	 * @see #getEmail()
	 * @generated
	 */
	void setEmail(String value);

	/**
	 * Returns the value of the '<em><b>Interests</b></em>' attribute list.
	 * The list contents are of type {@link tripplanning.PersonalInterest}.
	 * The literals are from the enumeration {@link tripplanning.PersonalInterest}.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the value of the '<em>Interests</em>' attribute list.
	 * @see tripplanning.PersonalInterest
	 * @see tripplanning.TripplanningPackage#getTraveler_Interests()
	 * @model
	 * @generated
	 */
	EList<PersonalInterest> getInterests();

} // Traveler
