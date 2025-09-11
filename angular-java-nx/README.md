# TMF Angular-Java Nx Example

A hybrid full-stack application demonstrating **TMF (TypeScript Model Framework)** integration with **Eclipse EMF (Java)** - showcasing how the same Ecore metamodel can generate both TypeScript and Java model code in an Nx monorepo.

## What This Demonstrates

1. **Polyglot Shared Data Model** - Single Ecore metamodel generates both TypeScript (TMF) and Java (EMF) classes
2. **Hybrid Architecture** - Angular frontend with Spring Boot backend, both using the same domain model
3. **Cross-Language Serialization** - TJson implementations in both TypeScript and Java ensure identical serialization behavior
4. **Full Reflective Stack** - Model-driven REST APIs, UI forms, and reference resolution across language boundaries

## Architecture

- **Data Model (TypeScript)** (`libs/datamodel-ts`) - Generated from `TripPlanning.ecore` using TMF
- **Data Model (Java)** (`libs/datamodel-java`) - Generated from `TripPlanning.ecore` using Eclipse EMF
- **Backend** (`apps/backend`) - Spring Boot with EMF-based model handling
- **Client** (`apps/client`) - Angular app with TMF reflective editor
- **Model** (`model/`) - Shared Ecore metamodel definitions

## Quick Start

```bash
# Install dependencies
npm install

# Start Java backend (port 8080)
nx serve backend

# In another terminal, start Angular client (port 4200)
nx serve client

# Or run both concurrently
nx run-many --target=serve --projects=backend,client --parallel
```

Visit http://localhost:4200 to see the reflective model editor in action. Data created in the Angular frontend is persisted by the Java Spring Boot backend.

## The Model

The example models a trip planning domain with:

- **Trip** - Main aggregate with segments, participants, dates, and budget
- **TripSegment** - Trip sections with origin/destination and activities  
- **Traveler** - People with interests and contact info
- **Location** - Places of interest (cities, hotels, restaurants, attractions)
- **Activity** - Planned activities for each segment

## Key Features Demonstrated

### Cross-Language Model Generation
- **TMF (TypeScript)** - Lightweight EMF port for frontend development
- **Eclipse EMF (Java)** - Industry-standard modeling framework for backend
- **Shared Metamodel** - Single `TripPlanning.ecore` generates both implementations

### Identical Serialization
- **TJson TypeScript** - JSON serialization with cross-reference support
- **TJson Java** - Matching serialization behavior ensuring data compatibility

### Modern Stack Integration
- **Angular 19** with standalone components and TMF reflective editor
- **Spring Boot** with EMF integration and custom JSON utilities
- **Nx Monorepo** with optimized build caching and dependency management

## Development Commands
### Model Generation
```bash
# Generate TypeScript models from Ecore
npm run gen:datamodel-ts

# Java models require Eclipse EMF tooling
# Open model/*.ecore and *.genmodel files in Eclipse with EMF
```

## Model Development Workflow

1. **Edit Metamodel** - Modify `model/TripPlanning.ecore` 
2. **Generate TypeScript** - Run `npm run gen:datamodel-ts`
3. **Generate Java** - Use Eclipse EMF tooling to regenerate Java classes (You just need to open the .ecore and .genmodel files)

## Key TMF/EMF Features Shown

- **Factory Pattern** for creating model instances (`TripplanningFactory.eINSTANCE`)
- **Package Singletons** for metamodel access (`TripplanningPackage.eINSTANCE`)
- **Containment & Cross-References** with automatic bidirectional updates
- **Reflective APIs** that adapt to any metamodel changes
- **Observable Collections** (EList) for reactive model relationships
- **Type Safety** across TypeScript frontend and Java backend

## Project Structure

```
angular-java-nx/
├── apps/
│   ├── backend/          # Spring Boot backend
│   └── client/           # Angular frontend
├── libs/
│   ├── datamodel-java/   # Generated Java EMF classes
│   └── datamodel-ts/     # Generated TypeScript TMF classes
├── model/
│   └── TripPlanning.ecore # Shared metamodel
└── tools/                # Nx workspace configuration
```

## Useful Links

1. [TMF Github Repository](https://github.com/tripsnek/tmf)
2. [TMF npm package](https://www.npmjs.com/package/@tripsnek/tmf)
3. [Eclipse EMF Documentation](https://eclipse.dev/modeling/emf/)
4. [TMF Ecore Editor](https://github.com/tripsnek/tmf-ecore-editor) - VSCode extension for editing ecore files
5. [TripSnek](https://tripsnek.com/) - Travel itinerary optimization app built on top of TMF