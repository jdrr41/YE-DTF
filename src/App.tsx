import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LinearMeterCalculator } from './components/LinearMeterCalculator';
import { IndividualImageCalculator } from './components/IndividualImageCalculator';
import { QuoteSummary } from './components/QuoteSummary';
import { BudgetSummaryCard } from './components/BudgetSummaryCard';
import { PricingSettingsModal } from './components/PricingSettingsModal';
import { DTFGuideModal } from './components/DTFGuideModal';
import { Logo } from './components/Logo';
import { DTFType, CalculationMode, PricingConfig, QuoteItem } from './types';
import { Sparkles, Layers, Image as ImageIcon, Ruler, ArrowRight, ShieldCheck, Check, Info } from 'lucide-react';
import { DEFAULT_BCV_EUR_RATE, fetchBcvEuroRate, formatBs, BCV_OFFICIAL_URL } from './utils/currency';

const DEFAULT_CONFIG: PricingConfig = {
  textilMeterPrice: 13, // 13 € / m
  textilIndividualSmallPrice: 25, // 25 € / m (< 150 cm²)
  textilIndividualLargePrice: 20, // 20 € / m (>= 150 cm²)
  textilThresholdArea: 150, // 150 cm²
  uvMeterPrice: 25, // 25 € / m
  uvIndividualSmallPrice: 40, // 40 € / m (< 250 cm²)
  uvIndividualLargePrice: 35, // 35 € / m (>= 250 cm²)
  uvThresholdArea: 250, // 250 cm²
  rollWidthCm: 57, // 57 cm
  bcvEurRate: DEFAULT_BCV_EUR_RATE, // Tasa BCV EUR/VES
  bcvLastUpdated: undefined,
};

export default function App() {
  const [activeDtfType, setActiveDtfType] = useState<DTFType>('textil');
  const [calcMode, setCalcMode] = useState<CalculationMode>('meter');
  
  // Pricing configuration with localStorage persistence
  const [config, setConfig] = useState<PricingConfig>(() => {
    try {
      const saved = localStorage.getItem('yesdtf_pricing_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_CONFIG,
          ...parsed,
          textilIndividualSmallPrice: parsed.textilIndividualSmallPrice ?? parsed.textilIndividualPrice ?? 25,
          textilIndividualLargePrice: parsed.textilIndividualLargePrice ?? 20,
          textilThresholdArea: parsed.textilThresholdArea ?? 150,
          uvIndividualSmallPrice: parsed.uvIndividualSmallPrice ?? parsed.uvIndividualPrice ?? 40,
          uvIndividualLargePrice: parsed.uvIndividualLargePrice ?? 35,
          uvThresholdArea: parsed.uvThresholdArea ?? 250,
          bcvEurRate: parsed.bcvEurRate ?? DEFAULT_BCV_EUR_RATE,
        };
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_CONFIG;
  });

  // Automatically check for latest BCV Euro rate on app mount
  useEffect(() => {
    fetchBcvEuroRate().then((res) => {
      if (res && res.rate) {
        setConfig((prev) => ({
          ...prev,
          bcvEurRate: res.rate,
          bcvLastUpdated: res.date || prev.bcvLastUpdated,
        }));
      }
    });
  }, []);

  // Quote cart items
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>(() => {
    try {
      const saved = localStorage.getItem('yesdtf_quote_items');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Modals state
  const [isQuoteOpen, setIsQuoteOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('yesdtf_pricing_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('yesdtf_quote_items', JSON.stringify(quoteItems));
  }, [quoteItems]);

  const handleAddToQuote = (item: QuoteItem) => {
    setQuoteItems((prev) => [item, ...prev]);
  };

  const handleUpdateQuantity = (id: string, newQty: number) => {
    setQuoteItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const unit = item.unitPrice;
          return {
            ...item,
            quantity: newQty,
            totalPrice: Number((unit * newQty).toFixed(2)),
          };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (id: string) => {
    setQuoteItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearQuote = () => {
    setQuoteItems([]);
  };

  const handleScrollToQuote = () => {
    const el = document.getElementById('resumen-presupuesto');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setIsQuoteOpen(true);
    }
  };

  const isTextil = activeDtfType === 'textil';

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-[#FF0088] selection:text-white">
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeDtfType}
        setActiveTab={setActiveDtfType}
        quoteCount={quoteItems.length}
        bcvRate={config.bcvEurRate}
        onOpenQuote={handleScrollToQuote}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-8 pb-10 sm:pt-12 sm:pb-14 border-b border-slate-200/80 bg-linear-to-b from-yellow-50/50 via-white to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Left Brand intro */}
              <div className="max-w-2xl text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEE100]/40 border border-[#FEE100] text-slate-900 text-xs font-black mb-4">
                  <span className="w-2 h-2 rounded-full bg-[#FF0088] animate-pulse" />
                  <span>CALCULADORA OFICIAL YES DTF</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.08] text-balance">
                  Calcula el precio de tus impresiones{' '}
                  <span className="relative whitespace-nowrap">
                    <span className="text-[#FF0088] relative z-10">DTF Textil</span>
                  </span>{' '}
                  y{' '}
                  <span className="text-[#00B87C]">DTF UV</span>
                </h1>

                <p className="mt-4 text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-xl">
                  Cotiza al instante por <strong className="text-slate-900 font-bold">metro lineal</strong> continuo o por <strong className="text-slate-900 font-bold">imagen individual</strong>. Si imprimes con nosotros el armado de la mesa es <strong className="text-emerald-600 font-black">GRATIS</strong>.
                </p>

                {/* Quick specs pill row */}
                <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-bold text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-600 font-bold text-sm">✓</span>
                    <span>Ancho estándar 57 cm</span>
                  </div>
                  <span className="text-slate-300">·</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-600 font-bold text-sm">✓</span>
                    <span>Calidad 300 DPI CMYK + Blanco</span>
                  </div>
                  <span className="text-slate-300">·</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-600 font-bold text-sm">✓</span>
                    <span>Sin bordes blancos en semitonos</span>
                  </div>
                </div>
              </div>

              {/* Right Big Emblem */}
              <div className="shrink-0 flex flex-col items-center">
                <div className="relative p-3 bg-white rounded-full border-4 border-slate-950 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] hover:rotate-2 transition-transform duration-300">
                  <Logo size={140} />
                </div>
                <span className="mt-3 text-xs font-black text-slate-400 uppercase tracking-widest">
                  YES DTF · PRINT STUDIO
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Calculator Container */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          {/* Step 1: Selector for DTF Type (Textil vs UV) */}
          <div className="mb-8">
            <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-3">
              1. Selecciona el Tipo de Tecnología DTF
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option DTF Textil */}
              <button
                type="button"
                onClick={() => setActiveDtfType('textil')}
                className={`relative p-5 rounded-2xl border-2 transition-all text-left flex items-start justify-between cursor-pointer ${
                  activeDtfType === 'textil'
                    ? 'border-slate-950 bg-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] ring-2 ring-pink-500/20'
                    : 'border-slate-200 bg-slate-50/70 hover:border-slate-400 hover:bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-3 h-3 rounded-full bg-[#FF0088]" />
                    <h3 className="text-xl font-black text-slate-950">DTF Textil</h3>
                  </div>
                  <p className="text-xs text-slate-600">
                    Para prendas, camisetas, sudaderas, bolsas de tela, gorras y textiles de algodón o sintéticos.
                  </p>
                </div>

                <div
                  className={`w-6 h-6 rounded-full border-2 border-slate-900 flex items-center justify-center shrink-0 ${
                    activeDtfType === 'textil' ? 'bg-[#FEE100]' : 'bg-white'
                  }`}
                >
                  {activeDtfType === 'textil' && <span className="w-2.5 h-2.5 rounded-full bg-slate-950" />}
                </div>
              </button>

              {/* Option DTF UV */}
              <button
                type="button"
                onClick={() => setActiveDtfType('uv')}
                className={`relative p-5 rounded-2xl border-2 transition-all text-left flex items-start justify-between cursor-pointer ${
                  activeDtfType === 'uv'
                    ? 'border-slate-950 bg-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-slate-50/70 hover:border-slate-400 hover:bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-3 h-3 rounded-full bg-[#00D492]" />
                    <h3 className="text-xl font-black text-slate-950">DTF UV (Rígidos)</h3>
                  </div>
                  <p className="text-xs text-slate-600">
                    Adhesivo de alta resistencia curado UV para tazas, termos, botellas, madera, metal, plástico y vidrio.
                  </p>
                </div>

                <div
                  className={`w-6 h-6 rounded-full border-2 border-slate-900 flex items-center justify-center shrink-0 ${
                    activeDtfType === 'uv' ? 'bg-[#FEE100]' : 'bg-white'
                  }`}
                >
                  {activeDtfType === 'uv' && <span className="w-2.5 h-2.5 rounded-full bg-slate-950" />}
                </div>
              </button>
            </div>
          </div>

          {/* Step 2: Mode Selector (Por Metro vs Por Imagen Individual) */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-wider">
                2. Modo de Cálculo
              </label>

              <span className="text-xs font-bold text-slate-600">
                Tecnología activa:{' '}
                <strong className={isTextil ? 'text-[#FF0088]' : 'text-emerald-700'}>
                  {isTextil ? 'DTF Textil' : 'DTF UV'}
                </strong>
              </span>
            </div>

            <div className="inline-flex w-full sm:w-auto p-1.5 bg-slate-100 border-2 border-slate-900 rounded-2xl gap-2 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
              <button
                type="button"
                onClick={() => setCalcMode('meter')}
                className={`flex-1 sm:flex-initial px-5 py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                  calcMode === 'meter'
                    ? 'bg-[#FEE100] text-slate-950 shadow-sm border-2 border-slate-900'
                    : 'text-slate-700 hover:text-slate-900 border-2 border-transparent'
                }`}
              >
                <Ruler className="w-4 h-4" />
                <span>1. Por Metro de Largo (Mesa)</span>
              </button>

              <button
                type="button"
                onClick={() => setCalcMode('individual')}
                className={`flex-1 sm:flex-initial px-5 py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                  calcMode === 'individual'
                    ? 'bg-[#FF0088] text-white shadow-sm border-2 border-slate-900'
                    : 'text-slate-700 hover:text-slate-900 border-2 border-transparent'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>2. Por Imagen Individual (Alto × Ancho)</span>
              </button>
            </div>
          </div>

          {/* Active Calculator Component */}
          <div className="transition-all duration-200">
            {calcMode === 'meter' ? (
              <LinearMeterCalculator
                dtfType={activeDtfType}
                config={config}
                onAddToQuote={handleAddToQuote}
              />
            ) : (
              <IndividualImageCalculator
                dtfType={activeDtfType}
                config={config}
                onAddToQuote={handleAddToQuote}
              />
            )}
          </div>
        </section>

        {/* Cuadro Resumen de Presupuesto */}
        <BudgetSummaryCard
          items={quoteItems}
          bcvRate={config.bcvEurRate}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearAll={handleClearQuote}
        />
      </main>

      {/* Floating Quote Trigger (Bottom bar if items exist) */}
      {quoteItems.length > 0 && (
        <aside aria-label="Resumen de presupuesto" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-md">
          <div className="bg-slate-950 text-white rounded-2xl p-3 sm:p-4 border-2 border-[#FEE100] shadow-[6px_6px_0px_0px_rgba(254,225,0,1)] flex items-center justify-between gap-3 animate-in slide-in-from-bottom-4 duration-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#FF0088] text-white text-[11px] font-black px-2 py-0.5 rounded-full">
                  {quoteItems.length} {quoteItems.length === 1 ? 'partida' : 'partidas'}
                </span>
                <span className="text-xs font-semibold text-slate-400">Total presupuestado</span>
              </div>
              <div className="text-base sm:text-lg font-black text-[#FEE100] tabular-nums mt-0.5">
                {quoteItems.reduce((acc, i) => acc + i.totalPrice, 0).toFixed(2)} €{' '}
                <span className="text-emerald-400 font-extrabold text-xs sm:text-sm">
                  ({formatBs(quoteItems.reduce((acc, i) => acc + i.totalPrice, 0) * (config.bcvEurRate || DEFAULT_BCV_EUR_RATE))})
                </span>{' '}
                <span className="text-[10px] font-normal text-slate-400">sin IVA</span>
              </div>
            </div>

            <button
              onClick={handleScrollToQuote}
              className="px-4 py-2.5 bg-[#FEE100] text-slate-950 rounded-xl font-black text-xs sm:text-sm hover:bg-yellow-300 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <span>Ver Presupuesto</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Logo size={28} />
            <span className="font-black text-slate-900">YES DTF</span>
            <span>· Calculadora Profesional de Impresión Textil & UV</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="hover:text-slate-950 transition-colors cursor-pointer"
            >
              Guía de Preparación
            </button>
            <span>·</span>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="hover:text-slate-950 transition-colors cursor-pointer"
            >
              Tarifas
            </button>
            <span>·</span>
            <button
              onClick={() => setIsQuoteOpen(true)}
              className="hover:text-slate-950 transition-colors cursor-pointer"
            >
              Presupuesto
            </button>
          </div>

          <p className="text-[11px] text-slate-400">
            © {new Date().getFullYear()} YES DTF. Todos los derechos reservados.
          </p>
        </div>
      </footer>

      {/* Modals */}
      <QuoteSummary
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        items={quoteItems}
        bcvRate={config.bcvEurRate}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearAll={handleClearQuote}
      />

      <PricingSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onSaveConfig={setConfig}
        defaultConfig={DEFAULT_CONFIG}
      />

      <DTFGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
