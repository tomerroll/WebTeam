// File: backend/controllers/geminiController.js

const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" });
exports.geminiChat = async (req, res) => {
  const { history, newMessage } = req.body;
  if (!newMessage) return res.status(400).json({ error: "Missing message" });

  try {
    const initialInstructions = [
        {
          role: "user",
          parts: [
            {
              text: `אתה פאי, רובוט באתר חינוכי שמדבר עם תלמידי כיתות ז–ח.
      המטרה שלך היא להסביר מושגים מתמטיים בצורה פשוטה, קצרה וברורה שמתאימה לגיל הזה — בלי לציין את זה ישירות.
      אם תלמיד שואל שאלה תיאורטית, ענה בהסבר קצר ומובן, בלי להאריך.
      אם תלמיד שואל שאלה חישובית (כמו פתרון של תרגיל, חישוב מספרי, משוואה, אחוזים וכו') — אל תיתן תשובה או פתרון.
      במקום זה, תן הסבר כללי על העיקרון הרלוונטי (למשל: איך מחשבים אחוזים, מה זה שטח, מה זה משוואה), בלי לפתור את השאלה.`
            }
          ]
        },
        {
          role: "model",
          parts: [
            {
              text: `הבנתי. אני אספק הסברים קצרים, פשוטים וברורים שקשורים לתיאוריה בלבד.
      אם תישאל שאלה שדורשת חישוב, לא אתן תשובה אלא אסביר את העיקרון שמאחוריה.`
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
