package com.example.tripplanning.controller;

import com.example.tripplanning.service.DataPersistenceService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.eclipse.emf.ecore.EClass;
import org.eclipse.emf.ecore.EObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.tripsnek.tmf.json.TJson;
import tripplanning.TripplanningPackage;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api")
public class TripPlanningController {

    @Autowired
    private DataPersistenceService dataPersistenceService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping("/status")
    public ResponseEntity<JsonNode> getStatus() {
        TripplanningPackage pkg = dataPersistenceService.getPackage();
        List<EClass> rootEClasses = dataPersistenceService.getRootEClasses();
        
        ObjectNode response = objectMapper.createObjectNode();
        response.put("status", "connected");
        response.put("package", pkg.getName());
        response.put("nsURI", pkg.getNsURI());
        response.put("totalInstances", dataPersistenceService.getTotalInstanceCount());
        response.put("dataFile", System.getProperty("user.dir") + "/data/instances.json");
        
        ArrayNode rootClassesArray = objectMapper.createArrayNode();
        for (EClass eClass : rootEClasses) {
            ObjectNode classInfo = objectMapper.createObjectNode();
            classInfo.put("name", eClass.getName());
            classInfo.put("abstract", eClass.isAbstract());
            classInfo.put("instanceCount", dataPersistenceService.getInstanceStore(eClass.getName()).size());
            rootClassesArray.add(classInfo);
        }
        response.set("rootClasses", rootClassesArray);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/export")
    public ResponseEntity<JsonNode> exportData() {
        try {
            dataPersistenceService.saveInstancesToFile();
            
            List<EClass> rootEClasses = dataPersistenceService.getRootEClasses();
            int totalInstances = dataPersistenceService.getTotalInstanceCount();
            
            ObjectNode response = objectMapper.createObjectNode();
            response.put("success", true);
            response.put("message", "Successfully saved " + totalInstances + " instances to file");
            response.put("file", System.getProperty("user.dir") + "/data/instances.json");
            response.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            
            ArrayNode classesArray = objectMapper.createArrayNode();
            for (EClass eClass : rootEClasses) {
                ObjectNode classInfo = objectMapper.createObjectNode();
                classInfo.put("name", eClass.getName());
                classInfo.put("instanceCount", dataPersistenceService.getInstanceStore(eClass.getName()).size());
                classesArray.add(classInfo);
            }
            response.set("classes", classesArray);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ObjectNode errorResponse = objectMapper.createObjectNode();
            errorResponse.put("success", false);
            errorResponse.put("error", "Failed to export instances");
            errorResponse.put("details", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("")
    public ResponseEntity<JsonNode> getApiInfo() {
        List<EClass> rootEClasses = dataPersistenceService.getRootEClasses();
        
        ArrayNode endpoints = objectMapper.createArrayNode();
        
        // Add status and export endpoints
        ObjectNode statusEndpoint = objectMapper.createObjectNode();
        statusEndpoint.put("path", "/api/status");
        statusEndpoint.put("method", "GET");
        statusEndpoint.put("description", "Get server status and instance counts");
        endpoints.add(statusEndpoint);
        
        ObjectNode exportEndpoint = objectMapper.createObjectNode();
        exportEndpoint.put("path", "/api/export");
        exportEndpoint.put("method", "GET");
        exportEndpoint.put("description", "Save all instances to file system");
        endpoints.add(exportEndpoint);
        
        // Add endpoints for each root EClass
        for (EClass eClass : rootEClasses) {
            String className = eClass.getName();
            ObjectNode classEndpoints = objectMapper.createObjectNode();
            classEndpoints.put("className", className);
            
            ArrayNode endpointList = objectMapper.createArrayNode();
            endpointList.add("GET /api/" + className);
            endpointList.add("POST /api/" + className);
            endpointList.add("GET /api/" + className + "/:id");
            endpointList.add("PUT /api/" + className + "/:id");
            endpointList.add("DELETE /api/" + className + "/:id");
            
            classEndpoints.set("endpoints", endpointList);
            endpoints.add(classEndpoints);
        }
        
        ObjectNode response = objectMapper.createObjectNode();
        response.set("endpoints", endpoints);
        
        return ResponseEntity.ok(response);
    }

    // Dynamic endpoints for each EClass
    @GetMapping("/{className}")
    public ResponseEntity<JsonNode> getAllInstances(@PathVariable String className) {
        if (!isValidClassName(className)) {
            return ResponseEntity.notFound().build();
        }
        
        Collection<EObject> instances = dataPersistenceService.getAllInstances(className);
        JsonNode jsonArray = TJson.makeJsonArray(new ArrayList<>(instances));
        return ResponseEntity.ok(jsonArray);
    }

    @PostMapping("/{className}")
    public ResponseEntity<JsonNode> createInstance(@PathVariable String className, @RequestBody JsonNode requestBody) {
        if (!isValidClassName(className)) {
            return ResponseEntity.notFound().build();
        }
        
        try {
            EObject created = dataPersistenceService.createInstance(className, requestBody);
            if (created != null) {
                JsonNode jsonResponse = TJson.makeJson(created);
                return ResponseEntity.status(HttpStatus.CREATED).body(jsonResponse);
            } else {
                ObjectNode errorResponse = objectMapper.createObjectNode();
                errorResponse.put("error", "Failed to create instance");
                return ResponseEntity.badRequest().body(errorResponse);
            }
        } catch (Exception e) {
            ObjectNode errorResponse = objectMapper.createObjectNode();
            errorResponse.put("error", "Failed to create instance");
            errorResponse.put("details", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/{className}/{id}")
    public ResponseEntity<JsonNode> getInstance(@PathVariable String className, @PathVariable String id) {
        if (!isValidClassName(className)) {
            return ResponseEntity.notFound().build();
        }
        
        EObject instance = dataPersistenceService.getInstance(className, id);
        if (instance != null) {
            JsonNode jsonResponse = TJson.makeJson(instance);
            return ResponseEntity.ok(jsonResponse);
        } else {
            ObjectNode errorResponse = objectMapper.createObjectNode();
            errorResponse.put("error", "Instance not found");
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{className}/{id}")
    public ResponseEntity<JsonNode> updateInstance(@PathVariable String className, @PathVariable String id, @RequestBody JsonNode requestBody) {
        if (!isValidClassName(className)) {
            return ResponseEntity.notFound().build();
        }
        
        try {
            EObject updated = dataPersistenceService.updateInstance(className, id, requestBody);
            if (updated != null) {
                JsonNode jsonResponse = TJson.makeJson(updated);
                return ResponseEntity.ok(jsonResponse);
            } else {
                ObjectNode errorResponse = objectMapper.createObjectNode();
                errorResponse.put("error", "Failed to update instance");
                return ResponseEntity.badRequest().body(errorResponse);
            }
        } catch (Exception e) {
            ObjectNode errorResponse = objectMapper.createObjectNode();
            errorResponse.put("error", "Failed to update instance");
            errorResponse.put("details", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @DeleteMapping("/{className}/{id}")
    public ResponseEntity<Void> deleteInstance(@PathVariable String className, @PathVariable String id) {
        if (!isValidClassName(className)) {
            return ResponseEntity.notFound().build();
        }
        
        boolean deleted = dataPersistenceService.deleteInstance(className, id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    private boolean isValidClassName(String className) {
        return dataPersistenceService.getRootEClasses().stream()
                .anyMatch(eClass -> eClass.getName().equals(className));
    }
}