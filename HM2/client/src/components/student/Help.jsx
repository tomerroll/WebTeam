import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendHelpRequest, fetchHelpMessages } from '../../services/helpService';

/**
 * Help Component
 * 
 * A help request system that allows students to send questions to teachers and view
 * responses. Students can submit help requests with subjects and detailed messages,
 * and view all their previous requests along with teacher responses. The component
 * includes form validation, real-time updates, and a clean interface for managing
 * help communications.
 * 
 * @returns {JSX.Element} - Help request form and message history
 */
const Help = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [helpContent, setHelpContent] = useState([]);

  const user = JSON.parse(localStorage.getItem('user'));
  const studentEmail = user?.email || null;
  const studentName = user?.name || 'משתמש לא מזוהה';

  /**
   * Handles submission of a new help request
   * @param {Event} e - Form submission event
   */
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

  /**
   * Loads all help messages for the current student
   */
  const loadHelpMessages = async () => {
    try {
      const data = await fetchHelpMessages();
      setHelpContent(data);
    } catch (err) {
      console.error('שגיאה בטעינת הודעות:', err);
    }
  };

  // Load help messages on component mount
  useEffect(() => {
    loadHelpMessages();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-200 dark:from-gray-900 dark:to-gray-800 py-10 px-4">
      <main className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-white via-blue-50 to-sky-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl p-8 transition-all duration-300">
          <h2 className="text-3xl font-bold text-center text-blue-800 dark:text-white drop-shadow mb-8">
            בקשת עזרה מהמורה
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6 mb-10">
            <div>
              <label htmlFor="subject" className="block text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">
                נושא
              </label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">
                תוכן ההודעה
              </label>
              <textarea
                id="message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-semibold shadow transition"
              >
                שלח בקשה
              </button>
            </div>
          </form>

          <div>
            <h3 className="text-2xl font-bold text-blue-800 dark:text-white mb-6 drop-shadow text-center">הודעות שנשלחו</h3>
            <ul className="space-y-6">
              {helpContent.length > 0 ? (
                helpContent.map((help) => (
                  <li key={help._id} className="bg-white dark:bg-gray-700 rounded-xl shadow-md p-6">
                    <div className="mb-2">
                      <h4 className="text-xl font-bold text-gray-800 dark:text-white">{help.subject}</h4>
                      <p className="mt-2 text-gray-700 dark:text-gray-200">{help.message}</p>
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                        {new Date(help.createdAt).toLocaleString()}
                      </p>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 font-semibold">
                        נשלח על ידי: {help.studentName || help.studentEmail}
                      </p>
                    </div>

                    {help.answer && help.answer.trim() !== '' && (
                      <div className="mt-4 bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100 p-4 rounded-lg border border-yellow-300 dark:border-yellow-600">
                        <h5 className="font-semibold mb-2">תשובת המורה:</h5>
                        <p>{help.answer}</p>
                        {help.answeredBy && (
                          <p className="mt-2 text-sm text-green-700 dark:text-green-300 font-medium">
                            נענה על ידי: {help.answeredBy}
                          </p>
                        )}
                      </div>
                    )}
                  </li>
                ))
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-300">לא נמצאו הודעות עזרה.</p>
              )}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Help;
