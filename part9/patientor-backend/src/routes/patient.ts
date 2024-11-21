import express, { Request, Response, NextFunction } from 'express';
import patientService from '../services/patientService';
import { Patient, NewPatient, NonSensitivePatient, EntryWithoutId, Entry } from '../types';
import { newPatientSchema, newEntrySchema } from '../utils/newPatientUtil';
import { z } from 'zod';

const router = express.Router();

router.get('/', (_req, res: Response<NonSensitivePatient[]>) => {
  res.send(patientService.getNonSensitiveEntries());
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  const patient = patientService.findById(id);
  if (patient) {
    res.send(patient);
  } else {
    res.sendStatus(404);
  }
});

const NewPatientParser = (req: Request, _res: Response, next: NextFunction) => { 
  try {
    newPatientSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const newEntryParser = (req: Request, _res: Response, next: NextFunction) => { 
  try {
    newEntrySchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction) => { 
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};

router.post('/', NewPatientParser, (req: Request<unknown, unknown, NewPatient>, res: Response<Patient>) => {
  const addedEntry = patientService.addPatient(req.body);
  res.json(addedEntry);
});

router.post('/:id/entries', newEntryParser, (req: Request<{ id: string }, unknown, EntryWithoutId>, res: Response<Entry>) => {
  const addedEntry = patientService.addEntry(req.params.id, req.body);
  res.json(addedEntry);
});

router.use(errorMiddleware);

export default router;