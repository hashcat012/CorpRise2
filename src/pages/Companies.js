import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Building2, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const COMPANY_TYPES = [
  { value: 'SaaS', label: 'SaaS', desc: 'Abonelik tabanlı, yüksek büyüme potansiyeli' },
  { value: 'E-ticaret', label: 'E-ticaret', desc: 'Hızlı gelir, orta risk' },
  { value: 'Oyun Stüdyosu', label: 'Oyun Stüdyosu', desc: 'Çok yüksek risk, çok yüksek ödül' },
  { value: 'Influencer/Ajans', label: 'Influencer/Ajans', desc: 'Düşük başlangıç, esnek büyüme' },
  { value: 'Finans/Yatırım', label: 'Finans/Yatırım', desc: 'Yüksek gelir, yüksek risk' },
];

export default function Companies() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newCompany, setNewCompany] = useState({ name: '', company_type: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/companies`, {
        credentials: 'include'
      });
      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      console.error('Failed to fetch companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCompany = async () => {
    if (!newCompany.name || !newCompany.company_type) {
      toast.error('Şirket adı ve türü gerekli');
      return;
    }

    setCreating(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/companies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newCompany)
      });

      if (response.ok) {
        toast.success('Şirket başarıyla kuruldu!');
        setDialogOpen(false);
        setNewCompany({ name: '', company_type: '' });
        fetchCompanies();
      } else {
        toast.error('Şirket kurulamadı');
      }
    } catch (error) {
      toast.error('Bir hata oluştu');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#09090B]">
        <div className="text-white font-mono text-sm uppercase tracking-widest animate-pulse">
          LOADING...
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#09090B]" data-testid="companies-page">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <TopBar />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1600px] mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-mono font-bold uppercase tracking-tight text-white" data-testid="companies-title">
                  Şirketler
                </h1>
                <p className="text-sm text-zinc-500 mt-1 font-mono uppercase tracking-wider" data-testid="companies-subtitle">
                  İş portföyünüzü yönetin
                </p>
              </div>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-white text-black hover:bg-gray-200 rounded-none font-mono text-xs uppercase tracking-widest btn-hover"
                    data-testid="open-create-company-dialog"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Yeni Şirket Kur
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#121214] border border-zinc-800 text-white rounded-sm" data-testid="create-company-dialog">
                  <DialogHeader>
                    <DialogTitle className="font-mono uppercase tracking-tight">Yeni Şirket Kur</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="text-xs text-zinc-500 uppercase tracking-wider font-mono mb-2 block">
                        Şirket Adı
                      </label>
                      <Input
                        value={newCompany.name}
                        onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                        placeholder="Örn: TechVenture Inc."
                        className="bg-zinc-900/50 border-zinc-800 focus:border-white rounded-none font-mono text-sm"
                        data-testid="company-name-input"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-500 uppercase tracking-wider font-mono mb-2 block">
                        Şirket Türü
                      </label>
                      <Select value={newCompany.company_type} onValueChange={(value) => setNewCompany({ ...newCompany, company_type: value })}>
                        <SelectTrigger className="bg-zinc-900/50 border-zinc-800 rounded-none font-mono" data-testid="company-type-select">
                          <SelectValue placeholder="Tür seçin" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#121214] border border-zinc-800 text-white">
                          {COMPANY_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value} className="font-mono" data-testid={`company-type-${type.value}`}>
                              <div>
                                <div className="font-semibold">{type.label}</div>
                                <div className="text-xs text-zinc-500">{type.desc}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      onClick={handleCreateCompany}
                      disabled={creating}
                      className="w-full bg-white text-black hover:bg-gray-200 rounded-none font-mono text-xs uppercase tracking-widest"
                      data-testid="confirm-create-company-button"
                    >
                      {creating ? 'Kuruluyor...' : 'Şirketi Kur'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {companies.length === 0 ? (
              <Card className="bg-[#121214] border border-zinc-800 rounded-sm p-12" data-testid="no-companies-card">
                <div className="text-center">
                  <Building2 className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                  <h2 className="text-xl font-mono font-semibold text-white mb-2">Henüz şirket yok</h2>
                  <p className="text-sm text-zinc-500 font-mono mb-6">
                    Dijital dünyada ilk şirketinizi kurarak imparatorluğunuzu inşa edin
                  </p>
                  <Button
                    onClick={() => setDialogOpen(true)}
                    className="bg-white text-black hover:bg-gray-200 rounded-none font-mono text-xs uppercase tracking-widest"
                    data-testid="create-first-company-button-empty"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    İlk Şirketinizi Kurun
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-2 gap-6">
                {companies.map((company) => (
                  <Card
                    key={company.company_id}
                    className="bg-[#121214] border border-zinc-800 rounded-sm overflow-hidden cursor-pointer card-hover"
                    onClick={() => navigate(`/company/${company.company_id}`)}
                    data-testid={`company-card-${company.company_id}`}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-mono font-bold text-white mb-1">{company.name}</h3>
                          <span className="text-xs text-zinc-500 uppercase tracking-wider font-mono">
                            {company.company_type}
                          </span>
                        </div>
                        <Building2 className="w-6 h-6 text-zinc-600" />
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-xs text-zinc-600 uppercase tracking-wider font-mono mb-1">Revenue</div>
                          <div className="text-lg font-mono text-green-500">${company.revenue.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-xs text-zinc-600 uppercase tracking-wider font-mono mb-1">Net Profit</div>
                          <div className={`text-lg font-mono ${company.net_profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            ${company.net_profit.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-zinc-600 uppercase tracking-wider font-mono mb-1">Cash Flow</div>
                          <div className="text-lg font-mono text-white">${company.cash_flow.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-xs text-zinc-600 uppercase tracking-wider font-mono mb-1">Market Share</div>
                          <div className="text-lg font-mono text-blue-400">{company.market_share.toFixed(1)}%</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 pt-4 border-t border-zinc-900">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-xs text-zinc-500 font-mono">Müşteri: {company.customer_satisfaction.toFixed(0)}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                          <span className="text-xs text-zinc-500 font-mono">Risk: {company.risk_level.toFixed(0)}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-3 h-3 text-blue-500" />
                          <span className="text-xs text-zinc-500 font-mono">Büyüme: {company.growth_rate.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}