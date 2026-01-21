import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebase";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Building2 } from "lucide-react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { toast } from "sonner";

const COMPANY_TYPES = [
  { value: "SaaS", label: "SaaS", desc: "Abonelik tabanlı, yüksek büyüme potansiyeli" },
  { value: "E-ticaret", label: "E-ticaret", desc: "Hızlı gelir, orta risk" },
  { value: "Oyun Stüdyosu", label: "Oyun Stüdyosu", desc: "Çok yüksek risk, çok yüksek ödül" },
  { value: "Influencer/Ajans", label: "Influencer/Ajans", desc: "Düşük başlangıç, esnek büyüme" },
  { value: "Finans/Yatırım", label: "Finans/Yatırım", desc: "Yüksek gelir, yüksek risk" },
];

export default function Companies() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newCompany, setNewCompany] = useState({ name: "", company_type: "" });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        fetchCompanies(u.uid);
      } else {
        navigate("/login", { replace: true });
      }
      setLoading(false);
    });
    return () => unsub();
  }, [navigate]);

  const fetchCompanies = async (uid) => {
    try {
      const snap = await getDocs(collection(db, "users", uid, "companies"));
      const data = snap.docs.map((doc) => ({ company_id: doc.id, ...doc.data() }));
      setCompanies(data);
    } catch (err) {
      console.error("Failed to fetch companies:", err);
      toast.error("Şirketler yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCompany = async () => {
    if (!newCompany.name || !newCompany.company_type) {
      toast.error("Şirket adı ve türü gerekli");
      return;
    }
    setCreating(true);
    try {
      await addDoc(collection(db, "users", user.uid, "companies"), {
        ...newCompany,
        revenue: 0,
        net_profit: 0,
        cash_flow: 0,
        market_share: 0,
        customer_satisfaction: 0,
        risk_level: 0,
        growth_rate: 0,
      });
      toast.success("Şirket başarıyla kuruldu!");
      setDialogOpen(false);
      setNewCompany({ name: "", company_type: "" });
      fetchCompanies(user.uid);
    } catch (err) {
      console.error("Company creation failed:", err);
      toast.error("Şirket kurulamadı");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#09090B]">
        <div className="text-white font-mono text-sm uppercase tracking-widest animate-pulse">LOADING...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen bg-[#09090B]" data-testid="companies-page">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <TopBar />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1600px] mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-mono font-bold uppercase tracking-tight text-white">Şirketler</h1>
                <p className="text-sm text-zinc-500 mt-1 font-mono uppercase tracking-wider">İş portföyünüzü yönetin</p>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-white text-black hover:bg-gray-200 rounded-none font-mono text-xs uppercase tracking-widest btn-hover">
                    <Plus className="w-4 h-4 mr-2" />
                    Yeni Şirket Kur
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#121214] border border-zinc-800 text-white rounded-sm">
                  <DialogHeader>
                    <DialogTitle className="font-mono uppercase tracking-tight">Yeni Şirket Kur</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <Input
                      value={newCompany.name}
                      onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                      placeholder="Şirket adı"
                      className="bg-zinc-900/50 border-zinc-800 focus:border-white rounded-none font-mono text-sm"
                    />
                    <Select
                      value={newCompany.company_type}
                      onValueChange={(value) => setNewCompany({ ...newCompany, company_type: value })}
                    >
                      <SelectTrigger className="bg-zinc-900/50 border-zinc-800 rounded-none font-mono">
                        <SelectValue placeholder="Tür seçin" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#121214] border border-zinc-800 text-white">
                        {COMPANY_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value} className="font-mono">
                            <div>
                              <div className="font-semibold">{type.label}</div>
                              <div className="text-xs text-zinc-500">{type.desc}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={handleCreateCompany}
                      disabled={creating}
                      className="w-full bg-white text-black hover:bg-gray-200 rounded-none font-mono text-xs uppercase tracking-widest"
                    >
                      {creating ? "Kuruluyor..." : "Şirketi Kur"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {companies.length === 0 ? (
              <Card className="bg-[#121214] border border-zinc-800 rounded-sm p-12">
                <div className="text-center">
                  <Building2 className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                  <h2 className="text-xl font-mono font-semibold text-white mb-2">Henüz şirket yok</h2>
                  <p className="text-sm text-zinc-500 font-mono mb-6">
                    Dijital dünyada ilk şirketinizi kurarak imparatorluğunuzu inşa edin
                  </p>
                  <Button
                    onClick={() => setDialogOpen(true)}
                    className="bg-white text-black hover:bg-gray-200 rounded-none font-mono text-xs uppercase tracking-widest"
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
                    className="bg-[#18181B] border border-zinc-800 rounded-sm overflow-hidden cursor-pointer card-hover"
                    onClick={() => navigate(`/company/${company.company_id}`)}
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
