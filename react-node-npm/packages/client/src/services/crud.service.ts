import axios, { AxiosError } from 'axios';
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

class CrudService {
  private factory = TripplanningFactory.eINSTANCE;
  private readonly baseUrl = '/api';  // Will be proxied by Vite
  
  /**
   * Check server connection status
   */
  async checkConnection(): Promise<ServerStatus | null> {
    try {
      const response = await axios.get<ServerStatus>(`${this.baseUrl}/status`);
      return response.data;
    } catch (error) {
      console.error('Connection check failed:', error);
      return null;
    }
  }

  /**
   * Get all instances of a root EClass
   */
  async getAllInstances(eClass: EClass): Promise<EObject[]> {
    try {
      const className = eClass.getName();
      const response = await axios.get<any[]>(`${this.baseUrl}/${className}`);
      return TJson.makeEObjectArray(response.data);
    } catch (error) {
      this.handleError(error as AxiosError);
      return [];
    }
  }

  /**
   * Get a single instance by ID
   */
  async getInstance(eClass: EClass, id: string): Promise<EObject | null> {
    try {
      const className = eClass.getName();
      const response = await axios.get<any>(`${this.baseUrl}/${className}/${id}`);
      return TJson.makeEObject(response.data)!;
    } catch (error) {
      if ((error as AxiosError).response?.status === 404) {
        return null;
      }
      this.handleError(error as AxiosError);
      return null;
    }
  }

  /**
   * Create a new instance
   */
  async createInstance(eObject: EObject): Promise<EObject> {
    const className = eObject.eClass().getName();
    const json = TJson.makeJson(eObject);
    
    const response = await axios.post<any>(`${this.baseUrl}/${className}`, json);
    return TJson.makeEObject(response.data)!;
  }

  /**
   * Update an existing instance
   */
  async updateInstance(eObject: EObject): Promise<EObject> {
    const className = eObject.eClass().getName();
    const id = this.getObjectId(eObject);
    
    if (!id) {
      throw new Error('Cannot update object without ID');
    }
    
    const json = TJson.makeJson(eObject);
    const response = await axios.put<any>(`${this.baseUrl}/${className}/${id}`, json);
    return TJson.makeEObject(response.data)!;
  }

  /**
   * Delete an instance
   */
  async deleteInstance(eObject: EObject): Promise<void> {
    const className = eObject.eClass().getName();
    const id = this.getObjectId(eObject);
    
    if (!id) {
      throw new Error('Cannot delete object without ID');
    }
    
    await axios.delete(`${this.baseUrl}/${className}/${id}`);
  }

  /**
   * Save an instance (create or update based on whether it exists on server)
   */
  async saveInstance(eObject: EObject, isNew: boolean = false): Promise<EObject> {
    if (isNew) {
      return this.createInstance(eObject);
    } else {
      return this.updateInstance(eObject);
    }
  }

  /**
   * Load all instances for all root classes
   */
  async loadAllRootInstances(rootClasses: EClass[]): Promise<Map<EClass, EObject[]>> {
    const result = new Map<EClass, EObject[]>();
    
    const promises = rootClasses.map(async (eClass) => {
      try {
        const instances = await this.getAllInstances(eClass);
        result.set(eClass, instances);
      } catch (error) {
        console.error(`Failed to load instances for ${eClass.getName()}:`, error);
        result.set(eClass, []);
      }
    });

    await Promise.all(promises);
    return result;
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
  private handleError(error: AxiosError): void {
    let errorMessage = 'An error occurred';
    
    if (error.response) {
      // Server-side error
      errorMessage = `Error Code: ${error.response.status}\nMessage: ${error.message}`;
    } else if (error.request) {
      // Network error
      errorMessage = `Network error: ${error.message}`;
    } else {
      // Client-side error
      errorMessage = `Error: ${error.message}`;
    }
    
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
}

export const crudService = new CrudService();