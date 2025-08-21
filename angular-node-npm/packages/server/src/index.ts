import express from 'express';
import cors from 'cors';
import { TripplanningFactory, TripplanningPackage } from '@tmf-example/data-model';
import {EClass, EClassImpl, EObject, EObjectImpl, TJson, TUtils} from '@tripsnek/tmf';

const pkg = TripplanningPackage.eINSTANCE;

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const eobj = new EClassImpl();
eobj.setName('TestClass');
console.log("Can I import tripsnek types: " + eobj.getName())
console.log("instanceof works? " + (TripplanningPackage.eINSTANCE.getTripSegment() instanceof EClassImpl));

//TODO: implement server here
const rootEClasses : EClass[] = TUtils.getRootEClasses(pkg);


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});