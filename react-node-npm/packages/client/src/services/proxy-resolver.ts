// proxy-resolver.ts
import { EObject, EReference, EClass, EList } from '@tripsnek/tmf';

/**
 * ProxyInfo holds information about a proxy reference that needs resolution
 */
interface ProxyInfo {
  sourceObject: EObject;        // The object containing the proxy reference
  feature: EReference;          // The reference feature
  proxy: EObject;              // The proxy object
  isMany: boolean;             // Whether this is a many-valued reference
  index?: number;              // Index in collection (for many-valued refs)
}

/**
 * ProxyResolver handles resolution of proxy objects in TMF models.
 * 
 * Proxy objects are created when deserializing references to objects
 * in different containment hierarchies. These proxies have the correct
 * type and ID but lack other data and return true for eIsProxy().
 * 
 * This resolver finds all proxies in a model and replaces them with
 * their corresponding real objects.
 */
export class ProxyResolver {
  
  /**
   * Resolves all proxy references in the given root objects.
   * 
   * @param rootObjects All root objects in the model
   * @returns Number of proxies resolved
   */
  public static resolveProxies(rootObjects: EObject[]): number {
    console.log('Starting proxy resolution for', rootObjects.length, 'root objects');
    
    // Step 1: Build index of all real objects by their full ID
    const objectIndex = this.buildObjectIndex(rootObjects);
    console.log('Built index with', objectIndex.size, 'objects');
    
    // Step 2: Find all proxy references
    const proxyInfos = this.findAllProxies(rootObjects);
    console.log('Found', proxyInfos.length, 'proxy references to resolve');
    
    // Step 3: Resolve each proxy
    let resolvedCount = 0;
    for (const proxyInfo of proxyInfos) {
      if (this.resolveProxy(proxyInfo, objectIndex)) {
        resolvedCount++;
      }
    }
    
    console.log('Successfully resolved', resolvedCount, 'of', proxyInfos.length, 'proxies');
    return resolvedCount;
  }
  
  /**
   * Resolves proxies for a single root object and its containment tree.
   * Useful when incrementally loading objects.
   * 
   * @param newObject The newly loaded object
   * @param existingObjects All existing objects in the model
   * @returns Number of proxies resolved
   */
  public static resolveProxiesForObject(newObject: EObject, existingObjects: EObject[]): number {
    console.log('Resolving proxies for newly loaded object:', newObject.fullId());
    
    // Build index of all objects (including the new one)
    const allObjects = [...existingObjects, newObject];
    const objectIndex = this.buildObjectIndex(allObjects);
    
    // Find proxies only in the new object's tree
    const proxyInfos = this.findProxiesInTree(newObject);
    console.log('Found', proxyInfos.length, 'proxies in new object tree');
    
    // Also check if any existing objects have proxies pointing to the new object
    const reverseProxies = this.findProxiesPointingTo(newObject, existingObjects);
    console.log('Found', reverseProxies.length, 'existing proxies pointing to new object');
    
    // Resolve all found proxies
    let resolvedCount = 0;
    for (const proxyInfo of [...proxyInfos, ...reverseProxies]) {
      if (this.resolveProxy(proxyInfo, objectIndex)) {
        resolvedCount++;
      }
    }
    
    return resolvedCount;
  }
  
  /**
   * Builds an index mapping full IDs to their corresponding EObjects.
   * Includes all objects in the containment hierarchies.
   */
  private static buildObjectIndex(rootObjects: EObject[]): Map<string, EObject> {
    const index = new Map<string, EObject>();
    
    for (const root of rootObjects) {
      // Skip proxy objects when building the index
      if (!root.eIsProxy()) {
        index.set(root.fullId(), root);
        
        // Add all contained objects
        for (const contained of root.eAllContents()) {
          if (!contained.eIsProxy()) {
            index.set(contained.fullId(), contained);
          }
        }
      }
    }
    
    return index;
  }
  
  /**
   * Finds all proxy references in the given objects and their containment trees.
   */
  private static findAllProxies(rootObjects: EObject[]): ProxyInfo[] {
    const proxyInfos: ProxyInfo[] = [];
    
    for (const root of rootObjects) {
      proxyInfos.push(...this.findProxiesInTree(root));
    }
    
    return proxyInfos;
  }
  
  /**
   * Finds all proxy references within a single object's containment tree.
   */
  private static findProxiesInTree(root: EObject): ProxyInfo[] {
    const proxyInfos: ProxyInfo[] = [];
    
    // Check the root object
    proxyInfos.push(...this.findProxiesInObject(root));
    
    // Check all contained objects
    for (const contained of root.eAllContents()) {
      proxyInfos.push(...this.findProxiesInObject(contained));
    }
    
    return proxyInfos;
  }
  
  /**
   * Finds proxy references within a single object's references.
   */
  private static findProxiesInObject(obj: EObject): ProxyInfo[] {
    const proxyInfos: ProxyInfo[] = [];
    
    // Check all references (skip containment refs as they shouldn't have proxies)
    for (const ref of obj.eClass().getEAllReferences().elements()) {
      if (!ref.isContainment()) {
        if (ref.isMany()) {
          // Many-valued reference
          const list = <EList<EObject>>obj.eGet(ref);
          if (list && list.elements) {
            const elements = list.elements();
            elements.forEach((element, index) => {
              if (element && element.eIsProxy && element.eIsProxy()) {
                proxyInfos.push({
                  sourceObject: obj,
                  feature: ref,
                  proxy: element,
                  isMany: true,
                  index: index
                });
              }
            });
          }
        } else {
          // Single-valued reference
          const value = obj.eGet(ref);
          if (value && value.eIsProxy && value.eIsProxy()) {
            proxyInfos.push({
              sourceObject: obj,
              feature: ref,
              proxy: value,
              isMany: false
            });
          }
        }
      }
    }
    
    return proxyInfos;
  }
  
  /**
   * Finds existing proxy references that point to a newly loaded object.
   * This is important when incrementally loading objects.
   */
  private static findProxiesPointingTo(targetObject: EObject, existingObjects: EObject[]): ProxyInfo[] {
    const proxyInfos: ProxyInfo[] = [];
    const targetId = targetObject.fullId();
    
    for (const obj of existingObjects) {
      // Check object and its containment tree
      const objectsToCheck = [obj, ...obj.eAllContents()];
      
      for (const checkObj of objectsToCheck) {
        for (const ref of checkObj.eClass().getEAllReferences().elements()) {
          if (!ref.isContainment()) {
            if (ref.isMany()) {
              const list = <EList<EObject>>checkObj.eGet(ref);
              if (list && list.elements) {
                const elements = list.elements();
                elements.forEach((element, index) => {
                  if (element && element.eIsProxy && element.eIsProxy() && element.fullId() === targetId) {
                    proxyInfos.push({
                      sourceObject: checkObj,
                      feature: ref,
                      proxy: element,
                      isMany: true,
                      index: index
                    });
                  }
                });
              }
            } else {
              const value = checkObj.eGet(ref);
              if (value && value.eIsProxy && value.eIsProxy() && value.fullId() === targetId) {
                proxyInfos.push({
                  sourceObject: checkObj,
                  feature: ref,
                  proxy: value,
                  isMany: false
                });
              }
            }
          }
        }
      }
    }
    
    return proxyInfos;
  }
  
  /**
   * Resolves a single proxy reference by replacing it with the real object.
   * 
   * @returns true if successfully resolved, false otherwise
   */
  private static resolveProxy(proxyInfo: ProxyInfo, objectIndex: Map<string, EObject>): boolean {
    const proxyId = proxyInfo.proxy.fullId();
    const realObject = objectIndex.get(proxyId);
    
    if (!realObject) {
      console.warn(`Could not resolve proxy ${proxyId} - object not found in index`);
      return false;
    }
    
    // Verify the real object is not itself a proxy
    if (realObject.eIsProxy()) {
      console.warn(`Object ${proxyId} in index is itself a proxy - skipping`);
      return false;
    }
    
    // Replace the proxy with the real object
    if (proxyInfo.isMany) {
      // For many-valued references, we need to replace at the specific index
      const list = proxyInfo.sourceObject.eGet(proxyInfo.feature);
      if (list && list.set && proxyInfo.index !== undefined) {
        try {
          list.set(proxyInfo.index, realObject);
          console.debug(`Resolved proxy ${proxyId} in ${proxyInfo.sourceObject.fullId()}.${proxyInfo.feature.getName()}[${proxyInfo.index}]`);
          return true;
        } catch (error) {
          console.error(`Failed to replace proxy in list:`, error);
          return false;
        }
      }
    } else {
      // For single-valued references, just set the value
      try {
        proxyInfo.sourceObject.eSet(proxyInfo.feature, realObject);
        console.debug(`Resolved proxy ${proxyId} in ${proxyInfo.sourceObject.fullId()}.${proxyInfo.feature.getName()}`);
        return true;
      } catch (error) {
        console.error(`Failed to replace proxy:`, error);
        return false;
      }
    }
    
    return false;
  }
  
  /**
   * Utility method to count total proxies in a model (for debugging).
   */
  public static countProxies(rootObjects: EObject[]): number {
    return this.findAllProxies(rootObjects).length;
  }
  
  /**
   * Utility method to get a report of unresolved proxies (for debugging).
   */
  public static getUnresolvedProxyReport(rootObjects: EObject[]): string[] {
    const proxyInfos = this.findAllProxies(rootObjects);
    const report: string[] = [];
    
    for (const info of proxyInfos) {
      const location = `${info.sourceObject.fullId()}.${info.feature.getName()}`;
      const proxyId = info.proxy.fullId();
      report.push(`Unresolved proxy: ${proxyId} at ${location}`);
    }
    
    return report;
  }
}