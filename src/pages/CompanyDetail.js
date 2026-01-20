import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, TrendingUp, TrendingDown, Users, DollarSign, Activity, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function CompanyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompany();
  }, [id]);

  const fetchCompany = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/companies/${id}`, { credentials: 'include' });
      const data = await response.json();
      setCompany(data);
    } catch (error) {
      console.error('Failed to fetch company:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-[#09090B]"><div className="text-white font-mono text-sm uppercase tracking-widest animate-pulse">LOADING...</div></div>;
  if (!company) return null;

  return (
    <div className="flex h-screen bg-[#09090B]" data-testid="company-detail-page">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <TopBar />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1600px] mx-auto space-y-6">
            <div className="flex items-center gap-4">
              <Button onClick={() => navigate('/companies')} variant="outline" size="sm" className="rounded-none border-zinc-700 font-mono" data-testid="back-button">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-4xl font-mono font-bold uppercase tracking-tight text-white" data-testid="company-name">{company.name}</h1>
                <p className="text-sm text-zinc-500 mt-1 font-mono uppercase tracking-wider">{company.company_type}</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <Card className="bg-[#121214] border border-zinc-800 rounded-sm p-4" data-testid="stat-revenue">
                <div className="flex items-center justify-between mb-2"><span className="text-xs text-zinc-500 uppercase tracking-wider font-mono">Revenue</span><TrendingUp className="w-4 h-4 text-green-500" /></div>
                <div className="text-2xl font-mono font-bold text-green-500">${company.revenue.toLocaleString()}</div>
              </Card>
              <Card className="bg-[#121214] border border-zinc-800 rounded-sm p-4" data-testid="stat-expenses">
                <div className="flex items-center justify-between mb-2"><span className="text-xs text-zinc-500 uppercase tracking-wider font-mono">Expenses</span><TrendingDown className="w-4 h-4 text-red-500" /></div>
                <div className="text-2xl font-mono font-bold text-red-500">${company.expenses.toLocaleString()}</div>
              </Card>
              <Card className="bg-[#121214] border border-zinc-800 rounded-sm p-4" data-testid="stat-profit">
                <div className="flex items-center justify-between mb-2"><span className="text-xs text-zinc-500 uppercase tracking-wider font-mono">Net Profit</span><Activity className="w-4 h-4 text-yellow-500" /></div>
                <div className={`text-2xl font-mono font-bold ${company.net_profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>${company.net_profit.toLocaleString()}</div>
              </Card>
              <Card className="bg-[#121214] border border-zinc-800 rounded-sm p-4" data-testid="stat-cash">
                <div className="flex items-center justify-between mb-2"><span className="text-xs text-zinc-500 uppercase tracking-wider font-mono">Cash Flow</span><DollarSign className="w-4 h-4 text-blue-500" /></div>
                <div className="text-2xl font-mono font-bold text-white">${company.cash_flow.toLocaleString()}</div>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Card className="bg-[#121214] border border-zinc-800 rounded-sm p-6" data-testid="company-metrics">
                <h2 className="text-xl font-mono font-semibold uppercase tracking-tight text-white mb-4">Metrics</h2>
                <div className="space-y-4">
                  <div><div className="flex justify-between text-sm font-mono mb-2"><span className="text-zinc-500">Customer Satisfaction</span><span className="text-white">{company.customer_satisfaction.toFixed(0)}%</span></div><Progress value={company.customer_satisfaction} className="h-2" /></div>
                  <div><div className="flex justify-between text-sm font-mono mb-2"><span className="text-zinc-500">Employee Efficiency</span><span className="text-white">{company.employee_efficiency.toFixed(0)}%</span></div><Progress value={company.employee_efficiency} className="h-2" /></div>
                  <div><div className="flex justify-between text-sm font-mono mb-2"><span className="text-zinc-500">Risk Level</span><span className="text-red-500">{company.risk_level.toFixed(0)}%</span></div><Progress value={company.risk_level} className="h-2 bg-red-900/20" /></div>
                  <div><div className="flex justify-between text-sm font-mono mb-2"><span className="text-zinc-500">Market Share</span><span className="text-blue-400">{company.market_share.toFixed(1)}%</span></div><Progress value={company.market_share} className="h-2" /></div>
                </div>
              </Card>

              <Card className="bg-[#121214] border border-zinc-800 rounded-sm p-6" data-testid="company-operations">
                <h2 className="text-xl font-mono font-semibold uppercase tracking-tight text-white mb-4">Operations</h2>
                <div className="space-y-3">
                  <div className="flex justify-between"><span className="text-sm text-zinc-500 font-mono">Employees</span><span className="text-sm text-white font-mono">{company.employees_count}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-zinc-500 font-mono">Marketing Budget</span><span className="text-sm text-white font-mono">${company.marketing_budget.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-zinc-500 font-mono">R&D Budget</span><span className="text-sm text-white font-mono">${company.rd_budget.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-zinc-500 font-mono">Pricing Strategy</span><span className="text-sm text-white font-mono uppercase">{company.pricing_strategy}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-zinc-500 font-mono">Brand Value</span><span className="text-sm text-white font-mono">${company.brand_value.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-zinc-500 font-mono">Growth Rate</span><span className={`text-sm font-mono ${company.growth_rate >= 0 ? 'text-green-500' : 'text-red-500'}`}>{company.growth_rate.toFixed(1)}%</span></div>
                </div>
              </Card>
            </div>

            <Card className="bg-[#121214] border border-zinc-800 rounded-sm p-6" data-testid="moves-section">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-mono font-semibold uppercase tracking-tight text-white">Stratejik Hamleler</h2>
                <Button onClick={() => navigate('/moves')} className="bg-white text-black hover:bg-gray-200 rounded-none font-mono text-xs uppercase tracking-widest" data-testid="go-to-moves-button">Hamle Yap</Button>
              </div>
              <p className="text-sm text-zinc-500 font-mono">Bu şirket için stratejik kararlar almak için Hamleler sayfasına gidin.</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}