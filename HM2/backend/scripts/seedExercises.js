require('dotenv').config();
const mongoose = require('mongoose');
const Exercise = require('../models/Exercise');
const StudentProgress = require('../models/StudentProgress'); // ודא שהנתיב נכון

// החלף ל-ID אמיתי של מורה מה-DB שלך
const teacherId = '66500e7e2b8c2e0012a12345';

const exercises = [
  // עברית
  {
    title: 'פירוש מטאפורה',
    description: 'מה פירוש הביטוי "ים של דמעות"?',
    options: ['הרבה דמעות', 'מים מלוחים', 'אדם בוכה בים', 'גשם חזק'],
    correctOption: 0,
    subject: 'עברית',
    grade: 'ח',
    difficulty: 'קל',
    points: 10,
    createdBy: teacherId,
  },
  {
    title: 'זיהוי פועל',
    description: 'איזו מילה היא פועל במשפט: "הילד רץ לבית הספר"?',
    options: ['הילד', 'רץ', 'לבית', 'הספר'],
    correctOption: 1,
    subject: 'עברית',
    grade: 'ח',
    difficulty: 'קל',
    points: 10,
    createdBy: teacherId,
  },
  {
    title: 'השלמת משפט',
    description: 'השלם: "הילדה ____ את הספר."',
    options: ['קרא', 'קוראת', 'קראו', 'קוראים'],
    correctOption: 1,
    subject: 'עברית',
    grade: 'ח',
    difficulty: 'בינוני',
    points: 15,
    createdBy: teacherId,
  },

  // מתמטיקה
  {
    title: 'חישוב פשוט',
    description: 'כמה זה 12 × 8?',
    options: ['96', '88', '104', '92'],
    correctOption: 0,
    subject: 'מתמטיקה',
    grade: 'ז',
    difficulty: 'קל',
    points: 10,
    createdBy: teacherId,
  },
  {
    title: 'שבר עשרוני',
    description: 'מהו השבר העשרוני של 3/4?',
    options: ['0.5', '0.25', '0.75', '1.25'],
    correctOption: 2,
    subject: 'מתמטיקה',
    grade: 'ח',
    difficulty: 'בינוני',
    points: 15,
    createdBy: teacherId,
  },

  // אנגלית
  {
    title: 'Vocabulary: Animals',
    description: 'What is the correct translation for "פיל"?',
    options: ['Tiger', 'Dog', 'Elephant', 'Bear'],
    correctOption: 2,
    subject: 'אנגלית',
    grade: 'ו',
    difficulty: 'קל',
    points: 10,
    createdBy: teacherId,
  },
  {
    title: 'Grammar: Verb Tenses',
    description: 'Choose the correct form: "She ____ to school every day."',
    options: ['go', 'goes', 'went', 'gone'],
    correctOption: 1,
    subject: 'אנגלית',
    grade: 'ח',
    difficulty: 'בינוני',
    points: 15,
    createdBy: teacherId,
  },

  // היסטוריה
  {
    title: 'מתי הייתה הכרזת המדינה?',
    description: 'באיזו שנה הוכרזה מדינת ישראל?',
    options: ['1948', '1950', '1936', '1967'],
    correctOption: 0,
    subject: 'היסטוריה',
    grade: 'ט',
    difficulty: 'קל',
    points: 10,
    createdBy: teacherId,
  },
  {
    title: 'מלחמות ישראל',
    description: 'איזו מלחמה התקיימה בשנת 1973?',
    options: ['ששת הימים', 'לבנון הראשונה', 'יום כיפור', 'עצמאות'],
    correctOption: 2,
    subject: 'היסטוריה',
    grade: 'י',
    difficulty: 'בינוני',
    points: 15,
    createdBy: teacherId,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // שלב 1: מחיקת תרגילים קיימים
    await Exercise.deleteMany({});
    console.log('✔ כל התרגילים נמחקו');

    // שלב 2: הוספת תרגילים חדשים
    await Exercise.insertMany(exercises);
    console.log('✔ הוזנו תרגילים חדשים');

    // שלב 3: איפוס StudentProgress
    const result = await StudentProgress.updateMany(
      {},
      {
        $set: {
          currentIndex: 0,
          completed: false,
          lastAttempt: null,
        },
      }
    );
    console.log(`✔ עודכנו ${result.modifiedCount} רשומות ב-StudentProgress`);

  } catch (err) {
    console.error('שגיאה במהלך הזרעה:', err);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
