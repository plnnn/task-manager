import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Tasks from './components/Tasks.jsx';
import { AuthContext } from './context/AuthContext.jsx';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/tasks" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/tasks" />} />
      <Route path="/tasks" element={user ? <Tasks /> : <Navigate to="/login" />} />
      <Route path="/" element={<Navigate to={user ? "/tasks" : "/login"} />} />
    </Routes>
  );
}

export default App;