const { onSchedule } = require("firebase-functions/v2/scheduler"); // ✅ Use v2 syntax
const { getFirestore } = require("firebase-admin/firestore");
const admin = require("firebase-admin");

admin.initializeApp();
const firestore = getFirestore();

function getESPenalty(data) {
    const oldES = data.PLUH.ES;

    const lowerBound = Math.floor(oldES.value); // Get the integer part
    const increment = 0.5 * Math.pow(0.5, lowerBound);
    const newValue = oldES.value < increment ? 0 : oldES.value - increment;

    const newES = {
        value: Math.round(newValue * 100) / 100
    }

    return newES;
}

// ✅ Correct way to define a scheduled function in Firebase v2
exports.checkStreaks = onSchedule(
    {
        schedule: "0 0 * * *", 
        timeZone: "Asia/Kolkata",
    },
    async (event) => {
        try {
            const now = new Date();
            const yesterday = new Date();
            yesterday.setDate(now.getDate() - 1);
            yesterday.setHours(0, 0, 0, 0); // Midnight of yesterday

            const userProgressRef = firestore.collection("userProgress");
            const snapshot = await userProgressRef.get();

            const batch = firestore.batch();

            snapshot.forEach((doc) => {
                const data = doc.data();
                const lastLessonTimestamp = data.lastLesson;

                if (lastLessonTimestamp && data.streak !== 0 && lastLessonTimestamp.toDate() < yesterday) {
                    batch.update(doc.ref, {
                        streak: 0,
                        "PLUH.ES": getESPenalty(data),
                    }); // Reset streak if lastLesson is before yesterday
                }
            });

            await batch.commit();
            console.log("Streaks checked and updated successfully.");
        } catch (error) {
            console.error("Error updating streaks:", error);
        }
    }
);
