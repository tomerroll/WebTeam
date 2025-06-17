/**
 * Theory Service
 * Handles API calls for theoretical content management
 */

/**
 * Fetch all theory content
 * @returns {Promise<Array>} Array of theory content
 */
export const fetchTheoryContent = async () => {
    const response = await fetch('/api/theory');
    if (!response.ok) throw new Error('Error loading theory content');
    return await response.json();
  };

/**
 * Add new theory content
 * @param {Object} theoryData - Theory data to add
 * @returns {Promise<Object>} Created theory content
 */
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
    throw new Error(errorData.message || 'Error adding theory');
  }
  return await response.json();
};

/**
 * Update existing theory content
 * @param {string} id - Theory ID
 * @param {Object} theoryData - Updated theory data
 * @returns {Promise<Object>} Updated theory content
 */
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
    throw new Error(errorData.message || 'Error updating theory');
  }
  return await response.json(); // Usually returns the updated item
};

/**
 * Delete theory content
 * @param {string} id - Theory ID
 * @returns {Promise<Object>} Success message
 */
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
    throw new Error(errorData.message || 'Error deleting theory');
  }
  // No content typically returned for a successful DELETE
  return { message: 'Theory deleted successfully' };
};