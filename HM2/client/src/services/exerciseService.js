/**
 * Exercise Service
 * Handles API calls for exercise management and progress tracking
 */

/**
 * Fetch exercises by subject
 * @param {string} subject - Subject name
 * @returns {Promise<Array>} Array of exercises for the subject
 */
export const fetchExercisesBySubject = async (subject) => {
  const res = await fetch(`/api/exercises/subject/${encodeURIComponent(subject)}`);
  if (!res.ok) throw new Error('Error fetching exercises by subject');
  return await res.json();
};

/**
 * Fetch exercises by grade
 * @param {string} grade - Grade level
 * @returns {Promise<Array>} Array of exercises for the grade
 */
export const fetchExercisesByGrade = async (grade) => {
  const res = await fetch(`/api/exercises?grade=${encodeURIComponent(grade)}`);
  if (!res.ok) throw new Error('Error fetching exercises by grade');
  return await res.json();
};

/**
 * Fetch all exercises (for teachers)
 * @returns {Promise<Array>} Array of all exercises
 */
export const fetchAllExercises = async () => {
  const res = await fetch('/api/exercises');
  if (!res.ok) throw new Error('Error fetching all exercises');
  return await res.json();
};

/**
 * Add a new exercise
 * @param {Object} exerciseData - Exercise data to add
 * @returns {Promise<Object>} Created exercise
 */
export const addExercise = async (exerciseData) => {
  const res = await fetch('/api/exercises/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(exerciseData),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || 'Error adding exercise');
  return data.exercise;
};

/**
 * Update existing exercise
 * @param {string} id - Exercise ID
 * @param {Object} updatedData - Updated exercise data
 * @returns {Promise<Object>} Updated exercise
 */
export const updateExercise = async (id, updatedData) => {
  const res = await fetch(`/api/exercises/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error updating exercise');
  return data;
};

/**
 * Delete exercise
 * @param {string} id - Exercise ID
 * @returns {Promise<void>}
 */
export const deleteExercise = async (id) => {
  const res = await fetch(`/api/exercises/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error deleting exercise');
};

/**
 * Fetch progress by subject
 * @param {string} studentId - Student ID
 * @param {string} subject - Subject name
 * @returns {Promise<Object>} Progress data for the subject
 */
export const fetchProgressBySubject = async (studentId, subject) => {
  const res = await fetch(`/api/progress/${studentId}/${subject}`);
  if (!res.ok) throw new Error('Error fetching progress');
  return await res.json();
};

/**
 * Fetch completed subjects
 * @param {string} studentId - Student ID
 * @returns {Promise<Array>} Array of completed subjects
 */
export const fetchCompletedSubjects = async (studentId) => {
  const res = await fetch(`/api/progress/completed/${studentId}`);
  if (!res.ok) throw new Error('Error fetching completed subjects');
  return await res.json();
};

/**
 * Update practice progress
 * @param {Object} progressData - Progress data to update
 * @returns {Promise<Object>} Updated progress data
 */
export const updateProgress = async ({ student, subject, currentIndex, completed, answers }) => {
  const res = await fetch('/api/progress', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ student, subject, currentIndex, completed, answers }),
  });
  if (!res.ok) throw new Error('Error updating progress');
  return await res.json();
};
