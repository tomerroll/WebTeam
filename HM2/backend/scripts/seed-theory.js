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
    
    visualExamples: [
      {
        title: 'המחשה ויזואלית של שברים',
        description: 'צפה כיצד שברים נראים בצורה ויזואלית',
        imageUrl: '/images/fractions-visual.png',
        animationData: {
          type: 'svg',
          content: `
            <svg width="400" height="200" viewBox="0 0 400 200">
              <!-- עיגול 1/2 -->
              <circle cx="100" cy="100" r="50" fill="none" stroke="#3B82F6" stroke-width="3"/>
              <path d="M 100 50 L 100 150" stroke="#3B82F6" stroke-width="3"/>
              <text x="100" y="180" text-anchor="middle" fill="#374151" font-size="16">1/2</text>
              
              <!-- עיגול 1/4 -->
              <circle cx="250" cy="100" r="50" fill="none" stroke="#10B981" stroke-width="3"/>
              <path d="M 250 50 L 250 150" stroke="#10B981" stroke-width="3"/>
              <path d="M 200 100 L 300 100" stroke="#10B981" stroke-width="3"/>
              <text x="250" y="180" text-anchor="middle" fill="#374151" font-size="16">1/4</text>
              
              <!-- מלבן 3/4 -->
              <rect x="320" y="50" width="60" height="100" fill="none" stroke="#F59E0B" stroke-width="3"/>
              <path d="M 320 100 L 380 100" stroke="#F59E0B" stroke-width="3"/>
              <path d="M 320 125 L 380 125" stroke="#F59E0B" stroke-width="3"/>
              <text x="350" y="180" text-anchor="middle" fill="#374151" font-size="16">3/4</text>
            </svg>
          `
        },
        explanation: 'התמונה מראה כיצד שברים שונים נראים כחלקים של עיגול או מלבן.'
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
    
    visualExamples: [
      {
        title: 'המחשה ויזואלית של אחוזים',
        description: 'צפה כיצד אחוזים נראים בצורה ויזואלית',
        animationData: {
          type: 'svg',
          content: `
            <svg width="400" height="200" viewBox="0 0 400 200">
              <!-- 25% -->
              <circle cx="100" cy="100" r="40" fill="none" stroke="#E5E7EB" stroke-width="8"/>
              <path d="M 100 100 L 100 60 A 40 40 0 0 1 140 100 Z" fill="#3B82F6"/>
              <text x="100" y="180" text-anchor="middle" fill="#374151" font-size="14">25%</text>
              
              <!-- 50% -->
              <circle cx="200" cy="100" r="40" fill="none" stroke="#E5E7EB" stroke-width="8"/>
              <path d="M 200 100 L 200 60 A 40 40 0 0 1 240 100 Z" fill="#10B981"/>
              <text x="200" y="180" text-anchor="middle" fill="#374151" font-size="14">50%</text>
              
              <!-- 75% -->
              <circle cx="300" cy="100" r="40" fill="none" stroke="#E5E7EB" stroke-width="8"/>
              <path d="M 300 100 L 300 60 A 40 40 0 0 1 340 100 A 40 40 0 0 1 300 140 Z" fill="#F59E0B"/>
              <text x="300" y="180" text-anchor="middle" fill="#374151" font-size="14">75%</text>
            </svg>
          `
        },
        explanation: 'התמונה מראה כיצד אחוזים שונים נראים כחלקים של עיגול.'
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
    
    visualExamples: [
      {
        title: 'המחשה ויזואלית של משוואות',
        description: 'צפה כיצד משוואות נפתרות צעד אחר צעד',
        animationData: {
          type: 'html',
          content: `
            <div class="equation-steps">
              <div class="step">
                <span class="step-number">1</span>
                <span class="equation">2x + 3 = 7</span>
              </div>
              <div class="step">
                <span class="step-number">2</span>
                <span class="equation">2x = 7 - 3</span>
              </div>
              <div class="step">
                <span class="step-number">3</span>
                <span class="equation">2x = 4</span>
              </div>
              <div class="step">
                <span class="step-number">4</span>
                <span class="equation">x = 4 ÷ 2</span>
              </div>
              <div class="step">
                <span class="step-number">5</span>
                <span class="equation">x = 2</span>
              </div>
            </div>
            <style>
              .equation-steps {
                display: flex;
                flex-direction: column;
                gap: 10px;
                padding: 20px;
                background: #f8fafc;
                border-radius: 8px;
              }
              .step {
                display: flex;
                align-items: center;
                gap: 15px;
              }
              .step-number {
                background: #3b82f6;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
              }
              .equation {
                font-size: 18px;
                font-family: 'Courier New', monospace;
                color: #374151;
              }
            </style>
          `
        },
        explanation: 'התמונה מראה את השלבים השונים בפתרון משוואה לינארית.'
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
    
    visualExamples: [
      {
        title: 'המחשה ויזואלית של יחסים',
        description: 'צפה כיצד יחסים נראים בצורה ויזואלית',
        animationData: {
          type: 'svg',
          content: `
            <svg width="400" height="200" viewBox="0 0 400 200">
              <!-- יחס 2:1 -->
              <rect x="50" y="50" width="60" height="40" fill="#3B82F6"/>
              <rect x="120" y="50" width="30" height="40" fill="#10B981"/>
              <text x="100" y="120" text-anchor="middle" fill="#374151" font-size="14">יחס 2:1</text>
              
              <!-- יחס 3:2 -->
              <rect x="200" y="50" width="90" height="40" fill="#F59E0B"/>
              <rect x="300" y="50" width="60" height="40" fill="#EF4444"/>
              <text x="250" y="120" text-anchor="middle" fill="#374151" font-size="14">יחס 3:2</text>
              
              <!-- פרופורציה -->
              <text x="200" y="160" text-anchor="middle" fill="#374151" font-size="12">2:1 = 4:2</text>
            </svg>
          `
        },
        explanation: 'התמונה מראה כיצד יחסים שונים נראים כחלקים של מלבנים.'
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
    
    visualExamples: [
      {
        title: 'המחשה ויזואלית של שטח והיקף',
        description: 'צפה כיצד שטח והיקף נראים בצורה ויזואלית',
        animationData: {
          type: 'svg',
          content: `
            <svg width="400" height="200" viewBox="0 0 400 200">
              <!-- מלבן -->
              <rect x="50" y="50" width="80" height="40" fill="none" stroke="#3B82F6" stroke-width="2"/>
              <text x="90" y="110" text-anchor="middle" fill="#374151" font-size="12">מלבן</text>
              <text x="90" y="125" text-anchor="middle" fill="#374151" font-size="10">שטח: 80×40</text>
              
              <!-- ריבוע -->
              <rect x="180" y="50" width="50" height="50" fill="none" stroke="#10B981" stroke-width="2"/>
              <text x="205" y="110" text-anchor="middle" fill="#374151" font-size="12">ריבוע</text>
              <text x="205" y="125" text-anchor="middle" fill="#374151" font-size="10">היקף: 4×50</text>
              
              <!-- משולש -->
              <polygon points="320,90 350,50 380,90" fill="none" stroke="#F59E0B" stroke-width="2"/>
              <text x="350" y="110" text-anchor="middle" fill="#374151" font-size="12">משולש</text>
              <text x="350" y="125" text-anchor="middle" fill="#374151" font-size="10">שטח: (ב×ג)/2</text>
            </svg>
          `
        },
        explanation: 'התמונה מראה כיצד שטח והיקף נראים בצורות גיאומטריות שונות.'
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
