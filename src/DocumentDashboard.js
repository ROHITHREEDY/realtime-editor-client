import React, { useEffect, useState, useContext } from 'react';
import { authFetch } from './authFetch';  // Import the helper
import { AuthContext } from './AuthContext'; // Import AuthContext

function DocumentDashboard() {
  const [documents, setDocuments] = useState([]);
  const [title, setTitle] = useState('');
  const { user, logout } = useContext(AuthContext); // Get user and logout from context

  // Load document list on mount
  useEffect(() => {
    authFetch('/api/documents/list')
      .then((res) => res.json())
      .then((data) => setDocuments(data));
  }, []);

  // Create a new document
  function handleCreate(e) {
    e.preventDefault();
    authFetch('/api/documents/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    })
      .then((res) => res.json())
      .then((doc) => {
        setDocuments([doc, ...documents]);
        setTitle('');
      });
  }

  // Rename a document by prompting user and calling the backend
  function handleRename(id, currentTitle) {
    const newTitle = prompt('Rename document:', currentTitle);
    if (newTitle && newTitle !== currentTitle) {
      authFetch(`/api/documents/${id}/rename`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }),
      })
        .then(res => res.json())
        .then(updatedDoc => {
          setDocuments(docs => docs.map(doc => doc._id === id ? updatedDoc : doc));
        });
    }
  }

  // Delete a document by confirming and calling the backend
  function handleDelete(id) {
    if (window.confirm('Are you sure you want to delete this document?')) {
      authFetch(`/api/documents/${id}`, { method: 'DELETE' })
        .then(() => {
          setDocuments(docs => docs.filter(doc => doc._id !== id));
        });
    }
  }

  return (
    <div className="App">
      <header
        className="App-header"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <span>My Documents</span>
        {user && (
          <span>
            Signed in as <b>{user.username}</b>
            <button
              onClick={logout}
              style={{
                marginLeft: 12,
                background: 'red',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                padding: '4px 10px',
                cursor: 'pointer',
              }}
            >
              Log out
            </button>
          </span>
        )}
      </header>
      <main className="editor-container" style={{ alignItems: 'stretch' }}>
        <form onSubmit={handleCreate} style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          <input
            style={{ flex: 1, borderRadius: '8px', border: '1px solid #ddd', padding: '12px', fontSize: '16px' }}
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Document Title"
            required
          />
          <button
            style={{ borderRadius: '8px', background: '#1976d2', color: 'white', border: 'none', padding: '0 24px', fontWeight: 600 }}
            type="submit"
          >
            Create
          </button>
        </form>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {documents.map(doc => (
            <li key={doc._id} style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <a
                href={`/doc/${doc._id}`}
                style={{
                  fontSize: '18px',
                  color: '#1976d2',
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  display: 'block',
                  background: '#f3f7fa',
                  flexGrow: 1
                }}
              >
                {doc.title}
              </a>
              <button onClick={() => handleRename(doc._id, doc.title)}>Rename</button>
              <button onClick={() => handleDelete(doc._id)} style={{ color: 'red' }}>Delete</button>
            </li>
          ))}
        </ul>
      </main>
      <footer className="footer">
        Built by Rohit —{' '}
        <a
          href="https://github.com/your-github"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#1976d2' }}
        >
          GitHub
        </a>
      </footer>
    </div>
  );
}

export default DocumentDashboard;
