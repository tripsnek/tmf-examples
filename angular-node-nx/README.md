# TMF Angular NX Example

A full-stack TypeScript application demonstrating the **@tripsnek/tmf** library - a lightweight port of the Eclipse Modeling Framework for TypeScript - as an NX monorepo.

## What This Demonstrates

1. **Shared Code-Generated Data Model** - Single Ecore metamodel generates TypeScript classes used by both server and client
2. **Full Reflective Stack** - Everything is model-driven: REST APIs, UI forms, persistence, and reference resolution

## Architecture

- **Data Model** (`packages/data-model`) - Generated from `TripPlanning.ecore` metamodel
- **Server** (`packages/server`) - Express.js with auto-generated reflective REST API
- **Client** (`packages/client`) - Angular app with TMF reflective editor

## Quick Start

```bash
# Install dependencies
npm install

# [Optional] Start the server (port 3000)
nx run server

# In another terminal, start the client (port 4200)
nx run client
```

Visit http://localhost:4200 to see the reflective model editor in action. If you launched the server, created data will be persistent across page refreshes.

## The Model

The example models a trip planning domain with:

- **Trip** - Main aggregate with segments, participants, dates, and budget
- **TripSegment** - Trip sections with origin/destination and activities  
- **Traveler** - People with interests and contact info
- **Location** - Places of interest (cities, hotels, restaurants, attractions)
- **Activity** - Planned activities for each segment

## Key TMF Features Shown

- **Code Generation** from Ecore metamodel (`node generate.mjs`) or with the [TMF Ecore Editor](https://github.com/tripsnek/tmf-ecore-editor) VSCode Extension
- **Factory Pattern** for creating model instances
- **Containment & Inverse References** with automatic bidirectional updates
- **Reflective Backend and Frontend** that adapts to any metamodel - edit the .ecore file as much as you want, or replace with your own! It requires updating only a couple of code references to your generated package 'eINSTANCE'
- **JSON Serialization** with TJson, and reflective cross-container reference resolution demonstrated with proxy-resolver.ts
- **Type Safety** across the entire stack
- 
## Useful Links

  1. [TMF Github Repository](https://github.com/tripsnek/tmf)
  2. [TMF npm package](https://www.npmjs.com/package/@tripsnek/tmf)
  3. [TMF Ecore Editor](https://github.com/tripsnek/tmf-ecore-editor) - VSCode extension for editing ecore files
  4. [TripSnek](https://tripsnek.com/) - Travel itinerary optimization app built on top of TMF
