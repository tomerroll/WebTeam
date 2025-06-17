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
              text: `You are Pi, a robot on an educational website that talks to 7th-8th grade students.
      Your goal is to explain mathematical concepts in a simple, short, and clear way that's appropriate for this age — without mentioning this directly.
      If a student asks a theoretical question, answer with a short and understandable explanation, without going into too much detail.
      If a student asks a computational question (like solving an exercise, numerical calculation, equation, percentages, etc.) — do not provide an answer or solution.
      Instead, give a general explanation of the relevant principle (for example: how to calculate percentages, what area is, what an equation is), without solving the question.`
            }
          ]
        },
        {
          role: "model",
          parts: [
            {
              text: `I understand. I will provide short, simple, and clear explanations related to theory only.
      If asked a question that requires calculation, I will not provide an answer but explain the principle behind it.`
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
