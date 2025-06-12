import React, { useEffect, useState, useMemo } from 'react';
import { fetchReports } from '../../services/reportService';


const COLORS = ['#00C49F', '#FF8042']; // Kept in case you add charts later

// פונקציה שמקבצת דוחות לפי נושא ומחשבת סה"כ תשובות נכונות וסך הכל תשובות לכל נושא
const aggregateBySubject = (reports) => {
  const map = {};
  reports.forEach(({ subject, correctAnswers, totalAnswered }) => {
    if (!map[subject]) {
      map[subject] = { subject, correctAnswers: 0, totalAnswered: 0 };
    }
    map[subject].correctAnswers += correctAnswers;
    map[subject].totalAnswered += totalAnswered;
  });
  return Object.values(map);
};

const ReportsList = () => {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('כל הנושאים');

  useEffect(() => {
    fetchReports()
      .then(data => setReports(data))
      .catch(err => setError(err.message));
  }, []);

  // רשימת נושאים ייחודיים
  const subjects = useMemo(() => {
    const uniqueSubjects = Array.from(new Set(reports.map(r => r.subject)));
    uniqueSubjects.sort();
    return ['כל הנושאים', ...uniqueSubjects];
  }, [reports]);

  // סינון דוחות לפי נושא נבחר
  const filteredReports = useMemo(() => {
    if (selectedSubject === 'כל הנושאים') return reports;
    return reports.filter(r => r.subject === selectedSubject);
  }, [reports, selectedSubject]);

  // נתונים ל-BarChart - תמיד מציג את כל הנושאים (לא תלוי בבורר)
  const barData = useMemo(() => { // This data is currently not used in the UI, but kept for completeness
    return aggregateBySubject(reports);
  }, [reports]);

  if (error) {
    return (
      <div className="text-red-600 text-center mt-5">
        שגיאה: {error}
      </div>
    );
  }

  return (
    <div dir="rtl" className="p-5 font-sans max-w-4xl mx-auto bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">📊 דוחות התקדמות תלמידים</h2>

      {/* בורר נושאים */}
      <div className="mb-6 text-center">
        <label htmlFor="subjectSelect" className="ml-2 font-bold text-lg text-gray-800 dark:text-gray-200">
          סינון לפי נושא:
        </label>
        <select
          id="subjectSelect"
          value={selectedSubject}
          onChange={e => setSelectedSubject(e.target.value)}
          className="p-2 text-base rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white min-w-[180px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {subjects.map((subject, i) => (
            <option key={i} value={subject}>
              {subject}
            </option>
          ))}
        </select>
      </div>

      {filteredReports.length === 0 ? (
        <p className="text-center text-lg text-gray-700 dark:text-gray-300">אין דוחות להצגה עבור הנושא שנבחר</p>
      ) : (
        <>
          {/* טבלת דוחות */}
          <div className="overflow-x-auto shadow-lg rounded-lg mb-10"> {/* Added responsive overflow */}
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-200 dark:bg-gray-700">
                <tr>
                  {['תלמיד', 'נושא', 'הושלם', 'סה״כ תשובות', 'תשובות נכונות', 'תאריך אחרון'].map((header, i) => (
                    <th
                      key={i}
                      className="py-3 px-2 border-b-2 border-gray-300 dark:border-gray-600 text-center font-bold text-gray-700 dark:text-gray-200 whitespace-nowrap"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredReports.map((report, index) => (
                  <tr
                    key={index}
                    className={`text-center transition-colors duration-200
                      ${report.completed ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}
                      hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300`}
                  >
                    <td className="py-2 px-2">{report.studentName}</td>
                    <td className="py-2 px-2">{report.subject}</td>
                    <td className="py-2 px-2 text-xl">{report.completed ? '✅' : '❌'}</td>
                    <td className="py-2 px-2">{report.totalAnswered}</td>
                    <td className="py-2 px-2">{report.correctAnswers}</td>
                    <td className="py-2 px-2 whitespace-nowrap">{report.lastAttempt ? new Date(report.lastAttempt).toLocaleDateString('he-IL') : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ReportsList;