import patientsData from '../../data/patients';

import { Patient, NonSensitivePatient, NewPatient, EntryWithoutId, Entry } from '../types';

import { v1 as uuid } from 'uuid';

const getEntries = () : Patient[] => {
  return patientsData;
};

const findById = (id: string): Patient | undefined => {
  const entry = patientsData.find(d => d.id === id);
  return entry;
};

const getNonSensitiveEntries = () : NonSensitivePatient[] => {
  return patientsData.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};

const addPatient = (patient: NewPatient): Patient => {
  const id: string = uuid();
  const newPatient = {
    id,
    entries: [],
    ...patient
  };
  patientsData.push(newPatient);
  return newPatient;
};

const addEntry = (id: string, entry: EntryWithoutId): Entry => {
  const patient = patientsData.find(d => d.id === id);
  if (!patient) {
    throw new Error('Patient not found');
  }
  const newEntry = {
    id: uuid(),
    ...entry
  };
  patient.entries.push(newEntry);
  return newEntry;
};

export default {
  getEntries,
  findById,
  getNonSensitiveEntries,
  addPatient,
  addEntry
};