/**
 * Teacher Service
 * Handles API calls for teacher management and data retrieval
 */

/**
 * Fetch current logged-in teacher
 * @returns {Promise<Object>} Current teacher data
 */
export const fetchCurrentTeacher = async () => {
    const res = await fetch('/api/teachers/me');
    if (!res.ok) throw new Error('Error fetching teacher details');
    return await res.json();
  };
  