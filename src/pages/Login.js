import React, { useEffect } from 'react';
import { Building2, TrendingUp, Users, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth, provider, listenAuth, signInWithGoogleRedirect } from '@/firebase';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    listenAuth(() => navigate('/dashboard'));
  }, [navigate]);

  return (
    <div className="h-screen w-screen bg-[#09090B] flex items-center justify-center relative overflow-hidden" data-testid="login-page">
      {/* Background image */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1762429648253-b8bc921c8b30?crop=entropy&cs=srgb&fm=jpg&q=85)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 max-w-md w-full px-8">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-mono font-bold uppercase tracking-tighter text-white mb-4" data-testid="login-title">
            TITANOS
          </h1>
          <p className="text-zinc-400 text-sm uppercase tracking-wider font-mono" data-testid="login-subtitle">
            Business Empire Simulation
          </p>
        </div>

        <div className="bg-[#121214] border border-zinc-800 p-8 rounded-sm">
          <h2 className="text-2xl font-mono font-semibold text-white mb-6 uppercase tracking-tight" data-testid="login-heading">
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
            onClick={signInWithGoogleRedirect}
            className="w-full bg-white text-black hover:bg-gray-200 rounded-none font-mono text-xs uppercase tracking-widest py-6 btn-hover"
            data-testid="google-login-button"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google ile Giriş Yap
          </Button>

          <p className="text-xs text-zinc-600 text-center mt-6 font-mono" data-testid="login-disclaimer">
            Giriş yaparak kullanım koşullarını kabul ediyorsunuz
          </p>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-zinc-600 uppercase tracking-wider font-mono" data-testid="login-version">
            Alpha v1.0 - MVP
          </p>
        </div>
      </div>
    </div>
  );
}