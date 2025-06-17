require('dotenv').config();
const mongoose = require('mongoose');
const Exercise = require('../models/Exercise');
const StudentProgress = require('../models/StudentProgress'); // ודא שהנתיב נכון

// החלף ל-ID אמיתי של מורה מה-DB שלך
const teacherId = '66500e7e2b8c2e0012a12345';

const exercises = [
  // תרגילים לנושא "שברים"
  {
    title: 'זיהוי שברים',
    description: 'איזה שבר מייצג חצי?',
    options: ['1/3', '1/2', '2/3', '3/4'],
    correctOption: 1,
    subject: 'שברים',
    grade: 'ז',
    difficulty: 'קל',
    points: 10,
    createdBy: teacherId,
  },
  {
    title: 'השוואת שברים',
    description: 'איזה שבר גדול יותר: 1/4 או 1/2?',
    options: ['1/4', '1/2', 'שווים', 'לא ניתן לדעת'],
    correctOption: 1,
    subject: 'שברים',
    grade: 'ז',
    difficulty: 'קל',
    points: 10,
    createdBy: teacherId,
  },
  {
    title: 'חיבור שברים',
    description: 'כמה זה 1/4 + 1/4?',
    options: ['1/8', '1/2', '2/4', '1/4'],
    correctOption: 1,
    subject: 'שברים',
    grade: 'ז',
    difficulty: 'בינוני',
    points: 15,
    createdBy: teacherId,
  },
  {
    title: 'כפל שברים',
    description: 'כמה זה 1/2 × 1/3?',
    options: ['1/6', '1/5', '2/6', '1/3'],
    correctOption: 0,
    subject: 'שברים',
    grade: 'ח',
    difficulty: 'בינוני',
    points: 15,
    createdBy: teacherId,
  },
  {
    title: 'שבר מעורב',
    description: 'איך כותבים 7/4 כשבר מעורב?',
    options: ['1 3/4', '2 1/4', '1 1/4', '2 3/4'],
    correctOption: 0,
    subject: 'שברים',
    grade: 'ח',
    difficulty: 'בינוני',
    points: 15,
    createdBy: teacherId,
  },

  // תרגילים לנושא "אחוזים"
  {
    title: 'חישוב אחוזים',
    description: 'כמה זה 20% מ-50?',
    options: ['5', '10', '15', '20'],
    correctOption: 1,
    subject: 'אחוזים',
    grade: 'ז',
    difficulty: 'קל',
    points: 10,
    createdBy: teacherId,
  },
  {
    title: 'מציאת אחוז',
    description: 'איזה אחוז 15 הוא מ-60?',
    options: ['15%', '20%', '25%', '30%'],
    correctOption: 2,
    subject: 'אחוזים',
    grade: 'ז',
    difficulty: 'בינוני',
    points: 15,
    createdBy: teacherId,
  },
  {
    title: 'אחוזים מעשיים',
    description: 'אם מחיר חולצה הוא 80 ש"ח ויש הנחה של 25%, כמה תעלה החולצה?',
    options: ['55 ש"ח', '60 ש"ח', '65 ש"ח', '70 ש"ח'],
    correctOption: 1,
    subject: 'אחוזים',
    grade: 'ח',
    difficulty: 'בינוני',
    points: 15,
    createdBy: teacherId,
  },
  {
    title: 'אחוזים מורכבים',
    description: 'כמה זה 150% מ-40?',
    options: ['50', '60', '70', '80'],
    correctOption: 1,
    subject: 'אחוזים',
    grade: 'ח',
    difficulty: 'קשה',
    points: 20,
    createdBy: teacherId,
  },
  {
    title: 'אחוזים ושברים',
    description: 'איזה אחוז מייצג השבר 3/5?',
    options: ['50%', '60%', '65%', '70%'],
    correctOption: 1,
    subject: 'אחוזים',
    grade: 'ח',
    difficulty: 'בינוני',
    points: 15,
    createdBy: teacherId,
  },

  // תרגילים לנושא "משוואות לינאריות"
  {
    title: 'פתרון משוואה פשוטה',
    description: 'מה הפתרון של המשוואה x + 5 = 12?',
    options: ['5', '7', '12', '17'],
    correctOption: 1,
    subject: 'משוואות לינאריות',
    grade: 'ז',
    difficulty: 'קל',
    points: 10,
    createdBy: teacherId,
  },
  {
    title: 'משוואה עם כפל',
    description: 'מה הפתרון של המשוואה 3x = 15?',
    options: ['3', '5', '12', '18'],
    correctOption: 1,
    subject: 'משוואות לינאריות',
    grade: 'ז',
    difficulty: 'קל',
    points: 10,
    createdBy: teacherId,
  },
  {
    title: 'משוואה מורכבת',
    description: 'מה הפתרון של המשוואה 2x + 3 = 7?',
    options: ['1', '2', '3', '4'],
    correctOption: 1,
    subject: 'משוואות לינאריות',
    grade: 'ח',
    difficulty: 'בינוני',
    points: 15,
    createdBy: teacherId,
  },
  {
    title: 'משוואה עם חיסור',
    description: 'מה הפתרון של המשוואה x - 4 = 8?',
    options: ['4', '8', '12', '16'],
    correctOption: 2,
    subject: 'משוואות לינאריות',
    grade: 'ז',
    difficulty: 'קל',
    points: 10,
    createdBy: teacherId,
  },
  {
    title: 'משוואה עם חלוקה',
    description: 'מה הפתרון של המשוואה x/3 = 4?',
    options: ['7', '9', '12', '15'],
    correctOption: 2,
    subject: 'משוואות לינאריות',
    grade: 'ח',
    difficulty: 'בינוני',
    points: 15,
    createdBy: teacherId,
  },

  // תרגילים לנושא "יחס ופרופורציה"
  {
    title: 'חישוב יחס',
    description: 'מה היחס בין 8 ל-4?',
    options: ['1:2', '2:1', '4:1', '8:1'],
    correctOption: 1,
    subject: 'יחס ופרופורציה',
    grade: 'ז',
    difficulty: 'קל',
    points: 10,
    createdBy: teacherId,
  },
  {
    title: 'פרופורציה מעשית',
    description: 'אם 3 ספרים עולים 30 ש"ח, כמה יעלו 5 ספרים?',
    options: ['40 ש"ח', '45 ש"ח', '50 ש"ח', '60 ש"ח'],
    correctOption: 2,
    subject: 'יחס ופרופורציה',
    grade: 'ז',
    difficulty: 'בינוני',
    points: 15,
    createdBy: teacherId,
  },
  {
    title: 'יחס פשוט',
    description: 'מה היחס בין 6 ל-2?',
    options: ['1:3', '2:1', '3:1', '6:1'],
    correctOption: 2,
    subject: 'יחס ופרופורציה',
    grade: 'ז',
    difficulty: 'קל',
    points: 10,
    createdBy: teacherId,
  },
  {
    title: 'פרופורציה מורכבת',
    description: 'אם 4 עובדים מסיימים עבודה ב-6 שעות, כמה זמן ייקח ל-6 עובדים?',
    options: ['3 שעות', '4 שעות', '6 שעות', '9 שעות'],
    correctOption: 1,
    subject: 'יחס ופרופורציה',
    grade: 'ח',
    difficulty: 'קשה',
    points: 20,
    createdBy: teacherId,
  },
  {
    title: 'יחס ושברים',
    description: 'איזה שבר מייצג את היחס 3:4?',
    options: ['1/2', '2/3', '3/4', '4/3'],
    correctOption: 2,
    subject: 'יחס ופרופורציה',
    grade: 'ח',
    difficulty: 'בינוני',
    points: 15,
    createdBy: teacherId,
  },

  // תרגילים לנושא "שטח והיקף"
  {
    title: 'חישוב שטח מלבן',
    description: 'מה השטח של מלבן באורך 6 ורוחב 4?',
    options: ['10', '20', '24', '30'],
    correctOption: 2,
    subject: 'שטח והיקף',
    grade: 'ז',
    difficulty: 'קל',
    points: 10,
    createdBy: teacherId,
  },
  {
    title: 'חישוב היקף ריבוע',
    description: 'מה ההיקף של ריבוע בצלע 5?',
    options: ['10', '15', '20', '25'],
    correctOption: 2,
    subject: 'שטח והיקף',
    grade: 'ז',
    difficulty: 'קל',
    points: 10,
    createdBy: teacherId,
  },
  {
    title: 'שטח ריבוע',
    description: 'מה השטח של ריבוע בצלע 7?',
    options: ['14', '28', '49', '56'],
    correctOption: 2,
    subject: 'שטח והיקף',
    grade: 'ז',
    difficulty: 'קל',
    points: 10,
    createdBy: teacherId,
  },
  {
    title: 'היקף מלבן',
    description: 'מה ההיקף של מלבן באורך 8 ורוחב 3?',
    options: ['11', '22', '24', '26'],
    correctOption: 1,
    subject: 'שטח והיקף',
    grade: 'ז',
    difficulty: 'קל',
    points: 10,
    createdBy: teacherId,
  },
  {
    title: 'שטח משולש',
    description: 'מה השטח של משולש עם בסיס 6 וגובה 4?',
    options: ['10', '12', '15', '18'],
    correctOption: 1,
    subject: 'שטח והיקף',
    grade: 'ח',
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
