import { useState } from "react";
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Chip, Box, Grid, SelectChangeEvent } from '@mui/material';
import { EntryFormValues, HealthCheckRating } from "../../types";

interface Props {
  onCancel: () => void;
  onSubmit: (values: EntryFormValues) => void;
  diagnosisCodes: string[]
}

const AddEntryForm = ({ onCancel, onSubmit, diagnosisCodes }: Props) => {
  const [entryType, setEntryType] = useState("HealthCheck");
  const [formValues, setFormValues] = useState({
    description: '',
    date: '',
    specialist: '',
    healthCheckRating: HealthCheckRating.Healthy, // Only for HealthCheck
    discharge: { date: '', criteria: '' }, // Only for Hospital
    employerName: '', // Only for OccupationalHealthcare
    sickLeave: { startDate: '', endDate: '' }, // Only for OccupationalHealthcare
    diagnosisCodes: [] as string[],
  });

  const handleEntryTypeChange = (event: SelectChangeEvent<string>) => {
    setEntryType(event.target.value);
    setFormValues({ // Reset values when entry type changes
      description: '',
      date: '',
      specialist: '',
      healthCheckRating: HealthCheckRating.Healthy,
      discharge: { date: '', criteria: '' },
      employerName: '',
      sickLeave: { startDate: '', endDate: '' },
      diagnosisCodes: [],
    });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleDiagnosisCodesChange = (value: string[]) => {
    setFormValues({ ...formValues, diagnosisCodes: value });
  };

  const addEntry = (event: React.FormEvent) => {
    event.preventDefault();
    const newEntry = {
      description: formValues.description,
      date: formValues.date,
      specialist: formValues.specialist,
      diagnosisCodes: formValues.diagnosisCodes,
    };

    if (entryType === "HealthCheck") {
      onSubmit({
        ...newEntry,
        type: "HealthCheck",
        healthCheckRating: formValues.healthCheckRating,
      });
    } else if (entryType === "Hospital") {
      onSubmit({
        ...newEntry,
        type: "Hospital",
        discharge: {
          date: formValues.discharge.date,
          criteria: formValues.discharge.criteria,
        }
      });
    } else if (entryType === "OccupationalHealthcare") {
      onSubmit({
        ...newEntry,
        type: "OccupationalHealthcare",
        employerName: formValues.employerName,
        sickLeave: {
          startDate: formValues.sickLeave.startDate,
          endDate: formValues.sickLeave.endDate
        }
      });
    }
  };

  return (
    <form onSubmit={addEntry}>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="entry-type-label">Entry Type</InputLabel>
        <Select
          labelId="entry-type-label"
          value={entryType}
          onChange={handleEntryTypeChange}
        >
          <MenuItem value="HealthCheck">Health Check</MenuItem>
          <MenuItem value="Hospital">Hospital</MenuItem>
          <MenuItem value="OccupationalHealthcare">Occupational Healthcare</MenuItem>
        </Select>
      </FormControl>

      <TextField
        name="description"
        label="Description"
        fullWidth
        value={formValues.description}
        onChange={handleChange}
      />
      <TextField
        name="date"
        type="date"
        fullWidth
        value={formValues.date}
        onChange={handleChange}
      />
      <TextField
        name="specialist"
        label="Specialist"
        fullWidth
        value={formValues.specialist}
        onChange={handleChange}
      />

      {entryType === "HealthCheck" && (
        <FormControl fullWidth>
          <InputLabel id="healthCheckRating-label">Health Check Rating</InputLabel>
          <Select
            labelId="healthCheckRating-label"
            name="healthCheckRating"
            value={formValues.healthCheckRating.toString()}
            onChange={handleChange}
          >
            {Object.entries(HealthCheckRating).filter(([, value]) => typeof value === "number").map(([key, value]) => (
              <MenuItem key={key} value={value}>
                {key}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {entryType === "Hospital" && (
        <>
          <TextField
            name="dischargeDate"
            label="Discharge Date"
            type="date"
            fullWidth
            value={formValues.discharge.date}
            onChange={(event) => setFormValues({
              ...formValues,
              discharge: { ...formValues.discharge, date: event.target.value }
            })}
          />
          <TextField
            name="dischargeCriteria"
            label="Discharge Criteria"
            fullWidth
            value={formValues.discharge.criteria}
            onChange={(event) => setFormValues({
              ...formValues,
              discharge: { ...formValues.discharge, criteria: event.target.value }
            })}
          />
        </>
      )}

      {entryType === "OccupationalHealthcare" && (
        <>
          <TextField
            name="employerName"
            label="Employer Name"
            fullWidth
            value={formValues.employerName}
            onChange={handleChange}
          />
          <TextField
            name="sickLeaveStart"
            label="Sick Leave Start"
            type="date"
            fullWidth
            value={formValues.sickLeave.startDate}
            onChange={(event) => setFormValues({
              ...formValues,
              sickLeave: { ...formValues.sickLeave, startDate: event.target.value }
            })}
          />
          <TextField
            name="sickLeaveEnd"
            label="Sick Leave End"
            type="date"
            fullWidth
            value={formValues.sickLeave.endDate}
            onChange={(event) => setFormValues({
              ...formValues,
              sickLeave: { ...formValues.sickLeave, endDate: event.target.value }
            })}
          />
        </>
      )}

      <FormControl fullWidth>
        <InputLabel id="diagnosis-code-label">Diagnosis Code</InputLabel>
        <Select
          labelId="diagnosis-code-label"
          multiple
          value={formValues.diagnosisCodes}
          onChange={({ target }) => handleDiagnosisCodesChange(target.value as string[])}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
        >
          {diagnosisCodes.map((code) => (
            <MenuItem key={code} value={code}>
              {code}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Grid sx={{ mt: 2 }}>
        <Grid item>
          <Button
            color="secondary"
            variant="contained"
            style={{ float: "left" }}
            type="button"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </Grid>
        <Grid item>
          <Button
            style={{
              float: "right",
            }}
            type="submit"
            variant="contained"
          >
            Add
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default AddEntryForm;