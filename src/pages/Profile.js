import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { Card } from '@/components/ui/card';
import { User, Building2, Trophy, Calendar } from 'lucide-react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function Profile() {
  const [user, setUser] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) return;
      setUser(u);
      try {
        const [userRes, companiesRes] = await Promise.all([
          fetch(`${BACKEND_URL}/api/auth/me`, { credentials: 'include' }),
          fetch(`${BACKEND_URL}/api/companies`, { credentials: 'include' })
        ]);
        const userData = await userRes.json();
        const companiesData = await companiesRes.json();
        setUser(prev => ({ ...prev, ...userData }));
        setCompanies(companiesData);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  if (loading) return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#09090B]">
      <div className="text-white font-mono text-sm uppercase tracking-widest animate-pulse">LOADING...</div>
    </div>
  );

  if (!user) return null;

  return (
    <div className="flex h-screen bg-[#09090B]">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <TopBar />
        <div className="flex-1 overflow-y-auto p-6">
          <h1 className="text-4xl font-mono font-bold text-white mb-2">Profil</h1>
          <p className="text-sm text-zinc-500 font-mono mb-4">Hesap bilgileriniz ve istatistikler</p>
          <Card className="bg-[#121214] p-6">
            <div className="flex items-center gap-4">
              {user.photoURL && <img src={user.photoURL} alt="avatar" className="w-24 h-24 rounded-none border-2 border-zinc-700" />}
              <div>
                <h2 className="text-3xl font-mono font-bold text-white">{user.displayName}</h2>
                <p className="text-sm text-zinc-500 font-mono">{user.email}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
