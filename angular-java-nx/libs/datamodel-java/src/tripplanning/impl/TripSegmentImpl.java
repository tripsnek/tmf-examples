/**
 */
package tripplanning.impl;

import org.eclipse.emf.common.notify.Notification;
import org.eclipse.emf.common.notify.NotificationChain;

import org.eclipse.emf.ecore.EClass;
import org.eclipse.emf.ecore.InternalEObject;

import org.eclipse.emf.ecore.impl.ENotificationImpl;
import org.eclipse.emf.ecore.impl.MinimalEObjectImpl;

import org.eclipse.emf.ecore.util.EcoreUtil;

import tripplanning.Location;
import tripplanning.Trip;
import tripplanning.TripSegment;
import tripplanning.TripplanningPackage;

/**
 * <!-- begin-user-doc -->
 * An implementation of the model object '<em><b>Trip Segment</b></em>'.
 * <!-- end-user-doc -->
 * <p>
 * The following features are implemented:
 * </p>
 * <ul>
 *   <li>{@link tripplanning.impl.TripSegmentImpl#getDestinationNights <em>Destination Nights</em>}</li>
 *   <li>{@link tripplanning.impl.TripSegmentImpl#getTrip <em>Trip</em>}</li>
 *   <li>{@link tripplanning.impl.TripSegmentImpl#getOrigin <em>Origin</em>}</li>
 *   <li>{@link tripplanning.impl.TripSegmentImpl#getDestination <em>Destination</em>}</li>
 *   <li>{@link tripplanning.impl.TripSegmentImpl#getName <em>Name</em>}</li>
 * </ul>
 *
 * @generated
 */
public class TripSegmentImpl extends MinimalEObjectImpl.Container implements TripSegment {
	/**
	 * The default value of the '{@link #getDestinationNights() <em>Destination Nights</em>}' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #getDestinationNights()
	 * @generated
	 * @ordered
	 */
	protected static final int DESTINATION_NIGHTS_EDEFAULT = 0;

	/**
	 * The cached value of the '{@link #getDestinationNights() <em>Destination Nights</em>}' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #getDestinationNights()
	 * @generated
	 * @ordered
	 */
	protected int destinationNights = DESTINATION_NIGHTS_EDEFAULT;

	/**
	 * The cached value of the '{@link #getOrigin() <em>Origin</em>}' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #getOrigin()
	 * @generated
	 * @ordered
	 */
	protected Location origin;

	/**
	 * The cached value of the '{@link #getDestination() <em>Destination</em>}' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #getDestination()
	 * @generated
	 * @ordered
	 */
	protected Location destination;

	/**
	 * The default value of the '{@link #getName() <em>Name</em>}' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #getName()
	 * @generated
	 * @ordered
	 */
	protected static final String NAME_EDEFAULT = null;

	/**
	 * The cached value of the '{@link #getName() <em>Name</em>}' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #getName()
	 * @generated
	 * @ordered
	 */
	protected String name = NAME_EDEFAULT;

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	protected TripSegmentImpl() {
		super();
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	protected EClass eStaticClass() {
		return TripplanningPackage.Literals.TRIP_SEGMENT;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public int getDestinationNights() {
		return destinationNights;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public void setDestinationNights(int newDestinationNights) {
		int oldDestinationNights = destinationNights;
		destinationNights = newDestinationNights;
		if (eNotificationRequired())
			eNotify(new ENotificationImpl(this, Notification.SET, TripplanningPackage.TRIP_SEGMENT__DESTINATION_NIGHTS, oldDestinationNights, destinationNights));
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public Trip getTrip() {
		if (eContainerFeatureID() != TripplanningPackage.TRIP_SEGMENT__TRIP) return null;
		return (Trip)eInternalContainer();
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public NotificationChain basicSetTrip(Trip newTrip, NotificationChain msgs) {
		msgs = eBasicSetContainer((InternalEObject)newTrip, TripplanningPackage.TRIP_SEGMENT__TRIP, msgs);
		return msgs;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public void setTrip(Trip newTrip) {
		if (newTrip != eInternalContainer() || (eContainerFeatureID() != TripplanningPackage.TRIP_SEGMENT__TRIP && newTrip != null)) {
			if (EcoreUtil.isAncestor(this, newTrip))
				throw new IllegalArgumentException("Recursive containment not allowed for " + toString());
			NotificationChain msgs = null;
			if (eInternalContainer() != null)
				msgs = eBasicRemoveFromContainer(msgs);
			if (newTrip != null)
				msgs = ((InternalEObject)newTrip).eInverseAdd(this, TripplanningPackage.TRIP__SEGMENTS, Trip.class, msgs);
			msgs = basicSetTrip(newTrip, msgs);
			if (msgs != null) msgs.dispatch();
		}
		else if (eNotificationRequired())
			eNotify(new ENotificationImpl(this, Notification.SET, TripplanningPackage.TRIP_SEGMENT__TRIP, newTrip, newTrip));
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public Location getOrigin() {
		if (origin != null && origin.eIsProxy()) {
			InternalEObject oldOrigin = (InternalEObject)origin;
			origin = (Location)eResolveProxy(oldOrigin);
			if (origin != oldOrigin) {
				if (eNotificationRequired())
					eNotify(new ENotificationImpl(this, Notification.RESOLVE, TripplanningPackage.TRIP_SEGMENT__ORIGIN, oldOrigin, origin));
			}
		}
		return origin;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public Location basicGetOrigin() {
		return origin;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public void setOrigin(Location newOrigin) {
		Location oldOrigin = origin;
		origin = newOrigin;
		if (eNotificationRequired())
			eNotify(new ENotificationImpl(this, Notification.SET, TripplanningPackage.TRIP_SEGMENT__ORIGIN, oldOrigin, origin));
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public Location getDestination() {
		if (destination != null && destination.eIsProxy()) {
			InternalEObject oldDestination = (InternalEObject)destination;
			destination = (Location)eResolveProxy(oldDestination);
			if (destination != oldDestination) {
				if (eNotificationRequired())
					eNotify(new ENotificationImpl(this, Notification.RESOLVE, TripplanningPackage.TRIP_SEGMENT__DESTINATION, oldDestination, destination));
			}
		}
		return destination;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public Location basicGetDestination() {
		return destination;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public void setDestination(Location newDestination) {
		Location oldDestination = destination;
		destination = newDestination;
		if (eNotificationRequired())
			eNotify(new ENotificationImpl(this, Notification.SET, TripplanningPackage.TRIP_SEGMENT__DESTINATION, oldDestination, destination));
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
	public void setName(String newName) {
		String oldName = name;
		name = newName;
		if (eNotificationRequired())
			eNotify(new ENotificationImpl(this, Notification.SET, TripplanningPackage.TRIP_SEGMENT__NAME, oldName, name));
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public NotificationChain eInverseAdd(InternalEObject otherEnd, int featureID, NotificationChain msgs) {
		switch (featureID) {
			case TripplanningPackage.TRIP_SEGMENT__TRIP:
				if (eInternalContainer() != null)
					msgs = eBasicRemoveFromContainer(msgs);
				return basicSetTrip((Trip)otherEnd, msgs);
		}
		return super.eInverseAdd(otherEnd, featureID, msgs);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public NotificationChain eInverseRemove(InternalEObject otherEnd, int featureID, NotificationChain msgs) {
		switch (featureID) {
			case TripplanningPackage.TRIP_SEGMENT__TRIP:
				return basicSetTrip(null, msgs);
		}
		return super.eInverseRemove(otherEnd, featureID, msgs);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public NotificationChain eBasicRemoveFromContainerFeature(NotificationChain msgs) {
		switch (eContainerFeatureID()) {
			case TripplanningPackage.TRIP_SEGMENT__TRIP:
				return eInternalContainer().eInverseRemove(this, TripplanningPackage.TRIP__SEGMENTS, Trip.class, msgs);
		}
		return super.eBasicRemoveFromContainerFeature(msgs);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public Object eGet(int featureID, boolean resolve, boolean coreType) {
		switch (featureID) {
			case TripplanningPackage.TRIP_SEGMENT__DESTINATION_NIGHTS:
				return getDestinationNights();
			case TripplanningPackage.TRIP_SEGMENT__TRIP:
				return getTrip();
			case TripplanningPackage.TRIP_SEGMENT__ORIGIN:
				if (resolve) return getOrigin();
				return basicGetOrigin();
			case TripplanningPackage.TRIP_SEGMENT__DESTINATION:
				if (resolve) return getDestination();
				return basicGetDestination();
			case TripplanningPackage.TRIP_SEGMENT__NAME:
				return getName();
		}
		return super.eGet(featureID, resolve, coreType);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public void eSet(int featureID, Object newValue) {
		switch (featureID) {
			case TripplanningPackage.TRIP_SEGMENT__DESTINATION_NIGHTS:
				setDestinationNights((Integer)newValue);
				return;
			case TripplanningPackage.TRIP_SEGMENT__TRIP:
				setTrip((Trip)newValue);
				return;
			case TripplanningPackage.TRIP_SEGMENT__ORIGIN:
				setOrigin((Location)newValue);
				return;
			case TripplanningPackage.TRIP_SEGMENT__DESTINATION:
				setDestination((Location)newValue);
				return;
			case TripplanningPackage.TRIP_SEGMENT__NAME:
				setName((String)newValue);
				return;
		}
		super.eSet(featureID, newValue);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public void eUnset(int featureID) {
		switch (featureID) {
			case TripplanningPackage.TRIP_SEGMENT__DESTINATION_NIGHTS:
				setDestinationNights(DESTINATION_NIGHTS_EDEFAULT);
				return;
			case TripplanningPackage.TRIP_SEGMENT__TRIP:
				setTrip((Trip)null);
				return;
			case TripplanningPackage.TRIP_SEGMENT__ORIGIN:
				setOrigin((Location)null);
				return;
			case TripplanningPackage.TRIP_SEGMENT__DESTINATION:
				setDestination((Location)null);
				return;
			case TripplanningPackage.TRIP_SEGMENT__NAME:
				setName(NAME_EDEFAULT);
				return;
		}
		super.eUnset(featureID);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public boolean eIsSet(int featureID) {
		switch (featureID) {
			case TripplanningPackage.TRIP_SEGMENT__DESTINATION_NIGHTS:
				return destinationNights != DESTINATION_NIGHTS_EDEFAULT;
			case TripplanningPackage.TRIP_SEGMENT__TRIP:
				return getTrip() != null;
			case TripplanningPackage.TRIP_SEGMENT__ORIGIN:
				return origin != null;
			case TripplanningPackage.TRIP_SEGMENT__DESTINATION:
				return destination != null;
			case TripplanningPackage.TRIP_SEGMENT__NAME:
				return NAME_EDEFAULT == null ? name != null : !NAME_EDEFAULT.equals(name);
		}
		return super.eIsSet(featureID);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public String toString() {
		if (eIsProxy()) return super.toString();

		StringBuilder result = new StringBuilder(super.toString());
		result.append(" (destinationNights: ");
		result.append(destinationNights);
		result.append(", name: ");
		result.append(name);
		result.append(')');
		return result.toString();
	}

} //TripSegmentImpl
