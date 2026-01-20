import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, LineChart, Swords, Trophy, TrendingUp, User, Briefcase } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: LineChart, label: 'Dashboard' },
    { path: '/companies', icon: Building2, label: 'Şirketler' },
    { path: '/moves', icon: Briefcase, label: 'Hamleler' },
    { path: '/pvp', icon: Swords, label: 'PvP Arena' },
    { path: '/leaderboard', icon: Trophy, label: 'Liderlik Tablosu' },
    { path: '/market', icon: TrendingUp, label: 'Pazar' },
    { path: '/profile', icon: User, label: 'Profil' },
  ];

  return (
    <div className="w-64 h-screen bg-[#121214] border-r border-zinc-800 fixed left-0 top-0 flex flex-col" data-testid="sidebar">
      <div className="p-6 border-b border-zinc-800">
        <h1 className="text-2xl font-mono font-bold uppercase tracking-tighter text-white" data-testid="app-title">
          TITANOS
        </h1>
        <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wider" data-testid="app-subtitle">Business Empire</p>
      </div>

      <nav className="flex-1 p-4 space-y-1" data-testid="sidebar-nav">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              className={`flex items-center gap-3 px-4 py-3 rounded-none text-sm font-mono uppercase tracking-wider transition-all duration-150 ${
                isActive
                  ? 'bg-white text-black'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <div className="text-xs text-zinc-600 uppercase tracking-wider font-mono" data-testid="version-info">
          v1.0.0 - MVP
        </div>
      </div>
    </div>
  );
}