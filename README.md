# TMF Examples

Example applications demonstrating the **@tripsnek/tmf** library - a lightweight TypeScript port of the Eclipse Modeling Framework (EMF). These examples show how to build full-stack applications using model-driven development principles.

## Examples

### [angular-node-npm/](./angular-node-npm/) - **Main Example** ⭐
Full-stack npm workspaces monorepo with Angular frontend and Express.js backend.
- **Architecture**: npm workspaces
- **Frontend**: Angular 19 with TMF reflective editor
- **Backend**: Express.js with auto-generated REST API
- **Features**: Complete CRUD operations, file persistence, keyboard shortcuts

### [react-node-npm/](./react-node-npm/)
React-based implementation using the same architecture as the Angular example.
- **Architecture**: npm workspaces  
- **Frontend**: React with TMF reflective editor
- **Backend**: Express.js with auto-generated REST API
- **Features**: Same model-driven approach with React UI

### [angular-node-nx/](./angular-node-nx/)
Alternative structure using Nx workspace tooling.
- **Architecture**: Nx monorepo
- **Frontend**: Angular 19 with TMF reflective editor
- **Backend**: Express.js with auto-generated REST API
- **Features**: Nx build system with incremental builds and dependency graph

## Key TMF Features

- **Code Generation** from Ecore metamodel (`generate.mjs`) or with the [TMF Ecore Editor](https://github.com/tripsnek/tmf-ecore-editor) VSCode Extension
- **Factory Pattern** for creating model instances
- **Containment & Inverse References** with automatic bidirectional updates
- **Reflective Backend and Frontend** that adapts to any metamodel - edit the .ecore file as much as you want, or replace with your own! It requires updating only a couple of code references to your generated package 'eINSTANCE'
- **JSON Serialization** with TJson, and reflective cross-container reference resolution demonstrated with proxy-resolver.ts
- **Type Safety** across the entire stack

## Getting Started

Choose an example and follow its README for detailed setup instructions. 

Each example can run independently with its own development servers:
- **Server**: http://localhost:3000 (Express.js API)
- **Client**: http://localhost:4200 (Angular/React UI)

## Userful Links

- [TMF GitHub Repository](https://github.com/tripsnek/tmf)
- [TMF npm Package](https://www.npmjs.com/package/@tripsnek/tmf)
- [TMF Ecore Editor](https://github.com/tripsnek/tmf-ecore-editor) - VSCode extension
- [TripSnek](https://tripsnek.com/) - Real-world app built with TMF