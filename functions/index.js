const { onSchedule } = require("firebase-functions/v2/scheduler"); // ✅ Use v2 syntax
const { getFirestore } = require("firebase-admin/firestore");
const admin = require("firebase-admin");

admin.initializeApp();
const firestore = getFirestore();

// ✅ Correct way to define a scheduled function in Firebase v2
exports.checkStreaks = onSchedule(
    {
        schedule : "every 1 minutes",
        timeZone: "Asia/Kolkata",
    }, async (event) => {
    const currentTime = new Date().toLocaleTimeString();
    const data = {
        currentTime,
    }
    try {  
        await firestore.collection("timepass").doc(currentTime).set(data);
    } catch (error) {
        console.log(error)
    }
});
