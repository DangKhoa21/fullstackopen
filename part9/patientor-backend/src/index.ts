import express from 'express';
import cors from 'cors';

import diagnosisRouter from './routes/diagnosis';
import patientRouter from './routes/patient';

const app = express();
app.use(express.json());
app.use((cors as (options: cors.CorsOptions) => express.RequestHandler)({}));

const PORT = 3001;

app.get('/api/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.use('/api/diagnoses', diagnosisRouter);
app.use('/api/patients', patientRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});