import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { Card } from '@/components/ui/card';
import { User, Building2, Trophy, Calendar } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function Profile() {
  const [user, setUser] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const [userRes, companiesRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/auth/me`, { credentials: 'include' }),
        fetch(`${BACKEND_URL}/api/companies`, { credentials: 'include' })
      ]);
      const userData = await userRes.json();
      const companiesData = await companiesRes.json();
      setUser(userData);
      setCompanies(companiesData);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-[#09090B]"><div className="text-white font-mono text-sm uppercase tracking-widest animate-pulse">LOADING...</div></div>;
  if (!user) return null;

  return (
    <div className="flex h-screen bg-[#09090B]" data-testid="profile-page">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <TopBar />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1600px] mx-auto space-y-6">
            <div>
              <h1 className="text-4xl font-mono font-bold uppercase tracking-tight text-white" data-testid="profile-title">Profil</h1>
              <p className="text-sm text-zinc-500 mt-1 font-mono uppercase tracking-wider">Hesap bilgileriniz ve istatistikler</p>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <Card className="bg-[#121214] border border-zinc-800 rounded-sm p-6 col-span-2" data-testid="user-info-card">
                <div className="flex items-start gap-6">
                  {user.picture && (
                    <img src={user.picture} alt={user.name} className="w-24 h-24 rounded-none border-2 border-zinc-700" data-testid="user-avatar" />
                  )}
                  <div className="flex-1">
                    <h2 className="text-3xl font-mono font-bold text-white mb-2" data-testid="user-name">{user.name}</h2>
                    <p className="text-sm text-zinc-500 font-mono mb-4" data-testid="user-email">{user.email}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-zinc-600 uppercase tracking-wider font-mono mb-1">Net Worth</div>
                        <div className="text-2xl font-mono font-bold text-white" data-testid="user-net-worth">${user.total_net_worth.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-xs text-zinc-600 uppercase tracking-wider font-mono mb-1">League</div>
                        <div className="text-2xl font-mono font-bold text-yellow-400" data-testid="user-league">{user.league}</div>
                      </div>
                      <div>
                        <div className="text-xs text-zinc-600 uppercase tracking-wider font-mono mb-1">Prestige Points</div>
                        <div className="text-2xl font-mono font-bold text-blue-400" data-testid="user-prestige">{user.prestige_points}</div>
                      </div>
                      <div>
                        <div className="text-xs text-zinc-600 uppercase tracking-wider font-mono mb-1">Daily Moves</div>
                        <div className="text-2xl font-mono font-bold text-white">{user.daily_moves_limit}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-[#121214] border border-zinc-800 rounded-sm p-6" data-testid="account-stats">
                <h3 className="text-xl font-mono font-semibold uppercase tracking-tight text-white mb-4">Account Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="text-xs text-zinc-600 uppercase tracking-wider font-mono">Companies</div>
                      <div className="text-lg font-mono text-white">{companies.length}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-green-500" />
                    <div>
                      <div className="text-xs text-zinc-600 uppercase tracking-wider font-mono">Member Since</div>
                      <div className="text-sm font-mono text-white">{new Date(user.created_at).toLocaleDateString('tr-TR')}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-purple-500" />
                    <div>
                      <div className="text-xs text-zinc-600 uppercase tracking-wider font-mono">Last Login</div>
                      <div className="text-sm font-mono text-white">{new Date(user.last_login).toLocaleDateString('tr-TR')}</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="bg-[#121214] border border-zinc-800 rounded-sm p-6" data-testid="account-value">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <h3 className="text-xl font-mono font-semibold uppercase tracking-tight text-white">Hesap Değeri</h3>
              </div>
              <div className="text-4xl font-mono font-bold text-white mb-2" data-testid="account-value-display">
                ${user.total_net_worth.toLocaleString()}
              </div>
              <p className="text-sm text-zinc-500 font-mono">
                Hesap değeriniz şirketlerinizin toplam değeri, lig seviyeniz ve prestij puanlarınızın birleşimidir.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}