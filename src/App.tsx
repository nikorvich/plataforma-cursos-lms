import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { Admin } from './pages/Admin';
import { UserProgress } from './pages/UserProgress';
import { Financial } from './pages/Financial';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-vh-100 bg-light">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/progresso" element={<UserProgress />} />
          <Route path="/financeiro" element={<Financial />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
