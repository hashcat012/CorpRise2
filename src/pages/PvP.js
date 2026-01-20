import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Swords, Target } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function PvP() {
  const [competitors, setCompetitors] = useState([]);
  const [myCompanies, setMyCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [targetUser, setTargetUser] = useState('');
  const [attackType, setAttackType] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchCompetitors();
    fetchMyCompanies();
  }, []);

  const fetchCompetitors = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/pvp/competitors`, { credentials: 'include' });
      const data = await response.json();
      setCompetitors(data);
    } catch (error) {
      console.error('Failed to fetch competitors:', error);
    }
  };

  const fetchMyCompanies = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/companies`, { credentials: 'include' });
      const data = await response.json();
      setMyCompanies(data);
    } catch (error) {
      console.error('Failed to fetch companies:', error);
    }
  };

  const handleAttack = async () => {
    if (!selectedCompany || !targetUser || !attackType) {
      toast.error('Tüm alanları doldurun');
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/pvp/attack`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ target_user_id: targetUser, attacker_company_id: selectedCompany, attack_type: attackType })
      });

      const result = await response.json();
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
      setDialogOpen(false);
    } catch (error) {
      toast.error('Saldırı başarısız oldu');
    }
  };

  return (
    <div className="flex h-screen bg-[#09090B]" data-testid="pvp-page">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <TopBar />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1600px] mx-auto space-y-6">
            <div>
              <h1 className="text-4xl font-mono font-bold uppercase tracking-tight text-white" data-testid="pvp-title">PvP Arena</h1>
              <p className="text-sm text-zinc-500 mt-1 font-mono uppercase tracking-wider">Ekonomik rekabet</p>
            </div>

            <Card className="bg-[#121214] border border-zinc-800 rounded-sm p-6" data-testid="competitors-card">
              <h2 className="text-xl font-mono font-semibold uppercase tracking-tight text-white mb-4">Rakipler</h2>
              {competitors.length === 0 ? (
                <p className="text-zinc-500 font-mono text-sm">Ligeğinizde rakip bulunamadı</p>
              ) : (
                <div className="space-y-3">
                  {competitors.map((comp) => (
                    <div key={comp.user_id} className="bg-[#18181B] border border-zinc-800 p-4 rounded-sm flex items-center justify-between" data-testid={`competitor-${comp.user_id}`}>
                      <div>
                        <div className="font-mono font-semibold text-white">{comp.name}</div>
                        <div className="text-xs text-zinc-500 font-mono mt-1">Net Worth: ${comp.total_net_worth.toLocaleString()} | Şirket: {comp.company_count}</div>
                      </div>
                      <Dialog open={dialogOpen && targetUser === comp.user_id} onOpenChange={(open) => { setDialogOpen(open); if (open) setTargetUser(comp.user_id); }}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="rounded-none border-red-900/50 text-red-500 hover:bg-red-900/20 font-mono text-xs uppercase tracking-widest" data-testid={`attack-button-${comp.user_id}`}>
                            <Swords className="w-3 h-3 mr-2" />Saldır
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#121214] border border-zinc-800 text-white rounded-sm" data-testid="attack-dialog">
                          <DialogHeader><DialogTitle className="font-mono uppercase tracking-tight">Ekonomik Saldırı</DialogTitle></DialogHeader>
                          <div className="space-y-4 mt-4">
                            <div>
                              <label className="text-xs text-zinc-500 uppercase tracking-wider font-mono mb-2 block">Saldıran Şirket</label>
                              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                                <SelectTrigger className="bg-zinc-900/50 border-zinc-800 rounded-none font-mono" data-testid="attacker-company-select"><SelectValue placeholder="Şirket seçin" /></SelectTrigger>
                                <SelectContent className="bg-[#121214] border border-zinc-800 text-white">
                                  {myCompanies.map((c) => (<SelectItem key={c.company_id} value={c.company_id} className="font-mono">{c.name}</SelectItem>))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <label className="text-xs text-zinc-500 uppercase tracking-wider font-mono mb-2 block">Saldırı Türü</label>
                              <Select value={attackType} onValueChange={setAttackType}>
                                <SelectTrigger className="bg-zinc-900/50 border-zinc-800 rounded-none font-mono" data-testid="attack-type-select"><SelectValue placeholder="Tür seçin" /></SelectTrigger>
                                <SelectContent className="bg-[#121214] border border-zinc-800 text-white">
                                  <SelectItem value="price_war" className="font-mono">Fiyat Savaşı</SelectItem>
                                  <SelectItem value="market_takeover" className="font-mono">Pazar Ele Geçirme</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Button onClick={handleAttack} className="w-full bg-red-900/20 text-red-500 border border-red-900/50 hover:bg-red-900/40 rounded-none font-mono text-xs uppercase tracking-widest" data-testid="confirm-attack-button">Saldırıyı Başlat</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}