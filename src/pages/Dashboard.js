import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebase";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, TrendingUp, TrendingDown, Building2, DollarSign, Activity, Plus } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        try {
          const docRef = doc(db, "users", u.uid, "dashboard", "main");
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) setDashboard(docSnap.data());
        } catch (err) {
          console.error("Dashboard fetch error:", err);
        }
      } else {
        navigate("/login", { replace: true });
      }
      setLoading(false);
    });
    return () => unsub();
  }, [navigate]);

  if (loading) return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#09090B]">
      <div className="text-white font-mono text-sm uppercase tracking-widest animate-pulse">LOADING DASHBOARD...</div>
    </div>
  );

  if (!user || !dashboard) return null;

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
                <h1 className="text-4xl font-mono font-bold uppercase tracking-tight text-white">Dashboard</h1>
                <p className="text-sm text-zinc-500 mt-1 font-mono uppercase tracking-wider">İş İmparatorluğunuza Genel Bakış</p>
              </div>
              <Button onClick={() => navigate('/companies')} className="bg-white text-black hover:bg-gray-200 rounded-none font-mono text-xs uppercase tracking-widest btn-hover">
                <Plus className="w-4 h-4 mr-2" />
                Yeni Şirket Kur
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

