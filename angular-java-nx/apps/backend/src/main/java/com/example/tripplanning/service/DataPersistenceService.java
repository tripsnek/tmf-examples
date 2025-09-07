package com.example.tripplanning.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.eclipse.emf.ecore.EClass;
import org.eclipse.emf.ecore.EObject;
import org.springframework.stereotype.Service;
import org.tripsnek.tmf.json.TJson;
import org.tripsnek.tmf.json.TUtils;
import tripplanning.TripplanningPackage;

import javax.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class DataPersistenceService {

    private final TripplanningPackage pkg = TripplanningPackage.eINSTANCE;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Map<String, Map<String, EObject>> instanceStore = new ConcurrentHashMap<>();
    private final List<EClass> rootEClasses;
    private final Path dataDir;
    private final Path instancesFile;

    public DataPersistenceService() {
        // Initialize TJson with the package
        TJson.addPackages(Arrays.asList(pkg));
        
        // Get root EClasses
        this.rootEClasses = TUtils.getRootEClasses(pkg);
        
        // Setup data directory and file paths
        this.dataDir = Paths.get(System.getProperty("user.dir"), "data");
        this.instancesFile = dataDir.resolve("instances.json");
        
        // Initialize storage for each root EClass
        for (EClass eClass : rootEClasses) {
            instanceStore.put(eClass.getName(), new ConcurrentHashMap<>());
        }
    }

    @PostConstruct
    public void init() {
        ensureDataDirectory();
        loadInstancesFromFile();
    }

    public List<EClass> getRootEClasses() {
        return Collections.unmodifiableList(rootEClasses);
    }

    public TripplanningPackage getPackage() {
        return pkg;
    }

    public Map<String, EObject> getInstanceStore(String className) {
        return instanceStore.get(className);
    }

    public Collection<EObject> getAllInstances(String className) {
        Map<String, EObject> classStore = instanceStore.get(className);
        return classStore != null ? classStore.values() : Collections.emptyList();
    }

    public EObject getInstance(String className, String id) {
        Map<String, EObject> classStore = instanceStore.get(className);
        return classStore != null ? classStore.get(id) : null;
    }

    public EObject createInstance(String className, JsonNode jsonData) {
        try {
            EObject eObject = TJson.makeEObject(jsonData);
            if (eObject != null) {
                String id = getObjectId(eObject);
                if (id == null) {
                    // Generate ID if not provided
                    id = generateId(className);
                    setObjectId(eObject, id);
                }

                Map<String, EObject> classStore = instanceStore.get(className);
                if (classStore != null) {
                    classStore.put(id, eObject);
                    saveInstancesToFile();
                    return eObject;
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Error creating instance: " + e.getMessage(), e);
        }
        return null;
    }

    public EObject updateInstance(String className, String id, JsonNode jsonData) {
        try {
            EObject updatedObject = TJson.makeEObject(jsonData);
            if (updatedObject != null) {
                // Ensure the ID matches
                setObjectId(updatedObject, id);

                Map<String, EObject> classStore = instanceStore.get(className);
                if (classStore != null) {
                    classStore.put(id, updatedObject);
                    saveInstancesToFile();
                    return updatedObject;
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Error updating instance: " + e.getMessage(), e);
        }
        return null;
    }

    public boolean deleteInstance(String className, String id) {
        Map<String, EObject> classStore = instanceStore.get(className);
        if (classStore != null && classStore.containsKey(id)) {
            classStore.remove(id);
            saveInstancesToFile();
            return true;
        }
        return false;
    }

    public synchronized void saveInstancesToFile() {
        try {
            ensureDataDirectory();

            ObjectNode dataToSave = objectMapper.createObjectNode();

            // Convert all instances to JSON format
            for (EClass eClass : rootEClasses) {
                String className = eClass.getName();
                Map<String, EObject> classStore = instanceStore.get(className);
                List<EObject> instances = new ArrayList<>(classStore.values());
                JsonNode jsonArray = TJson.makeJsonArray(instances);
                dataToSave.set(className, jsonArray);
            }

            // Write to file
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(instancesFile.toFile(), dataToSave);
            
            int totalInstances = rootEClasses.stream()
                    .mapToInt(eClass -> instanceStore.get(eClass.getName()).size())
                    .sum();
            
            System.out.println("Saved " + totalInstances + " instances to " + instancesFile);
        } catch (IOException e) {
            System.err.println("Error saving instances to file: " + e.getMessage());
            throw new RuntimeException("Failed to save instances", e);
        }
    }

    private void loadInstancesFromFile() {
        try {
            if (!Files.exists(instancesFile)) {
                System.out.println("No instances file found at " + instancesFile + ", starting with empty storage");
                return;
            }

            JsonNode savedData = objectMapper.readTree(instancesFile.toFile());
            int totalLoaded = 0;

            // Load instances for each EClass
            for (EClass eClass : rootEClasses) {
                String className = eClass.getName();
                Map<String, EObject> classStore = instanceStore.get(className);
                JsonNode savedInstances = savedData.get(className);
                
                if (savedInstances != null && savedInstances.isArray()) {
                    for (JsonNode instanceJson : savedInstances) {
                        try {
                            EObject eObject = TJson.makeEObject(instanceJson);
                            if (eObject != null) {
                                String id = getObjectId(eObject);
                                if (id != null) {
                                    classStore.put(id, eObject);
                                    totalLoaded++;
                                } else {
                                    System.out.println("Skipping instance without ID in class " + className);
                                }
                            }
                        } catch (Exception e) {
                            System.err.println("Error deserializing instance in class " + className + ": " + e.getMessage());
                        }
                    }
                }
            }

            System.out.println("Loaded " + totalLoaded + " instances from " + instancesFile);
        } catch (IOException e) {
            System.err.println("Error loading instances from file: " + e.getMessage());
            // Don't throw here - we want the server to start even if loading fails
        }
    }

    private void ensureDataDirectory() {
        try {
            if (!Files.exists(dataDir)) {
                Files.createDirectories(dataDir);
                System.out.println("Created data directory: " + dataDir);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to create data directory: " + dataDir, e);
        }
    }

    private String getObjectId(EObject eObject) {
        if (eObject == null || eObject.eClass().getEIDAttribute() == null) {
            return null;
        }
        Object id = eObject.eGet(eObject.eClass().getEIDAttribute());
        return id != null ? id.toString() : null;
    }

    private void setObjectId(EObject eObject, String id) {
        if (eObject != null && eObject.eClass().getEIDAttribute() != null) {
            eObject.eSet(eObject.eClass().getEIDAttribute(), id);
        }
    }

    private String generateId(String className) {
        return className + "_" + System.currentTimeMillis() + "_" + 
               Integer.toHexString(new Random().nextInt(0x1000000));
    }

    public int getTotalInstanceCount() {
        return rootEClasses.stream()
                .mapToInt(eClass -> instanceStore.get(eClass.getName()).size())
                .sum();
    }
}