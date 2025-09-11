import { TripplanningPackage } from './tripplanning-package.js';
import { TripplanningFactory } from './tripplanning-factory.js';
import { TJson, EClassImpl } from '@tripsnek/tmf';


/**
 * A "global initializer" solution for ensuring that package contents
 * for an entire package hierarchy can be initialized on the first
 * 'touch' of any individual package, without triggering circular import
 * issues.
 *
 * The way it works:
 *  1. Whenever any package is 'touched' (by simply being referenced in code) it
 *     initialized it's '_eINSTANCE' field, and uses it to create its initial structures
 *     and Literals references. This does *not* require touching other packages, so there
 *     is no risk of circular imports.
 *  2. When the first invocation of '<package>.eINSTANCE' is made, each package intercepts
 *     that as a static 'get' on the property, and calls registerAll() on this instance to ensure that
 *     ALL packages are touched and have their initial contents created.
 *  3. The first time registerAll() is called, the package hierarchy (sub/super) is created, and
 *     all package contents are initialized.
 */
export class TripplanningPackageInitializer {
  private static registered = false;

  static registerAll() {
    //if registration is completed, return immediately
    if (this.registered) return;
    this.registered = true;
    const tripplanning = TripplanningPackage._eINSTANCE;


    //set package/sub-package relationships


    //initialize package contents
    tripplanning.initializePackageContents();


    //initialize package to factory refs
    tripplanning.setEFactoryInstance(TripplanningFactory.eINSTANCE);


    const allPkgs = [tripplanning];

    for (const p of allPkgs) {
      for (const e of p.getEClassifiers()) {
        if (e instanceof EClassImpl) {
          e.recomputeAllLists();
        }
      }
    }

    //default TJson configuration
    TJson.addPackages(allPkgs);

  }
}