# 🏴‍☠️TreasureMap-Academy

Treasure Map Academy is an interactive, gamified learning platform built to bridge the gap between traditional education and modern learner engagement. Designed with both *learners* and *course creators* in mind, the platform empowers creators to upload video lessons with embedded quizzes and track user performance, while giving learners a rich, interactive environment to explore courses, earn rewards, and stay motivated through streaks and badges.

---

## 🚀 Features

•⁠  ⁠📹 Upload and manage course videos  
•⁠  ⁠❓ Add interactive quizzes within video timestamps  
•⁠  ⁠🎯 Earn badges and coins for completing lessons and quizzes  
•⁠  ⁠🔁 Maintain learning streaks with daily quiz activity  
•⁠  ⁠📈 Track progress for both learners and educators  
•⁠  ⁠🎓 Auto-generate course completion certificates  

---

## 🛠 Tech Stack

### Frontend:
•⁠  ⁠*Next.js* (App Router)
•⁠  ⁠*React*
•⁠  ⁠*Tailwind CSS*

### Backend & Services:
•⁠  ⁠*Next.js*
•⁠  ⁠*Firebase Authentication*
•⁠  ⁠*Firebase Firestore (NoSQL DB)*
•⁠  ⁠*Firebase Functions*
•⁠  ⁠*AWS S3* (for video and thumbnail storage)

### Hosting:
•⁠  ⁠*Vercel* for deployment

---

## 🧑‍💻 How to Install Locally (Developer Setup)

	Follow the steps below to set up Treasure Map Academy on your machine.

1.⁠ ⁠*Clone the Repository*
```
git clone git@github.com:avneeshdeshmukh/TreasureMap-Academy.git
```
2.⁠ ⁠*Go to the directory*
```
cd TreasureMap-Academy
```
3. *Install Dependencies*

```
npm install
```

4. *Setup Environment Variables*

   *Create a .env.local file in the root and add your keys & IDs :*

```
NEXT_PUBLIC_FIREBASE_API_KEY = 
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = 
NEXT_PUBLIC_FIREBASE_PROJECT_ID = 
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = 
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 
NEXT_PUBLIC_FIREBASE_APP_ID = 
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID = 

FIREBASE_PROJECT_ID = 
FIREBASE_CLIENT_EMAIL = 
FIREBASE_PRIVATE_KEY =

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_BUCKET_NAME = 

NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

5. *Run the Development Server*
```
npm run dev
```
6. *Visit Localhost*

   *Open `http://localhost:3000` in your browser.*


---
## 🔑 How to Use Treasure Map Academy

### 🧑‍🎓 For Learners


1. *Sign Up / Log In*

   - *Use your email to register or sign in with Google account.*

2. *Explore Courses*

   - *Browse available courses by category*

3. *Start Learning*

   - *Click on any course and begin watching the videos.*  
   - *Interactive quizzes will appear within videos at key timestamps.*

3. *Earn Rewards*

   - *Earn coins and badges for completing lessons and answering quizzes.*

4. *Track Progress*

   - *View your learning streak, completed lessons, and badge history.*

5. *Download Certificate*

   - *After completing a course, you’ll be able to generate a PDF certificate.*

---
## 🧑‍🏫 For Course Creators


1. *Sign Up / Log In*

   - *Go to the creator section to register yourself as a course creator.*

2. *Create Course*  
   - *Go to the educator dashboard and click "Create New Course".*
   - *Fill in course details (title, category, duration, etc.).*

3. *Upload Videos*

   - Upload course videos and thumbnails to AWS S3.

4. *Add Interactive Quizzes*

   - *Add timestamps and embed quiz questions (MCQs, T/F, etc.) within videos.*

5. *Publish Course*

   - *Once complete, submit the course for admin approval.*

6. *Track Learner Engagement*

   - *View stats on learner progress, quiz accuracy, and completion rates.*

---

## 📧 Contact
 **treasuremapacademy@gmail.com**

 ---
