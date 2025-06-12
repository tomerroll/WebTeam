import React, { useEffect, useState, useMemo } from 'react';
import { fetchReports } from '../../services/reportService';


const COLORS = ['#00C49F', '#FF8042'];

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
  const barData = useMemo(() => {
    return aggregateBySubject(reports);
  }, [reports]);

  if (error) {
    return (
      <div style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>
        שגיאה: {error}
      </div>
    );
  }

  return (
    <div dir="rtl" style={{ padding: 20, fontFamily: 'Arial, sans-serif', maxWidth: 900, margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 30 }}>📊 דוחות התקדמות תלמידים</h2>

      {/* בורר נושאים */}
      <div style={{ marginBottom: 20, textAlign: 'center' }}>
        <label htmlFor="subjectSelect" style={{ marginRight: 10, fontWeight: 'bold', fontSize: 16 }}>
          סינון לפי נושא:
        </label>
        <select
          id="subjectSelect"
          value={selectedSubject}
          onChange={e => setSelectedSubject(e.target.value)}
          style={{
            padding: '6px 12px',
            fontSize: 16,
            borderRadius: 5,
            border: '1px solid #ccc',
            minWidth: 180,
            cursor: 'pointer',
          }}
        >
          {subjects.map((subject, i) => (
            <option key={i} value={subject}>
              {subject}
            </option>
          ))}
        </select>
      </div>

      {filteredReports.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: 18 }}>אין דוחות להצגה עבור הנושא שנבחר</p>
      ) : (
        <>
          {/* טבלת דוחות */}
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: 40,
            boxShadow: '0 0 12px rgba(0,0,0,0.1)',
            fontSize: 14,
          }}>
            <thead style={{ backgroundColor: '#f2f2f2' }}>
              <tr>
                {['תלמיד', 'נושא', 'הושלם', 'סה״כ תשובות', 'תשובות נכונות', 'תאריך אחרון'].map((header, i) => (
                  <th
                    key={i}
                    style={{
                      padding: '10px 8px',
                      borderBottom: '2px solid #ddd',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      color: '#333',
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report, index) => (
                <tr
                  key={index}
                  style={{
                    backgroundColor: report.completed ? '#e8f5e9' : '#ffebee',
                    borderBottom: '1px solid #ddd',
                    textAlign: 'center',
                    transition: 'background-color 0.3s',
                    userSelect: 'none',
                  }}
                >
                  <td>{report.studentName}</td>
                  <td>{report.subject}</td>
                  <td style={{ fontSize: 20 }}>{report.completed ? '✅' : '❌'}</td>
                  <td>{report.totalAnswered}</td>
                  <td>{report.correctAnswers}</td>
                  <td>{report.lastAttempt ? new Date(report.lastAttempt).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default ReportsList;
