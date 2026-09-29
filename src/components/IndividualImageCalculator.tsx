import React, { useState } from 'react';
import { Plus, Check, Scissors, ExternalLink } from 'lucide-react';
import { DTFType, PricingConfig, QuoteItem } from '../types';
import { RollVisualizer } from './RollVisualizer';
import { formatBs, BCV_OFFICIAL_URL } from '../utils/currency';
import { AdditionalServicesCard } from './AdditionalServicesCard';

interface IndividualImageCalculatorProps {
  dtfType: DTFType;
  config: PricingConfig;
  onAddToQuote: (item: QuoteItem) => void;
}

export const IndividualImageCalculator: React.FC<IndividualImageCalculatorProps> = ({
  dtfType,
  config,
  onAddToQuote,
}) => {
  const isTextil = dtfType === 'textil';

  const [heightInput, setHeightInput] = useState<string>('15');
  const [widthInput, setWidthInput] = useState<string>('15');
  const [quantity, setQuantity] = useState<number>(1);
  const [customName, setCustomName] = useState<string>('');
  const [addedAnimation, setAddedAnimation] = useState<boolean>(false);

  const heightCm = parseFloat(heightInput) || 0;
  const widthCm = parseFloat(widthInput) || 0;
  const isZero = heightCm <= 0 || widthCm <= 0;

  // Separation options: 2.5 mm, 5 mm, 1 cm (10 mm)
  const [marginMm, setMarginMm] = useState<number>(2.5);
  const marginPerSideCm = marginMm / 10;
  const totalMarginCm = Number((marginPerSideCm * 2).toFixed(2));
  const marginLabel = marginMm === 10 ? '1 cm' : `${marginMm} mm`;

  const rollWidth = config.rollWidthCm; // 57 cm

  // Dynamic pricing based on image area (alto * ancho):
  // DTF Textil: < 150 cm² -> 25 €/m | >= 150 cm² -> 20 €/m
  // DTF UV: < 250 cm² -> 40 €/m | >= 250 cm² -> 35 €/m
  const imageArea = Number((heightCm * widthCm).toFixed(2));
  const thresholdArea = isTextil ? config.textilThresholdArea : config.uvThresholdArea;
  const isLarge = imageArea >= thresholdArea;

  const basePricePerMeter = isTextil
    ? (isLarge ? config.textilIndividualLargePrice : config.textilIndividualSmallPrice)
    : (isLarge ? config.uvIndividualLargePrice : config.uvIndividualSmallPrice);

  // Effective dimensions including separation on all sides:
  const effectiveHeight = Number((heightCm + totalMarginCm).toFixed(2));
  const effectiveWidth = Number((widthCm + totalMarginCm).toFixed(2));

  // Exact step-by-step formula:
  // Step 1: (basePricePerMeter / 100) * effectiveHeight
  // Step 2: (Step 1 / 57) * effectiveWidth
  const step1 = (basePricePerMeter / 100) * effectiveHeight;
  const singleImageCost = isZero ? 0 : (step1 / rollWidth) * effectiveWidth;
  const totalCost = singleImageCost * quantity;

  const handleDimensionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void
  ) => {
    let clean = e.target.value.replace(/[^0-9.,]/g, '').replace(',', '.');
    const parts = clean.split('.');
    if (parts.length > 2) {
      clean = parts[0] + '.' + parts.slice(1).join('');
    }
    if (clean === '' || clean.trim() === '') {
      e.target.value = '0';
      setter('0');
      return;
    }
    if (clean.length > 1 && clean.startsWith('0') && !clean.startsWith('0.')) {
      clean = clean.replace(/^0+/, '') || '0';
    }
    e.target.value = clean;
    setter(clean);
  };

  const handleDimensionBlur = (
    currentVal: string,
    setter: (val: string) => void
  ) => {
    if (currentVal.endsWith('.')) {
      setter(currentVal.slice(0, -1) || '0');
    } else if (!currentVal || isNaN(Number(currentVal))) {
      setter('0');
    }
  };

  const separationOptions = [
    { value: 2.5, label: '2.5 mm' },
    { value: 5, label: '5 mm' },
    { value: 10, label: '1 cm' },
  ];

  // Presets
  const presets = isTextil
    ? [
        { label: 'Logo Pecho', w: 10, h: 10 },
        { label: 'Bolsillo / Manga', w: 8, h: 5 },
        { label: 'Frontal A4', w: 21, h: 29.7 },
        { label: 'Espalda A3', w: 28, h: 40 },
      ]
    : [
        { label: 'Logo Taza / Vaso', w: 8, h: 8 },
        { label: 'Sticker Bolígrafo / Mechero', w: 5, h: 1.5 },
        { label: 'Etiqueta Botella', w: 12, h: 7 },
        { label: 'Placa / Señal A5', w: 14.8, h: 21 },
      ];

  const handleAdd = () => {
    if (heightCm <= 0 || widthCm <= 0) return;

    const itemTitle = customName.trim()
      ? customName.trim()
      : `Imagen ${isTextil ? 'DTF Textil' : 'DTF UV'} ${widthCm}×${heightCm} cm`;

    const newItem: QuoteItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      dtfType,
      mode: 'individual',
      title: itemTitle,
      description: `Diseño ${widthCm}×${heightCm} cm (+${marginLabel} corte perimetral = ${effectiveWidth}×${effectiveHeight} cm)`,
      dimensionsText: `${widthCm} × ${heightCm} cm (+${marginLabel} corte: ${effectiveWidth} × ${effectiveHeight} cm)`,
      quantity,
      unitPrice: Number(singleImageCost.toFixed(2)),
      totalPrice: Number(totalCost.toFixed(2)),
      timestamp: Date.now(),
    };

    onAddToQuote(newItem);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1400);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Input Form */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
          {/* Header */}
          <div className="pb-6 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-[#FF0088]" />
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Impresión por Imagen Individual
              </h3>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Con <strong className="text-pink-700 font-bold">{marginLabel} de separación</strong> de corte en todos los lados (bobina {rollWidth} cm)
            </p>
          </div>

          {/* Separation Badge Banner */}
          <div className="mt-6 p-3.5 bg-pink-50/80 border-2 border-pink-300 rounded-2xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-pink-600 text-white flex items-center justify-center shrink-0">
                <Scissors className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-black text-slate-900 block">
                  Separación de {marginLabel} en todos los lados aplicada
                </span>
                <span className="text-[11px] text-pink-900">
                  +{marginPerSideCm} cm en cada lado (+{totalMarginCm} cm en total por cota)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {separationOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setMarginMm(opt.value)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    marginMm === opt.value
                      ? 'bg-pink-600 text-white border-pink-600 font-black shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-slate-800'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="pt-4">
            <span className="text-xs font-bold text-slate-600 mb-2 block">
              Tamaños estándar frecuentes del diseño:
            </span>
            <div className="flex flex-wrap gap-2">
              {presets.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    setWidthInput(String(p.w));
                    setHeightInput(String(p.h));
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border-2 transition-all cursor-pointer ${
                    widthCm === p.w && heightCm === p.h
                      ? 'bg-[#FF0088] border-slate-900 text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                      : 'bg-white border-slate-300 text-slate-700 hover:border-slate-900'
                  }`}
                >
                  {p.label} ({p.w}×{p.h}cm)
                </button>
              ))}
            </div>
          </div>

          {/* The 2 Primary Input Boxes: ALTO and ANCHO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4">
            {/* Box 1: ALTO en cm */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="heightCm" className="block text-sm font-black text-slate-900">
                  1. ALTO del diseño (cm)
                </label>
                <span className="text-xs font-bold text-pink-700 bg-pink-100 px-2 py-0.5 rounded">
                  Corte: {effectiveHeight} cm
                </span>
              </div>
              <div className="relative">
                <input
                  id="heightCm"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  value={heightInput}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => handleDimensionChange(e, setHeightInput)}
                  onBlur={() => handleDimensionBlur(heightInput, setHeightInput)}
                  className="w-full text-2xl font-black text-slate-900 bg-slate-50 border-2 border-slate-900 rounded-2xl px-4 py-3 focus:bg-white focus:outline-none focus:ring-4 focus:ring-pink-200 transition-all tabular-nums"
                  placeholder="0"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400 bg-slate-200 px-2 py-0.5 rounded">
                  cm
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                {heightCm} cm diseño + {marginPerSideCm} cm sup. + {marginPerSideCm} cm inf. = <strong>{effectiveHeight} cm</strong>
              </p>
            </div>

            {/* Box 2: ANCHO en cm */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="widthCm" className="block text-sm font-black text-slate-900">
                  2. ANCHO del diseño (cm)
                </label>
                <span className="text-xs font-bold text-pink-700 bg-pink-100 px-2 py-0.5 rounded">
                  Corte: {effectiveWidth} cm
                </span>
              </div>
              <div className="relative">
                <input
                  id="widthCm"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  value={widthInput}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => handleDimensionChange(e, setWidthInput)}
                  onBlur={() => handleDimensionBlur(widthInput, setWidthInput)}
                  className="w-full text-2xl font-black text-slate-900 bg-slate-50 border-2 border-slate-900 rounded-2xl px-4 py-3 focus:bg-white focus:outline-none focus:ring-4 focus:ring-pink-200 transition-all tabular-nums"
                  placeholder="0"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400 bg-slate-200 px-2 py-0.5 rounded">
                  cm
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                {widthCm} cm diseño + {marginPerSideCm} cm izq. + {marginPerSideCm} cm dcha. = <strong>{effectiveWidth} cm</strong>
              </p>
            </div>
          </div>

          {/* Secondary Controls: Quantity & Custom Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-200 mt-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Cantidad de unidades a imprimir
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
              <div className="flex gap-1.5 mt-2">
                {[1, 5, 10, 25, 50].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setQuantity(q)}
                    className={`px-2 py-1 text-[11px] font-bold rounded border cursor-pointer ${
                      quantity === q
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-100 text-slate-600 border-slate-300'
                    }`}
                  >
                    {q} uds
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Referencia o Nombre del diseño
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Ej. Logo Club Deportivo"
                className="w-full text-sm font-semibold text-slate-900 bg-slate-50 border-2 border-slate-900 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Total Price & Add Action */}
          <div className="mt-8 pt-6 border-t-2 border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Total para {quantity} {quantity === 1 ? 'unidad' : 'unidades'}
                </span>
                {quantity > 1 && (
                  <span className="text-xs font-bold text-pink-700 bg-pink-100 px-2 py-0.5 rounded-full">
                    {singleImageCost.toFixed(2)} €/ud ({formatBs(singleImageCost * (config.bcvEurRate || 976.90))})
                  </span>
                )}
              </div>
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
                  : 'bg-[#FF0088] hover:bg-[#d60072] text-white border-slate-950 cursor-pointer shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-5 h-5 text-slate-950" />
                  <span>¡Añadido al presupuesto!</span>
                </>
              ) : (
                <>
                  <Plus className={`w-5 h-5 ${isZero ? 'text-slate-400' : 'text-white'}`} />
                  <span>Añadir a Presupuesto</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Visualizer */}
      <div className="lg:col-span-5 space-y-6">
        <RollVisualizer
          dtfType={dtfType}
          mode="individual"
          rollWidthCm={rollWidth}
          imageWidthCm={widthCm}
          imageHeightCm={heightCm}
          marginMm={marginMm}
          quantity={quantity}
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
