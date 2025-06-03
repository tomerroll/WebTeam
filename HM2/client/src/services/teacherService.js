export const fetchCurrentTeacher = async () => {
    const res = await fetch('/api/teachers/me');
    if (!res.ok) throw new Error('שגיאה בשליפת פרטי המורה');
    return await res.json();
  };
  