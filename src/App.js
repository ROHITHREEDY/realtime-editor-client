import React, { useEffect, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('https://realtime-editor-backend-a8xx.onrender.com');



 // Connect to backend

function App() {
  const textareaRef = useRef();

  useEffect(() => {
    // When receiving changes, update textarea value
    socket.on('receive-changes', data => {
      if (textareaRef.current) {
        textareaRef.current.value = data;
      }
    });

    return () => {
      socket.off('receive-changes');
    };
  }, []);

  function handleChange(e) {
    const value = e.target.value;
    // Send changes to server
    socket.emit('send-changes', value);
  }

  return (
    <div style={{ margin: '50px auto', maxWidth: '600px' }}>
      <h2>Real-Time Collaborative Editor</h2>
      <textarea
        ref={textareaRef}
        rows={12}
        style={{ width: '100%', fontSize: '18px' }}
        onChange={handleChange}
        placeholder="Start typing..."
      />
      <p>Open this page in two browser windows to test live editing!</p>
    </div>
  );
}

export default App;
