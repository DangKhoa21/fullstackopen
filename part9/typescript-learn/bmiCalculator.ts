type bmiCategory = 'underweight' | 'normal range' | 'overweight' | 'obese';

const calculateBmi = (height: number, weight: number): bmiCategory => {
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  
  if (bmi < 18.5) {
    return 'underweight';
  } else if (bmi < 25) {
    return 'normal range';
  } else if (bmi < 30) {
    return 'overweight';
  } else {
    return 'obese';
  }
};

if (require.main === module) {
  const parseArguments = (args: string[]): {height: number, weight: number} => {
    if (args.length < 4) throw new Error('Not enough arguments');
    if (args.length > 4) throw new Error('Too many arguments');
  
    if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
      return {
        height: Number(args[2]),
        weight: Number(args[3])
      };
    } else {
      throw new Error('Provided values were not numbers!');
    }
  };
  
  try {
    const { height, weight } = parseArguments(process.argv);
    console.log(calculateBmi(height, weight));
  } catch (error: unknown) {
    let errorMessage = 'Something bad happened.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
  }
}

export default calculateBmi;