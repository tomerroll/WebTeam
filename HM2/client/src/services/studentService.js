const BASE_URL = '/api/students';

// 1. שליפת כל התלמידים
export const fetchAllStudents = async () => {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('שגיאה בשליפת תלמידים');
  return await res.json();
};

// 2. שליפת תלמיד לפי ID
export const fetchStudentById = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error('שגיאה בשליפת פרטי תלמיד');
  return await res.json();
};

// 3. שליפת התלמיד המחובר (אם יש אימות מבוסס טוקן)
export const fetchCurrentStudent = async () => {
  const res = await fetch(`${BASE_URL}/me`);
  if (!res.ok) throw new Error('שגיאה בשליפת פרטי התלמיד הנוכחי');
  return await res.json();
};

// 4. הוספת תלמיד חדש
export const addStudent = async (studentData) => {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(studentData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'שגיאה בהוספת תלמיד');
  return data;
};

// 5. מחיקת תלמיד
export const deleteStudent = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('שגיאה במחיקת תלמיד');
};

// 6. הוספת נקודות
export const addPoints = async (studentId, amount) => {
  const res = await fetch(`${BASE_URL}/addPoints`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId, points: amount }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'שגיאה בהוספת נקודות');
  }
  const data = await res.json();
  return data;  // השרת מחזיר את ה-points החדש
};

// 7. הוספת כתר
export const addCrown = async (studentId) => {
  const res = await fetch(`${BASE_URL}/addCrown`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'שגיאה בהוספת כתר');
  }
  const data = await res.json();
  return data;  // השרת מחזיר את ה-crowns החדש
};
