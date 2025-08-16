import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DocumentDashboard from './DocumentDashboard';
import EditorPage from './EditorPage';
import AuthPage from './AuthPage';   // Import new tabbed auth page
import { AuthProvider, AuthContext } from './AuthContext';
import PrivateRoute from './PrivateRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <DocumentDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/doc/:id"
            element={
              <PrivateRoute>
                <EditorPage />
              </PrivateRoute>
            }
          />

          {/* Redirect any unknown route to /auth */}
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
