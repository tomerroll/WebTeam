import React, { useEffect, useState, useMemo } from 'react';
import { fetchReports } from '../../services/reportService';

/**
 * Reports Component
 * 
 * A comprehensive reporting interface for teachers to view student progress and performance.
 * Displays detailed reports including completion status, correct answers, total attempts,
 * and last attempt dates. Features subject filtering, student search, responsive table design, and
 * visual indicators for completed vs incomplete exercises.
 * 
 * @returns {JSX.Element} - Student progress reports with filtering and search capabilities
 */

// Color constants for potential chart implementations
const COLORS = ['#00C49F', '#FF8042']; // Kept in case you add charts later

/**
 * Aggregates reports by subject, calculating total correct answers and total answered questions
 * @param {Array} reports - Array of report objects
 * @returns {Array} - Aggregated data grouped by subject
 */
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
  const [searchTerm, setSearchTerm] = useState('');

  // Load reports data on component mount
  useEffect(() => {
    fetchReports()
      .then(data => setReports(data))
      .catch(err => setError(err.message));
  }, []);

  // Generate unique subjects list for filtering
  const subjects = useMemo(() => {
    const uniqueSubjects = Array.from(new Set(reports.map(r => r.subject)));
    uniqueSubjects.sort();
    return ['כל הנושאים', ...uniqueSubjects];
  }, [reports]);

  // Filter reports based on selected subject and search term
  const filteredReports = useMemo(() => {
    let filtered = reports;
    
    // Filter by subject
    if (selectedSubject !== 'כל הנושאים') {
      filtered = filtered.filter(r => r.subject === selectedSubject);
    }
    
    // Filter by student name search
    if (searchTerm.trim()) {
      filtered = filtered.filter(r => 
        r.studentName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [reports, selectedSubject, searchTerm]);

  // Prepare data for potential bar chart visualization
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
  <div dir="rtl" className="min-h-screen bg-gradient-to-b from-sky-100 to-cyan-200 dark:from-gray-900 dark:to-gray-800 py-10 px-4 font-sans text-gray-900 dark:text-white">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-10">📊 דוחות התקדמות תלמידים</h2>

      {/* Filters Section */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
        {/* Subject Filter */}
        <div className="flex items-center">
          <label htmlFor="subjectSelect" className="ml-3 text-lg font-semibold text-gray-800 dark:text-gray-200">
            סינון לפי נושא:
          </label>
          <select
            id="subjectSelect"
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
            className="rounded-xl px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
          >
            {subjects.map((subject, i) => (
              <option key={i} value={subject}>{subject}</option>
            ))}
          </select>
        </div>

        {/* Student Search */}
        <div className="flex items-center">
          <label htmlFor="studentSearch" className="ml-3 text-lg font-semibold text-gray-800 dark:text-gray-200">
            חיפוש תלמיד:
          </label>
          <input
            id="studentSearch"
            type="text"
            placeholder="הקלד שם תלמיד..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="rounded-xl px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
          />
        </div>
      </div>

      {/* Results Count */}
      <div className="text-center mb-4 text-gray-700 dark:text-gray-300">
        נמצאו {filteredReports.length} תוצאות
      </div>

      {/* תצוגה מותאמת */}
      {filteredReports.length === 0 ? (
        <div className="text-center text-lg text-gray-700 dark:text-gray-300 bg-white/70 dark:bg-white/5 backdrop-blur-md rounded-xl py-8 shadow-inner">
          {searchTerm.trim() || selectedSubject !== 'כל הנושאים' 
            ? 'לא נמצאו תוצאות עבור החיפוש והסינון שנבחרו'
            : 'אין דוחות להצגה'
          }
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl shadow-xl bg-white/80 dark:bg-white/5 backdrop-blur-md">
          <table className="min-w-full text-sm text-center divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-blue-200 dark:bg-gray-800">
              <tr className="text-gray-700 dark:text-gray-200 text-base">
                {['תלמיד', 'נושא', 'הושלם', 'סה״כ תשובות', 'תשובות נכונות', 'תאריך אחרון'].map((header, i) => (
                  <th key={i} className="py-4 px-3 font-bold">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300 dark:divide-gray-700">
              {filteredReports.map((report, i) => (
                <tr
                  key={i}
                  className={`transition-all duration-200
                    ${report.completed ? 'bg-green-100/60 dark:bg-green-900/20' : 'bg-red-100/60 dark:bg-red-900/20'}
                    hover:bg-blue-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-100`}
                >
                  <td className="py-3 px-2">{report.studentName}</td>
                  <td className="py-3 px-2">{report.subject}</td>
                  <td className="py-3 px-2 text-xl">{report.completed ? '✅' : '❌'}</td>
                  <td className="py-3 px-2">{report.totalAnswered}</td>
                  <td className="py-3 px-2">{report.correctAnswers}</td>
                  <td className="py-3 px-2 whitespace-nowrap">
                    {report.lastAttempt ? new Date(report.lastAttempt).toLocaleDateString('he-IL') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
);

};

export default ReportsList;