// client/src/services/helpService.js

// שליחת פנייה חדשה מהתלמיד
export const sendHelpRequest = async ({ subject, message, studentEmail, studentName }) => {
    const res = await fetch('/api/help', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, message, studentEmail, studentName }),
    });
  
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'שגיאה בשליחת בקשת עזרה');
    }
  
    return await res.json();
  };
  
  // שליפת כל הפניות (למורה)
  export const fetchHelpMessages = async () => {
    const res = await fetch('/api/help');
    if (!res.ok) throw new Error('שגיאה בשליפת הודעות עזרה');
    return await res.json();
  };
  
  // שליחת תשובה לפנייה (למורה)
  export const answerHelpRequest = async (id, answer, answeredBy) => {
    const res = await fetch(`/api/help/${id}/answer`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer, answeredBy }),
    });
  
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'שגיאה בשליחת תשובה');
    }
  
    return await res.json();
  };
  
  // מחיקת תשובה לפנייה (למורה)
  export const deleteHelpAnswer = async (id) => {
    const res = await fetch(`/api/help/${id}/answer`, {
      method: 'DELETE',
    });
  
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'שגיאה במחיקת תשובה');
    }
  
    return await res.json();
  };
  
  // מחיקת פנייה שלמה (למורה)
  export const deleteHelpRequest = async (id) => {
    const res = await fetch(`/api/help/${id}`, {
      method: 'DELETE',
    });
  
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'שגיאה במחיקת פנייה');
    }
  
    return await res.json();
  };
  