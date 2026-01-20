import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const MOVE_TYPES = [
  { value: 'price_change', label: 'Fiyat Değişikliği', params: ['strategy'] },
  { value: 'marketing_boost', label: 'Pazarlama Bütçesi Artır', params: ['amount'] },
  { value: 'hire_employee', label: 'Eleman Al', params: ['count'] },
  { value: 'fire_employee', label: 'Eleman Çıkar', params: ['count'] },
  { value: 'rd_investment', label: 'Ar-Ge Yatırımı', params: ['amount'] },
  { value: 'market_expansion', label: 'Pazar Genişleme', params: ['cost'] },
  { value: 'risk_reduction', label: 'Risk Azaltma', params: ['cost'] },
];

export default function Moves() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedMove, setSelectedMove] = useState('');
  const [params, setParams] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [availableMoves, setAvailableMoves] = useState(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      fetchAvailableMoves();
    }
  }, [selectedCompany]);

  const fetchCompanies = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/companies`, { credentials: 'include' });
      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      console.error('Failed to fetch companies:', error);
    }
  };

  const fetchAvailableMoves = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/moves/available/${selectedCompany}`, { credentials: 'include' });
      const data = await response.json();
      setAvailableMoves(data);
    } catch (error) {
      console.error('Failed to fetch available moves:', error);
    }
  };

  const handleMakeMove = async () => {
    if (!selectedCompany || !selectedMove) {
      toast.error('Şirket ve hamle seçin');
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/moves`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ company_id: selectedCompany, move_type: selectedMove, parameters: params })
      });

      if (response.ok) {
        toast.success('Hamle başarıyla yapıldı!');
        setDialogOpen(false);
        setSelectedMove('');
        setParams({});
        fetchAvailableMoves();
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Hamle yapılamadı');
      }
    } catch (error) {
      toast.error('Bir hata oluştu');
    }
  };

  const currentMove = MOVE_TYPES.find(m => m.value === selectedMove);

  return (
    <div className="flex h-screen bg-[#09090B]" data-testid="moves-page">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <TopBar />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1600px] mx-auto space-y-6">
            <div>
              <h1 className="text-4xl font-mono font-bold uppercase tracking-tight text-white" data-testid="moves-title">Hamleler</h1>
              <p className="text-sm text-zinc-500 mt-1 font-mono uppercase tracking-wider">Stratejik kararlar alın</p>
            </div>

            <Card className="bg-[#121214] border border-zinc-800 rounded-sm p-6" data-testid="select-company-card">
              <h2 className="text-xl font-mono font-semibold uppercase tracking-tight text-white mb-4">Şirket Seç</h2>
              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger className="bg-zinc-900/50 border-zinc-800 rounded-none font-mono" data-testid="company-select">
                  <SelectValue placeholder="Şirket seçin" />
                </SelectTrigger>
                <SelectContent className="bg-[#121214] border border-zinc-800 text-white">
                  {companies.map((c) => (
                    <SelectItem key={c.company_id} value={c.company_id} className="font-mono" data-testid={`company-option-${c.company_id}`}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {availableMoves && (
                <div className="mt-4 text-sm font-mono"><span className="text-zinc-500">Kalan hamle:</span> <span className="text-white">{availableMoves.remaining_moves} / {availableMoves.total_moves}</span></div>
              )}
            </Card>

            {selectedCompany && availableMoves && availableMoves.remaining_moves > 0 && (
              <Card className="bg-[#121214] border border-zinc-800 rounded-sm p-6" data-testid="available-moves-card">
                <h2 className="text-xl font-mono font-semibold uppercase tracking-tight text-white mb-4">Mevcut Hamleler</h2>
                <div className="grid grid-cols-2 gap-4">
                  {MOVE_TYPES.map((move) => (
                    <Dialog key={move.value}>
                      <DialogTrigger asChild>
                        <Button onClick={() => setSelectedMove(move.value)} variant="outline" className="rounded-none border-zinc-700 hover:bg-zinc-800 font-mono text-left justify-start h-auto py-4" data-testid={`move-button-${move.value}`}>
                          <div><div className="font-semibold">{move.label}</div></div>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-[#121214] border border-zinc-800 text-white rounded-sm" data-testid={`move-dialog-${move.value}`}>
                        <DialogHeader><DialogTitle className="font-mono uppercase tracking-tight">{move.label}</DialogTitle></DialogHeader>
                        <div className="space-y-4 mt-4">
                          {move.params.includes('strategy') && (
                            <Select value={params.strategy} onValueChange={(v) => setParams({ ...params, strategy: v })}>
                              <SelectTrigger className="bg-zinc-900/50 border-zinc-800 rounded-none font-mono"><SelectValue placeholder="Strateji seçin" /></SelectTrigger>
                              <SelectContent className="bg-[#121214] border border-zinc-800 text-white">
                                <SelectItem value="düşük" className="font-mono">Düşük Fiyat</SelectItem>
                                <SelectItem value="orta" className="font-mono">Orta Fiyat</SelectItem>
                                <SelectItem value="yüksek" className="font-mono">Yüksek Fiyat</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                          {move.params.includes('amount') && (
                            <Input type="number" placeholder="Miktar" value={params.amount || ''} onChange={(e) => setParams({ ...params, amount: parseInt(e.target.value) || 0 })} className="bg-zinc-900/50 border-zinc-800 rounded-none font-mono" />
                          )}
                          {move.params.includes('count') && (
                            <Input type="number" placeholder="Sayı" value={params.count || ''} onChange={(e) => setParams({ ...params, count: parseInt(e.target.value) || 0 })} className="bg-zinc-900/50 border-zinc-800 rounded-none font-mono" />
                          )}
                          {move.params.includes('cost') && (
                            <Input type="number" placeholder="Maliyet" value={params.cost || ''} onChange={(e) => setParams({ ...params, cost: parseInt(e.target.value) || 0 })} className="bg-zinc-900/50 border-zinc-800 rounded-none font-mono" />
                          )}
                          <Button onClick={handleMakeMove} className="w-full bg-white text-black hover:bg-gray-200 rounded-none font-mono text-xs uppercase tracking-widest" data-testid="confirm-move-button">Hamleyi Yap</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              </Card>
            )}

            {selectedCompany && availableMoves && availableMoves.remaining_moves === 0 && (
              <Card className="bg-[#121214] border border-zinc-800 rounded-sm p-6 text-center" data-testid="no-moves-left-card">
                <p className="text-zinc-500 font-mono">Bugün için hamle hakkınız kalmadı. Yarın tekrar deneyin.</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}