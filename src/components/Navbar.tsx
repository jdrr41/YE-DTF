import React from 'react';
import { Logo } from './Logo';
import { Sliders, BookOpen, ShoppingBag, Sparkles, ExternalLink } from 'lucide-react';
import { DTFType } from '../types';
import { formatBs, BCV_OFFICIAL_URL } from '../utils/currency';

interface NavbarProps {
  activeTab: DTFType;
  setActiveTab: (tab: DTFType) => void;
  quoteCount: number;
  bcvRate?: number;
  onOpenQuote: () => void;
  onOpenSettings: () => void;
  onOpenGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  quoteCount,
  bcvRate,
  onOpenQuote,
  onOpenSettings,
  onOpenGuide,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Zone 1: Single Brand Zone */}
        <div className="flex items-center gap-3">
          <Logo size={46} />
          <a
            href="#"
            className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-1.5"
          >
            <span>YES</span>
            <span className="text-[#FF0088] underline decoration-4 decoration-[#FEE100] underline-offset-4">
              DTF
            </span>
          </a>
        </div>

        {/* Zone 2: Navigation links / active modes */}
        <nav className="hidden md:flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveTab('textil')}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'textil'
                ? 'bg-white text-slate-950 shadow-sm border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${activeTab === 'textil' ? 'bg-[#FF0088]' : 'bg-slate-300'}`} />
            DTF Textil
          </button>

          <button
            onClick={() => setActiveTab('uv')}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'uv'
                ? 'bg-white text-slate-950 shadow-sm border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${activeTab === 'uv' ? 'bg-[#00D492]' : 'bg-slate-300'}`} />
            DTF UV
          </button>

          <div className="w-px h-5 bg-slate-300 mx-1" />

          <button
            onClick={onOpenGuide}
            className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-white/60 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Guía Archivos
          </button>

          <button
            onClick={onOpenSettings}
            className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-white/60 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            Tarifas
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2.5">
          {/* BCV Exchange Rate Badge */}
          {bcvRate && bcvRate > 0 && (
            <a
              href={BCV_OFFICIAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              title="Tasa oficial de cambio del Banco Central de Venezuela (EUR a Bs.)"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-300 hover:border-slate-900 transition-all text-xs font-bold text-slate-800 cursor-pointer shadow-2xs"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Tasa BCV:</span>
              <strong className="text-emerald-700 font-extrabold">{formatBs(bcvRate)} / €</strong>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          )}

          {/* Mobile switcher */}
          <div className="flex md:hidden items-center bg-slate-100 p-0.5 rounded-lg mr-1">
            <button
              onClick={() => setActiveTab('textil')}
              className={`px-2.5 py-1.5 text-xs font-bold rounded-md ${
                activeTab === 'textil' ? 'bg-[#FEE100] text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Textil
            </button>
            <button
              onClick={() => setActiveTab('uv')}
              className={`px-2.5 py-1.5 text-xs font-bold rounded-md ${
                activeTab === 'uv' ? 'bg-[#FEE100] text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              UV
            </button>
          </div>

          <button
            onClick={onOpenQuote}
            className="relative px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-950 bg-[#FEE100] hover:bg-[#ebd000] border-2 border-slate-950 rounded-xl transition-all shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center gap-2 whitespace-nowrap cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-slate-900" />
            <span className="hidden sm:inline">Presupuesto</span>
            {quoteCount > 0 && (
              <span className="inline-flex items-center justify-center bg-[#FF0088] text-white text-[11px] font-black w-5 h-5 rounded-full">
                {quoteCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
