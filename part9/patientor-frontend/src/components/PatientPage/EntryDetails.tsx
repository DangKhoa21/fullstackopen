import { Box, Typography } from "@mui/material";
import { Entry, Diagnosis } from "../../types";
import HealthRatingBar from "../HealthRatingBar";


const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const EntryDetails = ({ entry, diagnoses }: { entry: Entry, diagnoses: Diagnosis[] }) => {
  return (
    <Box sx={{ my: 2, border: '1px solid black', borderRadius: '5px', p: 2 }}>
      <Typography>{entry.date}</Typography>
      <Typography sx={{ fontStyle: 'italic' }}>{entry.description}</Typography>

      {entry.diagnosisCodes && (
        <Box>
          {entry.diagnosisCodes.map((code) => (
            <Typography key={code}>
              {code} {diagnoses.find((d) => d.code === code)?.name}
            </Typography>
          ))}
        </Box>
      )}

      <EntryInfo entry={entry} />

      <Typography>diagnosed by {entry.specialist}</Typography>
    </Box>
  );
};

const EntryInfo = ({ entry }: { entry: Entry }) => {
  switch (entry.type) {
    case "Hospital":
      return (
        <Box>
          <Typography>Discharge date: {entry.discharge.date}</Typography>
          <Typography>Discharge criteria: {entry.discharge.criteria}</Typography>
        </Box>
      );
    case "OccupationalHealthcare":
      return (
        <Box>
          <Typography>Employer: {entry.employerName}</Typography>
          {entry.sickLeave && (
            <Box>
              <Typography>Sick leave start: {entry.sickLeave.startDate}</Typography>
              <Typography>Sick leave end: {entry.sickLeave.endDate}</Typography>
            </Box>
          )}
        </Box>
      );
    case "HealthCheck":
      return (
        <Box>
          <HealthRatingBar showText={false} rating={entry.healthCheckRating} />
        </Box>
      );
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;