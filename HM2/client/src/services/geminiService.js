// File: client/src/services/geminiService.js

/**
 * Gemini Service
 * Handles API calls for AI chat functionality using Google's Gemini API
 */

/**
 * Send message to Gemini AI and get response
 * @param {Array} history - Chat history
 * @param {string} newMessage - New message to send
 * @returns {Promise<string>} AI response
 */
export const sendMessageToGemini = async (history, newMessage) => {
    try {
      const res = await fetch('/api/gemini-chat/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ history, newMessage })
      });
  
      if (!res.ok) throw new Error('Network response was not ok');
  
      const data = await res.json();
      return data.reply;
    } catch (error) {
      console.error('Gemini service error:', error);
      throw error;
    }
  };
  