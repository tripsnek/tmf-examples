/**
 */
package tripplanning;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.eclipse.emf.common.util.Enumerator;

/**
 * <!-- begin-user-doc -->
 * A representation of the literals of the enumeration '<em><b>Personal Interest</b></em>',
 * and utility methods for working with them.
 * <!-- end-user-doc -->
 * @see tripplanning.TripplanningPackage#getPersonalInterest()
 * @model
 * @generated
 */
public enum PersonalInterest implements Enumerator {
	/**
	 * The '<em><b>Natural Beauty</b></em>' literal object.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #NATURAL_BEAUTY_VALUE
	 * @generated
	 * @ordered
	 */
	NATURAL_BEAUTY(0, "NaturalBeauty", "LITERAL_3"),

	/**
	 * The '<em><b>Major Cities</b></em>' literal object.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #MAJOR_CITIES_VALUE
	 * @generated
	 * @ordered
	 */
	MAJOR_CITIES(1, "MajorCities", "LITERAL_4"),

	/**
	 * The '<em><b>Cuisine</b></em>' literal object.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #CUISINE_VALUE
	 * @generated
	 * @ordered
	 */
	CUISINE(2, "Cuisine", "LITERAL_5"),

	/**
	 * The '<em><b>Wine</b></em>' literal object.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #WINE_VALUE
	 * @generated
	 * @ordered
	 */
	WINE(3, "Wine", "LITERAL_6"),

	/**
	 * The '<em><b>Ocean</b></em>' literal object.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #OCEAN_VALUE
	 * @generated
	 * @ordered
	 */
	OCEAN(4, "Ocean", "LITERAL_7"),

	/**
	 * The '<em><b>Nightlife</b></em>' literal object.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #NIGHTLIFE_VALUE
	 * @generated
	 * @ordered
	 */
	NIGHTLIFE(5, "Nightlife", "LITERAL_8"),

	/**
	 * The '<em><b>Museums</b></em>' literal object.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #MUSEUMS_VALUE
	 * @generated
	 * @ordered
	 */
	MUSEUMS(6, "Museums", "LITERAL_9");

	/**
	 * The '<em><b>Natural Beauty</b></em>' literal value.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #NATURAL_BEAUTY
	 * @model name="NaturalBeauty" literal="LITERAL_3"
	 * @generated
	 * @ordered
	 */
	public static final int NATURAL_BEAUTY_VALUE = 0;

	/**
	 * The '<em><b>Major Cities</b></em>' literal value.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #MAJOR_CITIES
	 * @model name="MajorCities" literal="LITERAL_4"
	 * @generated
	 * @ordered
	 */
	public static final int MAJOR_CITIES_VALUE = 1;

	/**
	 * The '<em><b>Cuisine</b></em>' literal value.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #CUISINE
	 * @model name="Cuisine" literal="LITERAL_5"
	 * @generated
	 * @ordered
	 */
	public static final int CUISINE_VALUE = 2;

	/**
	 * The '<em><b>Wine</b></em>' literal value.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #WINE
	 * @model name="Wine" literal="LITERAL_6"
	 * @generated
	 * @ordered
	 */
	public static final int WINE_VALUE = 3;

	/**
	 * The '<em><b>Ocean</b></em>' literal value.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #OCEAN
	 * @model name="Ocean" literal="LITERAL_7"
	 * @generated
	 * @ordered
	 */
	public static final int OCEAN_VALUE = 4;

	/**
	 * The '<em><b>Nightlife</b></em>' literal value.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #NIGHTLIFE
	 * @model name="Nightlife" literal="LITERAL_8"
	 * @generated
	 * @ordered
	 */
	public static final int NIGHTLIFE_VALUE = 5;

	/**
	 * The '<em><b>Museums</b></em>' literal value.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #MUSEUMS
	 * @model name="Museums" literal="LITERAL_9"
	 * @generated
	 * @ordered
	 */
	public static final int MUSEUMS_VALUE = 6;

	/**
	 * An array of all the '<em><b>Personal Interest</b></em>' enumerators.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	private static final PersonalInterest[] VALUES_ARRAY =
		new PersonalInterest[] {
			NATURAL_BEAUTY,
			MAJOR_CITIES,
			CUISINE,
			WINE,
			OCEAN,
			NIGHTLIFE,
			MUSEUMS,
		};

	/**
	 * A public read-only list of all the '<em><b>Personal Interest</b></em>' enumerators.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public static final List<PersonalInterest> VALUES = Collections.unmodifiableList(Arrays.asList(VALUES_ARRAY));

	/**
	 * Returns the '<em><b>Personal Interest</b></em>' literal with the specified literal value.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @param literal the literal.
	 * @return the matching enumerator or <code>null</code>.
	 * @generated
	 */
	public static PersonalInterest get(String literal) {
		for (int i = 0; i < VALUES_ARRAY.length; ++i) {
			PersonalInterest result = VALUES_ARRAY[i];
			if (result.toString().equals(literal)) {
				return result;
			}
		}
		return null;
	}

	/**
	 * Returns the '<em><b>Personal Interest</b></em>' literal with the specified name.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @param name the name.
	 * @return the matching enumerator or <code>null</code>.
	 * @generated
	 */
	public static PersonalInterest getByName(String name) {
		for (int i = 0; i < VALUES_ARRAY.length; ++i) {
			PersonalInterest result = VALUES_ARRAY[i];
			if (result.getName().equals(name)) {
				return result;
			}
		}
		return null;
	}

	/**
	 * Returns the '<em><b>Personal Interest</b></em>' literal with the specified integer value.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @param value the integer value.
	 * @return the matching enumerator or <code>null</code>.
	 * @generated
	 */
	public static PersonalInterest get(int value) {
		switch (value) {
			case NATURAL_BEAUTY_VALUE: return NATURAL_BEAUTY;
			case MAJOR_CITIES_VALUE: return MAJOR_CITIES;
			case CUISINE_VALUE: return CUISINE;
			case WINE_VALUE: return WINE;
			case OCEAN_VALUE: return OCEAN;
			case NIGHTLIFE_VALUE: return NIGHTLIFE;
			case MUSEUMS_VALUE: return MUSEUMS;
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
	private PersonalInterest(int value, String name, String literal) {
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
	
} //PersonalInterest
