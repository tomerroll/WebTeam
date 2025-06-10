// client/src/services/reportService.js

export const fetchReports = async () => {
  const res = await fetch('/api/reports');
  if (!res.ok) {
    throw new Error('שגיאה בשליפת הדוחות');
  }
  return await res.json();
};
