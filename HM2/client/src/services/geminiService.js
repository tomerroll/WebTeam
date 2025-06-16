// File: client/src/services/geminiService.js

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
  