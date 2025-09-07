/**
 */
package tripplanning.impl;

import java.util.Collection;
import java.util.Date;

import org.eclipse.emf.common.notify.Notification;
import org.eclipse.emf.common.notify.NotificationChain;

import org.eclipse.emf.common.util.EList;

import org.eclipse.emf.ecore.EClass;
import org.eclipse.emf.ecore.InternalEObject;

import org.eclipse.emf.ecore.impl.ENotificationImpl;

import org.eclipse.emf.ecore.util.EObjectContainmentWithInverseEList;
import org.eclipse.emf.ecore.util.EObjectResolvingEList;
import org.eclipse.emf.ecore.util.InternalEList;

import tripplanning.Traveler;
import tripplanning.Trip;
import tripplanning.TripSegment;
import tripplanning.TripplanningPackage;

/**
 * <!-- begin-user-doc -->
 * An implementation of the model object '<em><b>Trip</b></em>'.
 * <!-- end-user-doc -->
 * <p>
 * The following features are implemented:
 * </p>
 * <ul>
 *   <li>{@link tripplanning.impl.TripImpl#getSegments <em>Segments</em>}</li>
 *   <li>{@link tripplanning.impl.TripImpl#getName <em>Name</em>}</li>
 *   <li>{@link tripplanning.impl.TripImpl#getStartDate <em>Start Date</em>}</li>
 *   <li>{@link tripplanning.impl.TripImpl#getEndDate <em>End Date</em>}</li>
 *   <li>{@link tripplanning.impl.TripImpl#getParticipants <em>Participants</em>}</li>
 *   <li>{@link tripplanning.impl.TripImpl#getDescription <em>Description</em>}</li>
 *   <li>{@link tripplanning.impl.TripImpl#getBudgetDollars <em>Budget Dollars</em>}</li>
 *   <li>{@link tripplanning.impl.TripImpl#isTentative <em>Tentative</em>}</li>
 * </ul>
 *
 * @generated
 */
public class TripImpl extends IDedEntityImpl implements Trip {
	/**
	 * The cached value of the '{@link #getSegments() <em>Segments</em>}' containment reference list.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #getSegments()
	 * @generated
	 * @ordered
	 */
	protected EList<TripSegment> segments;

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
	 * The default value of the '{@link #getStartDate() <em>Start Date</em>}' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #getStartDate()
	 * @generated
	 * @ordered
	 */
	protected static final Date START_DATE_EDEFAULT = null;

	/**
	 * The cached value of the '{@link #getStartDate() <em>Start Date</em>}' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #getStartDate()
	 * @generated
	 * @ordered
	 */
	protected Date startDate = START_DATE_EDEFAULT;

	/**
	 * The default value of the '{@link #getEndDate() <em>End Date</em>}' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #getEndDate()
	 * @generated
	 * @ordered
	 */
	protected static final Date END_DATE_EDEFAULT = null;

	/**
	 * The cached value of the '{@link #getEndDate() <em>End Date</em>}' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #getEndDate()
	 * @generated
	 * @ordered
	 */
	protected Date endDate = END_DATE_EDEFAULT;

	/**
	 * The cached value of the '{@link #getParticipants() <em>Participants</em>}' reference list.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #getParticipants()
	 * @generated
	 * @ordered
	 */
	protected EList<Traveler> participants;

	/**
	 * The default value of the '{@link #getDescription() <em>Description</em>}' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #getDescription()
	 * @generated
	 * @ordered
	 */
	protected static final String DESCRIPTION_EDEFAULT = null;

	/**
	 * The cached value of the '{@link #getDescription() <em>Description</em>}' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #getDescription()
	 * @generated
	 * @ordered
	 */
	protected String description = DESCRIPTION_EDEFAULT;

	/**
	 * The default value of the '{@link #getBudgetDollars() <em>Budget Dollars</em>}' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #getBudgetDollars()
	 * @generated
	 * @ordered
	 */
	protected static final double BUDGET_DOLLARS_EDEFAULT = 0.0;

	/**
	 * The cached value of the '{@link #getBudgetDollars() <em>Budget Dollars</em>}' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #getBudgetDollars()
	 * @generated
	 * @ordered
	 */
	protected double budgetDollars = BUDGET_DOLLARS_EDEFAULT;

	/**
	 * The default value of the '{@link #isTentative() <em>Tentative</em>}' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #isTentative()
	 * @generated
	 * @ordered
	 */
	protected static final boolean TENTATIVE_EDEFAULT = false;

	/**
	 * The cached value of the '{@link #isTentative() <em>Tentative</em>}' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #isTentative()
	 * @generated
	 * @ordered
	 */
	protected boolean tentative = TENTATIVE_EDEFAULT;

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	protected TripImpl() {
		super();
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	protected EClass eStaticClass() {
		return TripplanningPackage.Literals.TRIP;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public EList<TripSegment> getSegments() {
		if (segments == null) {
			segments = new EObjectContainmentWithInverseEList<TripSegment>(TripSegment.class, this, TripplanningPackage.TRIP__SEGMENTS, TripplanningPackage.TRIP_SEGMENT__TRIP);
		}
		return segments;
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
			eNotify(new ENotificationImpl(this, Notification.SET, TripplanningPackage.TRIP__NAME, oldName, name));
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public Date getStartDate() {
		return startDate;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public void setStartDate(Date newStartDate) {
		Date oldStartDate = startDate;
		startDate = newStartDate;
		if (eNotificationRequired())
			eNotify(new ENotificationImpl(this, Notification.SET, TripplanningPackage.TRIP__START_DATE, oldStartDate, startDate));
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public Date getEndDate() {
		return endDate;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public void setEndDate(Date newEndDate) {
		Date oldEndDate = endDate;
		endDate = newEndDate;
		if (eNotificationRequired())
			eNotify(new ENotificationImpl(this, Notification.SET, TripplanningPackage.TRIP__END_DATE, oldEndDate, endDate));
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public EList<Traveler> getParticipants() {
		if (participants == null) {
			participants = new EObjectResolvingEList<Traveler>(Traveler.class, this, TripplanningPackage.TRIP__PARTICIPANTS);
		}
		return participants;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public String getDescription() {
		return description;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public void setDescription(String newDescription) {
		String oldDescription = description;
		description = newDescription;
		if (eNotificationRequired())
			eNotify(new ENotificationImpl(this, Notification.SET, TripplanningPackage.TRIP__DESCRIPTION, oldDescription, description));
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public double getBudgetDollars() {
		return budgetDollars;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public void setBudgetDollars(double newBudgetDollars) {
		double oldBudgetDollars = budgetDollars;
		budgetDollars = newBudgetDollars;
		if (eNotificationRequired())
			eNotify(new ENotificationImpl(this, Notification.SET, TripplanningPackage.TRIP__BUDGET_DOLLARS, oldBudgetDollars, budgetDollars));
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public boolean isTentative() {
		return tentative;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public void setTentative(boolean newTentative) {
		boolean oldTentative = tentative;
		tentative = newTentative;
		if (eNotificationRequired())
			eNotify(new ENotificationImpl(this, Notification.SET, TripplanningPackage.TRIP__TENTATIVE, oldTentative, tentative));
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@SuppressWarnings("unchecked")
	@Override
	public NotificationChain eInverseAdd(InternalEObject otherEnd, int featureID, NotificationChain msgs) {
		switch (featureID) {
			case TripplanningPackage.TRIP__SEGMENTS:
				return ((InternalEList<InternalEObject>)(InternalEList<?>)getSegments()).basicAdd(otherEnd, msgs);
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
			case TripplanningPackage.TRIP__SEGMENTS:
				return ((InternalEList<?>)getSegments()).basicRemove(otherEnd, msgs);
		}
		return super.eInverseRemove(otherEnd, featureID, msgs);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public Object eGet(int featureID, boolean resolve, boolean coreType) {
		switch (featureID) {
			case TripplanningPackage.TRIP__SEGMENTS:
				return getSegments();
			case TripplanningPackage.TRIP__NAME:
				return getName();
			case TripplanningPackage.TRIP__START_DATE:
				return getStartDate();
			case TripplanningPackage.TRIP__END_DATE:
				return getEndDate();
			case TripplanningPackage.TRIP__PARTICIPANTS:
				return getParticipants();
			case TripplanningPackage.TRIP__DESCRIPTION:
				return getDescription();
			case TripplanningPackage.TRIP__BUDGET_DOLLARS:
				return getBudgetDollars();
			case TripplanningPackage.TRIP__TENTATIVE:
				return isTentative();
		}
		return super.eGet(featureID, resolve, coreType);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@SuppressWarnings("unchecked")
	@Override
	public void eSet(int featureID, Object newValue) {
		switch (featureID) {
			case TripplanningPackage.TRIP__SEGMENTS:
				getSegments().clear();
				getSegments().addAll((Collection<? extends TripSegment>)newValue);
				return;
			case TripplanningPackage.TRIP__NAME:
				setName((String)newValue);
				return;
			case TripplanningPackage.TRIP__START_DATE:
				setStartDate((Date)newValue);
				return;
			case TripplanningPackage.TRIP__END_DATE:
				setEndDate((Date)newValue);
				return;
			case TripplanningPackage.TRIP__PARTICIPANTS:
				getParticipants().clear();
				getParticipants().addAll((Collection<? extends Traveler>)newValue);
				return;
			case TripplanningPackage.TRIP__DESCRIPTION:
				setDescription((String)newValue);
				return;
			case TripplanningPackage.TRIP__BUDGET_DOLLARS:
				setBudgetDollars((Double)newValue);
				return;
			case TripplanningPackage.TRIP__TENTATIVE:
				setTentative((Boolean)newValue);
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
			case TripplanningPackage.TRIP__SEGMENTS:
				getSegments().clear();
				return;
			case TripplanningPackage.TRIP__NAME:
				setName(NAME_EDEFAULT);
				return;
			case TripplanningPackage.TRIP__START_DATE:
				setStartDate(START_DATE_EDEFAULT);
				return;
			case TripplanningPackage.TRIP__END_DATE:
				setEndDate(END_DATE_EDEFAULT);
				return;
			case TripplanningPackage.TRIP__PARTICIPANTS:
				getParticipants().clear();
				return;
			case TripplanningPackage.TRIP__DESCRIPTION:
				setDescription(DESCRIPTION_EDEFAULT);
				return;
			case TripplanningPackage.TRIP__BUDGET_DOLLARS:
				setBudgetDollars(BUDGET_DOLLARS_EDEFAULT);
				return;
			case TripplanningPackage.TRIP__TENTATIVE:
				setTentative(TENTATIVE_EDEFAULT);
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
			case TripplanningPackage.TRIP__SEGMENTS:
				return segments != null && !segments.isEmpty();
			case TripplanningPackage.TRIP__NAME:
				return NAME_EDEFAULT == null ? name != null : !NAME_EDEFAULT.equals(name);
			case TripplanningPackage.TRIP__START_DATE:
				return START_DATE_EDEFAULT == null ? startDate != null : !START_DATE_EDEFAULT.equals(startDate);
			case TripplanningPackage.TRIP__END_DATE:
				return END_DATE_EDEFAULT == null ? endDate != null : !END_DATE_EDEFAULT.equals(endDate);
			case TripplanningPackage.TRIP__PARTICIPANTS:
				return participants != null && !participants.isEmpty();
			case TripplanningPackage.TRIP__DESCRIPTION:
				return DESCRIPTION_EDEFAULT == null ? description != null : !DESCRIPTION_EDEFAULT.equals(description);
			case TripplanningPackage.TRIP__BUDGET_DOLLARS:
				return budgetDollars != BUDGET_DOLLARS_EDEFAULT;
			case TripplanningPackage.TRIP__TENTATIVE:
				return tentative != TENTATIVE_EDEFAULT;
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
		result.append(" (name: ");
		result.append(name);
		result.append(", startDate: ");
		result.append(startDate);
		result.append(", endDate: ");
		result.append(endDate);
		result.append(", description: ");
		result.append(description);
		result.append(", budgetDollars: ");
		result.append(budgetDollars);
		result.append(", tentative: ");
		result.append(tentative);
		result.append(')');
		return result.toString();
	}

} //TripImpl
