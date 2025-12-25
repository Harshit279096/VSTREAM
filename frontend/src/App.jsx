import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ color: 'var(--primary)', padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="container" style={{ paddingTop: '2rem' }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/admin" element={
                <PrivateRoute>
                  <AdminPanel />
                </PrivateRoute>
              } />
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </main>
          <ToastContainer theme="dark" position="bottom-right" />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
