import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchHelpMessages, answerHelpRequest, deleteHelpAnswer, deleteHelpRequest } from '../../services/helpService';

const TeacherHelpForum = () => {
  const navigate = useNavigate();
  const [helps, setHelps] = useState([]);
  const [answerInputs, setAnswerInputs] = useState({});
  const [editing, setEditing] = useState({});
  const [user, setUser] = useState(null);

  // טען את המשתמש מה-localStorage בפעם הראשונה
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);
  const fetchHelps = async () => {
    try {
      const data = await fetchHelpMessages();
      setHelps(data);
    } catch (err) {
      console.error('שגיאה בקבלת הפניות:', err);
    }
  };
  

  useEffect(() => {
    fetchHelps();
  }, []);

  const handleAnswerChange = (id, value) => {
    setAnswerInputs((prev) => ({ ...prev, [id]: value }));
  };

  const submitAnswer = async (id) => {
    const answer = answerInputs[id];
    if (!answer || answer.trim() === '') {
      alert('אנא הזן תשובה לפני השליחה');
      return;
    }
  
    const storedUser = localStorage.getItem('user');
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const teacherName = parsedUser?.name || 'מורה לא ידוע';
  
    try {
      await answerHelpRequest(id, answer, teacherName);
      alert('התשובה נשמרה בהצלחה');
      setAnswerInputs((prev) => ({ ...prev, [id]: '' }));
      setEditing((prev) => ({ ...prev, [id]: false }));
      fetchHelps();
    } catch (err) {
      console.error('שגיאה בשליחת תשובה:', err);
      alert('אירעה שגיאה בעת שליחת התשובה');
    }
  };
  

  const deleteAnswer = async (id) => {
    const confirmDelete = window.confirm('האם אתה בטוח שברצונך למחוק את התשובה?');
    if (!confirmDelete) return;
  
    try {
      await deleteHelpAnswer(id);
      alert('התשובה נמחקה בהצלחה');
      fetchHelps();
    } catch (err) {
      console.error('שגיאה במחיקת תשובה:', err);
      alert('אירעה שגיאה בעת מחיקת התשובה');
    }
  };
  

  // פונקציה למחיקת פנייה מלאה
  const deleteHelp = async (id) => {
    const confirmDelete = window.confirm('האם אתה בטוח שברצונך למחוק את הפנייה הזו?');
    if (!confirmDelete) return;
  
    try {
      await deleteHelpRequest(id);
      alert('הפנייה נמחקה בהצלחה');
      fetchHelps();
    } catch (err) {
      console.error('שגיאה במחיקת הפנייה:', err);
      alert('אירעה שגיאה בעת מחיקת הפנייה');
    }
  };
  
  if (!user) {
    // אפשר להוסיף טעינת משתמש במידה ועדיין לא טען
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>טוען משתמש...</p>
      </div>
    );
  }

return (
  <div className="min-h-screen bg-gradient-to-b from-sky-100 to-cyan-200 dark:from-gray-900 dark:to-gray-800 py-10 px-4">
    <main className="max-w-5xl mx-auto font-sans text-gray-900 dark:text-white">
      <div className="bg-white/70 dark:bg-white/5 backdrop-blur-md shadow-2xl rounded-3xl p-8">
        <h2 className="text-4xl font-bold text-center mb-8">📩 פורום פניות תלמידים</h2>

        {helps.length === 0 ? (
          <p className="text-center text-lg text-gray-700 dark:text-gray-300">אין פניות להצגה.</p>
        ) : (
          <ul className="space-y-8">
            {helps.map((help) => (
              <li
                key={help._id}
                className="relative rounded-xl bg-white dark:bg-gray-800 shadow-md p-6 transition hover:shadow-lg"
              >
                {/* כפתור מחיקת פנייה */}
                <button
                  onClick={() => deleteHelp(help._id)}
                  className="absolute top-3 left-3 text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full shadow-md transition"
                >
                  🗑 מחק פנייה
                </button>

                <h4 className="text-xl font-semibold mb-1">{help.subject}</h4>
                <p className="text-gray-700 dark:text-gray-300">{help.message}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  נשלח ב־{new Date(help.createdAt).toLocaleString()}
                </p>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  מאת: {help.studentName || help.studentEmail}
                </p>

                {/* תשובה קיימת */}
                {help.answer && !editing[help._id] ? (
                  <div className="mt-4 bg-green-100 dark:bg-green-900/20 p-4 rounded-xl">
                    <p className="font-semibold text-green-800 dark:text-green-300">✏️ תשובת המורה:</p>
                    <p className="mt-1">{help.answer}</p>
                    {help.answeredBy && (
                      <p className="text-sm mt-1 text-green-700 dark:text-green-400">
                        נענה על ידי: {help.answeredBy}
                      </p>
                    )}

                    {( !help.answeredBy || help.answeredBy === user.name ) && (
                      <div className="flex space-x-2 rtl:space-x-reverse mt-2">
                        <button
                          onClick={() => {
                            setEditing((prev) => ({ ...prev, [help._id]: true }));
                            setAnswerInputs((prev) => ({ ...prev, [help._id]: help.answer }));
                          }}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          ערוך
                        </button>
                        <button
                          onClick={() => deleteAnswer(help._id)}
                          className="text-red-600 hover:underline text-sm"
                        >
                          מחק תשובה
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-4">
                    <textarea
                      rows={3}
                      placeholder="כתוב תשובה כאן..."
                      value={answerInputs[help._id] || ''}
                      onChange={(e) => handleAnswerChange(help._id, e.target.value)}
                      className="w-full rounded-xl p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <div className="mt-2 flex space-x-2 rtl:space-x-reverse">
                      <button
                        onClick={() => submitAnswer(help._id)}
                        className="bg-primary-600 text-white px-4 py-2 rounded-xl hover:bg-primary-700 transition"
                      >
                        שמור תשובה
                      </button>
                      {help.answer && (
                        <button
                          onClick={() => setEditing((prev) => ({ ...prev, [help._id]: false }))}
                          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-xl hover:bg-gray-400"
                        >
                          ביטול
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  </div>
);

};

export default TeacherHelpForum;
