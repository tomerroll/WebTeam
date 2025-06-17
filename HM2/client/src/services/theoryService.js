export const fetchTheoryContent = async () => {
    const response = await fetch('/api/theory');
    if (!response.ok) throw new Error('שגיאה בטעינת תוכן תיאוריה');
    return await response.json();
  };
//Function to add new theory content
export const addTheory = async (theoryData) => {
  const response = await fetch('/api/theory', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',

    },
    body: JSON.stringify(theoryData),
  });
  if (!response.ok) {
    const errorData = await response.json(); // Get error details from backend
    throw new Error(errorData.message || 'שגיאה בהוספת תיאוריה');
  }
  return await response.json();
};

//Function to update existing theory content
export const updateTheory = async (id, theoryData) => {
  const response = await fetch(`/api/theory/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      // Add authorization header if your API requires it
      // 'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(theoryData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'שגיאה בעדכון תיאוריה');
  }
  return await response.json(); // Usually returns the updated item
};

//Function to delete theory content
export const deleteTheory = async (id) => {
  const response = await fetch(`/api/theory/${id}`, {
    method: 'DELETE',
    headers: {
      // Add authorization header if your API requires it
      // 'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'שגיאה במחיקת תיאוריה');
  }
  // No content typically returned for a successful DELETE
  return { message: 'תיאוריה נמחקה בהצלחה' };
};