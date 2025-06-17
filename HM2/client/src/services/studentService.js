/**
 * Student Service
 * Handles API calls for student management and achievements
 */

const BASE_URL = '/api/students';

/**
 * Fetch all students
 * @returns {Promise<Array>} Array of all students
 */
export const fetchAllStudents = async () => {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('Error fetching students');
  return await res.json();
};

/**
 * Fetch student by ID
 * @param {string} id - Student ID
 * @returns {Promise<Object>} Student data
 */
export const fetchStudentById = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error('Error fetching student details');
  return await res.json();
};

/**
 * Fetch current logged-in student (if token-based authentication exists)
 * @returns {Promise<Object>} Current student data
 */
export const fetchCurrentStudent = async () => {
  const res = await fetch(`${BASE_URL}/me`);
  if (!res.ok) throw new Error('Error fetching current student details');
  return await res.json();
};

/**
 * Add new student
 * @param {Object} studentData - Student data to add
 * @returns {Promise<Object>} Created student data
 */
export const addStudent = async (studentData) => {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(studentData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error adding student');
  return data;
};

/**
 * Delete student
 * @param {string} id - Student ID
 * @returns {Promise<void>}
 */
export const deleteStudent = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error deleting student');
};

/**
 * Add points to student
 * @param {string} studentId - Student ID
 * @param {number} amount - Points to add
 * @returns {Promise<Object>} Updated points data
 */
export const addPoints = async (studentId, amount) => {
  const res = await fetch(`${BASE_URL}/addPoints`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId, points: amount }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error adding points');
  }
  const data = await res.json();
  return data;  // Server returns the new points
};

/**
 * Add crown to student
 * @param {string} studentId - Student ID
 * @returns {Promise<Object>} Updated crowns data
 */
export const addCrown = async (studentId) => {
  const res = await fetch(`${BASE_URL}/addCrown`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error adding crown');
  }
  const data = await res.json();
  return data;  // Server returns the new crowns
};
