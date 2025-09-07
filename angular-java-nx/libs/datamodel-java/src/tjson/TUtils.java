package org.tripsnek.tmf.json;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;


import org.eclipse.emf.common.util.TreeIterator;
import org.eclipse.emf.ecore.*;
import org.eclipse.emf.ecore.impl.EClassImpl;
import org.eclipse.emf.ecore.impl.EEnumImpl;

/**
 * Various utilities for interacting with TMF-modeled data objects, some
 * of which are relied upon by core TMF components (e.g. TJson) and generated
 * source code.
 */
public class TUtils {

    // All primitive EDataTypes supported by TMF
    public static final List<String> PRIMITIVES = Arrays.asList(
            "EString", "EBoolean", "EDouble", "EDoubleObject",
            "EFloat", "EFloatObject", "EInt", "EIntegerObject", "EDate");

    private static final SimpleDateFormat ISO_DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

    static {
        ISO_DATE_FORMAT.setTimeZone(TimeZone.getTimeZone("UTC"));
    }

    /**
     * Ensures all objects have IDs.
     * 
     * @param obj
     */
    public static void generateIdsForAllContained(EObject obj) {
        TreeIterator<EObject> iter = obj.eAllContents();
        while (iter.hasNext()) {
            EObject e = iter.next();
            genIdIfNotExists(e);
        }
    }

    /**
     * Sets an ID for the given object on its ID EAttribute. If
     * an ID is already specified, does nothing.
     *
     * @param obj
     */
    public static void genIdIfNotExists(EObject obj) {
        if (obj != null && obj.eClass().getEIDAttribute() != null && getFullId(obj) == null) {
            obj.eSet(obj.eClass().getEIDAttribute(), UUID.randomUUID().toString());
        }
    }

    /**
     * If an ID is specified on the object, returns that ID value. If not, a
     * new ID is assigned and that ID returned.
     *
     * @param obj
     */
    public static String getOrCreateIdForObject(EObject obj) {
        genIdIfNotExists(obj);
        return getFullId(obj);
    }

    /**
     * Gets the full ID for an object (equivalent to TypeScript's fullId())
     */
    public static String getFullId(EObject obj) {
        if (obj == null || obj.eClass().getEIDAttribute() == null) {
            return null;
        }
        Object id = obj.eGet(obj.eClass().getEIDAttribute());
        if (id == null) {
            return null;
        }
        return obj.eClass().getName() + "_" + id.toString();
    }

    public static EStructuralFeature lookupNamedField(EObject object, String fieldName) {
        EClass curClass = object.eClass();
        EStructuralFeature field = curClass.getEStructuralFeature(fieldName);

        if (field == null) {
            System.out.println(curClass.getName() + " has no field named " + fieldName);
            return null;
        }
        return field;
    }

    public static Object getNamedFieldValue(EObject object, String fieldName) {
        EStructuralFeature field = lookupNamedField(object, fieldName);
        if (field != null) {
            return object.eGet(field);
        }
        return null;
    }

    public static void setNamedFieldValue(EObject object, String fieldName, Object newValue) {
        EStructuralFeature field = lookupNamedField(object, fieldName);
        if (field != null) {
            object.eSet(field, newValue);
        }
    }

    /**
     * Parses a value for an EAttribute from its JSON representation.
     *
     * @param attr
     * @param stringVal
     */
    public static Object parseAttrValFromString(EAttribute attr, Object stringVal) {
        return parseValueFromString(attr.getEType(), String.valueOf(stringVal));
    }

    public static Object parseValueFromString(EClassifier attrType, String stringVal) {
        // If an empty string was set for the field, just return null
        if (stringVal == null ||
                (stringVal.trim().isEmpty() && attrType != EcorePackage.Literals.ESTRING)) {
            return null;
        }

        if (attrType == EcorePackage.Literals.ESTRING) {
            return stringVal;
        } else if (attrType == EcorePackage.Literals.EDOUBLE ||
                attrType == EcorePackage.Literals.EDOUBLE_OBJECT) {
            return Double.parseDouble(stringVal);
        } else if (attrType == EcorePackage.Literals.EFLOAT ||
                attrType == EcorePackage.Literals.EFLOAT_OBJECT) {
            return Float.parseFloat(stringVal);
        } else if (attrType == EcorePackage.Literals.EBOOLEAN ||
                attrType == EcorePackage.Literals.EBOOLEAN_OBJECT) {
            return Boolean.parseBoolean(stringVal);
        } else if (attrType == EcorePackage.Literals.ESHORT ||
                attrType == EcorePackage.Literals.ESHORT_OBJECT) {
            return Short.parseShort(stringVal);
        } else if (attrType == EcorePackage.Literals.EINT ||
                attrType == EcorePackage.Literals.EINTEGER_OBJECT) {
            return Integer.parseInt(stringVal);
        } else if (attrType == EcorePackage.Literals.ELONG ||
                attrType == EcorePackage.Literals.ELONG_OBJECT) {
            return Long.parseLong(stringVal);
        } else if (attrType == EcorePackage.Literals.EDATE) {
            try {
                return ISO_DATE_FORMAT.parse(stringVal);
            } catch (ParseException e) {
                try {
                    return new Date(Long.parseLong(stringVal));
                } catch (NumberFormatException ne) {
                    System.err.println("Could not parse date: " + stringVal);
                    return null;
                }
            }
        } else if (attrType instanceof EEnumImpl) {
            EEnum eenum = (EEnum) attrType;
            EEnumLiteral literal = eenum.getEEnumLiteral(stringVal);
            if (literal != null) {
                return literal.getInstance();
            } else {
                System.err.println("Could not parse literal value " + stringVal + " for " + eenum.getName());
            }
        }
        return null;
    }

    public static <T extends EObject> T carbonCopy(T obj) {
        return TJson.makeEObject(TJson.makeJson(obj));
    }

    /**
     * Returns the package and transitive closure of all contained subpackages.
     *
     * @param pkg
     * @returns
     */
    public static List<EPackage> allPackagesRecursive(EPackage pkg, List<EPackage> addTo) {
        List<EPackage> pkgs = addTo != null ? addTo : new ArrayList<>();
        pkgs.add(pkg);
        for (EPackage sp : pkg.getESubpackages()) {
            allPackagesRecursive(sp, pkgs);
        }
        return pkgs;
    }

    public static List<EPackage> allPackagesRecursive(EPackage pkg) {
        return allPackagesRecursive(pkg, null);
    }

    public static List<EClass> getRootEClasses(EPackage root) {
        if (root == null)
            return new ArrayList<>();

        List<EPackage> allPkgs = allPackagesRecursive(root);
        List<EClass> allClasses = new ArrayList<>();
        Set<EClass> containedClasses = new HashSet<>();

        // First, collect all non-abstract, non-interface classes
        for (EPackage ePackage : allPkgs) {
            for (EClassifier classifier : ePackage.getEClassifiers()) {
                if (classifier instanceof EClassImpl) {
                    EClass eClass = (EClass) classifier;
                    if (!eClass.isAbstract() && !eClass.isInterface()) {
                        allClasses.add(eClass);
                    }
                }
            }
        }

        // Then, find which classes are contained by others
        for (EClass eClass : allClasses) {
            for (EReference ref : eClass.getEAllReferences()) {
                if (ref.isContainment()) {
                    EClassifier targetType = ref.getEType();
                    if (targetType instanceof EClassImpl) {
                        EClass targetClass = (EClass) targetType;
                        containedClasses.add(targetClass);
                        // Also add all subtypes
                        for (EClass otherClass : allClasses) {
                            if (otherClass.getEAllSuperTypes().contains(targetClass)) {
                                containedClasses.add(otherClass);
                            }
                        }
                    }
                }
            }
        }

        // Return classes that are not contained by any other class
        List<EClass> result = new ArrayList<>();
        for (EClass c : allClasses) {
            if (!containedClasses.contains(c)) {
                result.add(c);
            }
        }
        Collections.reverse(result);
        return result;
    }
}