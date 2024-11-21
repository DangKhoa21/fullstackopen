import express from 'express';
import calculateBmi from './bmiCalculator';
import calculateExercises, { Exercise } from './exerciseCalculator';

const app = express();

app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (!isNaN(height) && !isNaN(weight)) {
    const bmi = calculateBmi(height, weight);
    res.send({
      weight,
      height,
      bmi
    });
  } else {
    res.send({
      error: 'malformatted parameters'
    });
  }
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;

  if (!daily_exercises || !target) {
    res.status(400).send({ error: 'parameters missing' });
  }

  if (!Array.isArray(daily_exercises) || isNaN(Number(target)) || daily_exercises.some(n => isNaN(Number(n)))) {
    res.status(400).send({ error: 'malformatted parameters' });
  }

  const result: Exercise = calculateExercises(daily_exercises as number[], Number(target));

  res.send(result);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});