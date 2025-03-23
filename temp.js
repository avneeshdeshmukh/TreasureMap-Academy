// function isYesterday(date) {
//     const givenDate = new Date(date);
//     const now = new Date("2025-03-24T00:00:00");


//     // Get local midnight for 'yesterday' by adjusting for local time zone

//     console.log(now)
//     console.log(now.toLocaleString())

//     // Convert both dates to the user's local timezone by resetting time to midnight
//     const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
//     givenDate.setHours(0, 0, 0, 0);

//     return givenDate.getTime() === yesterday.getTime();
// }

// // Example Usage:
// console.log(isYesterday("2025-03-23")); // ✅ Should return true if today is March 22 in IST

// const now = new Date();
// const yesterday = new Date();
// yesterday.setDate(now.getDate() - 1);
// yesterday.setHours(0, 0, 0, 0);

// // console.log(yesterday < (new Date("2025-03-21")))
// console.log(yesterday.getHours())

const oldRPS = {
    minValue: undefined, // Use old min or set to first value
    maxValue: 60, // Use old max or set to first value
    currentValue: 5, // Default midpoint
}

function getRPS(data, newCoins) {
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

console.log(oldRPS.minValue)