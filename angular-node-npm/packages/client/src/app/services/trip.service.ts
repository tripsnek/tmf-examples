import { Injectable } from '@angular/core';
import { TripplanningFactory } from '@tmf-example/data-model';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private factory = TripplanningFactory.eINSTANCE;

  getWelcomeMessage(): string {
    return 'Welcome to Trip Planning with Angular 19!';
  }

  testFactory(): string {
    if (this.factory) {
      return 'Successfully loaded data model factory';
    }
    return 'Factory not available';
  }

  // Example method that would use your generated types
  // createTrip(name: string): Trip {
  //   return this.factory.createTrip();
  // }
}