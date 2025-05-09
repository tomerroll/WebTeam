import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Help = () => {
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [helpContent, setHelpContent] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // כאן נוסיף את הלוגיקה לשליחת ההודעה
    console.log('Message:', message);
    console.log('Subject:', subject);
    // ניקוי הטופס
    setMessage('');
    setSubject('');
  };

  useEffect(() => {
    const fetchHelpContent = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/help');
        const data = await res.json();
        setHelpContent(data);
      } catch (err) {
        console.error('Error fetching help content:', err);
      }
    };

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
          </div>
        </div>
      </main>
    </div>
  );
};

export default Help; 