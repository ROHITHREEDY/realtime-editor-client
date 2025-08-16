const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export function authFetch(url, options = {}) {
  const token = localStorage.getItem('token');
  const headers = options.headers ? { ...options.headers } : {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Add API_URL to the beginning of the URL
  const fullUrl = `${API_URL}${url}`;

  return fetch(fullUrl, { ...options, headers }).then(async (res) => {
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      window.location.href = '/auth'; // Fixed: should be /auth not /login
      throw new Error('Not authorized');
    }
    return res;
  });
}
