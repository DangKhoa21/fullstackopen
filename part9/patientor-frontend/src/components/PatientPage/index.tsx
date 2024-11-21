import { useParams } from "react-router-dom";
import patientService from "../../services/patients";
import diagnosisService from "../../services/diagnoses";
import { useEffect, useState } from "react";
import { Patient, Diagnosis, EntryFormValues } from "../../types";

import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';

import EntryDetails from "./EntryDetails";
import AddEntryModal from "../AddEntryModal";
import axios from "axios";
import { Button } from "@mui/material";

const PatientPage = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const data = await patientService.getOne(id as string);
        setPatient(data);
      } catch (e) {
        setPatient(null);
      }
    };

    const fetchDiagnoses = async () => {
      const data = await diagnosisService.getAll();
      setDiagnoses(data);
    };

    void fetchPatient();
    void fetchDiagnoses();
  }, [id]);

  if (!patient) {
    return <div>Patient not found</div>;
  }
  
  const submitNewEntry = async (values: EntryFormValues) => {
    try {
      const entry = await patientService.createEntry(id as string, values);
      setPatient({ ...patient, entries: patient.entries.concat(entry) });
      setModalOpen(false);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data && typeof e?.response?.data === "string") {
          const message = e.response.data.replace('Something went wrong. Error: ', '');
          console.error(message);
          setError(message);
        } else {
          setError("Unrecognized axios error");
        }
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };

  return (
    <div>
      <h2>{patient.name} {patient.gender === "male" ? <MaleIcon /> : <FemaleIcon />}</h2>

      <div>
        <p>ssn: {patient.ssn}</p>
        <p>occupation: {patient.occupation}</p>
      </div>

      <h3>entries</h3>

      {patient.entries.map(entry => (
        <EntryDetails key={entry.id} entry={entry} diagnoses={diagnoses} />
      ))}
      
      <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
        diagnosisCodes={diagnoses.map(d => d.code)}
      />
      <Button variant="contained" onClick={() => openModal()}>
        Add New Entry
      </Button>
    </div>
  );
};

export default PatientPage;