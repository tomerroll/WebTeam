export const fetchTheoryContent = async () => {
    const response = await fetch('/api/theory');
    if (!response.ok) throw new Error('שגיאה בטעינת תוכן תיאוריה');
    return await response.json();
  };
  