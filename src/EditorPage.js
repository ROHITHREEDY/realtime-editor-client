import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const token = localStorage.getItem('token');
const socket = io('https://realtime-editor-backend-a8xx.onrender.com', {
  auth: { token }
});

function EditorPage() {
  const { id: documentId } = useParams();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch document with auth header
    fetch(`/api/documents/${documentId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(doc => {
        setContent(doc.content || '');
        setLoading(false);
      });

    socket.emit('join-document', documentId);

    const handleReceiveChanges = (newContent) => {
      setContent(newContent);
    };

    socket.on('receive-changes', handleReceiveChanges);

    return () => {
      socket.off('receive-changes', handleReceiveChanges);
    };
  }, [documentId]);

  const saveDocument = React.useCallback(debounce((value) => {
    fetch(`/api/documents/${documentId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ content: value }),
    });
  }, 1000), [documentId]);

  const handleChange = (value) => {
    setContent(value);
    socket.emit('send-changes', { documentId, data: value });
    saveDocument(value);
  };

  if (loading) return <div>Loading document…</div>;

  return (
    <div style={{ margin: '50px auto', maxWidth: '900px' }}>
      <h2>Collaborative Rich Text Editor</h2>
      <ReactQuill
        theme="snow"
        value={content}
        onChange={handleChange}
        style={{ height: '400px', marginBottom: '50px' }}
      />
      <p>Share this URL to collaborate live on this document!</p>
    </div>
  );
}

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default EditorPage;
