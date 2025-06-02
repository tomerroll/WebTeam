require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const Theory = require('../models/Theory'); // ודא שהנתיב נכון

const theories = [
  {
    title: 'שברים',
    description: 'מבוא לשברים',
    content: 'שבר הוא מספר שמייצג חלק מתוך שלם. למשל, 1/2 הוא חצי. המונה נמצא למעלה והמחנה למטה.',
  },
  {
    title: 'אחוזים',
    description: 'הבנת אחוזים',
    content: 'אחוז הוא דרך לבטא חלק מתוך מאה. לדוגמה, 25% משמעו 25 מתוך 100, או רבע.',
  },
  {
    title: 'משוואות לינאריות',
    description: 'פתרון משוואות פשוטות',
    content: 'משוואה לינארית היא משוואה מהצורה ax + b = c. פתרון המשוואה הוא מציאת ערך ל-x.',
  },
  {
    title: 'יחס ופרופורציה',
    description: 'מהו יחס?',
    content: 'יחס משווה בין שני גדלים. פרופורציה היא שוויון בין שני יחסים.',
  },
  {
    title: 'שטח והיקף',
    description: 'חישוב שטח והיקף',
    content: 'היקף הוא סך האורכים של כל הצלעות. שטח הוא כמות המקום שתופס שטח הצורה. לדוגמה, שטח מלבן: אורך × רוחב.',
  },
  {
    title: 'נפח',
    description: 'מהו נפח?',
    content: 'נפח הוא המקום שתופסת צורה תלת-ממדית. לדוגמה, נפח תיבה: אורך × רוחב × גובה.',
  },
  {
    title: 'משפט פיתגורס',
    description: 'קשר בין צלעות במשולש ישר זווית',
    content: 'במשולש ישר זווית, סכום ריבועי הניצבים שווה לריבוע היתר: a² + b² = c².',
  },
  {
    title: 'חציון',
    description: 'מציאת החציון',
    content: 'חציון הוא הערך האמצעי של קבוצה מסודרת. אם מספר הערכים זוגי, החציון הוא ממוצע של שני האמצעיים.',
  },
  {
    title: 'ממוצע וסטיית תקן',
    description: 'מהו ממוצע?',
    content: 'ממוצע הוא סכום כל הערכים חלקי מספרם. סטיית תקן מודדת את הפיזור של הערכים סביב הממוצע.',
  },
  {
    title: 'סדרות מספריות',
    description: 'סדרה חשבונית',
    content: 'סדרה שבה כל איבר מתקבל על ידי הוספת מספר קבוע לאיבר הקודם. לדוגמה: 2, 4, 6, 8... זו סדרה חשבונית עם הפרש 2.',
  },
];

async function seedTheory() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await Theory.deleteMany({});
    console.log('✔ כל תכני התיאוריה נמחקו');

    await Theory.insertMany(theories);
    console.log('✔ הוזנו תכני תיאוריה חדשים');

  } catch (err) {
    console.error('שגיאה במהלך הזרעה:', err);
  } finally {
    await mongoose.disconnect();
  }
}

seedTheory();
