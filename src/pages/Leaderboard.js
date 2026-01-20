import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { Card } from '@/components/ui/card';
import { Trophy, Medal, Award } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/leaderboard`, { credentials: 'include' });
      const data = await response.json();
      setLeaderboard(data);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-[#09090B]"><div className="text-white font-mono text-sm uppercase tracking-widest animate-pulse">LOADING...</div></div>;

  return (
    <div className="flex h-screen bg-[#09090B]" data-testid="leaderboard-page">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <TopBar />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1600px] mx-auto space-y-6">
            <div>
              <h1 className="text-4xl font-mono font-bold uppercase tracking-tight text-white" data-testid="leaderboard-title">Liderlik Tablosu</h1>
              <p className="text-sm text-zinc-500 mt-1 font-mono uppercase tracking-wider">En başarılı girişimciler</p>
            </div>

            <Card className="bg-[#121214] border border-zinc-800 rounded-sm overflow-hidden" data-testid="leaderboard-table">
              <div className="p-4 border-b border-zinc-800 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <h2 className="text-xl font-mono font-semibold uppercase tracking-tight text-white">Global Sıralama</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#18181B] border-b border-zinc-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-zinc-500">Rank</th>
                      <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-zinc-500">Player</th>
                      <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-zinc-500">Net Worth</th>
                      <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-zinc-500">League</th>
                      <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-zinc-500">Prestige</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry) => (
                      <tr key={entry.user_id} className="border-b border-zinc-900 hover:bg-zinc-900/30" data-testid={`leaderboard-entry-${entry.user_id}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {entry.rank === 1 && <Medal className="w-4 h-4 text-yellow-500" />}
                            {entry.rank === 2 && <Medal className="w-4 h-4 text-gray-400" />}
                            {entry.rank === 3 && <Medal className="w-4 h-4 text-amber-700" />}
                            <span className="text-sm font-mono text-white">#{entry.rank}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {entry.picture && <img src={entry.picture} alt={entry.name} className="w-8 h-8 rounded-none border border-zinc-700" />}
                            <span className="text-sm font-mono text-white">{entry.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4"><span className="text-sm font-mono text-green-500">${entry.total_net_worth.toLocaleString()}</span></td>
                        <td className="px-6 py-4"><span className="text-sm font-mono text-yellow-400">{entry.league}</span></td>
                        <td className="px-6 py-4"><span className="text-sm font-mono text-blue-400">{entry.prestige_points}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}