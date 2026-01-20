import React from "react";
import { Building2, TrendingUp, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/firebase";

export default function Login() {

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // navigate("/dashboard") kaldırıldı, ProtectedRoute yönlendirecek
    } catch (error) {
      console.error("Firebase Google Login Error:", error);
    }
  };

  return (
    <div
      className="h-screen w-screen bg-[#09090B] flex items-center justify-center relative overflow-hidden"
      data-testid="login-page"
    >
      {/* Background */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1762429648253-b8bc921c8b30?crop=entropy&cs=srgb&fm=jpg&q=85)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 max-w-md w-full px-8">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-mono font-bold uppercase tracking-tighter text-white mb-4">
            TITANOS
          </h1>
          <p className="text-zinc-400 text-sm uppercase tracking-wider font-mono">
            Business Empire Simulation
          </p>
        </div>

        <div className="bg-[#121214] border border-zinc-800 p-8 rounded-sm">
          <h2 className="text-2xl font-mono font-semibold text-white mb-6 uppercase tracking-tight">
            Dijital Dünyada Girişimci Ol
          </h2>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 text-zinc-300">
              <Building2 className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-mono">5 Farklı Şirket Türü</span>
            </div>
            <div className="flex items-center gap-3 text-zinc-300">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-sm font-mono">Derin Ekonomi Simülasyonu</span>
            </div>
            <div className="flex items-center gap-3 text-zinc-300">
              <Users className="w-5 h-5 text-red-500" />
              <span className="text-sm font-mono">PvP Ekonomik Rekabet</span>
            </div>
            <div className="flex items-center gap-3 text-zinc-300">
              <Award className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-mono">Lig & Sezon Sistemi</span>
            </div>
          </div>

          <Button
            onClick={handleGoogleLogin}
            className="w-full bg-white text-black hover:bg-gray-200 rounded-none font-mono text-xs uppercase tracking-widest py-6 btn-hover"
            data-testid="google-login-button"
          >
            Google ile Giriş Yap
          </Button>

          <p className="text-xs text-zinc-600 text-center mt-6 font-mono">
            Giriş yaparak kullanım koşullarını kabul ediyorsunuz
          </p>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-zinc-600 uppercase tracking-wider font-mono">
            Alpha v1.0 - MVP
          </p>
        </div>
      </div>
    </div>
  );
}