// NEW:
const socket = io(API_URL, {
  auth: { token }
});

// NEW:
fetch(`${API_URL}/api/documents/${documentId}`, {
  headers: { Authorization: `Bearer ${token}` }
})

// NEW:
fetch(`${API_URL}/api/documents/${documentId}`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  },
  body: JSON.stringify({ content: value }),
});
