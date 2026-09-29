import React from 'react';
import { Layers, Maximize2, Sparkles, Grid, Scissors } from 'lucide-react';
import { DTFType } from '../types';

interface RollVisualizerProps {
  dtfType: DTFType;
  mode: 'meter' | 'individual';
  rollWidthCm: number;
  // Meter mode props
  meterLengthCm?: number;
  // Individual image props
  imageWidthCm?: number;
  imageHeightCm?: number;
  marginMm?: number;
  quantity?: number;
}

export const RollVisualizer: React.FC<RollVisualizerProps> = ({
  dtfType,
  mode,
  rollWidthCm = 57,
  meterLengthCm = 100,
  imageWidthCm = 20,
  imageHeightCm = 20,
  marginMm = 2.5,
  quantity = 1,
}) => {
  const isTextil = dtfType === 'textil';
  const accentColor = isTextil ? '#FF0088' : '#00C887';
  const badgeBg = isTextil ? 'bg-pink-50 text-pink-700 border-pink-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200';

  if (mode === 'meter') {
    const meters = (meterLengthCm / 100).toFixed(2);
    const areaM2 = ((rollWidthCm * meterLengthCm) / 10000).toFixed(2);

    return (
      <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FEE100] border-2 border-slate-950 flex items-center justify-center font-black text-xs text-slate-900">
              57
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900">Mesa de Trabajo en Bobina</h4>
              <p className="text-xs text-slate-500">Ancho fijo de impresión: {rollWidthCm} cm</p>
            </div>
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${badgeBg}`}>
            {isTextil ? 'DTF Textil' : 'DTF UV'}
          </span>
        </div>

        {/* Scaled Roll Canvas Graphic */}
        <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-4 relative overflow-hidden flex flex-col items-center justify-center">
          {/* Top ruler: 57 cm */}
          <div className="w-full max-w-md flex items-center justify-between text-[11px] font-mono font-bold text-slate-500 mb-1 border-b border-slate-300 pb-1">
            <span>0 cm</span>
            <span className="bg-slate-900 text-white px-2 py-0.5 rounded text-[10px]">
              Ancho útil: {rollWidthCm} cm
            </span>
            <span>{rollWidthCm} cm</span>
          </div>

          {/* Roll area simulated */}
          <div
            className="w-full max-w-md bg-white border-2 border-slate-900 rounded-lg p-3 relative shadow-inner overflow-hidden min-h-[140px] flex flex-col justify-between"
            style={{
              backgroundImage: 'radial-gradient(#e2e8f0 1.5px, transparent 1.5px)',
              backgroundSize: '16px 16px',
            }}
          >
            {/* Header banner inside canvas */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 border-b border-slate-200 pb-2">
              <span className="flex items-center gap-1.5">
                <Grid className="w-3.5 h-3.5 text-slate-400" />
                Bobina continua
              </span>
              <span className="font-mono text-slate-900 bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                Largo: {meterLengthCm} cm ({meters} m)
              </span>
            </div>

            {/* Visual simulation of DTF Gang Sheet layout */}
            <div className="py-4 flex flex-wrap gap-2 items-center justify-center">
              <div 
                className="px-4 py-3 rounded-lg border-2 border-slate-900 font-extrabold text-xs text-white shadow-sm flex flex-col items-center justify-center transition-all"
                style={{ backgroundColor: accentColor }}
              >
                <span>MESA DE CLIENTE</span>
                <span className="text-[10px] font-mono opacity-90">{rollWidthCm} cm × {meterLengthCm} cm</span>
              </div>
            </div>

            {/* Bottom linear specs */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200">
              <span>Superficie total: <strong className="text-slate-800">{areaM2} m²</strong></span>
              <span>Aprovechamiento: <strong className="text-emerald-700">100% Mesa Continua</strong></span>
            </div>
          </div>
        </div>

        {/* Tip footer */}
        <p className="mt-3 text-xs text-slate-500 leading-relaxed">
          💡 <strong>Recomendación de taller:</strong> En esta mesa de {rollWidthCm} × {meterLengthCm} cm puedes colocar todos los diseños que quieras optimizados a 300 DPI y fondo transparente.
        </p>
      </div>
    );
  }

  // Mode: Individual Image
  const marginCm = marginMm / 10;
  const marginLabel = marginMm === 10 ? '1 cm' : `${marginMm} mm`;
  const marginTag = marginMm === 10 ? '+1cm' : `+${marginMm}mm`;
  const safeBaseWidth = Math.max(0.5, imageWidthCm);
  const safeBaseHeight = Math.max(0.5, imageHeightCm);

  // Effective dimensions including margin on all 4 sides (top, bottom, left, right)
  const effectiveWidth = Number((safeBaseWidth + (marginCm * 2)).toFixed(2));
  const effectiveHeight = Number((safeBaseHeight + (marginCm * 2)).toFixed(2));

  // How many fit per row of 57 cm taking into account the perimeter separation
  const itemsPerRow = Math.max(1, Math.floor(rollWidthCm / effectiveWidth));
  // How many rows fit in 100 cm (1 meter)
  const rowsPerMeter = Math.max(1, Math.floor(100 / effectiveHeight));
  // Total images per meter
  const totalPerMeter = itemsPerRow * rowsPerMeter;

  // Linear length required for selected quantity
  const totalRowsRequired = Math.ceil(quantity / itemsPerRow);
  const totalLengthNeededCm = Number((totalRowsRequired * effectiveHeight).toFixed(1));

  return (
    <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#FF0088] text-white flex items-center justify-center font-black text-xs">
            IMG
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900">Aprovechamiento en Bobina 57 cm</h4>
            <p className="text-xs text-slate-500">
              Diseño: {safeBaseWidth} × {safeBaseHeight} cm · <strong className="text-pink-700 font-bold">+{marginLabel} margen/lado</strong>
            </p>
          </div>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${badgeBg}`}>
          {isTextil ? 'DTF Textil' : 'DTF UV'}
        </span>
      </div>

      {/* Interactive visualizer */}
      <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-4">
        {/* Metric summary pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-3">
          <div className="bg-white border border-slate-200 rounded-lg p-2.5 text-center">
            <span className="block text-[11px] font-medium text-slate-500">Caben por fila</span>
            <span className="text-base font-black text-slate-900">{itemsPerRow} uds</span>
            <span className="block text-[10px] text-slate-400">en {rollWidthCm} cm con corte</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-2.5 text-center">
            <span className="block text-[11px] font-medium text-slate-500">Caben en 1 metro</span>
            <span className="text-base font-black text-[#FF0088]">{totalPerMeter} uds</span>
            <span className="block text-[10px] text-slate-400">100 × 57 cm</span>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-white border border-slate-200 rounded-lg p-2.5 text-center">
            <span className="block text-[11px] font-medium text-slate-500">Largo para {quantity} uds</span>
            <span className="text-base font-black text-slate-900">{totalLengthNeededCm} cm</span>
            <span className="block text-[10px] text-slate-400">{totalRowsRequired} fila(s) de corte</span>
          </div>
        </div>

        {/* Visual 57cm bed simulation */}
        <div
          className="bg-white border-2 border-slate-900 rounded-lg p-3 relative overflow-hidden"
          style={{
            backgroundImage: 'radial-gradient(#e2e8f0 1.5px, transparent 1.5px)',
            backgroundSize: '14px 14px',
          }}
        >
          <div className="flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-200 pb-1.5 mb-2 font-mono">
            <span>◄ 0 cm</span>
            <span className="font-bold text-slate-800">ANCHO BOBINA 57 cm (Área corte {effectiveWidth}×{effectiveHeight} cm)</span>
            <span>57 cm ►</span>
          </div>

          {/* Graphical preview of image tiles with cut separation line */}
          <div className="flex flex-wrap gap-1.5 justify-start">
            {Array.from({ length: Math.min(quantity, Math.max(itemsPerRow, 8)) }).map((_, idx) => (
              <div
                key={idx}
                className="relative rounded-lg p-1.5 border-2 border-dashed border-pink-400 bg-pink-50/60 shadow-xs flex flex-col items-center justify-center transition-transform hover:scale-105"
                style={{
                  minWidth: `${Math.min(96, Math.max(54, Math.floor(280 / itemsPerRow)))}px`,
                  minHeight: '52px',
                }}
              >
                {/* Visual design inside cut margin */}
                <div className="w-full h-full bg-[#FEE100] border-2 border-slate-900 rounded p-1 flex flex-col items-center justify-center text-slate-950 font-black text-[10px]">
                  <span>#{idx + 1}</span>
                  <span className="text-[9px] opacity-80">{safeBaseWidth}×{safeBaseHeight}</span>
                </div>
                {/* Cut badge tag */}
                <span className="absolute -top-1.5 -right-1 bg-pink-600 text-white text-[8px] font-mono px-1 rounded-full font-bold">
                  {marginTag}
                </span>
              </div>
            ))}
            {quantity > 8 && (
              <div className="border border-dashed border-slate-400 rounded-lg bg-slate-100 text-slate-500 font-bold text-[10px] p-2 flex items-center justify-center min-w-[60px]">
                +{quantity - 8} más
              </div>
            )}
          </div>
        </div>

        {/* Separation Legend */}
        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 bg-white p-2 rounded-lg border border-slate-200">
          <div className="flex items-center gap-1.5">
            <Scissors className="w-3.5 h-3.5 text-pink-600" />
            <span>Separación perimetral aplicada: <strong>{marginLabel}</strong> ({marginCm} cm / lado)</span>
          </div>
          <span className="font-mono text-slate-700 font-bold">
            Área con corte: {effectiveWidth} × {effectiveHeight} cm
          </span>
        </div>
      </div>

      {effectiveWidth > rollWidthCm && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2">
          <span>⚠️</span>
          <span>El ancho con separación ({effectiveWidth} cm) supera el ancho del rollo ({rollWidthCm} cm). Reduce dimensiones del diseño.</span>
        </div>
      )}
    </div>
  );
};
