import diagnosesData from '../../data/diagnoses';

import { DiagnosisEntry } from '../types';

const getEntries = () : DiagnosisEntry[] => {
  return diagnosesData;
};

const addDiagnose = () => {
  return null;
};

export default {
  getEntries,
  addDiagnose
};