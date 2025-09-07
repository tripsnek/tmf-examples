# TMF Examples

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Example applications demonstrating the **@tripsnek/tmf** library ([github](https://github.com/tripsnek/tmf) • [npm](https://www.npmjs.com/package/@tripsnek/tmf)) - a lightweight TypeScript port of the Eclipse Modeling Framework (EMF). These examples show how to build full-stack applications using model-driven development principles.

## A Quick Demo video

[https://github.com/user-attachments/assets/ee35ca1a-24d5-4a43-8926-96dffecd8d0e](https://github.com/user-attachments/assets/208731e7-e674-45d6-af5b-6426763feed9)

Quick demonstration of adding types/features to an ecore model and generating code (courtest of the [TMF Ecore Editor](https://github.com/tripsnek/tmf-ecore-editor)) in a full stack reflective application, specifically the [NX Angular/Node example](./angular-node-nx/).

## Examples

### [angular-node-npm/](./angular-node-npm/)
Full-stack npm workspaces monorepo with Angular frontend and Express.js backend.
- **Architecture**: npm workspaces
- **Frontend**: Angular 19 with TMF reflective editor
- **Backend**: Express.js with auto-generated REST API

### [react-node-npm/](./react-node-npm/)
React-based implementation using the same architecture as the Angular example.
- **Architecture**: npm workspaces  
- **Frontend**: React with TMF reflective editor
- **Backend**: Express.js with auto-generated REST API

### [angular-node-nx/](./angular-node-nx/)
Alternative structure using Nx workspace tooling.
- **Architecture**: Nx monorepo
- **Frontend**: Angular 19 with TMF reflective editor
- **Backend**: Express.js with auto-generated REST API

## Key TMF Features

- **Code Generation** from Ecore metamodel (`node generate.mjs` in each project) or with the [TMF Ecore Editor](https://github.com/tripsnek/tmf-ecore-editor) VSCode Extension
- **Factory Pattern** for creating model instances
- **Containment & Inverse References** with automatic bidirectional updates
- **Reflective Backend and Frontend** that adapts to any metamodel - edit the .ecore file as much as you want, or replace with your own! It requires updating only a couple of code references to your generated package 'eINSTANCE'
- **JSON Serialization** with TJson, and reflective cross-container reference resolution demonstrated with proxy-resolver.ts
- **Type Safety** across the entire stack

## Getting Started

Choose an example and follow its README for detailed setup instructions. 

## Useful Links

- [TMF GitHub Repository](https://github.com/tripsnek/tmf)
- [TMF npm Package](https://www.npmjs.com/package/@tripsnek/tmf)
- [TMF Ecore Editor](https://github.com/tripsnek/tmf-ecore-editor) - VSCode extension
- [TripSnek](https://tripsnek.com/) - Real-world app built with TMF
