import 'zone.js';

import { bootstrapApplication } from '@angular/platform-browser';
import { TMFReflectiveEditorComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common';

bootstrapApplication(TMFReflectiveEditorComponent, {
  providers: [
    provideRouter([]), // Add routes here when needed
    importProvidersFrom(CommonModule)
  ]
}).catch(err => console.error(err));