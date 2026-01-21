import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
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
        <div className="text-white font-mono animate-pulse">
          LOADING DASHBOARD...
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#09090B] text-white">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <TopBar />
        <div className="flex-1 flex items-center justify-center font-mono text-xl">
          HOŞ GELDİN {user?.displayName || "Kullanıcı"}
        </div>
      </div>
    </div>
  );
}