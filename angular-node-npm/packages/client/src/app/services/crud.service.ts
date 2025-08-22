import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError, BehaviorSubject, interval, Subscription, firstValueFrom } from 'rxjs';
import { catchError, map, tap, switchMap } from 'rxjs/operators';
import { EObject, EClass, TJson } from '@tripsnek/tmf';
import { TripplanningFactory } from '@tmf-example/data-model';

export interface ServerStatus {
  status: string;
  package: string;
  nsURI: string;
  rootClasses: Array<{
    name: string;
    abstract: boolean;
    instanceCount: number;
  }>;
}

export interface ConnectionStatus {
  connected: boolean;
  message: string;
  lastChecked?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CrudService implements OnDestroy {
  private factory = TripplanningFactory.eINSTANCE;
  private readonly baseUrl = 'http://localhost:3000/api';
  
  // Connection status observable
  private connectionStatusSubject = new BehaviorSubject<ConnectionStatus>({
    connected: false,
    message: 'Checking connection...'
  });
  
  public connectionStatus$ = this.connectionStatusSubject.asObservable();
  
  // Periodic connection check subscription
  private connectionCheckSubscription?: Subscription;

  constructor(private http: HttpClient) {
    this.checkConnection();
    
    // Check connection every 5 seconds
    this.connectionCheckSubscription = interval(5000).pipe(
      switchMap(() => this.checkConnection())
    ).subscribe();
  }

  ngOnDestroy() {
    if (this.connectionCheckSubscription) {
      this.connectionCheckSubscription.unsubscribe();
    }
  }

  /**
   * Check server connection status
   */
  checkConnection(): Observable<ServerStatus | null> {
    return this.http.get<ServerStatus>(`${this.baseUrl}/status`).pipe(
      tap(status => {
        const currentStatus = this.connectionStatusSubject.value;
        // Only update if status changed or it's the first check
        if (!currentStatus.connected || currentStatus.message !== `Connected to ${status.package}`) {
          this.connectionStatusSubject.next({
            connected: true,
            message: `Connected to ${status.package}`,
            lastChecked: new Date()
          });
        }
      }),
      catchError(error => {
        const currentStatus = this.connectionStatusSubject.value;
        // Only update if status changed
        if (currentStatus.connected || currentStatus.message !== 'Server not available') {
          this.connectionStatusSubject.next({
            connected: false,
            message: 'Server not available',
            lastChecked: new Date()
          });
        }
        return of(null);
      })
    );
  }

  /**
   * Get all instances of a root EClass
   */
  getAllInstances(eClass: EClass): Observable<EObject[]> {
    const className = eClass.getName();
    return this.http.get<any[]>(`${this.baseUrl}/${className}`).pipe(
      map(jsonArray => TJson.makeEObjectArray(jsonArray)),
      catchError(this.handleError)
    );
  }

  /**
   * Get a single instance by ID
   */
  getInstance(eClass: EClass, id: string): Observable<EObject | null> {
    const className = eClass.getName();
    return this.http.get<any>(`${this.baseUrl}/${className}/${id}`).pipe(
      map(json => TJson.makeEObject(json)!),
      catchError(error => {
        if (error.status === 404) {
          return of(null);
        }
        return this.handleError(error);
      })
    );
  }

  /**
   * Create a new instance
   */
  createInstance(eObject: EObject): Observable<EObject> {
    const className = eObject.eClass().getName();
    const json = TJson.makeJson(eObject);
    
    return this.http.post<any>(`${this.baseUrl}/${className}`, json).pipe(
      map(responseJson => TJson.makeEObject(responseJson)!),
      catchError(this.handleError)
    );
  }

  /**
   * Update an existing instance
   */
  updateInstance(eObject: EObject): Observable<EObject> {
    const className = eObject.eClass().getName();
    const id = this.getObjectId(eObject);
    
    if (!id) {
      return throwError(() => new Error('Cannot update object without ID'));
    }
    
    const json = TJson.makeJson(eObject);
    
    return this.http.put<any>(`${this.baseUrl}/${className}/${id}`, json).pipe(
      map(responseJson => TJson.makeEObject(responseJson)!),
      catchError(this.handleError)
    );
  }

  /**
   * Delete an instance
   */
  deleteInstance(eObject: EObject): Observable<void> {
    const className = eObject.eClass().getName();
    const id = this.getObjectId(eObject);
    
    if (!id) {
      return throwError(() => new Error('Cannot delete object without ID'));
    }
    
    return this.http.delete<void>(`${this.baseUrl}/${className}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Save an instance (create or update based on whether it exists on server)
   */
  saveInstance(eObject: EObject, isNew: boolean = false): Observable<EObject> {
    if (isNew) {
      return this.createInstance(eObject);
    } else {
      return this.updateInstance(eObject);
    }
  }

  /**
   * Load all instances for all root classes
   */
  loadAllRootInstances(rootClasses: EClass[]): Observable<Map<EClass, EObject[]>> {
    const result = new Map<EClass, EObject[]>();
    const observables: Observable<void>[] = [];

    rootClasses.forEach(eClass => {
      const obs = this.getAllInstances(eClass).pipe(
        map(instances => {
          result.set(eClass, instances);
        }),
        catchError(error => {
          console.error(`Failed to load instances for ${eClass.getName()}:`, error);
          result.set(eClass, []);
          return of(undefined);
        })
      );
      observables.push(obs);
    });

    if (observables.length === 0) {
      return of(result);
    }

    return new Observable(observer => {
      const promises = observables.map(obs => firstValueFrom(obs));
      Promise.all(promises).then(() => {
        observer.next(result);
        observer.complete();
      }).catch(error => {
        observer.error(error);
      });
    });
  }

  /**
   * Helper to get ID from an EObject
   */
  private getObjectId(eObject: EObject): string | undefined {
    const idAttr = eObject.eClass().getEStructuralFeature('id');
    if (idAttr) {
      const id = eObject.eGet(idAttr);
      return id ? String(id) : undefined;
    }
    return undefined;
  }

  /**
   * Error handler
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}