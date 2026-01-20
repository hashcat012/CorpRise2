import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function TopBar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/dashboard`, {
        credentials: 'include'
      });
      const data = await response.json();
      setUser(data.user);
      setDashboard(data);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!user || !dashboard) return null;

  const totalCash = dashboard.companies.reduce((sum, c) => sum + c.cash_flow, 0);
  const isPositive = dashboard.total_net_worth > 10000;

  return (
    <div className="h-16 bg-[#121214] border-b border-zinc-800 flex items-center justify-between px-6" data-testid="topbar">
      <div className="flex items-center gap-8">
        <div className="flex flex-col" data-testid="net-worth-display">
          <span className="text-xs text-zinc-500 uppercase tracking-wider font-mono">Net Worth</span>
          <div className="flex items-center gap-2">
            <span className="text-xl font-mono font-bold text-white">
              ${dashboard.total_net_worth.toLocaleString()}
            </span>
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
          </div>
        </div>

        <div className="flex flex-col" data-testid="cash-display">
          <span className="text-xs text-zinc-500 uppercase tracking-wider font-mono">Cash</span>
          <span className="text-xl font-mono font-bold text-white">
            ${totalCash.toLocaleString()}
          </span>
        </div>

        <div className="flex flex-col" data-testid="rank-display">
          <span className="text-xs text-zinc-500 uppercase tracking-wider font-mono">Rank</span>
          <span className="text-xl font-mono font-bold text-blue-400">
            #{dashboard.rank}
          </span>
        </div>

        <div className="flex flex-col" data-testid="league-display">
          <span className="text-xs text-zinc-500 uppercase tracking-wider font-mono">League</span>
          <span className="text-xl font-mono font-bold text-yellow-400">
            {dashboard.league}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3" data-testid="user-info">
          {user.picture && (
            <img
              src={user.picture}
              alt={user.name}
              className="w-8 h-8 rounded-none border border-zinc-700"
              data-testid="user-avatar"
            />
          )}
          <span className="text-sm font-mono text-zinc-300" data-testid="user-name">{user.name}</span>
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className="rounded-none border-zinc-700 hover:bg-zinc-800 font-mono text-xs uppercase tracking-widest"
          data-testid="logout-button"
        >
          <LogOut className="w-3 h-3 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}