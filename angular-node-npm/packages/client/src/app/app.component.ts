import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripService } from './services/trip.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Trip Planning App</h1>
    <p>{{ message }}</p>
    <div>
      <h2>Data Model Test</h2>
      <p>Factory initialized: {{ factoryTest }}</p>
    </div>
  `,
  styles: [`
    h1 { color: #1976d2; }
    div { margin-top: 20px; padding: 10px; border: 1px solid #ccc; }
  `]
})
export class AppComponent implements OnInit {
  message = '';
  factoryTest = '';

  // Modern Angular 19 injection pattern
  private tripService = inject(TripService);

  ngOnInit() {
    this.message = this.tripService.getWelcomeMessage();
    this.factoryTest = this.tripService.testFactory();
  }
}