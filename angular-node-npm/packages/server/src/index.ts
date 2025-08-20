import express from 'express';
import cors from 'cors';
import { TripplanningFactory, TripplanningPackage } from '@tmf-example/data-model';
import {EClassImpl, EObject, EObjectImpl} from '@tripsnek/tmf';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const eobj = new EClassImpl();
eobj.setName('TestClass');
console.log("Can I import tripsnek types: " + eobj.getName())
console.log("instanceof works? " + (TripplanningPackage.eINSTANCE.getTripSegment() instanceof EClassImpl));

// Example route using your data model
app.get('/api/trips', (req, res) => {
  const factory = TripplanningFactory.eINSTANCE;
  // Use your generated factories and types here
  res.json({ message: 'Trips endpoint', factory: !!factory });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});