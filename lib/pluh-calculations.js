export function calculateDifficulty(quizArray) {
    let diffArray = [];
    console.log(quizArray)
    for (let i = 0; i < quizArray.length; i++) {
        diffArray[i] = quizArray[i].points;
    }

    diffArray.sort((a, b) => a - b); // Sort array in ascending order
    const mid = Math.floor(diffArray.length / 2);

    return diffArray.length % 2 !== 0
        ? diffArray[mid]  // Odd length: return middle element
        : (diffArray[mid - 1] + diffArray[mid]) / 2;
}

export function calculateTotalPts(quizArray, attempt) {
    let ptsArray = [];
    for (let i = 0; i < quizArray.length; i++) {
        ptsArray[i] = quizArray[i].points;
    }

    let sum = ptsArray.reduce((acc, num) => acc + num, 0);
    return sum * attempt;
}

export function getQuizMetrics(quizArray, currentPoints, attempt) {
    const difficulty = calculateDifficulty(quizArray);
    const ratio = currentPoints / calculateTotalPts(quizArray, attempt);
    console.log(currentPoints);
    console.log(calculateTotalPts(quizArray, attempt))

    return { difficulty, ratio };
}

export function getQPS(data, ratio, attempt) {
    const oldQPS = data.PLUH.QPS;
    console.log(oldQPS);
    if (oldQPS.sample > 0) {
        let newValue = oldQPS.value + 0.1 * (ratio - oldQPS.value);
        const newQPS = {
            sample: oldQPS.sample + 1,
            value: newValue,
        }
        return newQPS;
    } else {
        const newQPS = {
            sample: 1,
            value: ratio,
        }
        return newQPS;
    }
}

export function getDS(data, difficulty, attempt) {
    const oldDS = data.PLUH.DS;
    if (oldDS.sample > 0) {
        let newValue = oldDS.value + 0.1 * (difficulty - oldDS.value);
        const newDS = {
            sample: oldDS.sample + 1,
            value: newValue,
        }
        return newDS;
    } else {
        const newDS = {
            sample: 1,
            value: difficulty,
        }
        return newDS;
    }
}

export function getES(data){
    const oldES = data.PLUH.ES;

    const lowerBound = Math.floor(oldES.value); // Get the integer part
    const increment = 0.1 * Math.pow(0.5, lowerBound);
    const newValue = oldES.value + increment;
     
    const newES = {
        value : Math.round(newValue * 100) / 100
    }
    return newES;
}

export function getESPenalty(data) {
    const oldES = data.PLUH.ES;

    const lowerBound = Math.floor(oldES.value); // Get the integer part
    const increment = 0.5 * Math.pow(0.5, lowerBound);
    const newValue = oldES.value < increment ? 0 : oldES.value - increment;

    const newES = {
        value : Math.round(newValue * 100) / 100
    }

    return newES;
}

export function getRPS(data, newCoins) {
    const oldRPS = data.PLUH.RPS || {};

    let newRPS = {
        minValue: oldRPS?.minValue ?? newCoins, // Use old min or set to first value
        maxValue: oldRPS?.maxValue ?? newCoins, // Use old max or set to first value
        currentValue: 2.5, // Default midpoint
    };

    if (oldRPS.minValue === undefined || oldRPS.maxValue === undefined) {
        return newRPS;
    }

    newRPS.minValue = Math.min(oldRPS.minValue, newCoins);
    newRPS.maxValue = Math.max(oldRPS.maxValue, newCoins);

    if (newRPS.maxValue === newRPS.minValue) {
        newRPS.currentValue = 2.5;
    } else {
        // Normalize value between 0 and 5
        newRPS.currentValue = ((newCoins - newRPS.minValue) /
            (newRPS.maxValue - newRPS.minValue)) * 5;
    }

    return newRPS;
}

//[{"correctAnswer":"true","type":"trueFalse","points":3,"question":"Hi"},{"question":"Hi my name <blank>.","type":"fillBlanks","correctAnswer":"Mihika","points":2}]