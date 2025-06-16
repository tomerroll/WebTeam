import React, { useEffect, useRef, useState, useContext } from 'react';
import '@google/model-viewer';
import { sendMessageToGemini } from '../../services/geminiService'
import { ThemeContext } from '../../contexts/ThemeContext';

const animations = ['Free_Fall', 'Look_Wave', 'Sitting'];

export default function ChatRobot({ width = 150, height = 150 }) {
  const viewerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const { isDarkMode } = useContext(ThemeContext);

  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'היי אני הרובוט פאי! 😊 איך אפשר לעזור?' },
  ]);
  const [input, setInput] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [showAskMeAnythingBubble, setShowAskMeAnythingBubble] = useState(false);
  const [hasShownAskMeAnything, setHasShownAskMeAnything] = useState(false);
  const [hasSentFirstMessage, setHasSentFirstMessage] = useState(false);

  useEffect(() => {
    // הפעלת אנימציה רנדומלית כל 6 שניות
    const interval = setInterval(() => {
      const viewer = viewerRef.current;
      if (viewer) {
        const randomAnim = animations[Math.floor(Math.random() * animations.length)];
        viewer.animationName = randomAnim;
      }
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // הצגת בועת "שאל אותי כל דבר" עם טעינת הרכיב
  useEffect(() => {
    if (!hasShownAskMeAnything) {
      setShowAskMeAnythingBubble(true);
      setHasShownAskMeAnything(true);
      setTimeout(() => {
        setShowAskMeAnythingBubble(false);
      }, 5000);
    }
  }, []);

  // גלילה לתחתית הצ'אט
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = { sender: 'user', text: input };
    setHasSentFirstMessage(true);
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    const indexOfFirstUserMsg = messages.findIndex(msg => msg.sender === 'user');
    const filteredMessages = indexOfFirstUserMsg >= 0 ? messages.slice(indexOfFirstUserMsg) : [];
    
    const historyForGemini = filteredMessages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    try {
      const reply = await sendMessageToGemini(historyForGemini, userMessage.text);
      const botMessage = { sender: 'bot', text: reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Gemini API error:', err);
      setMessages((prev) => [...prev, { sender: 'bot', text: "שגיאה: לא הצלחתי להתחבר." }]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* הצ'אט עצמו */}
      {chatOpen && (
        <div className={`absolute bottom-[calc(100%+1rem)] right-0 rounded-lg shadow-lg w-80 h-96 flex flex-col overflow-hidden ${
          isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        }`}>
          <div className={`flex justify-between items-center p-2 border-b ${
            isDarkMode ? 'border-gray-600' : 'border-gray-200'
          }`}>
            <h3 className="text-lg font-semibold">צ'אט עם הרובוט</h3>
            <button
              onClick={() => setChatOpen(false)}
              className={`text-xl font-bold ${
                isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              &times;
            </button>
          </div>
          <div className="p-4 flex-grow overflow-y-auto">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-2 p-2 rounded-lg text-sm max-w-[80%] ${
                  msg.sender === 'user'
                    ? 'bg-blue-500 text-white self-end ml-auto'
                    : isDarkMode 
                      ? 'bg-gray-700 text-gray-200 self-start mr-auto'
                      : 'bg-gray-200 text-gray-800 self-start mr-auto'
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className={`border-t p-2 flex ${
            isDarkMode ? 'border-gray-600' : 'border-gray-200'
          }`}>
            <input
              type="text"
              className={`flex-grow border rounded-md p-2 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'border-gray-300 text-gray-800 placeholder-gray-500'
              }`}
              placeholder="הקלד הודעה..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              onClick={handleSend}
            >
              שלח
            </button>
          </div>
        </div>
      )}

      {/* רובוט + בועה של 'שאל אותי' */}
      <div
        className="cursor-pointer relative"
        onClick={() => {
          setChatOpen(!chatOpen);
          setShowAskMeAnythingBubble(false); // מסתיר אם לחצו
        }}
      >
        {showAskMeAnythingBubble && (
          <div
            className={`absolute bottom-[calc(100%+0.5rem)] right-0 p-3 rounded-xl shadow-lg text-sm transition-all duration-300 animate-bounce ${
              isDarkMode 
                ? 'bg-gray-700 text-gray-200 border border-gray-600' 
                : 'bg-yellow-100 text-gray-800'
            }`}
            onClick={(e) => { e.stopPropagation(); setShowAskMeAnythingBubble(false); }}
          >
            👋 היי! שאל אותי כל דבר 💬
          </div>
        )}

        <model-viewer
          ref={viewerRef}
          src="/models/robot.glb"
          alt="Animated Robot"
          autoplay
          loop
          camera-orbit="0deg 90deg 4m"
          field-of-view="auto"
          style={{
            width: `${width}px`,
            height: `${height}px`,
            background: 'transparent',
          }}
        />
      </div>
    </div>
  );
}
