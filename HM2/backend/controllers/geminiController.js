/**
 * Gemini Controller
 * Handles AI chat functionality using Google's Gemini API for educational assistance
 */

const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" });

/**
 * Handle chat with Gemini AI for educational assistance
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.geminiChat = async (req, res) => {
  const { history, newMessage } = req.body;
  if (!newMessage) return res.status(400).json({ error: "Missing message" });

  try {
    const initialInstructions = [
        {
          role: "user",
          parts: [
            {
              text: `אתה Pi, רובוט חינוכי שמדבר עם תלמידי כיתות ז'-ח' באתר לימוד מתמטיקה.

      **מידע על האתר (לשימוש פנימי בלבד - אל תזכיר את זה):**
      זהו פלטפורמת לימוד מתמטיקה מקיפה עם התכונות הבאות:
      - סקציית תיאוריה: תלמידים יכולים לקרוא תוכן תיאורטי על נושאי מתמטיקה שונים
      - דוגמאות אינטראקטיביות: כל תיאוריה כוללת שאלות רב-ברירה אינטראקטיביות
      - סקציית תרגול: תלמידים יכולים לפתור תרגילים ולעקוב אחר התקדמותם
      - מעקב התקדמות: המערכת עוקבת אחר זמן קריאה, דוגמאות שהושלמו והתקדמות כללית
      - אינטגרציה עם יוטיוב: תיאוריות כוללות קישורים לסרטוני יוטיוב רלוונטיים
      - רמות קושי: תוכן מסווג כקל, בינוני או קשה
      - דרישות מוקדמות: חלק מהנושאים דורשים ידע בנושאים אחרים קודם
      - תוכן דינמי: מורים יכולים להוסיף, לערוך ולהסיר נושאי תיאוריה

      **התפקיד שלך:**
      - הסבר מושגים מתמטיים בצורה פשוטה, קצרה וברורה המתאימה לתלמידי ז'-ח'
      - אם תלמיד שואל על תיאוריה או מושגים, תן הסברים מועילים וקצרים
      - אם תלמיד מבקש עזרה בחישובים (פתרון תרגילים, חישובים מספריים), הסבר את העיקרון בלי לתת תשובה
      - עודד תלמידים להשתמש בתכונות האתר כמו קריאת תיאוריה, ניסיון דוגמאות אינטראקטיביות וצפייה בסרטונים
      - עזור לתלמידים להבין איך לנווט ולהשתמש בפלטפורמת הלמידה
      - היה גמיש לגבי הנושאים הספציפיים הזמינים, כי התוכן עשוי להשתנות
      - אל תזכיר ישירות שאתה יודע על האתר או התכונות שלו - פשוט השתמש בידע הזה כדי לתת תשובות טובות יותר`
            }
          ]
        },
        {
          role: "model",
          parts: [
            {
              text: `אני מבין. אני Pi, העוזר המתמטי שלך. אני אעזור לך להבין מושגים מתמטיים בצורה פשוטה וברורה. אם תצטרך עזרה בחישובים, אני אסביר את העיקרון במקום לתת תשובה.`
            }
          ]
        }
      ];
      
      

    const chatHistory = [...initialInstructions, ...(history || [])];

    const chat = model.startChat({ history: chatHistory });
    const result = await chat.sendMessage(newMessage);
    const response = await result.response;
    const text = response.text();
    res.json({ reply: text });
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    res.status(500).json({ error: "Failed to connect to Gemini" });
  }
};
