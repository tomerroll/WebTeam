/**
 * Theory Progress Service
 * Handles API calls for tracking student progress in theoretical content
 */

export const theoryProgressService = {
  /**
   * Get theory progress for a student
   * @param {string} studentId - Student ID
   * @param {string} theoryId - Theory ID
   * @returns {Promise<Object>} Theory progress data
   */
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

  /**
   * Update theory progress status
   * @param {string} studentId - Student ID
   * @param {string} theoryId - Theory ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated progress data
   */
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

  /**
   * Update reading progress
   * @param {string} studentId - Student ID
   * @param {string} theoryId - Theory ID
   * @param {Object} readingData - Reading progress data
   * @returns {Promise<Object>} Updated progress data
   */
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

  /**
   * Update interactive examples progress
   * @param {string} studentId - Student ID
   * @param {string} theoryId - Theory ID
   * @param {Object} exampleData - Example progress data
   * @returns {Promise<Object>} Updated progress data
   */
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

  /**
   * Get all theory progress for a student
   * @param {string} studentId - Student ID
   * @returns {Promise<Array>} Array of theory progress data
   */
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

  /**
   * Get theory progress statistics
   * @param {string} studentId - Student ID
   * @returns {Promise<Object>} Progress statistics
   */
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

  /**
   * Add notes and rating for a theory
   * @param {string} studentId - Student ID
   * @param {string} theoryId - Theory ID
   * @param {string} notes - Student notes
   * @param {number} rating - Student rating (1-5)
   * @returns {Promise<Object>} Updated progress data
   */
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

  /**
   * Mark theory as completed
   * @param {string} studentId - Student ID
   * @param {string} theoryId - Theory ID
   * @returns {Promise<Object>} Updated progress data
   */
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

  /**
   * Reset theory progress
   * @param {string} studentId - Student ID
   * @param {string} theoryId - Theory ID
   * @returns {Promise<Object>} Reset progress data
   */
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