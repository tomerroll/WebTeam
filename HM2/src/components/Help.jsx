import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Help = () => {
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [helpContent, setHelpContent] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/help', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, message }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('הבקשה נשלחה בהצלחה');
        setMessage('');
        setSubject('');
        // נטען מחדש את ההודעות אחרי שליחת פנייה
        fetchHelpContent();
      } else {
        alert(`שגיאה: ${data.error}`);
      }
    } catch (err) {
      console.error('שגיאה בשליחת בקשת העזרה:', err);
      alert('אירעה שגיאה בעת שליחת הבקשה');
    }
  };

  // פונקציה שמביאה את כל ההודעות
  const fetchHelpContent = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/help');
      const data = await res.json();
      setHelpContent(data);
    } catch (err) {
      console.error('שגיאה בהבאת תוכן עזרה:', err);
    }
  };

  // שימוש ב- useEffect להוריד את תוכן העזרה עם הטעינה הראשונית של הרכיב
  useEffect(() => {
    fetchHelpContent();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/student-dashboard" className="text-primary-600 hover:text-primary-700">
                  חזרה לדף הבית
                </Link>
              </div>
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

            {/* הצגת כל ההודעות */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-800">הודעות עזרה</h3>
              <ul className="space-y-4 mt-4">
                {helpContent.length > 0 ? (
                  helpContent.map((help) => (
                    <li key={help._id} className="p-4 bg-gray-50 rounded-lg shadow-md">
                      <h4 className="font-medium text-gray-800">{help.subject}</h4>
                      <p className="mt-2 text-gray-700">{help.message}</p>
                      <p className="mt-2 text-sm text-gray-500">{new Date(help.createdAt).toLocaleString()}</p>
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
