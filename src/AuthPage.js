import React, { useState } from 'react';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Use API_URL + "/api/..." in your fetch or axios calls


function AuthPage() {
  const [tab, setTab] = useState('login'); // 'login' or 'signup'

  return (
    <div style={{ maxWidth: 400, margin: '80px auto' }}>
      <div style={{ display: 'flex', marginBottom: 24 }}>
        <button
          style={{
            flex: 1,
            fontWeight: tab === 'login' ? 700 : 400,
            cursor: 'pointer',
            padding: '12px',
          }}
          onClick={() => setTab('login')}
        >
          Log In
        </button>
        <button
          style={{
            flex: 1,
            fontWeight: tab === 'signup' ? 700 : 400,
            cursor: 'pointer',
            padding: '12px',
          }}
          onClick={() => setTab('signup')}
        >
          Sign Up
        </button>
      </div>
      {tab === 'login' ? <LoginPage /> : <SignupPage />}
    </div>
  );
}

export default AuthPage;
