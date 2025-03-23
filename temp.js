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

function getES(val) {

    const lowerBound = Math.floor(val); // Get the integer part
    const increment = 0.5 * Math.pow(0.5, lowerBound);
    const newValue = val < increment ? 0 : val - increment;
    return Math.round(newValue * 100) / 100;
}

console.log(getES(0.1));