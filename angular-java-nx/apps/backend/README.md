# Trip Planning Backend (Java/Spring Boot)

This is a Spring Boot backend that provides the same REST API as the Node.js server but implemented in Java using Eclipse EMF and the generated Java data model.

## Features

- **Spring Boot** web application
- **Eclipse EMF** for model-driven architecture
- **TJson** for JSON serialization/deserialization
- **File-based persistence** to `data/instances.json`
- **CORS enabled** for Angular frontend
- **Reflective REST API** auto-generated from metamodel

## Dependencies

- Spring Boot 3.2.0
- Eclipse EMF Core 2.39.0 / 2.40.0
- Jackson 2.15.2 for JSON processing
- Java 21

## API Endpoints

### Status and Management
- `GET /api/status` - Server status and instance counts
- `GET /api/export` - Save all instances to file system
- `GET /api` - List all available endpoints

### Dynamic Model Endpoints
For each root EClass (Trip, Traveler, Location):
- `GET /api/{ClassName}` - Get all instances
- `POST /api/{ClassName}` - Create new instance
- `GET /api/{ClassName}/{id}` - Get instance by ID
- `PUT /api/{ClassName}/{id}` - Update instance
- `DELETE /api/{ClassName}/{id}` - Delete instance

## Running

### Development
```bash
# Using Maven directly
mvn spring-boot:run

# Using Nx
npx nx serve backend
```

### Building
```bash
# Using Maven
mvn clean package

# Using Nx  
npx nx build backend
```

## Configuration

- **Port**: 3000 (matches Node.js server)
- **CORS**: Allows `http://localhost:4200` (Angular dev server)
- **Data**: Stored in `data/instances.json`

## Generated Code Integration

The build process automatically copies generated Java sources:
- Trip planning model from `../../libs/datamodel-java/src/tripplanning/`
- TJson utilities from `../../libs/datamodel-java/src/tjson/`

## Data Model

Uses the same Eclipse EMF-based model as the TypeScript version:
- **Trip** - Main aggregate with segments, participants, dates, budget
- **TripSegment** - Journey sections with origin/destination  
- **Traveler** - People with interests and contact info
- **Location** - Places (cities, hotels, restaurants, attractions)
- **IDedEntity** - Abstract base with ID attribute