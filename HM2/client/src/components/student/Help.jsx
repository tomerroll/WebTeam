import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendHelpRequest, fetchHelpMessages } from '../../services/helpService';

const Help = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [helpContent, setHelpContent] = useState([]);

  const user = JSON.parse(localStorage.getItem('user'));
  const studentEmail = user?.email || null;
  const studentName = user?.name || 'משתמש לא מזוהה';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentEmail) {
      alert('אירעה שגיאה: לא נמצא מייל תלמיד. אנא התחבר מחדש.');
      return;
    }
  
    try {
      await sendHelpRequest({ subject, message, studentEmail, studentName });
      alert('הבקשה נשלחה בהצלחה');
      setMessage('');
      setSubject('');
      loadHelpMessages();
    } catch (err) {
      console.error('שגיאה בשליחת בקשת העזרה:', err);
      alert(`שגיאה: ${err.message}`);
    }
  };
  

  const loadHelpMessages = async () => {
    try {
      const data = await fetchHelpMessages();
      setHelpContent(data);
    } catch (err) {
      console.error('שגיאה בטעינת הודעות:', err);
    }
  };
  
  useEffect(() => {
    loadHelpMessages();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              <h1
                className="text-xl font-bold text-primary-600 cursor-pointer transition-all duration-300 hover:text-white hover:bg-primary-600 hover:shadow-lg hover:px-3 hover:rounded-full"
                onClick={() => window.location.href = '/student-dashboard'}
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">בקשת עזרה</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                  נושא
                </label>
                <input
                  type="text"
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  הודעה
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  שלח בקשה
                </button>
              </div>
            </form>

            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-800">הודעות עזרה</h3>
              <ul className="space-y-4 mt-4">
                {helpContent.length > 0 ? (
                  helpContent.map((help) => (
                    <li key={help._id} className="p-4 bg-gray-50 rounded-lg shadow-md">
                      <h4 className="font-medium text-gray-800">{help.subject}</h4>
                      <p className="mt-2 text-gray-700">{help.message}</p>
                      <p className="mt-2 text-sm text-gray-500">
                        {new Date(help.createdAt).toLocaleString()}
                      </p>
                      <p className="mt-1 text-sm text-gray-600 font-semibold">
                        שם התלמיד: {help.studentName || help.studentEmail}
                      </p>
                      {help.answer && help.answer.trim() !== '' && (
                        <div className="mt-4 p-3 bg-primary-100 text-primary-800 rounded-md">
                          <h5 className="font-semibold">תשובת המורה:</h5>
                          <p>{help.answer}</p>
                          {help.answeredBy && (
                            <p className="mt-1 text-sm text-green-700 font-medium">
                              נענה על ידי: {help.answeredBy}
                            </p>
                          )}
                        </div>
                      )}
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500">לא נמצאו הודעות עזרה.</p>
                )}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Help;
