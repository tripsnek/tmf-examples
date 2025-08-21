import { Injectable } from '@angular/core';
import { TripplanningFactory } from '@tmf-example/data-model';

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  private factory = TripplanningFactory.eINSTANCE;

  getWelcomeMessage(): string {
    return 'Welcome to Trip Planning with Angular 19!';
  }

  //TODO: implement service to talk to new server here

}