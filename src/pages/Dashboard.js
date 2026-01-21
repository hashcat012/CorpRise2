import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebase";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
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
        // Firebase üzerinden dashboard verisi çek
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

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#09090B]">
        <div className="text-white font-mono animate-pulse">LOADING DASHBOARD...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen bg-[#09090B] text-white">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <TopBar />
        <div className="flex-1 flex items-center justify-center font-mono text-xl">
          HOŞ GELDİN {user.displayName || "Kullanıcı"}
        </div>
      </div>
    </div>
  );
}
