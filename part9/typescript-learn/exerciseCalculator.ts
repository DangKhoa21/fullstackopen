export interface Exercise {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const parseExerciseArguments = (args: string[]): {hours: number[], target: number} => {
  if (args.length < 3) throw new Error('Not enough arguments');

  for (let i = 2; i < args.length - 1; i++) {
    if (!isNaN(Number(args[i]))) {
      continue;
    } else {
      throw new Error('Provided values were not numbers!');
    }
  }
  
  return {
    hours: args.slice(2, args.length - 1).map(arg => Number(arg)),
    target: Number(args[args.length - 1])
  };
};

const calculateExercises = (hours: number[], target: number): Exercise => {
  const periodLength = hours.length;
  const trainingDays = hours.filter(h => h > 0).length;
  const average = hours.reduce((a, b) => a + b, 0) / periodLength;
  const success = average >= target;
  let rating = 0;
  let ratingDescription = '';
  if (average/target > 1) {
    rating = 3;
    ratingDescription = 'great job!';
  } else if (average/target > 0.7) {
    rating = 2;
    ratingDescription = 'not too bad but could be better';
  } else {
    rating = 1;
    ratingDescription = 'could have been better';
  }
  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  };
};

if (require.main === module) {
  try {
    const { hours, target } = parseExerciseArguments(process.argv);
    console.log(calculateExercises(hours, target));
  } catch (error: unknown) {
    let errorMessage = 'Something bad happened.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
  }
}

export default calculateExercises;