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
    <div className="min-h-screen bg-gray-100">
      {/* Navbar עם שם המשתמש */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              <h1
                className="text-xl font-bold text-primary-600 cursor-pointer transition-all duration-300 hover:text-white hover:bg-primary-600 hover:shadow-lg hover:px-3 hover:rounded-full"
                onClick={() => window.location.href = '/teacher-dashboard'}
              >
                MathDuo
              </h1>
            </div>
            <div className="flex items-center gap-6">
              <button
                onClick={() => {
                  localStorage.clear();
                  navigate('/');
                }}
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                התנתק
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">פורום פניות תלמידים</h2>

            {helps.length === 0 ? (
              <p className="text-gray-500">אין פניות להצגה.</p>
            ) : (
              <ul className="space-y-6">
                {helps.map((help) => (
                  <li key={help._id} className="relative p-4 bg-gray-50 rounded-lg shadow-md">
                    {/* כפתור מחיקת הפנייה בפינה שמאלית עליונה */}
                    <button
                      onClick={() => deleteHelp(help._id)}
                      className="absolute top-2 left-2 text-sm text-white bg-red-600 hover:bg-red-700 hover:animate-shake px-3 py-1 rounded shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      מחק פנייה
                    </button>
                    <h4 className="font-medium text-gray-800">{help.subject}</h4>
                    <p className="mt-2 text-gray-700">{help.message}</p>
                    <p className="mt-2 text-sm text-gray-500">{new Date(help.createdAt).toLocaleString()}</p>
                    <p className="mt-1 text-sm text-gray-600 font-semibold">
                      שם התלמיד: {help.studentName || help.studentEmail}
                    </p>

                    {help.answer && !editing[help._id] ? (
                      <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md">
                        <h5 className="font-semibold">תשובת המורה:</h5>
                        <p>{help.answer}</p>
                        {/* הצגת שם המורה אם קיים */}
                        {help.answeredBy && (
                          <p className="mt-1 text-sm text-green-700 font-medium">
                            נענה על ידי: {help.answeredBy}
                          </p>
                        )}

                        {/* בדיקה האם להציג את כפתורי עריכה ומחיקה של תשובה */}
                        {( !help.answeredBy || help.answeredBy === user.name ) && (
                          <div className="mt-2 flex space-x-2 rtl:space-x-reverse">
                            <button
                              onClick={() => {
                                setEditing((prev) => ({ ...prev, [help._id]: true }));
                                setAnswerInputs((prev) => ({ ...prev, [help._id]: help.answer }));
                              }}
                              className="text-sm text-blue-600 hover:underline"
                            >
                              ערוך
                            </button>
                            <button
                              onClick={() => deleteAnswer(help._id)}
                              className="text-sm text-red-600 hover:underline"
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
                          className="w-full border border-gray-300 rounded-md p-2 shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        />
                        <div className="mt-2 flex space-x-2 rtl:space-x-reverse">
                          <button
                            onClick={() => submitAnswer(help._id)}
                            className="bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          >
                            שמור תשובה
                          </button>
                          {help.answer && (
                            <button
                              onClick={() => setEditing((prev) => ({ ...prev, [help._id]: false }))}
                              className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400"
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
        </div>
      </main>
    </div>
  );
};

export default TeacherHelpForum;
