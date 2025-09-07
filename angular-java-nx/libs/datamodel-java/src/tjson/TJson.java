package org.tripsnek.tmf.json;

import java.text.SimpleDateFormat;
import java.util.*;

import org.eclipse.emf.common.util.EList;
import org.eclipse.emf.common.util.TreeIterator;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.*;
import org.eclipse.emf.ecore.impl.EClassImpl;
import org.eclipse.emf.ecore.impl.EReferenceImpl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

/**
 * Utilities for converting between EObjects and JSON. Usage:
 *
 * (1) TJson.makeJson(EObject) - converts an EObject to JSON.
 * (2) TJson.makeEObject(json) - deserializes EObject encoded with (1).
 * (3) TJson.makeJsonArray(EObject[]) - converts an array of EObjects to a JSON Array.
 * (4) TJson.makeEObjectArray(json) - converts a JSON Array to an array of EObjects.
 *
 * You may also configure which EClasses are eligible for conversion with
 * 'addPackages(EPackage[])' and 'setPackages(EPackage[])'.
 */
public class TJson {
    // The name of the special JSON field that indicates each object's type
    public static final String JSON_FIELD_TYPESCRIPT_TYPE = "@type";
    
    // These will be automatically added by the PackageInitializer when a Package is "touched"
    private static List<EPackage> packages = new ArrayList<>();
    
    private static final ObjectMapper objectMapper = new ObjectMapper();
    private static final SimpleDateFormat ISO_DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
    
    static {
        ISO_DATE_FORMAT.setTimeZone(TimeZone.getTimeZone("UTC"));
    }

    public static void setPackages(List<EPackage> packages) {
        TJson.packages = packages;
    }

    // Automatically used by package initializers to add JSON serialization support when they are touched
    public static void addPackages(List<EPackage> packages) {
        for (EPackage p : packages) {
            if (!TJson.packages.contains(p)) {
                TJson.packages.add(p);
            }
        }
    }

    // The currently registered EPackages
    public static List<EPackage> getPackages() {
        return TJson.packages;
    }

    // Simple check - warn if no packages registered
    private static void throwErrorIfNotInitialized() {
        if (packages.isEmpty()) {
            throw new RuntimeException(
                "TJson: No packages registered. Call TJson.setPackages([...]) or " +
                "import and touch your package (e.g., MyPackage.eINSTANCE) before using TJson."
            );
        }
    }

    /**
     * Converts a TMF EObject to JSON.
     *
     * @param obj
     */
    public static JsonNode makeJson(EObject obj) {
        throwErrorIfNotInitialized();
        return eObjectToJsonAux(obj, new HashMap<>(), false);
    }

    /**
     * Converts an object in JSON Object into a TMF EObject.
     * Creates proxy objects for unresolved non-containment references.
     *
     * @param jsonObj
     * @return
     */
    @SuppressWarnings("unchecked")
    public static <T extends EObject> T makeEObject(JsonNode jsonObj) {
        throwErrorIfNotInitialized();
        
        List<SerializedReference> serializedReferences = new ArrayList<>();

        // Build containment hierarchy
        EObject eobj = jsonToEObject(jsonObj, serializedReferences);
        if (eobj == null) return null;

        // Build index of all contained objects
        Map<String, EObject> idsToObjs = new HashMap<>();
        TreeIterator<EObject> iter = eobj.eAllContents();
        while(iter.hasNext()){
            EObject elem = iter.next();
            String fullId = TUtils.getFullId(elem);
            if (fullId != null) {
                idsToObjs.put(fullId, elem);
            }
        }
        String rootFullId = TUtils.getFullId(eobj);
        if (rootFullId != null) {
            idsToObjs.put(rootFullId, eobj);
        }

        // Deserialize references, collecting unresolved ones
        List<SerializedReference> unresolvedRefs = new ArrayList<>();
        for (SerializedReference ref : serializedReferences) {
            if (!ref.deserialize(idsToObjs)) {
                unresolvedRefs.add(ref);
            }
        }

        // Create proxies for unresolved references
        for (SerializedReference ref : unresolvedRefs) {
            createAndSetProxy(ref, idsToObjs);
        }

        return (T) eobj;
    }

    /**
     * Creates a proxy object for an unresolved reference and sets it on the source object.
     * 
     * @param ref The unresolved serialized reference
     * @param idsToObjs Map of all resolved objects
     */
    private static void createAndSetProxy(SerializedReference ref, Map<String, EObject> idsToObjs) {
        EObject fromObj = idsToObjs.get(ref.fromId);
        if (fromObj == null) return;

        EStructuralFeature feature = fromObj.eClass().getEStructuralFeature(ref.refName);
        if (feature == null || !(feature instanceof EReferenceImpl)) return;

        // Check if proxy already exists for this target
        EObject proxy = idsToObjs.get(ref.toId);
        if (proxy == null) {
            proxy = createProxy(ref.toId, (EReference) feature);
            if (proxy != null) {
                // Add proxy to the index so future references to it can be resolved
                idsToObjs.put(ref.toId, proxy);
            }
        }

        if (proxy != null) {
            // Set the reference
            if (feature.isMany()) {
                @SuppressWarnings("unchecked")
                EList<EObject> list = (EList<EObject>) fromObj.eGet(feature);
                list.add(proxy);
            } else {
                fromObj.eSet(feature, proxy);
            }
        }
    }

    /**
     * Creates a proxy EObject for an unresolved reference.
     * 
     * @param fullId The full ID of the target object (format: "ClassName_actualId")
     * @param reference The reference feature to determine the target EClass
     * @returns A proxy EObject or null if creation failed
     */
    private static EObject createProxy(String fullId, EReference reference) {
        // Parse the fullId to extract class name and actual ID
        int underscoreIndex = fullId.indexOf('_');
        if (underscoreIndex == -1) {
            System.err.println("Invalid fullId format for proxy creation: " + fullId);
            return null;
        }
        
        String className = fullId.substring(0, underscoreIndex);
        String actualId = fullId.substring(underscoreIndex + 1);
        
        // Get the target EClass from the reference type
        EClass targetEClass = (EClass) reference.getEType();
        if (targetEClass == null) {
            System.err.println("No target EClass found for reference: " + reference.getName());
            return null;
        }
        
        // Verify the class name matches (safety check)
        if (!targetEClass.getName().equals(className)) {
            System.err.println("Class name mismatch for proxy: expected " + className + ", got " + targetEClass.getName());
            // Continue anyway - the reference type is authoritative
        }
        
        // Find the appropriate EPackage and factory
        for (EPackage pkg : packages) {
            for (EClassifier classifier : pkg.getEClassifiers()) {
                if (classifier == targetEClass) {
                    try {
                        // Create the proxy object
                        EObject proxy = pkg.getEFactoryInstance().create(targetEClass);
                        
                        // Set the ID attribute if it exists
                        EAttribute idAttribute = targetEClass.getEIDAttribute();
                        if (idAttribute != null) {
                            try {
                                // Parse the ID value to the correct type using TUtils
                                Object parsedId = TUtils.parseAttrValFromString(idAttribute, actualId);
                                proxy.eSet(idAttribute, parsedId);
                            } catch (Exception error) {
                                System.err.println("Failed to parse ID value for proxy: " + actualId + " - " + error.getMessage());
                            }
                        }
                        
                        // Mark as proxy
                        ((InternalEObject) proxy).eSetProxyURI(URI.createURI(fullId));
                        
                        // System.out.println("Created proxy object for " + fullId);
                        return proxy;
                    } catch (Exception error) {
                        System.err.println("Failed to create proxy for " + fullId + ": " + error.getMessage());
                        return null;
                    }
                }
            }
        }
        
        System.err.println("No EPackage found containing EClass " + targetEClass.getName() + " for proxy creation");
        return null;
    }

    /**
     * Converts a TMF EObject array to JSON array.
     *
     * @param objs
     */
    public static ArrayNode makeJsonArray(List<? extends EObject> objs) {
        throwErrorIfNotInitialized();
        
        ArrayNode jsonArray = objectMapper.createArrayNode();
        if (objs != null) {
            for (EObject element : objs) {
                jsonArray.add(makeJson(element));
            }
        }
        return jsonArray;
    }

    /**
     * Converts an object in JSON Array into an array of TMF EObjects.
     *
     * @param jsonArray
     * @return
     */
    public static List<? extends EObject> makeEObjectArray(ArrayNode jsonArray) {
        throwErrorIfNotInitialized();
        
        List<EObject> eobjArray = new ArrayList<>();
        if (jsonArray != null && jsonArray.isArray()) {
            for (JsonNode element : jsonArray) {
                EObject eobj = makeEObject(element);
                if (eobj != null) {
                    eobjArray.add(eobj);
                }
            }
        }
        return eobjArray;
    }

    private static EObject jsonToEObject(JsonNode jsonObj, List<SerializedReference> serializedRefs) {
        if (jsonObj == null || jsonObj.isNull()) {
            throw new RuntimeException("ERROR: null value for JSON Object. Cannot convert to EObject.");
        }

        // Get the type indicator and instantiate the TMF Object
        JsonNode typeNode = jsonObj.get(JSON_FIELD_TYPESCRIPT_TYPE);
        if (typeNode == null) {
            System.err.println("ERROR: No value for " + JSON_FIELD_TYPESCRIPT_TYPE + " was specified for the JSON object: " + jsonObj);
            return null;
        }
        String objectType = typeNode.asText();

        EClass eClass = null;
        EObject eObj = null;
        for (EPackage pkg : packages) {
            eClass = eClassByNameCaseInsensitive(objectType, pkg);
            if (eClass != null) {
                eObj = pkg.getEFactoryInstance().create(eClass);
                break;
            }
        }
        
        if (eClass != null && eObj != null) {
            // Handle all primitive attributes
            setPrimitiveValuesOnJson(jsonObj, eObj);
            // Handle all references
            for (EReference ref : eObj.eClass().getEAllReferences()) {
                deserializeReferencedObjects(jsonObj, eObj, ref, serializedRefs);
            }
        }
        return eObj;
    }

    private static void deserializeReferencedObjects(JsonNode jsonObj, EObject dObj, EReference ref, List<SerializedReference> serializedRefs) {
        String jsonFieldName = getJsonFieldName(ref);
        // Multi-valued references
        if (ref.isMany()) {
            deserializeManyValuedReference(jsonObj, jsonFieldName, ref, dObj, serializedRefs);
        }
        // Single-valued references
        else {
            deserializeSingleValuedReference(jsonObj, jsonFieldName, ref, dObj, serializedRefs);
        }
    }

    private static void deserializeSingleValuedReference(JsonNode jsonObj, String jsonFieldName, EReference ref, EObject tObj, List<SerializedReference> serializedRefs) {
        JsonNode referencedObj = jsonObj.get(jsonFieldName);
        if (referencedObj != null && !referencedObj.isNull()) {
            if (ref.isContainment()) {
                JsonNode containeTJsonObj = referencedObj;
                if (!containeTJsonObj.has(JSON_FIELD_TYPESCRIPT_TYPE)) {
                    ((ObjectNode) containeTJsonObj).put(JSON_FIELD_TYPESCRIPT_TYPE, ref.getEType().getName());
                }
                EObject referencedEmfObj = jsonToEObject(containeTJsonObj, serializedRefs);
                tObj.eSet(ref, referencedEmfObj);
            } else {
                serializedRefs.add(SerializedReference.create(TUtils.getFullId(tObj), referencedObj.asText(), ref.getName()));
            }
        }
    }

    private static void deserializeManyValuedReference(JsonNode jsonObj, String jsonFieldName, EReference ref, EObject tObj, List<SerializedReference> serializedRefs) {
        JsonNode jsonArray = jsonObj.get(jsonFieldName);
        if (jsonArray != null && jsonArray.isArray()) {
            for (JsonNode containedTJsonObj : jsonArray) {
                if (ref.isContainment()) {
                    if (!containedTJsonObj.has(JSON_FIELD_TYPESCRIPT_TYPE)) {
                        ((ObjectNode) containedTJsonObj).put(JSON_FIELD_TYPESCRIPT_TYPE, ref.getEType().getName());
                    }
                    EObject containedDObj = jsonToEObject(containedTJsonObj, serializedRefs);
                    @SuppressWarnings("unchecked")
                    EList<EObject> list = (EList<EObject>) tObj.eGet(ref);
                    list.add(containedDObj);
                } else {
                    serializedRefs.add(SerializedReference.create(TUtils.getFullId(tObj), containedTJsonObj.asText(), ref.getName()));
                }
            }
        }
    }

    protected static JsonNode eObjectToJsonAux(EObject obj, Map<EObject, JsonNode> serializedSoFar, boolean attributesOnly) {
        // Make sure there is really an object to convert
        if (obj == null) {
            return objectMapper.nullNode();
        }

        ObjectNode jsonObj = objectMapper.createObjectNode();

        // Generate IDs for all Entities in the hierarchy which do not have them
        if (TUtils.getFullId(obj) == null) {
            TUtils.genIdIfNotExists(obj);
        }

        // Add a type indicator for everything (the class name)
        jsonObj.put(JSON_FIELD_TYPESCRIPT_TYPE, obj.eClass().getName());
        
        // Handle all primitive attributes
        attributesToJson(obj, jsonObj);
        
        // Handle all references
        if (!attributesOnly) {
            referencesToJson(obj, serializedSoFar, jsonObj);
        }
        return jsonObj;
    }

    private static void referencesToJson(EObject obj, Map<EObject, JsonNode> serializedSoFar, ObjectNode jsonObj) {
        for (EReference ref : obj.eClass().getEAllReferences()) {
            if (!ref.isVolatile() && !ref.isTransient()) {
                // Multi-valued references
                if (ref.isMany()) {
                    manyValuedReferenceToJson(obj, ref, serializedSoFar, jsonObj);
                }
                // Single-valued references
                else {
                    singleValuedRefToJson(obj, ref, serializedSoFar, jsonObj);
                }
            }
        }
    }

    @SuppressWarnings("unchecked")
    private static void manyValuedReferenceToJson(EObject obj, EReference ref, Map<EObject, JsonNode> serializedSoFar, ObjectNode jsonObj) {
        String jsonFieldName = getJsonFieldName(ref);
        ArrayNode jsonArray = objectMapper.createArrayNode();
        EList<EObject> referencedObjects = (EList<EObject>) obj.eGet(ref);
        for (EObject referencedObj : referencedObjects) {
            if (referencedObj != null) {
                if (ref.isContainment()) {
                    JsonNode referenceTJsonObj = eObjectToJsonAux(referencedObj, serializedSoFar, false);
                    if (referenceTJsonObj != null && !referenceTJsonObj.isNull()) {
                        jsonArray.add(referenceTJsonObj);
                    }
                } else {
                    String serializedRef = new SerializedReference(
                        TUtils.getOrCreateIdForObject(obj),
                        TUtils.getOrCreateIdForObject(referencedObj),
                        jsonFieldName
                    ).serialize();
                    jsonArray.add(serializedRef);
                }
            }
        }
        jsonObj.set(jsonFieldName, jsonArray);
    }

    private static void singleValuedRefToJson(EObject obj, EReference ref, Map<EObject, JsonNode> serializedSoFar, ObjectNode jsonObj) {
        String jsonFieldName = getJsonFieldName(ref);
        EObject referencedObj = (EObject) obj.eGet(ref);
        if (referencedObj != null) {
            JsonNode referenceTJsonObj = null;
            // If the object is 'contained', we generate its full representation
            if (ref.isContainment()) {
                referenceTJsonObj = eObjectToJsonAux(referencedObj, serializedSoFar, false);
            }
            // Otherwise, we generate a serialized pointer to the referenced object
            else {
                if (referencedObj.eClass().getEIDAttribute() != null) {
                    String serializedRef = new SerializedReference(
                        TUtils.getOrCreateIdForObject(obj),
                        TUtils.getOrCreateIdForObject(referencedObj),
                        jsonFieldName
                    ).serialize();
                    referenceTJsonObj = objectMapper.valueToTree(serializedRef);
                }
            }
            if (referenceTJsonObj != null && !referenceTJsonObj.isNull()) {
                jsonObj.set(jsonFieldName, referenceTJsonObj);
            }
        }
    }

    private static void attributesToJson(EObject obj, ObjectNode jsonObj) {
        for (EAttribute attr : obj.eClass().getEAllAttributes()) {
            if (!attr.isVolatile() && !attr.isTransient()) {
                String jsonFieldName = getJsonFieldName(attr);
                Object origVal = obj.eGet(attr);
                JsonNode convertedVal = primitiveValueToJson(attr, origVal);
                if (convertedVal != null) {
                    jsonObj.set(jsonFieldName, convertedVal);
                }
            }
        }
    }

    /**
     * Converts a primitive value (or a Date) for use inside JSON.
     *
     * @param attr
     * @param val
     * @return
     */
    @SuppressWarnings("unchecked")
    public static JsonNode primitiveValueToJson(EAttribute attr, Object val) {
        if (val == null) {
            return objectMapper.nullNode();
        }
        
        // Serialize many-valued eattributes
        if (attr.isMany()) {
            ArrayNode arrayNode = objectMapper.createArrayNode();
            EList<Object> list = (EList<Object>) val;
            for (Object v : list) {
                if (v instanceof Date) {
                    arrayNode.add(ISO_DATE_FORMAT.format((Date) v));
                } else {
                    arrayNode.add(objectMapper.valueToTree(v));
                }
            }
            return arrayNode;
        }
        
        if (val instanceof Date) {
            return objectMapper.valueToTree(ISO_DATE_FORMAT.format((Date) val));
        }
        
        return objectMapper.valueToTree(val);
    }

    public static String getJsonFieldName(EStructuralFeature feature) {
        return feature.getName();
    }

    public static EClass eClassByNameCaseInsensitive(String objectType, EPackage pkg) {
        EClass dClass = (EClass) pkg.getEClassifier(objectType);
        if (dClass == null) {
            // Case insensitive checking of names
            for (EClassifier eclass : pkg.getEClassifiers()) {
                if (eclass instanceof EClassImpl && 
                    eclass.getName().toLowerCase().equals(objectType.toLowerCase())) {
                    dClass = (EClass) eclass;
                    break;
                }
            }
        }
        return dClass;
    }

    /**
     * Sets all primitive (EAttribute) values on the eobject, given a
     * JSONObject with the same fields.
     *
     * @param propsObj
     * @param eObj
     */
    @SuppressWarnings("unchecked")
    public static void setPrimitiveValuesOnJson(JsonNode propsObj, EObject eObj) {
        for (EAttribute attr : eObj.eClass().getEAllAttributes()) {
            String jsonFieldName = getJsonFieldName(attr);
            JsonNode jsonVal = propsObj.get(jsonFieldName);
            if (jsonVal != null && !jsonVal.isNull()) {
                if (attr.isMany()) {
                    if (jsonVal.isArray()) {
                        EList<Object> coll = (EList<Object>) eObj.eGet(attr);
                        for (JsonNode o : jsonVal) {
                            Object parsed = TUtils.parseAttrValFromString(attr, o.asText());
                            if (parsed != null) {
                                coll.add(parsed);
                            }
                        }
                    }
                } else {
                    Object tVal = TUtils.parseAttrValFromString(attr, jsonVal.asText());
                    if (tVal != null) {
                        eObj.eSet(attr, tVal);
                    } else {
                        System.err.println("JSON parse failed for " + eObj.eClass().getName() + "." + attr.getName() + " with value " + jsonVal.asText());
                    }
                }
            }
        }
    }
}

/**
 * Helper class for handling serialized references
 */
class SerializedReference {
    String fromId;
    String toId;
    String refName;

    public SerializedReference(String from, String to, String ref) {
        this.fromId = from;
        this.toId = to;
        this.refName = ref;
    }

    public static SerializedReference create(String fromDId, String toDId, String fromRef) {
        return new SerializedReference(fromDId, toDId, fromRef);
    }

    /**
     * Swizzles the object to JSON.
     */
    public String serialize() {
        return this.toId;
    }

    /**
     * Restores the swizzled reference.
     *
     * @param allObjs
     * @returns true if the reference was successfully resolved, false if target object not found
     */
    @SuppressWarnings("unchecked")
    public boolean deserialize(Map<String, EObject> allObjs) {
        // Gather the objects and feature
        EObject fromObj = allObjs.get(this.fromId);
        EObject toObj = allObjs.get(this.toId);
        if (fromObj != null && toObj != null) {
            EStructuralFeature feature = fromObj.eClass().getEStructuralFeature(this.refName);

            // Enforce the reference
            if (feature != null) {
                if (feature.isMany()) {
                    EList<EObject> list = (EList<EObject>) fromObj.eGet(feature);
                    list.add(toObj);
                } else {
                    fromObj.eSet(feature, toObj);
                }
                return true;
            }
        }
        return false;
    }
}