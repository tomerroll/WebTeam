// client/src/services/helpService.js

/**
 * Help Service
 * Handles API calls for help request management between students and teachers
 */

/**
 * Send new help request from student
 * @param {Object} helpData - Help request data
 * @returns {Promise<Object>} Help request response
 */
export const sendHelpRequest = async ({ subject, message, studentEmail, studentName }) => {
    const res = await fetch('/api/help', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, message, studentEmail, studentName }),
    });
  
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Error sending help request');
    }
  
    return await res.json();
  };
  
/**
 * Fetch all help messages (for teachers)
 * @returns {Promise<Array>} Array of help messages
 */
export const fetchHelpMessages = async () => {
    const res = await fetch('/api/help');
    if (!res.ok) throw new Error('Error fetching help messages');
    return await res.json();
  };
  
/**
 * Send answer to help request (for teachers)
 * @param {string} id - Help request ID
 * @param {string} answer - Teacher's answer
 * @param {string} answeredBy - Teacher's name
 * @returns {Promise<Object>} Answer response
 */
export const answerHelpRequest = async (id, answer, answeredBy) => {
    const res = await fetch(`/api/help/${id}/answer`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer, answeredBy }),
    });
  
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Error sending answer');
    }
  
    return await res.json();
  };
  
/**
 * Delete answer to help request (for teachers)
 * @param {string} id - Help request ID
 * @returns {Promise<Object>} Deletion response
 */
export const deleteHelpAnswer = async (id) => {
    const res = await fetch(`/api/help/${id}/answer`, {
      method: 'DELETE',
    });
  
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Error deleting answer');
    }
  
    return await res.json();
  };
  
/**
 * Delete entire help request (for teachers)
 * @param {string} id - Help request ID
 * @returns {Promise<Object>} Deletion response
 */
export const deleteHelpRequest = async (id) => {
    const res = await fetch(`/api/help/${id}`, {
      method: 'DELETE',
    });
  
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Error deleting help request');
    }
  
    return await res.json();
  };
  