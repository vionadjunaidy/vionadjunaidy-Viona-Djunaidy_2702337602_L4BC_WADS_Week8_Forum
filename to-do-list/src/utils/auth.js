/**
 * Retrieves the authentication token from localStorage
 * @returns {string|null} 
 */
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

/**
 * Sets the authentication token in localStorage
 * @param {string} token 
 */
export const setAuthToken = (token) => {
  localStorage.setItem('token', token);
};

/**
 * Removes the authentication token from localStorage
 */
export const removeAuthToken = () => {
  localStorage.removeItem('token');
}; 