export const theoryProgressService = {
  // קבלת התקדמות תיאוריה לתלמיד
  async getTheoryProgress(studentId, theoryId) {
    try {
      const response = await fetch(`/api/theory-progress/${studentId}/${theoryId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch theory progress');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching theory progress:', error);
      throw error;
    }
  },

  // עדכון סטטוס התקדמות
  async updateTheoryStatus(studentId, theoryId, status) {
    try {
      const response = await fetch(`/api/theory-progress/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          studentId,
          theoryId,
          status
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update theory status');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating theory status:', error);
      throw error;
    }
  },

  // עדכון התקדמות קריאה
  async updateReadingProgress(studentId, theoryId, readingData) {
    try {
      const response = await fetch(`/api/theory-progress/reading`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          studentId,
          theoryId,
          ...readingData
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update reading progress');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating reading progress:', error);
      throw error;
    }
  },

  // עדכון התקדמות דוגמאות אינטראקטיביות
  async updateInteractiveProgress(studentId, theoryId, exampleData) {
    try {
      const response = await fetch(`/api/theory-progress/interactive`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          studentId,
          theoryId,
          ...exampleData
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update interactive progress');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating interactive progress:', error);
      throw error;
    }
  },

  // קבלת כל ההתקדמות של תלמיד
  async getAllTheoryProgress(studentId) {
    try {
      const response = await fetch(`/api/theory-progress/student/${studentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch all theory progress');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching all theory progress:', error);
      throw error;
    }
  },

  // קבלת סטטיסטיקות התקדמות
  async getTheoryStats(studentId) {
    try {
      const response = await fetch(`/api/theory-progress/stats/${studentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch theory stats');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching theory stats:', error);
      throw error;
    }
  },

  // הוספת הערות ודירוג
  async addNotesAndRating(studentId, theoryId, notes, rating) {
    try {
      const response = await fetch(`/api/theory-progress/feedback`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          studentId,
          theoryId,
          notes,
          rating
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to add feedback');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error adding feedback:', error);
      throw error;
    }
  },

  // סימון תיאוריה כהושלמה
  async completeTheory(studentId, theoryId) {
    try {
      const response = await fetch(`/api/theory-progress/complete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          studentId,
          theoryId
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to complete theory');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error completing theory:', error);
      throw error;
    }
  },

  // איפוס התקדמות תיאוריה
  async resetTheoryProgress(studentId, theoryId) {
    try {
      const response = await fetch(`/api/theory-progress/reset`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          studentId,
          theoryId
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to reset theory progress');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error resetting theory progress:', error);
      throw error;
    }
  }
}; 