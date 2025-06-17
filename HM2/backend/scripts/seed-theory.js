require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const Theory = require('../models/Theory');

const theories = [
  {
    title: 'שברים',
    description: 'מבוא מקיף לשברים עם דוגמאות אינטראקטיביות',
    content: `שבר הוא מספר שמייצג חלק מתוך שלם. 

**המרכיבים של השבר:**
- המונה (המספר העליון) - מייצג כמה חלקים יש לנו
- המכנה (המספר התחתון) - מייצג לכמה חלקים חילקנו את השלם

**דוגמה:** 3/4 משמעו 3 חלקים מתוך 4 חלקים שווים.

**סוגי שברים:**
- שבר רגיל: 1/2, 3/4
- שבר מעורב: 1 1/2 (מספר שלם + שבר)
- שבר עשרוני: 0.5, 0.75`,
    
    interactiveExamples: [
      {
        title: 'זיהוי שברים',
        description: 'איזה שבר מייצג חצי?',
        question: 'איזה מהשברים הבאים מייצג חצי?',
        options: ['1/3', '1/2', '2/3', '3/4'],
        correctAnswer: 1,
        explanation: '1/2 מייצג חצי כי יש לנו חלק אחד מתוך שני חלקים שווים.'
      },
      {
        title: 'השוואת שברים',
        description: 'איזה שבר גדול יותר?',
        question: 'איזה שבר גדול יותר: 1/4 או 1/2?',
        options: ['1/4', '1/2', 'שווים', 'לא ניתן לדעת'],
        correctAnswer: 1,
        explanation: '1/2 גדול יותר מ-1/4 כי חצי גדול מרבע.'
      }
    ],
    
    difficulty: 'קל',
    estimatedTime: 15,
    prerequisites: [],
    tags: ['שברים', 'מתמטיקה', 'יסודי'],
    youtubeLink: 'https://www.youtube.com/embed/GxueRTrfjhE' // סרטון על שברים לילדים
  },
  
  {
    title: 'אחוזים',
    description: 'הבנת אחוזים עם דוגמאות מעשיות',
    content: `אחוז הוא דרך לבטא חלק מתוך מאה.\n\n**הגדרה:** 1% = 1/100 = 0.01\n\n**דוגמאות מעשיות:**\n- 25% = 25/100 = 1/4 = 0.25\n- 50% = 50/100 = 1/2 = 0.5\n- 100% = 100/100 = 1\n\n**חישוב אחוזים:**\n- כדי למצוא אחוז ממספר: מספר × (אחוז ÷ 100)\n- כדי למצוא איזה אחוז מספר אחד הוא ממספר אחר: (מספר ÷ מספר אחר) × 100`,
    
    interactiveExamples: [
      {
        title: 'חישוב אחוזים',
        description: 'חשב 20% מ-50',
        question: 'כמה זה 20% מ-50?',
        options: ['5', '10', '15', '20'],
        correctAnswer: 1,
        explanation: '20% מ-50 = 50 × (20 ÷ 100) = 50 × 0.2 = 10'
      },
      {
        title: 'מציאת אחוז',
        description: 'איזה אחוז 15 הוא מ-60?',
        question: 'איזה אחוז 15 הוא מ-60?',
        options: ['15%', '20%', '25%', '30%'],
        correctAnswer: 2,
        explanation: '(15 ÷ 60) × 100 = 0.25 × 100 = 25%'
      }
    ],
    
    difficulty: 'בינוני',
    estimatedTime: 20,
    prerequisites: ['שברים'],
    tags: ['אחוזים', 'מתמטיקה', 'חישובים'],
    youtubeLink: 'https://www.youtube.com/embed/cW0H-ITzQSc' // סרטון על אחוזים לילדים
  },
  
  {
    title: 'משוואות לינאריות',
    description: 'פתרון משוואות לינאריות צעד אחר צעד',
    content: `משוואה לינארית היא משוואה מהצורה: ax + b = c\n\n**שלבי הפתרון:**\n1. העבר את כל האיברים עם x לצד אחד\n2. העבר את כל המספרים לצד השני\n3. חלק את שני הצדדים במקדם של x\n\n**דוגמה:** 2x + 3 = 7\n1. 2x = 7 - 3\n2. 2x = 4\n3. x = 4 ÷ 2\n4. x = 2\n\n**בדיקה:** 2(2) + 3 = 4 + 3 = 7 ✓`,
    
    interactiveExamples: [
      {
        title: 'פתרון משוואה פשוטה',
        description: 'פתור: x + 5 = 12',
        question: 'מה הפתרון של המשוואה x + 5 = 12?',
        options: ['5', '7', '12', '17'],
        correctAnswer: 1,
        explanation: 'x + 5 = 12 → x = 12 - 5 → x = 7'
      },
      {
        title: 'משוואה עם כפל',
        description: 'פתור: 3x = 15',
        question: 'מה הפתרון של המשוואה 3x = 15?',
        options: ['3', '5', '12', '18'],
        correctAnswer: 1,
        explanation: '3x = 15 → x = 15 ÷ 3 → x = 5'
      }
    ],
    
    difficulty: 'בינוני',
    estimatedTime: 25,
    prerequisites: ['חשבון בסיסי'],
    tags: ['משוואות', 'אלגברה', 'פתרון'],
    youtubeLink: 'https://www.youtube.com/embed/Fz7GMKbLPh4' // סרטון על משוואות לינאריות לילדים
  },
  
  {
    title: 'יחס ופרופורציה',
    description: 'הבנת יחסים ופרופורציות עם דוגמאות מעשיות',
    content: `**יחס** משווה בין שני גדלים או כמויות.\n\n**דוגמה:** אם יש 3 בנים ו-2 בנות, היחס הוא 3:2\n\n**פרופורציה** היא שוויון בין שני יחסים.\n\n**דוגמה:** 3:2 = 6:4 (כי 3×2=6 ו-2×2=4)\n\n**שימוש מעשי:**\n- אם 2 ק\"ג עולים 10 ש\"ח, כמה יעלו 5 ק\"ג?\n- היחס: 2:10 = 5:x\n- הפתרון: x = (5 × 10) ÷ 2 = 25 ש\"ח`,
    
    interactiveExamples: [
      {
        title: 'חישוב יחס',
        description: 'חשב את היחס בין 8 ל-4',
        question: 'מה היחס בין 8 ל-4?',
        options: ['1:2', '2:1', '4:1', '8:1'],
        correctAnswer: 1,
        explanation: 'היחס הוא 8:4 = 2:1 (חילקנו ב-4)'
      },
      {
        title: 'פרופורציה מעשית',
        description: 'אם 3 ספרים עולים 30 ש"ח, כמה יעלו 5 ספרים?',
        question: 'אם 3 ספרים עולים 30 ש"ח, כמה יעלו 5 ספרים?',
        options: ['40 ש"ח', '45 ש"ח', '50 ש"ח', '60 ש"ח'],
        correctAnswer: 2,
        explanation: '3:30 = 5:x → x = (5 × 30) ÷ 3 = 50 ש"ח'
      }
    ],
    
    difficulty: 'בינוני',
    estimatedTime: 20,
    prerequisites: ['חשבון בסיסי'],
    tags: ['יחס', 'פרופורציה', 'חישובים'],
    youtubeLink: 'https://www.youtube.com/embed/ARBDyGe4E_Q' // סרטון על יחס ופרופורציה לילדים
  },
  
  {
    title: 'שטח והיקף',
    description: 'חישוב שטח והיקף של צורות גיאומטריות',
    content: `**היקף** הוא סך האורכים של כל הצלעות.\n\n**שטח** הוא כמות המקום שתופס הצורה.\n\n**נוסחאות חשובות:**\n\n**מלבן:**\n- היקף: 2 × (אורך + רוחב)\n- שטח: אורך × רוחב\n\n**ריבוע:**\n- היקף: 4 × צלע\n- שטח: צלע²\n\n**משולש:**\n- היקף: סכום כל הצלעות\n- שטח: (בסיס × גובה) ÷ 2\n\n**עיגול:**\n- היקף: 2 × π × רדיוס\n- שטח: π × רדיוס²`,
    
    interactiveExamples: [
      {
        title: 'חישוב שטח מלבן',
        description: 'חשב שטח מלבן באורך 6 ורוחב 4',
        question: 'מה השטח של מלבן באורך 6 ורוחב 4?',
        options: ['10', '20', '24', '30'],
        correctAnswer: 2,
        explanation: 'שטח = אורך × רוחב = 6 × 4 = 24'
      },
      {
        title: 'חישוב היקף ריבוע',
        description: 'חשב היקף ריבוע בצלע 5',
        question: 'מה ההיקף של ריבוע בצלע 5?',
        options: ['10', '15', '20', '25'],
        correctAnswer: 2,
        explanation: 'היקף = 4 × צלע = 4 × 5 = 20'
      }
    ],
    
    difficulty: 'קל',
    estimatedTime: 18,
    prerequisites: ['חשבון בסיסי'],
    tags: ['גיאומטריה', 'שטח', 'היקף'],
    youtubeLink: 'https://www.youtube.com/embed/uu_T9e3FHAE' // סרטון על שטח והיקף לילדים
  }
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
    console.log('✔ הוזנו תכני תיאוריה חדשים עם תוכן אינטראקטיבי');

  } catch (err) {
    console.error('שגיאה במהלך הזרעה:', err);
  } finally {
    await mongoose.disconnect();
  }
}

seedTheory();
