import React, { useState } from 'react';
import { Plus, Check, ExternalLink } from 'lucide-react';
import { DTFType, PricingConfig, QuoteItem } from '../types';
import { RollVisualizer } from './RollVisualizer';
import { formatBs, BCV_OFFICIAL_URL } from '../utils/currency';
import { AdditionalServicesCard } from './AdditionalServicesCard';

interface LinearMeterCalculatorProps {
  dtfType: DTFType;
  config: PricingConfig;
  onAddToQuote: (item: QuoteItem) => void;
}

export const LinearMeterCalculator: React.FC<LinearMeterCalculatorProps> = ({
  dtfType,
  config,
  onAddToQuote,
}) => {
  const [lengthInput, setLengthInput] = useState<string>('100');
  const [quantity, setQuantity] = useState<number>(1);
  const [customName, setCustomName] = useState<string>('');
  const [addedAnimation, setAddedAnimation] = useState<boolean>(false);

  const lengthCm = parseFloat(lengthInput) || 0;
  const isZero = lengthCm <= 0;

  const isTextil = dtfType === 'textil';
  const basePricePerMeter = isTextil ? config.textilMeterPrice : config.uvMeterPrice;
  const rollWidth = config.rollWidthCm;

  // Exact formula from user:
  // (basePrice / 100) * lengthCm
  const pricePerCm = basePricePerMeter / 100;
  const singleUnitCost = pricePerCm * lengthCm;
  const totalCost = singleUnitCost * quantity;

  const quickPresets = [50, 100, 150, 200, 300, 500];

  const handleLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let clean = e.target.value.replace(/[^0-9.,]/g, '').replace(',', '.');
    const parts = clean.split('.');
    if (parts.length > 2) {
      clean = parts[0] + '.' + parts.slice(1).join('');
    }
    if (clean === '' || clean.trim() === '') {
      e.target.value = '0';
      setLengthInput('0');
      return;
    }
    if (clean.length > 1 && clean.startsWith('0') && !clean.startsWith('0.')) {
      clean = clean.replace(/^0+/, '') || '0';
    }
    e.target.value = clean;
    setLengthInput(clean);
  };

  const handleLengthBlur = () => {
    if (lengthInput.endsWith('.')) {
      setLengthInput(lengthInput.slice(0, -1) || '0');
    } else if (!lengthInput || isNaN(Number(lengthInput))) {
      setLengthInput('0');
    }
  };

  const handleAdd = () => {
    if (lengthCm <= 0) return;

    const itemTitle = customName.trim()
      ? customName.trim()
      : `Mesa ${isTextil ? 'DTF Textil' : 'DTF UV'} ${lengthCm} cm`;

    const newItem: QuoteItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      dtfType,
      mode: 'meter',
      title: itemTitle,
      description: `Mesa continua de ${rollWidth} cm de ancho × ${lengthCm} cm de largo`,
      dimensionsText: `${rollWidth} × ${lengthCm} cm (${(lengthCm / 100).toFixed(2)} m)`,
      quantity,
      unitPrice: Number(singleUnitCost.toFixed(2)),
      totalPrice: Number(totalCost.toFixed(2)),
      timestamp: Date.now(),
    };

    onAddToQuote(newItem);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1400);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Form Controls */}
      <div className="lg:col-span-7 space-y-6">
        {/* Main Card */}
        <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
          {/* Card Header */}
          <div className="pb-6 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-[#FFE600] border border-slate-900" />
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Impresión por Metro Lineal
              </h3>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Ancho de rollo estándar: <strong className="text-slate-900 font-bold">{rollWidth} cm</strong>
            </p>
          </div>

          {/* Input: Largo en cm */}
          <div className="pt-6 space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="lengthCm" className="block text-sm font-black text-slate-900">
                Medida de la mesa de trabajo (Largo en cm)
              </label>
              <span className="text-xs font-semibold text-slate-500">
                = {(lengthCm / 100).toFixed(2)} metros
              </span>
            </div>

            <div className="relative">
              <input
                id="lengthCm"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={lengthInput}
                onFocus={(e) => e.target.select()}
                onChange={handleLengthChange}
                onBlur={handleLengthBlur}
                className="w-full text-2xl sm:text-3xl font-black text-slate-900 bg-slate-50 border-2 border-slate-900 rounded-2xl px-5 py-3.5 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FEE100]/50 transition-all tabular-nums"
                placeholder="0"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                <span className="text-sm font-black text-slate-500 bg-slate-200/80 px-2.5 py-1 rounded-lg">
                  CENTÍMETROS (cm)
                </span>
              </div>
            </div>

            {/* Quick Presets Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-bold text-slate-500 mr-1">Rápidos:</span>
              {quickPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setLengthInput(String(preset))}
                  className={`px-3 py-1.5 text-xs font-extrabold rounded-lg border-2 transition-all cursor-pointer ${
                    lengthCm === preset
                      ? 'bg-[#FEE100] border-slate-900 text-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                      : 'bg-white border-slate-300 text-slate-700 hover:border-slate-900'
                  }`}
                >
                  {preset} cm ({preset / 100}m)
                </button>
              ))}
            </div>
          </div>

          {/* Secondary Controls: Quantity & Custom Tag */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-200 mt-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Número de tiradas / copias iguales
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-xl border-2 border-slate-900 bg-white font-black text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer text-lg"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-full text-center font-black text-slate-900 bg-slate-50 border-2 border-slate-900 rounded-xl py-2 focus:bg-white focus:outline-none tabular-nums"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-xl border-2 border-slate-900 bg-white font-black text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer text-lg"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Nombre de referencia (opcional)
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Ej. Colección Verano 2026"
                className="w-full text-sm font-semibold text-slate-900 bg-slate-50 border-2 border-slate-900 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Total Price & Add Button */}
          <div className="mt-8 pt-6 border-t-2 border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Total estimado {quantity > 1 && `(${quantity} unidades)`}
              </span>
              <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 mt-1">
                <span className="text-3xl sm:text-4xl font-black text-slate-950 tabular-nums">
                  {totalCost.toFixed(2)} €
                </span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-600 tabular-nums">
                  ≈ {formatBs(totalCost * (config.bcvEurRate || 976.90))}
                </span>
              </div>
              <div className="text-xs text-slate-500 font-semibold mt-1">
                sin IVA ({ (totalCost * 1.16).toFixed(2) } € / {formatBs(totalCost * 1.16 * (config.bcvEurRate || 976.90))} con 16% IVA)
              </div>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <span>Tasa BCV: <strong className="text-slate-600">{formatBs(config.bcvEurRate || 976.90)} / €</strong></span>
                <a
                  href={BCV_OFFICIAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline font-semibold ml-1 inline-flex items-center gap-0.5"
                >
                  (bcv.org.ve) <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              disabled={isZero}
              className={`w-full sm:w-auto px-6 py-4 rounded-2xl font-black text-base transition-all flex items-center justify-center gap-2 border-2 ${
                isZero
                  ? 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed shadow-none'
                  : addedAnimation
                  ? 'bg-emerald-400 text-slate-950 border-slate-950 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]'
                  : 'bg-[#FEE100] hover:bg-[#edd200] text-slate-950 border-slate-950 cursor-pointer shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-5 h-5 text-slate-950" />
                  <span>¡Añadido al presupuesto!</span>
                </>
              ) : (
                <>
                  <Plus className={`w-5 h-5 ${isZero ? 'text-slate-400' : 'text-slate-950'}`} />
                  <span>Añadir a Presupuesto</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Visualizer & Specs */}
      <div className="lg:col-span-5 space-y-6">
        <RollVisualizer
          dtfType={dtfType}
          mode="meter"
          rollWidthCm={rollWidth}
          meterLengthCm={lengthCm}
        />

        {/* Cuadro de Servicios adicionales */}
        <AdditionalServicesCard
          dtfType={dtfType}
          bcvRate={config.bcvEurRate}
          onAddItem={onAddToQuote}
        />
      </div>
    </div>
  );
};
