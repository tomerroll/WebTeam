import React, { useEffect, useState, useMemo } from 'react';
import { fetchReports } from '../../services/reportService';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#00C49F', '#FF8042'];

// קומפוננטה קטנה ל-PieChart יחיד לנושא מסוים
const SubjectPieChart = ({ subject, reports, isDarkMode }) => {
  const filtered = reports.filter(r => r.subject === subject);
  const completed = filtered.filter(r => r.completed).length;
  const notCompleted = filtered.length - completed;
  const pieData = [
    { name: 'השלימו', value: completed },
    { name: 'לא השלימו', value: notCompleted }
  ];

  const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 20;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill={isDarkMode ? '#DDD' : '#000'}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={14}
      >
        {`${Math.round(percent * 100)}%`}
      </text>
    );
  };

  return (
    <div className="flex flex-col items-center mb-8 w-full max-w-xs mx-auto">
      <h4 className={`mb-2 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{subject}</h4>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={renderCustomizedLabel}
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: isDarkMode ? '#333' : '#fff',
              borderColor: isDarkMode ? '#555' : '#ccc',
              color: isDarkMode ? '#eee' : '#000',
            }}
          />
          <Legend
            verticalAlign="bottom"
            wrapperStyle={{ color: isDarkMode ? '#eee' : '#000' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

const ReportsList = () => {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('כל הנושאים');
  const [searchTerm, setSearchTerm] = useState('');

  // בדיקת מצב לילה לפי class 'dark' ב-html
  const isDarkMode = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');

  // צבעים לגרפים בהתאם למצב
  const axisColor = isDarkMode ? '#DDD' : '#000';
  const axisLineColor = isDarkMode ? '#555' : '#888';
  const tooltipBgColor = isDarkMode ? '#333' : '#fff';
  const tooltipBorderColor = isDarkMode ? '#555' : '#ccc';
  const tooltipTextColor = isDarkMode ? '#eee' : '#000';
  const legendTextColor = isDarkMode ? '#eee' : '#000';

  // בדיקת רוחב חלון לצורך מובייל (רספונסיביות)
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1000);

  useEffect(() => {
    fetchReports()
      .then(data => setReports(data))
      .catch(err => setError(err.message));
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const subjects = useMemo(() => {
    const uniqueSubjects = Array.from(new Set(reports.map(r => r.subject)));
    uniqueSubjects.sort();
    return ['כל הנושאים', ...uniqueSubjects];
  }, [reports]);

  const filteredReports = useMemo(() => {
    let filtered = reports;
    if (selectedSubject !== 'כל הנושאים') {
      filtered = filtered.filter(r => r.subject === selectedSubject);
    }
    if (searchTerm.trim()) {
      filtered = filtered.filter(r =>
        r.studentName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  }, [reports, selectedSubject, searchTerm]);

  const completionBySubject = useMemo(() => {
    const map = {};
    reports.forEach(({ subject, completed }) => {
      if (!map[subject]) {
        map[subject] = { subject, total: 0, completed: 0 };
      }
      map[subject].total += 1;
      if (completed) map[subject].completed += 1;
    });

    return Object.entries(map).map(([subject, { total, completed }]) => ({
      subject,
      percentCompleted: total > 0 ? Math.round((completed / total) * 100) : 0
    }));
  }, [reports]);

  const pieData = useMemo(() => {
    if (selectedSubject === 'כל הנושאים') return [];
    const filtered = reports.filter(r => r.subject === selectedSubject);
    const completed = filtered.filter(r => r.completed).length;
    const notCompleted = filtered.length - completed;
    return [
      { name: 'השלימו', value: completed },
      { name: 'לא השלימו', value: notCompleted }
    ];
  }, [reports, selectedSubject]);

  const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 20;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill={isDarkMode ? '#DDD' : '#000'}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={14}
      >
        {`${Math.round(percent * 100)}%`}
      </text>
    );
  };

  if (error) {
    return <div className="text-red-600 text-center mt-5">שגיאה: {error}</div>;
  }

  // החלטה אם מובייל לפי רוחב חלון קטן מ-768px
  const isMobile = windowWidth < 768;

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-sky-100 to-cyan-200 dark:from-gray-900 dark:to-gray-800 py-10 px-4 font-sans text-gray-900 dark:text-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-10">📊 דוחות התקדמות תלמידים</h2>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
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

        {/* Count */}
        <div className="text-center mb-4 text-gray-700 dark:text-gray-300">
          נמצאו {filteredReports.length} תוצאות
        </div>

        {/* Table */}
        {filteredReports.length === 0 ? (
          <div className="text-center text-lg text-gray-700 dark:text-gray-300 bg-white/70 dark:bg-white/5 backdrop-blur-md rounded-xl py-8 shadow-inner">
            {searchTerm.trim() || selectedSubject !== 'כל הנושאים'
              ? 'לא נמצאו תוצאות עבור החיפוש והסינון שנבחרו'
              : 'אין דוחות להצגה'}
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

        {/* Charts */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold text-center mb-4 text-gray-800 dark:text-white">
            ניתוח גרפי
          </h3>

          {selectedSubject === 'כל הנושאים' ? (
            isMobile ? (
              // במובייל, מציגים PieChart נפרדים לכל נושא
              <div className="grid grid-cols-1 gap-6">
                {completionBySubject.map(({ subject }) => (
                  <SubjectPieChart
                    key={subject}
                    subject={subject}
                    reports={reports}
                    isDarkMode={isDarkMode}
                  />
                ))}
              </div>
            ) : (
              // בדסקטופ, מציגים BarChart
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={completionBySubject}
                  margin={{ top: 20, right: 30, left: 30, bottom: 60 }}
                >
                  <XAxis
                    dataKey="subject"
                    interval={0}
                    height={60}
                    tickLine={false}
                    axisLine={{ stroke: axisLineColor }}
                    tick={{ fill: axisColor, fontSize: 14, dy: 10 }}
                  />

                  <YAxis
                    domain={[0, 100]}
                    tickFormatter={(val) => `${val}%`}
                    tick={{ fill: axisColor, textAnchor: 'start', dx: -10, fontSize: 14 }}
                    axisLine={{ stroke: axisLineColor }}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(value) => `${value}%`}
                    contentStyle={{
                      backgroundColor: tooltipBgColor,
                      borderColor: tooltipBorderColor,
                      color: tooltipTextColor,
                    }}
                  />
                  <Legend verticalAlign="top" wrapperStyle={{ color: legendTextColor }} />
                  <Bar dataKey="percentCompleted" name="אחוז השלמה" fill="#00C49F" barSize={50} />
                </BarChart>
              </ResponsiveContainer>
            )
          ) : (
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label={renderCustomizedLabel}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: tooltipBgColor,
                      borderColor: tooltipBorderColor,
                      color: tooltipTextColor,
                    }}
                  />
                  <Legend verticalAlign="bottom" wrapperStyle={{ color: legendTextColor }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsList;
