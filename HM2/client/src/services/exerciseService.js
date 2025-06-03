// client/src/services/exerciseService.js

// 1. שליפת תרגילים לפי נושא
export const fetchExercisesBySubject = async (subject) => {
  const res = await fetch(`/api/exercises/subject/${encodeURIComponent(subject)}`);
  if (!res.ok) throw new Error('שגיאה בשליפת תרגילים לפי נושא');
  return await res.json();
};

// 2. שליפת תרגילים לפי כיתה
export const fetchExercisesByGrade = async (grade) => {
  const res = await fetch(`/api/exercises?grade=${encodeURIComponent(grade)}`);
  if (!res.ok) throw new Error('שגיאה בשליפת תרגילים לפי כיתה');
  return await res.json();
};

// 3. שליפת כל התרגילים (למורה)
export const fetchAllExercises = async () => {
  const res = await fetch('/api/exercises');
  if (!res.ok) throw new Error('שגיאה בשליפת כלל התרגילים');
  return await res.json();
};

// 4. הוספת תרגיל
export const addExercise = async (exerciseData) => {
  const res = await fetch('/api/exercises/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(exerciseData),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || 'שגיאה בהוספת תרגיל');
  return data.exercise;
};

// 5. עדכון תרגיל קיים
export const updateExercise = async (id, updatedData) => {
  const res = await fetch(`/api/exercises/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'שגיאה בעדכון תרגיל');
  return data;
};

// 6. מחיקת תרגיל
export const deleteExercise = async (id) => {
  const res = await fetch(`/api/exercises/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('שגיאה במחיקת תרגיל');
};

// 7. שליפת סטטוס התקדמות לפי נושא
export const fetchProgressBySubject = async (studentId, subject) => {
  const res = await fetch(`/api/progress/${studentId}/${subject}`);
  if (!res.ok) throw new Error('שגיאה בשליפת התקדמות');
  return await res.json();
};

// 8. שליפת נושאים שהושלמו
export const fetchCompletedSubjects = async (studentId) => {
  const res = await fetch(`/api/progress/completed/${studentId}`);
  if (!res.ok) throw new Error('שגיאה בשליפת נושאים שהושלמו');
  return await res.json();
};

// 9. עדכון התקדמות תרגול
export const updateProgress = async ({ student, subject, currentIndex, completed, answers }) => {
  const res = await fetch('/api/progress', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ student, subject, currentIndex, completed, answers }),
  });
  if (!res.ok) throw new Error('שגיאה בעדכון התקדמות');
  return await res.json();
};
