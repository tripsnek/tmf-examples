/**
 */
package tripplanning;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.eclipse.emf.common.util.Enumerator;

/**
 * <!-- begin-user-doc -->
 * A representation of the literals of the enumeration '<em><b>Location Type</b></em>',
 * and utility methods for working with them.
 * <!-- end-user-doc -->
 * @see tripplanning.TripplanningPackage#getLocationType()
 * @model
 * @generated
 */
public enum LocationType implements Enumerator {
	/**
	 * The '<em><b>City</b></em>' literal object.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #CITY_VALUE
	 * @generated
	 * @ordered
	 */
	CITY(0, "City", "LITERAL_1"),

	/**
	 * The '<em><b>Attraction</b></em>' literal object.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #ATTRACTION_VALUE
	 * @generated
	 * @ordered
	 */
	ATTRACTION(1, "Attraction", "LITERAL_2"),

	/**
	 * The '<em><b>Hotel</b></em>' literal object.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #HOTEL_VALUE
	 * @generated
	 * @ordered
	 */
	HOTEL(2, "Hotel", "LITERAL_10"),

	/**
	 * The '<em><b>Restaurant</b></em>' literal object.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #RESTAURANT_VALUE
	 * @generated
	 * @ordered
	 */
	RESTAURANT(3, "Restaurant", "LITERAL_11");

	/**
	 * The '<em><b>City</b></em>' literal value.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #CITY
	 * @model name="City" literal="LITERAL_1"
	 * @generated
	 * @ordered
	 */
	public static final int CITY_VALUE = 0;

	/**
	 * The '<em><b>Attraction</b></em>' literal value.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #ATTRACTION
	 * @model name="Attraction" literal="LITERAL_2"
	 * @generated
	 * @ordered
	 */
	public static final int ATTRACTION_VALUE = 1;

	/**
	 * The '<em><b>Hotel</b></em>' literal value.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #HOTEL
	 * @model name="Hotel" literal="LITERAL_10"
	 * @generated
	 * @ordered
	 */
	public static final int HOTEL_VALUE = 2;

	/**
	 * The '<em><b>Restaurant</b></em>' literal value.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #RESTAURANT
	 * @model name="Restaurant" literal="LITERAL_11"
	 * @generated
	 * @ordered
	 */
	public static final int RESTAURANT_VALUE = 3;

	/**
	 * An array of all the '<em><b>Location Type</b></em>' enumerators.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	private static final LocationType[] VALUES_ARRAY =
		new LocationType[] {
			CITY,
			ATTRACTION,
			HOTEL,
			RESTAURANT,
		};

	/**
	 * A public read-only list of all the '<em><b>Location Type</b></em>' enumerators.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public static final List<LocationType> VALUES = Collections.unmodifiableList(Arrays.asList(VALUES_ARRAY));

	/**
	 * Returns the '<em><b>Location Type</b></em>' literal with the specified literal value.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @param literal the literal.
	 * @return the matching enumerator or <code>null</code>.
	 * @generated
	 */
	public static LocationType get(String literal) {
		for (int i = 0; i < VALUES_ARRAY.length; ++i) {
			LocationType result = VALUES_ARRAY[i];
			if (result.toString().equals(literal)) {
				return result;
			}
		}
		return null;
	}

	/**
	 * Returns the '<em><b>Location Type</b></em>' literal with the specified name.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @param name the name.
	 * @return the matching enumerator or <code>null</code>.
	 * @generated
	 */
	public static LocationType getByName(String name) {
		for (int i = 0; i < VALUES_ARRAY.length; ++i) {
			LocationType result = VALUES_ARRAY[i];
			if (result.getName().equals(name)) {
				return result;
			}
		}
		return null;
	}

	/**
	 * Returns the '<em><b>Location Type</b></em>' literal with the specified integer value.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @param value the integer value.
	 * @return the matching enumerator or <code>null</code>.
	 * @generated
	 */
	public static LocationType get(int value) {
		switch (value) {
			case CITY_VALUE: return CITY;
			case ATTRACTION_VALUE: return ATTRACTION;
			case HOTEL_VALUE: return HOTEL;
			case RESTAURANT_VALUE: return RESTAURANT;
		}
		return null;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	private final int value;

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	private final String name;

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	private final String literal;

	/**
	 * Only this class can construct instances.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	private LocationType(int value, String name, String literal) {
		this.value = value;
		this.name = name;
		this.literal = literal;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public int getValue() {
	  return value;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public String getName() {
	  return name;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public String getLiteral() {
	  return literal;
	}

	/**
	 * Returns the literal value of the enumerator, which is its string representation.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public String toString() {
		return literal;
	}
	
} //LocationType
