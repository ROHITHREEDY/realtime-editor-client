// OLD:
fetch('/api/auth/login', {

// NEW:
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

fetch(`${API_URL}/api/auth/login`, {
