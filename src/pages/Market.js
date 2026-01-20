import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function Market() {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarkets();
  }, []);

  const fetchMarkets = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/market`, { credentials: 'include' });
      const data = await response.json();
      setMarkets(data);
    } catch (error) {
      console.error('Failed to fetch markets:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-[#09090B]"><div className="text-white font-mono text-sm uppercase tracking-widest animate-pulse">LOADING...</div></div>;

  return (
    <div className="flex h-screen bg-[#09090B]" data-testid="market-page">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <TopBar />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1600px] mx-auto space-y-6">
            <div>
              <h1 className="text-4xl font-mono font-bold uppercase tracking-tight text-white" data-testid="market-title">Pazar & Ekonomi</h1>
              <p className="text-sm text-zinc-500 mt-1 font-mono uppercase tracking-wider">Sektör analizi ve trendler</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {markets.map((market) => (
                <Card key={market.sector} className="bg-[#121214] border border-zinc-800 rounded-sm p-6 card-hover" data-testid={`market-${market.sector}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-mono font-bold text-white">{market.sector}</h3>
                      <p className="text-xs text-zinc-500 uppercase tracking-wider font-mono mt-1">Sektör Durumu</p>
                    </div>
                    {market.trend_score > 0 ? (
                      <TrendingUp className="w-6 h-6 text-green-500" />
                    ) : market.trend_score < 0 ? (
                      <TrendingDown className="w-6 h-6 text-red-500" />
                    ) : null}
                  </div>

                  <div className="mb-4">
                    <div className="text-xs text-zinc-600 uppercase tracking-wider font-mono mb-2">Trend Skoru</div>
                    <div className={`text-4xl font-mono font-bold ${
                      market.trend_score > 0 ? 'text-green-500' : market.trend_score < 0 ? 'text-red-500' : 'text-zinc-500'
                    }`}>
                      {market.trend_score > 0 ? '+' : ''}{market.trend_score.toFixed(1)}
                    </div>
                  </div>

                  {market.crisis_active && (
                    <div className="bg-red-900/20 border border-red-900/50 p-3 rounded-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <span className="text-sm font-mono font-semibold text-red-500 uppercase">Kriz Aktif</span>
                      </div>
                      <p className="text-xs text-zinc-400 font-mono">{market.crisis_type}</p>
                    </div>
                  )}

                  {!market.crisis_active && (
                    <div className="text-xs text-zinc-600 font-mono">
                      <p>Son güncelleme: {new Date(market.updated_at).toLocaleString('tr-TR')}</p>
                    </div>
                  )}
                </Card>
              ))}
            </div>

            <Card className="bg-[#121214] border border-zinc-800 rounded-sm p-6" data-testid="market-info">
              <h2 className="text-xl font-mono font-semibold uppercase tracking-tight text-white mb-4">Pazar Hakkında</h2>
              <div className="space-y-2 text-sm text-zinc-400 font-mono">
                <p>• Pazar trendleri şirketlerinizin performansını etkiler.</p>
                <p>• Pozitif trend büyüme fırsatları sunar, negatif trend riskleri artırır.</p>
                <p>• Kriz dönemlerinde dikkatli strateji gerekir.</p>
                <p>• Doğru zamanda doğru sektörde olmak avantaj sağlar.</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}