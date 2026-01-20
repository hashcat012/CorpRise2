import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import '@/index.css';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Companies from '@/pages/Companies';
import CompanyDetail from '@/pages/CompanyDetail';
import Moves from '@/pages/Moves';
import PvP from '@/pages/PvP';
import Leaderboard from '@/pages/Leaderboard';
import Market from '@/pages/Market';
import Profile from '@/pages/Profile';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Toaster } from '@/components/ui/sonner';

function AppRouter() {
  const location = useLocation();
  
  // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH  
  return (
    <>
      <div className="scanlines" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/companies" element={<ProtectedRoute><Companies /></ProtectedRoute>} />
        <Route path="/company/:id" element={<ProtectedRoute><CompanyDetail /></ProtectedRoute>} />
        <Route path="/moves" element={<ProtectedRoute><Moves /></ProtectedRoute>} />
        <Route path="/pvp" element={<ProtectedRoute><PvP /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        <Route path="/market" element={<ProtectedRoute><Market /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;