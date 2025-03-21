import { getFirestore } from "firebase/firestore";

const firestore = getFirestore();

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

    return { difficulty, ratio };
}

export function getQPS(data, ratio, attempt) {
    const oldQPS = data.PLUH.QPS;
    console.log(oldQPS);
    if (oldQPS.sample > 0) {
        let newValue = oldQPS.value + 0.1 * (ratio - oldQPS.value);
        if (attempt > 2) {
            newValue /= 2;
        } else {
            newValue /= attempt;
        }
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

export function getDS(data, ratio, attempt) {
    const oldDS = data.PLUH.DS;
    if (oldDS.sample > 0) {
        let newValue = oldDS.value + 0.1 * (ratio - oldDS.value);
        if (attempt > 2) {
            newValue /= 2;
        } else {
            newValue /= attempt;
        }
        const newDS = {
            sample: oldDS.sample + 1,
            value: newValue,
        }
        return newDS;
    } else {
        const newDS = {
            sample: 1,
            value: ratio,
        }
        return newDS;
    }
}

//[{"correctAnswer":"true","type":"trueFalse","points":3,"question":"Hi"},{"question":"Hi my name <blank>.","type":"fillBlanks","correctAnswer":"Mihika","points":2}]