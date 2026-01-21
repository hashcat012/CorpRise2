import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, TrendingUp, TrendingDown, Building2, DollarSign, Activity, Plus } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function Dashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/dashboard`, {
        credentials: 'include'
      });
      const data = await response.json();
      setDashboard(data);
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#09090B]">
        <div className="text-white font-mono text-sm uppercase tracking-widest animate-pulse">
          LOADING DASHBOARD...
        </div>
      </div>
    );
  }

  if (!dashboard) return null;

  const totalRevenue = dashboard.companies.reduce((sum, c) => sum + c.revenue, 0);
  const totalExpenses = dashboard.companies.reduce((sum, c) => sum + c.expenses, 0);
  const totalProfit = totalRevenue - totalExpenses;

  return (
    <div className="flex h-screen bg-[#09090B]" data-testid="dashboard-page">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <TopBar />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1600px] mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-mono font-bold uppercase tracking-tight text-white" data-testid="dashboard-title">
                  Dashboard
                </h1>
                <p className="text-sm text-zinc-500 mt-1 font-mono uppercase tracking-wider" data-testid="dashboard-subtitle">
                  İş İmparatorluğunuza Genel Bakış
                </p>
              </div>
              <Button
                onClick={() => navigate('/companies')}
                className="bg-white text-black hover:bg-gray-200 rounded-none font-mono text-xs uppercase tracking-widest btn-hover"
                data-testid="create-company-button"
              >
                <Plus className="w-4 h-4 mr-2" />
                Yeni Şirket Kur
              </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-4">
              <Card className="bg-[#121214] border border-zinc-800 rounded-sm p-4 card-hover" data-testid="stat-net-worth">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-zinc-500 uppercase tracking-wider font-mono">Net Worth</span>
                  <DollarSign className="w-4 h-4 text-blue-500" />
                </div>
                <div className="text-2xl font-mono font-bold text-white">
                  ${dashboard.total_net_worth.toLocaleString()}
                </div>
              </Card>

              <Card className="bg-[#121214] border border-zinc-800 rounded-sm p-4 card-hover" data-testid="stat-revenue">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-zinc-500 uppercase tracking-wider font-mono">Total Revenue</span>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <div className="text-2xl font-mono font-bold text-green-500">
                  ${totalRevenue.toLocaleString()}
                </div>
              </Card>

              <Card className="bg-[#121214] border border-zinc-800 rounded-sm p-4 card-hover" data-testid="stat-expenses">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-zinc-500 uppercase tracking-wider font-mono">Total Expenses</span>
                  <TrendingDown className="w-4 h-4 text-red-500" />
                </div>
                <div className="text-2xl font-mono font-bold text-red-500">
                  ${totalExpenses.toLocaleString()}
                </div>
              </Card>

              <Card className="bg-[#121214] border border-zinc-800 rounded-sm p-4 card-hover" data-testid="stat-profit">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-zinc-500 uppercase tracking-wider font-mono">Net Profit</span>
                  <Activity className="w-4 h-4 text-yellow-500" />
                </div>
                <div className={`text-2xl font-mono font-bold ${totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ${totalProfit.toLocaleString()}
                </div>
              </Card>
            </div>

            {/* Companies Overview */}
            <Card className="bg-[#121214] border border-zinc-800 rounded-sm overflow-hidden" data-testid="companies-overview">
              <div className="p-4 border-b border-zinc-800">
                <h2 className="text-xl font-mono font-semibold uppercase tracking-tight text-white">Şirketlerim</h2>
              </div>
              <div className="p-4">
                {dashboard.companies.length === 0 ? (
                  <div className="text-center py-12" data-testid="no-companies-message">
                    <Building2 className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                    <p className="text-zinc-500 font-mono text-sm uppercase tracking-wider">Henüz şirket kurmadınız</p>
                    <Button
                      onClick={() => navigate('/companies')}
                      className="mt-4 bg-white text-black hover:bg-gray-200 rounded-none font-mono text-xs uppercase tracking-widest"
                      data-testid="create-first-company-button"
                    >
                      İlk Şirketinizi Kurun
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {dashboard.companies.map((company) => (
                      <div
                        key={company.company_id}
                        onClick={() => navigate(`/company/${company.company_id}`)}
                        className="bg-[#18181B] border border-zinc-800 p-4 rounded-sm cursor-pointer card-hover"
                        data-testid={`company-card-${company.company_id}`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-mono font-semibold text-white">{company.name}</h3>
                          <span className="text-xs text-zinc-500 uppercase tracking-wider font-mono">
                            {company.company_type}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <div className="text-xs text-zinc-600 uppercase tracking-wider font-mono mb-1">Revenue</div>
                            <div className="text-sm font-mono text-green-500">${company.revenue.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-xs text-zinc-600 uppercase tracking-wider font-mono mb-1">Cash Flow</div>
                            <div className="text-sm font-mono text-white">${company.cash_flow.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-xs text-zinc-600 uppercase tracking-wider font-mono mb-1">Market Share</div>
                            <div className="text-sm font-mono text-blue-400">{company.market_share.toFixed(1)}%</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Market Trends */}
            {dashboard.markets && dashboard.markets.length > 0 && (
              <Card className="bg-[#121214] border border-zinc-800 rounded-sm overflow-hidden" data-testid="market-trends">
                <div className="p-4 border-b border-zinc-800">
                  <h2 className="text-xl font-mono font-semibold uppercase tracking-tight text-white">Pazar Trendleri</h2>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-5 gap-4">
                    {dashboard.markets.map((market) => (
                      <div key={market.sector} className="text-center" data-testid={`market-${market.sector}`}>
                        <div className="text-xs text-zinc-600 uppercase tracking-wider font-mono mb-2">
                          {market.sector}
                        </div>
                        <div className={`text-2xl font-mono font-bold ${
                          market.trend_score > 0 ? 'text-green-500' : market.trend_score < 0 ? 'text-red-500' : 'text-zinc-500'
                        }`}>
                          {market.trend_score > 0 ? '+' : ''}{market.trend_score.toFixed(1)}
                        </div>
                        {market.crisis_active && (
                          <div className="mt-2 flex items-center justify-center gap-1">
                            <AlertCircle className="w-3 h-3 text-red-500" />
                            <span className="text-xs text-red-500 font-mono uppercase">Kriz</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Recent Activity */}
            {dashboard.recent_moves && dashboard.recent_moves.length > 0 && (
              <Card className="bg-[#121214] border border-zinc-800 rounded-sm overflow-hidden" data-testid="recent-activity">
                <div className="p-4 border-b border-zinc-800">
                  <h2 className="text-xl font-mono font-semibold uppercase tracking-tight text-white">Son Hareketler</h2>
                </div>
                <div className="p-4">
                  <div className="space-y-2">
                    {dashboard.recent_moves.map((move) => (
                      <div key={move.move_id} className="flex items-center justify-between py-2 border-b border-zinc-900" data-testid={`move-${move.move_id}`}>
                        <div>
                          <span className="text-sm font-mono text-white">{move.move_type.replace('_', ' ').toUpperCase()}</span>
                        </div>
                        <div className="text-xs text-zinc-500 font-mono">
                          {new Date(move.timestamp).toLocaleString('tr-TR')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

