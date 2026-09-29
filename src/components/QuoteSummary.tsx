import React, { useState } from 'react';
import { Trash2, Copy, Check, Send, Printer, X, Plus, Minus, ArrowRight, ExternalLink } from 'lucide-react';
import { QuoteItem } from '../types';
import { Logo } from './Logo';
import { formatBs, BCV_OFFICIAL_URL, DEFAULT_BCV_EUR_RATE } from '../utils/currency';

interface QuoteSummaryProps {
  isOpen: boolean;
  onClose: () => void;
  items: QuoteItem[];
  bcvRate?: number;
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
}

export const QuoteSummary: React.FC<QuoteSummaryProps> = ({
  isOpen,
  onClose,
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

  if (!isOpen) return null;

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
    if (clientName) text += `Cliente: ${clientName}\n`;
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
    text += `\n*Tasa referencial Banco Central de Venezuela (BCV):*\n`;
    text += `1 € = ${formatBs(bcvRate)} (${BCV_OFFICIAL_URL})\n`;
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border-2 border-slate-950 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b-2 border-slate-900 flex items-center justify-between bg-[#FEE100]">
          <div className="flex items-center gap-3">
            <Logo size={42} />
            <div>
              <h2 className="text-xl font-black text-slate-950">Presupuesto de Impresión</h2>
              <p className="text-xs font-bold text-slate-800">
                {items.length} {items.length === 1 ? 'partida calculada' : 'partidas calculadas'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-white border-2 border-slate-900 hover:bg-slate-100 flex items-center justify-center font-black cursor-pointer transition-transform active:scale-95"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5 text-slate-950" />
          </button>
        </div>

        {/* Content area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Optional Client Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Nombre del Cliente o Empresa (opcional)
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ej. Tienda Camisetas SL"
                className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-slate-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                WhatsApp del Cliente (opcional con prefijo país)
              </label>
              <input
                type="text"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="Ej. 34612345678"
                className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-slate-900"
              />
            </div>
          </div>

          {/* Items List */}
          {items.length === 0 ? (
            <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-2xl">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                📦
              </div>
              <h3 className="text-base font-black text-slate-800">Tu presupuesto está vacío</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Calcula cualquier medida en DTF Textil o DTF UV y pulsa "Añadir a Presupuesto" para agregarlo aquí.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Volver a la calculadora
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border-2 border-slate-200 hover:border-slate-900 rounded-2xl p-4 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                          item.dtfType === 'textil'
                            ? 'bg-pink-50 text-pink-700 border-pink-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {item.dtfType === 'textil' ? 'DTF Textil' : 'DTF UV'}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500">
                        {item.mode === 'meter'
                          ? 'Metro lineal (57 cm ancho)'
                          : item.mode === 'service'
                          ? 'Servicio adicional'
                          : 'Imagen individual'}
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-500">{item.description}</p>
                    <p className="text-xs font-mono font-bold text-slate-700">
                      Medidas: {item.dimensionsText}
                    </p>
                  </div>

                  {/* Quantity & Price */}
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-black tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right min-w-[100px]">
                      <div className="text-xs text-slate-500 tabular-nums">
                        {item.unitPrice.toFixed(2)} €/ud
                      </div>
                      <div className="text-base font-black text-slate-950 tabular-nums">
                        {item.totalPrice.toFixed(2)} €
                      </div>
                      <div className="text-[11px] font-bold text-emerald-700 tabular-nums">
                        ≈ {formatBs(item.totalPrice * bcvRate)}
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Eliminar partida"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pricing calculations footer */}
          {items.length > 0 && (
            <div className="bg-slate-50 border-2 border-slate-900 rounded-2xl p-5 space-y-3">
              <div className="flex justify-between items-center text-sm font-semibold text-slate-600">
                <span>Subtotal (Base Imponible)</span>
                <div className="text-right">
                  <span className="font-mono font-bold text-slate-900 text-base tabular-nums">
                    {subtotal.toFixed(2)} €
                  </span>
                  <div className="text-xs font-bold text-emerald-700">
                    ≈ {formatBs(subtotal * bcvRate)}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-slate-600 pt-2 border-t border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer font-bold select-none">
                  <input
                    type="checkbox"
                    checked={includeIva}
                    onChange={(e) => setIncludeIva(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#FF0088] focus:ring-[#FF0088]"
                  />
                  <span>Aplicar 16% IVA</span>
                </label>
                <div className="text-right">
                  <span className="font-mono text-slate-700 tabular-nums">
                    {includeIva ? `${ivaAmount.toFixed(2)} €` : '0,00 €'}
                  </span>
                  {includeIva && (
                    <div className="text-xs font-bold text-emerald-700">
                      ≈ {formatBs(ivaAmount * bcvRate)}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-2 pt-3 border-t-2 border-slate-900 text-slate-950">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase block">
                    Total Presupuesto
                  </span>
                  <span className="text-xs text-slate-500">
                    {includeIva ? 'IVA (16%) incluido' : 'Base sin impuestos'}
                  </span>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-3xl sm:text-4xl font-black text-slate-950 tabular-nums">
                    {grandTotal.toFixed(2)} €
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-600 tabular-nums">
                    ≈ {formatBs(grandTotal * bcvRate)}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-1 text-[11px] text-slate-500">
                <span>Tasa oficial BCV: <strong className="text-slate-700">1 € = {formatBs(bcvRate)}</strong></span>
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
          )}
        </div>

        {/* Footer Actions */}
        {items.length > 0 && (
          <div className="px-6 py-4 bg-slate-100 border-t-2 border-slate-900 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={onClearAll}
              className="text-xs font-bold text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1.5 cursor-pointer py-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Vaciar presupuesto
            </button>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-3.5 py-2.5 rounded-xl border-2 border-slate-900 bg-white font-black text-xs text-slate-900 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir / PDF</span>
              </button>

              <button
                onClick={handleCopy}
                className="px-3.5 py-2.5 rounded-xl border-2 border-slate-900 bg-white font-black text-xs text-slate-900 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? '¡Copiado!' : 'Copiar Texto'}</span>
              </button>

              <button
                onClick={handleWhatsApp}
                className="px-4 py-2.5 rounded-xl border-2 border-slate-950 bg-[#00E5AA] hover:bg-[#00c994] font-black text-xs text-slate-950 flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
              >
                <Send className="w-4 h-4" />
                <span>Enviar por WhatsApp</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
