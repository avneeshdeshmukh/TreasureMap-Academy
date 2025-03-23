function isYesterday(date) {
    const givenDate = new Date(date);
    const now = new Date("2025-03-23");
    console.log(now)

    // Convert both dates to the user's local timezone by resetting time to midnight
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    givenDate.setHours(0, 0, 0, 0);

    return givenDate.getTime() === yesterday.getTime();
}

// Example Usage:
console.log(isYesterday("2025-03-22")); // ✅ Should return true if today is March 22 in IST
// console.log(isYesterday(new Date(Date.now() - 86400000))); // ✅ Another way to check yesterday
