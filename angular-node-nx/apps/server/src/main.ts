import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import {
  TripplanningPackage,
} from "@tmf-example/data-model";
import { EClass, EObject, TJson, TUtils } from "@tripsnek/tmf";

const pkg = TripplanningPackage.eINSTANCE;

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Data directory and file path
const DATA_DIR = path.join(process.cwd(), 'data');
const INSTANCES_FILE = path.join(DATA_DIR, 'instances.json');

// In-memory storage for instances, keyed by EClass name
const instanceStore = new Map<string, Map<string, EObject>>();

// Get root EClasses from the package
const rootEClasses: EClass[] = TUtils.getRootEClasses(pkg);

// Initialize storage for each root EClass
rootEClasses.forEach((eClass) => {
  instanceStore.set(eClass.getName(), new Map<string, EObject>());
});

// Helper function to get ID from an EObject
function getObjectId(eObject: EObject): string | undefined {
  const idAttr = eObject.eClass().getEStructuralFeature("id");
  if (idAttr) {
    const id = eObject.eGet(idAttr);
    return id ? String(id) : undefined;
  }
  return undefined;
}

// Helper function to set ID on an EObject
function setObjectId(eObject: EObject, id: string): void {
  const idAttr = eObject.eClass().getEStructuralFeature("id");
  if (idAttr) {
    eObject.eSet(idAttr, id);
  }
}

// Ensure data directory exists
function ensureDataDirectory(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log(`Created data directory: ${DATA_DIR}`);
  }
}

// Save all instances to JSON file
function saveInstancesToFile(): void {
  try {
    ensureDataDirectory();
    
    const dataToSave: Record<string, any[]> = {};
    
    // Convert all instances to JSON format
    rootEClasses.forEach((eClass) => {
      const className = eClass.getName();
      const classStore = instanceStore.get(className)!;
      const instances = Array.from(classStore.values());
      dataToSave[className] = TJson.makeJsonArray(instances);
    });
    
    // Write to file
    fs.writeFileSync(INSTANCES_FILE, JSON.stringify(dataToSave, null, 2));
    console.log(`Saved ${Object.keys(dataToSave).reduce((sum, key) => sum + dataToSave[key].length, 0)} instances to ${INSTANCES_FILE}`);
  } catch (error) {
    console.error("Error saving instances to file:", error);
    throw error;
  }
}

// Load instances from JSON file
function loadInstancesFromFile(): void {
  try {
    if (!fs.existsSync(INSTANCES_FILE)) {
      console.log(`No instances file found at ${INSTANCES_FILE}, starting with empty storage`);
      return;
    }
    
    const fileContent = fs.readFileSync(INSTANCES_FILE, 'utf8');
    const savedData: Record<string, any[]> = JSON.parse(fileContent);
    
    let totalLoaded = 0;
    
    // Load instances for each EClass
    rootEClasses.forEach((eClass) => {
      const className = eClass.getName();
      const classStore = instanceStore.get(className)!;
      const savedInstances = savedData[className] || [];
      
      savedInstances.forEach((instanceJson: any) => {
        try {
          const eObject = TJson.makeEObject(instanceJson);
          if (eObject) {
            const id = getObjectId(eObject);
            if (id) {
              classStore.set(id, eObject);
              totalLoaded++;
            } else {
              console.warn(`Skipping instance without ID in class ${className}`);
            }
          }
        } catch (error) {
          console.error(`Error deserializing instance in class ${className}:`, error);
        }
      });
    });
    
    console.log(`Loaded ${totalLoaded} instances from ${INSTANCES_FILE}`);
  } catch (error) {
    console.error("Error loading instances from file:", error);
    // Don't throw here - we want the server to start even if loading fails
  }
}

// Load instances on startup
loadInstancesFromFile();

// Status endpoint
app.get("/api/status", (req, res) => {
  const totalInstances = rootEClasses.reduce((sum, eClass) => {
    return sum + (instanceStore.get(eClass.getName())?.size || 0);
  }, 0);
  
  res.json({
    status: "connected",
    package: pkg.getName(),
    nsURI: pkg.getNsURI(),
    totalInstances,
    dataFile: INSTANCES_FILE,
    rootClasses: rootEClasses.map((ec) => ({
      name: ec.getName(),
      abstract: ec.isAbstract(),
      instanceCount: instanceStore.get(ec.getName())?.size || 0,
    })),
  });
});

// Export/Save endpoint
app.get("/api/export", (req, res) => {
  try {
    saveInstancesToFile();
    
    const totalInstances = rootEClasses.reduce((sum, eClass) => {
      return sum + (instanceStore.get(eClass.getName())?.size || 0);
    }, 0);
    
    res.json({
      success: true,
      message: `Successfully saved ${totalInstances} instances to file`,
      file: INSTANCES_FILE,
      timestamp: new Date().toISOString(),
      classes: rootEClasses.map((ec) => ({
        name: ec.getName(),
        instanceCount: instanceStore.get(ec.getName())?.size || 0,
      })),
    });
  } catch (error) {
    console.error("Export failed:", error);
    res.status(500).json({
      success: false,
      error: "Failed to export instances",
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// Generate reflective endpoints for each root EClass
rootEClasses.forEach((eClass) => {
  const className = eClass.getName();
  const classPath = `/api/${className}`;
  const classStore = instanceStore.get(className)!;

  // GET all instances of this EClass
  app.get(classPath, (req, res) => {
    const instances = Array.from(classStore.values());
    const jsonArray = TJson.makeJsonArray(instances);
    res.json(jsonArray);
  });

  // POST create new instance
  app.post(classPath, (req, res) => {
    try {
      // Create new instance from JSON
      const eObject = TJson.makeEObject(req.body);

      // Ensure it has an ID
      if (eObject) {
        let id = getObjectId(eObject);
        if (!id) {
          // Generate ID if not provided
          id = `${className}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          setObjectId(eObject, id);
        }

        // Store the instance
        classStore.set(id, eObject);

        // Auto-save after create (optional - remove if you prefer manual saves)
        saveInstancesToFile();

        // Return the created instance as JSON
        res.status(201).json(TJson.makeJson(eObject));
      }
    } catch (error) {
      console.error("Error creating instance:", error);
      res
        .status(400)
        .json({ error: "Failed to create instance", details: error });
    }
  });

  // GET single instance by ID
  app.get(`${classPath}/:id`, (req, res) => {
    const instance = classStore.get(req.params.id);
    if (instance) {
      res.json(TJson.makeJson(instance));
    } else {
      res.status(404).json({ error: "Instance not found" });
    }
  });

  // PUT update instance by ID
  app.put(`${classPath}/:id`, (req, res) => {
    try {
      const id = req.params.id;

      // Deserialize the updated object
      const updatedObject = TJson.makeEObject(req.body);

      if (updatedObject) {
        // Ensure the ID matches
        setObjectId(updatedObject, id);

        // Replace in store
        classStore.set(id, updatedObject);

        // Auto-save after update (optional - remove if you prefer manual saves)
        saveInstancesToFile();

        res.json(TJson.makeJson(updatedObject));
      }
    } catch (error) {
      console.error("Error updating instance:", error);
      res
        .status(400)
        .json({ error: "Failed to update instance", details: error });
    }
  });

  // DELETE instance by ID
  app.delete(`${classPath}/:id`, (req, res) => {
    const id = req.params.id;
    if (classStore.has(id)) {
      classStore.delete(id);
      
      // Auto-save after delete (optional - remove if you prefer manual saves)
      saveInstancesToFile();
      
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Instance not found" });
    }
  });

  console.log(`Registered endpoints for ${className}:`);
  console.log(`  GET    ${classPath} - Get all instances`);
  console.log(`  POST   ${classPath} - Create new instance`);
  console.log(`  GET    ${classPath}/:id - Get instance by ID`);
  console.log(`  PUT    ${classPath}/:id - Update instance`);
  console.log(`  DELETE ${classPath}/:id - Delete instance`);
});

// List all available endpoints
app.get("/api", (req, res) => {
  const endpoints = [
    {
      path: "/api/status",
      method: "GET",
      description: "Get server status and instance counts"
    },
    {
      path: "/api/export",
      method: "GET", 
      description: "Save all instances to file system"
    },
    ...rootEClasses.map((eClass) => ({
      className: eClass.getName(),
      endpoints: [
        `GET /api/${eClass.getName()}`,
        `POST /api/${eClass.getName()}`,
        `GET /api/${eClass.getName()}/:id`,
        `PUT /api/${eClass.getName()}/:id`,
        `DELETE /api/${eClass.getName()}/:id`,
      ],
    }))
  ];
  res.json({ endpoints });
});

app.listen(port, () => {
  console.log(
    `\nTMF Reflective REST Server running at http://localhost:${port}`
  );
  console.log(`\nPackage: ${pkg.getName()}`);
  console.log(`NS URI: ${pkg.getNsURI()}`);
  console.log(
    `\nRoot EClasses: ${rootEClasses.map((ec) => ec.getName()).join(", ")}`
  );
  console.log(`\nAPI endpoint: http://localhost:${port}/api`);
  console.log(`Status endpoint: http://localhost:${port}/api/status`);
  console.log(`Export endpoint: http://localhost:${port}/api/export`);
  console.log(`\nData will be saved to: ${INSTANCES_FILE}`);
});