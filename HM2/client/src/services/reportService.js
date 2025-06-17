// client/src/services/reportService.js

/**
 * Report Service
 * Handles API calls for student progress reports and analytics
 */

/**
 * Fetch all student progress reports
 * @returns {Promise<Array>} Array of student reports
 */
export const fetchReports = async () => {
  const res = await fetch('/api/reports');
  if (!res.ok) {
    throw new Error('Error fetching reports');
  }
  return await res.json();
};
