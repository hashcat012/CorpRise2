import React, { useEffect, useState } from 'react';
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
import { listenAuth } from './firebase';

function AppRouter() {
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    listenAuth(setUser);
  }, []);

  if (user === null) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#09090B]">
        <div className="text-white font-mono text-sm uppercase tracking-widest animate-pulse">
          LOADING...
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="scanlines" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute user={user}><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute user={user}><Dashboard /></ProtectedRoute>} />
        <Route path="/companies" element={<ProtectedRoute user={user}><Companies /></ProtectedRoute>} />
        <Route path="/company/:id" element={<ProtectedRoute user={user}><CompanyDetail /></ProtectedRoute>} />
        <Route path="/moves" element={<ProtectedRoute user={user}><Moves /></ProtectedRoute>} />
        <Route path="/pvp" element={<ProtectedRoute user={user}><PvP /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute user={user}><Leaderboard /></ProtectedRoute>} />
        <Route path="/market" element={<ProtectedRoute user={user}><Market /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute user={user}><Profile /></ProtectedRoute>} />
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