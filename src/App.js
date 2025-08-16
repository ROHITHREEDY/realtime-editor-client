import React, { useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './App.css'; // Import your CSS file

const socket = io('https://realtime-editor-backend-a8xx.onrender.com');

function App() {
  const textareaRef = useRef();

  useEffect(() => {
    const handleReceiveChanges = (data) => {
      if (textareaRef.current && textareaRef.current.value !== data) {
        textareaRef.current.value = data;
      }
    };

    socket.on('receive-changes', handleReceiveChanges);

    return () => {
      socket.off('receive-changes', handleReceiveChanges);
    };
  }, []);

  function handleChange(e) {
    const value = e.target.value;
    socket.emit('send-changes', value);
  }

  return (
    <div className="App">
      <header className="App-header">
        Real-Time Collaborative Editor
      </header>
      <main className="editor-container">
        <textarea
          ref={textareaRef}
          rows={12}
          onChange={handleChange}
          placeholder="Start typing..."
        />
        <p style={{ color: '#888' }}>
          Open this page in two browser windows to test live editing!
        </p>
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

export default App;
