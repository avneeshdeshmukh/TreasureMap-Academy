function calculateDifficulty(quizArray) {
    let diffArray = [];
    for(let i=0; i<quizArray.length; i++){
        diffArray[i]=quizArray[i].points;
    }

    console.log(diffArray)

    diffArray.sort((a, b) => a - b); // Sort array in ascending order
    const mid = Math.floor(diffArray.length / 2);

    return diffArray.length % 2 !== 0
        ? diffArray[mid]  // Odd length: return middle element
        : (diffArray[mid - 1] + diffArray[mid]) / 2;
}

console.log(calculateDifficulty([{"correctAnswer":"true","type":"trueFalse","points":3,"question":"Hi"},{"question":"Hi my name <blank>.","type":"fillBlanks","correctAnswer":"Mihika","points":2}]))