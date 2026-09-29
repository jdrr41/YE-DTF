import React, { useState } from 'react';
import { 
  FileText, 
  Trash2, 
  Copy, 
  Check, 
  Send, 
  Printer, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Sparkles,
  Scissors,
  Ruler,
  ExternalLink
} from 'lucide-react';
import { QuoteItem } from '../types';
import { formatBs, BCV_OFFICIAL_URL, DEFAULT_BCV_EUR_RATE } from '../utils/currency';

interface BudgetSummaryCardProps {
  items: QuoteItem[];
  bcvRate?: number;
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
}

export const BudgetSummaryCard: React.FC<BudgetSummaryCardProps> = ({
  items,
  bcvRate = DEFAULT_BCV_EUR_RATE,
  onUpdateQuantity,
  onRemoveItem,
  onClearAll,
}) => {
  const [includeIva, setIncludeIva] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');

  const subtotal = items.reduce((acc, item) => acc + item.totalPrice, 0);
  const ivaAmount = includeIva ? subtotal * 0.16 : 0;
  const grandTotal = subtotal + ivaAmount;

  const generateQuoteText = () => {
    const dateStr = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    let text = `*PRESUPUESTO YES DTF*\n`;
    text += `Fecha: ${dateStr}\n`;
    if (clientName.trim()) text += `Cliente: ${clientName.trim()}\n`;
    text += `--------------------------------\n`;

    items.forEach((item, index) => {
      text += `${index + 1}. *${item.title}*\n`;
      const modeLabel = item.mode === 'meter' ? 'Metro lineal' : item.mode === 'service' ? 'Servicio adicional' : 'Imagen individual';
      text += `   Tipo: ${item.dtfType.toUpperCase()} | Modo: ${modeLabel}\n`;
      text += `   Medidas: ${item.dimensionsText}\n`;
      text += `   Cantidad: ${item.quantity} ud(s) × ${item.unitPrice.toFixed(2)} € (${formatBs(item.unitPrice * bcvRate)}) = *${item.totalPrice.toFixed(2)} €* (*${formatBs(item.totalPrice * bcvRate)}*)\n\n`;
    });

    text += `--------------------------------\n`;
    text += `Subtotal: ${subtotal.toFixed(2)} € (${formatBs(subtotal * bcvRate)})\n`;
    if (includeIva) {
      text += `IVA (16%): ${ivaAmount.toFixed(2)} € (${formatBs(ivaAmount * bcvRate)})\n`;
      text += `*TOTAL CON IVA (16%): ${grandTotal.toFixed(2)} €*\n`;
      text += `*TOTAL EN BOLÍVARES: ${formatBs(grandTotal * bcvRate)}*\n`;
    } else {
      text += `*TOTAL (Base imponible): ${grandTotal.toFixed(2)} €*\n`;
      text += `*TOTAL EN BOLÍVARES: ${formatBs(grandTotal * bcvRate)}*\n`;
    }
    text += `\n*Tasa de cambio referencial Banco Central de Venezuela (BCV):*\n`;
    text += `1 € = ${formatBs(bcvRate)} (Fuente: ${BCV_OFFICIAL_URL})\n`;
    text += `\n*Condiciones YES DTF:*\n`;
    text += `• Archivos en PDF/PNG sin fondo a 300 DPI en CMYK.\n`;
    text += `• Ancho de bobina útil: 57 cm.\n`;
    text += `• ¡Gracias por confiar en YES DTF!`;

    return text;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateQuoteText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(generateQuoteText());
    const phone = clientPhone.replace(/\D/g, '');
    const url = phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="resumen-presupuesto" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
      <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FEE100] border-2 border-slate-900 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
              <FileText className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                  Cuadro Resumen de Presupuesto
                </h3>
                <span className="bg-[#FF0088] text-white text-xs font-black px-2.5 py-0.5 rounded-full">
                  {items.length} {items.length === 1 ? 'partida' : 'partidas'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Consolidado de tus trabajos calculados en bobinas de 57 cm
              </p>
            </div>
          </div>

          {items.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClearAll}
                className="px-3.5 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Vaciar presupuesto</span>
              </button>
            </div>
          )}
        </div>

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="py-12 px-4 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-yellow-50 border-2 border-dashed border-[#FEE100] text-slate-400 mx-auto flex items-center justify-center mb-4">
              <ShoppingBag className="w-8 h-8 text-slate-400" />
            </div>
            <h4 className="text-base font-black text-slate-900 mb-1">
              Tu presupuesto está vacío
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              Selecciona arriba la tecnología (<strong>DTF Textil</strong> o <strong>DTF UV</strong>), introduce las medidas de tu mesa o imagen y pulsa en <strong>"Añadir a Presupuesto"</strong> para ver el desglose aquí.
            </p>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-[11px] font-bold text-slate-600">
              <Sparkles className="w-3.5 h-3.5 text-[#FF0088]" />
              <span>Puedes combinar partidas por metros y por imágenes sueltas</span>
            </div>
          </div>
        ) : (
          <div className="pt-6 space-y-6">
            {/* Optional Client Information Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nombre del Cliente o Empresa (opcional)
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ej. Tienda Camisetas / Cliente Particular"
                  className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  WhatsApp del Cliente (opcional para envío directo)
                </label>
                <input
                  type="text"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="Ej. 34612345678 (con código país)"
                  className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-slate-900"
                />
              </div>
            </div>

            {/* Items Table / Cards */}
            <div className="overflow-x-auto border-2 border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-100 border-b-2 border-slate-200 text-slate-600 font-black uppercase text-[11px]">
                    <th className="py-3 px-4">Partida / Trabajo</th>
                    <th className="py-3 px-4">Medidas</th>
                    <th className="py-3 px-4 text-center">Cantidad</th>
                    <th className="py-3 px-4 text-right">Precio Ud. (€ / Bs.)</th>
                    <th className="py-3 px-4 text-right">Total (€ / Bs.)</th>
                    <th className="py-3 px-3 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {items.map((item) => {
                    const isTextil = item.dtfType === 'textil';
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-black text-slate-950 text-sm">{item.title}</div>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1">
                            <span
                              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                                isTextil
                                  ? 'bg-pink-50 text-pink-700 border-pink-200'
                                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              }`}
                            >
                              {isTextil ? 'DTF Textil' : 'DTF UV'}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
                              {item.mode === 'meter' ? (
                                <>
                                  <Ruler className="w-2.5 h-2.5" />
                                  <span>Por metro</span>
                                </>
                              ) : item.mode === 'service' ? (
                                <>
                                  <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                                  <span>Servicio adicional</span>
                                </>
                              ) : (
                                <>
                                  <Scissors className="w-2.5 h-2.5 text-[#FF0088]" />
                                  <span>Imagen individual</span>
                                </>
                              )}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-xs text-slate-700">
                          {item.dimensionsText}
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-300">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="w-7 h-7 rounded-lg bg-white border border-slate-300 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-800 cursor-pointer"
                              title="Restar"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center font-black text-slate-900 tabular-nums text-xs">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 rounded-lg bg-white border border-slate-300 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-800 cursor-pointer"
                              title="Sumar"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-right tabular-nums">
                          <div className="font-bold text-slate-800">{item.unitPrice.toFixed(2)} €</div>
                          <div className="text-[11px] font-bold text-emerald-700">{formatBs(item.unitPrice * bcvRate)}</div>
                        </td>

                        <td className="py-3.5 px-4 text-right tabular-nums">
                          <div className="font-black text-slate-950 text-base">{item.totalPrice.toFixed(2)} €</div>
                          <div className="text-xs font-black text-emerald-700">{formatBs(item.totalPrice * bcvRate)}</div>
                        </td>

                        <td className="py-3.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.id)}
                            className="w-8 h-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer"
                            title="Eliminar partida"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Financial Totals & Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end pt-2">
              {/* Left Column: Fast Action Buttons */}
              <div className="lg:col-span-6 flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="px-5 py-3 rounded-2xl bg-[#00D492] hover:bg-[#00bb80] text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar por WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-4 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm flex items-center gap-2 border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer transition-all"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700 font-black">¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-700" />
                      <span>Copiar texto</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm flex items-center gap-2 border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer transition-all"
                >
                  <Printer className="w-4 h-4 text-slate-700" />
                  <span>Imprimir / PDF</span>
                </button>
              </div>

              {/* Right Column: Calculations Breakdown */}
              <div className="lg:col-span-6 bg-slate-50 border-2 border-slate-900 rounded-2xl p-5 space-y-3">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="font-semibold text-slate-600">Subtotal (Base imponible):</span>
                  <div className="text-right">
                    <span className="font-black text-slate-900 tabular-nums">
                      {subtotal.toFixed(2)} €
                    </span>
                    <div className="text-xs font-bold text-emerald-700">
                      ≈ {formatBs(subtotal * bcvRate)}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs sm:text-sm pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 font-semibold">
                    <input
                      type="checkbox"
                      checked={includeIva}
                      onChange={(e) => setIncludeIva(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-[#FF0088] focus:ring-[#FF0088] cursor-pointer"
                    />
                    <span>Aplicar IVA (16%)</span>
                  </label>
                  <div className="text-right">
                    <span className="font-bold text-slate-700 tabular-nums">
                      {includeIva ? `${ivaAmount.toFixed(2)} €` : '0,00 €'}
                    </span>
                    {includeIva && (
                      <div className="text-xs font-bold text-emerald-700">
                        ≈ {formatBs(ivaAmount * bcvRate)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t-2 border-slate-300 flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-2">
                  <div>
                    <span className="block text-xs font-black uppercase text-slate-500 tracking-wider">
                      Total {includeIva ? 'con IVA (16%)' : 'sin IVA'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {items.reduce((acc, i) => acc + i.quantity, 0)} unidades en {items.length} partida(s)
                    </span>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-3xl sm:text-4xl font-black text-slate-950 tabular-nums">
                      {grandTotal.toFixed(2)} €
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-emerald-600 tabular-nums">
                      ≈ {formatBs(grandTotal * bcvRate)}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-1 text-[11px] text-slate-500">
                  <span>Tasa referencial BCV: <strong className="text-slate-700">1 € = {formatBs(bcvRate)}</strong></span>
                  <a
                    href={BCV_OFFICIAL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline font-semibold inline-flex items-center gap-0.5"
                  >
                    Banco Central de Venezuela <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
