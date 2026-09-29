import React, { useState, useEffect } from 'react';
import { X, RotateCcw, Check, Sliders, ShieldAlert, RefreshCw, ExternalLink } from 'lucide-react';
import { PricingConfig } from '../types';
import { fetchBcvEuroRate, formatBs, BCV_OFFICIAL_URL, DEFAULT_BCV_EUR_RATE } from '../utils/currency';

interface PricingSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: PricingConfig;
  onSaveConfig: (newConfig: PricingConfig) => void;
  defaultConfig: PricingConfig;
}

export const PricingSettingsModal: React.FC<PricingSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  defaultConfig,
}) => {
  const [formData, setFormData] = useState<PricingConfig>(config);
  const [savedAlert, setSavedAlert] = useState<boolean>(false);
  const [isUpdatingBcv, setIsUpdatingBcv] = useState<boolean>(false);
  const [bcvSuccessMsg, setBcvSuccessMsg] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setFormData(config);
    }
  }, [isOpen, config]);

  if (!isOpen) return null;

  const handleReset = () => {
    setFormData(defaultConfig);
  };

  const handleRefreshBcv = async () => {
    setIsUpdatingBcv(true);
    setBcvSuccessMsg('');
    try {
      const res = await fetchBcvEuroRate();
      if (res && res.rate) {
        setFormData((prev) => ({
          ...prev,
          bcvEurRate: res.rate,
          bcvLastUpdated: res.date || new Date().toISOString().split('T')[0],
        }));
        setBcvSuccessMsg(`¡Tasa actualizada: ${formatBs(res.rate)} / €!`);
        setTimeout(() => setBcvSuccessMsg(''), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdatingBcv(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    setSavedAlert(true);
    setTimeout(() => {
      setSavedAlert(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border-2 border-slate-950 rounded-3xl max-w-xl w-full flex flex-col shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b-2 border-slate-900 flex items-center justify-between bg-[#FEE100]">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-slate-950" />
            <h3 className="text-lg font-black text-slate-950">Ajuste de Tarifas y Parámetros</h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white border-2 border-slate-900 hover:bg-slate-100 flex items-center justify-center font-black cursor-pointer"
          >
            <X className="w-4 h-4 text-slate-950" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-6">
          <p className="text-xs text-slate-600">
            Puedes ajustar temporalmente los precios base por metro o para clientes con tarifas especiales (distribuidores, mayoristas).
          </p>

          {/* DTF Textil Section */}
          <div className="space-y-3 p-4 bg-pink-50/50 border border-pink-200 rounded-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF0088]" />
              <h4 className="text-xs font-black text-pink-900 uppercase tracking-wide">
                Tarifas DTF Textil
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  1. Metro lineal
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    value={formData.textilMeterPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, textilMeterPrice: Number(e.target.value) })
                    }
                    className="w-full text-sm font-bold bg-white border border-slate-300 rounded-xl px-3 py-2 pr-8 focus:outline-none focus:border-slate-900"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    €
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Estándar: 13.00 €</span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  2. Imagen &lt; 150 cm²
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    value={formData.textilIndividualSmallPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, textilIndividualSmallPrice: Number(e.target.value) })
                    }
                    className="w-full text-sm font-bold bg-white border border-slate-300 rounded-xl px-3 py-2 pr-8 focus:outline-none focus:border-slate-900"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    €
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Estándar: 25.00 €</span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  3. Imagen ≥ 150 cm²
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    value={formData.textilIndividualLargePrice}
                    onChange={(e) =>
                      setFormData({ ...formData, textilIndividualLargePrice: Number(e.target.value) })
                    }
                    className="w-full text-sm font-bold bg-white border border-slate-300 rounded-xl px-3 py-2 pr-8 focus:outline-none focus:border-slate-900"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    €
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Estándar: 20.00 €</span>
              </div>
            </div>
          </div>

          {/* DTF UV Section */}
          <div className="space-y-3 p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00D492]" />
              <h4 className="text-xs font-black text-emerald-900 uppercase tracking-wide">
                Tarifas DTF UV
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  1. Metro lineal
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    value={formData.uvMeterPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, uvMeterPrice: Number(e.target.value) })
                    }
                    className="w-full text-sm font-bold bg-white border border-slate-300 rounded-xl px-3 py-2 pr-8 focus:outline-none focus:border-slate-900"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    €
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Estándar: 25.00 €</span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  2. Imagen &lt; 250 cm²
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    value={formData.uvIndividualSmallPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, uvIndividualSmallPrice: Number(e.target.value) })
                    }
                    className="w-full text-sm font-bold bg-white border border-slate-300 rounded-xl px-3 py-2 pr-8 focus:outline-none focus:border-slate-900"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    €
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Estándar: 40.00 €</span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  3. Imagen ≥ 250 cm²
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    value={formData.uvIndividualLargePrice}
                    onChange={(e) =>
                      setFormData({ ...formData, uvIndividualLargePrice: Number(e.target.value) })
                    }
                    className="w-full text-sm font-bold bg-white border border-slate-300 rounded-xl px-3 py-2 pr-8 focus:outline-none focus:border-slate-900"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    €
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Estándar: 35.00 €</span>
              </div>
            </div>
          </div>

          {/* Tasa Oficial BCV */}
          <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Tasa Oficial Banco Central de Venezuela (EUR a Bs.)
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Conversión automática referencial para totales en Bolívares (Bs.)
                </span>
              </div>
              <button
                type="button"
                onClick={handleRefreshBcv}
                disabled={isUpdatingBcv}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-emerald-300 hover:border-emerald-600 rounded-xl text-xs font-bold text-emerald-800 transition-colors cursor-pointer self-start sm:self-auto shadow-2xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isUpdatingBcv ? 'animate-spin text-emerald-600' : ''}`} />
                <span>{isUpdatingBcv ? 'Consultando...' : 'Actualizar tasa BCV'}</span>
              </button>
            </div>

            {bcvSuccessMsg && (
              <div className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>{bcvSuccessMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center pt-1">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Valor de 1 Euro en Bolívares (Bs.)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    value={formData.bcvEurRate}
                    onChange={(e) =>
                      setFormData({ ...formData, bcvEurRate: Math.max(0.01, Number(e.target.value)) })
                    }
                    className="w-full text-sm font-black bg-white border border-slate-300 rounded-xl px-3 py-2 pr-14 focus:outline-none focus:border-slate-900 tabular-nums"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black text-slate-500">
                    Bs./€
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-500 space-y-1">
                <p>
                  Tasa activa: <strong className="text-slate-900">{formatBs(formData.bcvEurRate || DEFAULT_BCV_EUR_RATE)} / €</strong>
                </p>
                <a
                  href={BCV_OFFICIAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline font-semibold inline-flex items-center gap-1 text-[11px]"
                >
                  Ver glosario oficial en bcv.org.ve <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Roll Width */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs font-black text-slate-900 block">Ancho útil de bobina</span>
              <span className="text-[11px] text-slate-500">Impresoras industriales YES DTF</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="10"
                max="160"
                value={formData.rollWidthCm}
                onChange={(e) =>
                  setFormData({ ...formData, rollWidthCm: Number(e.target.value) })
                }
                className="w-20 text-center font-bold bg-white border border-slate-300 rounded-xl py-1.5 focus:outline-none focus:border-slate-900 text-sm"
              />
              <span className="text-xs font-bold text-slate-600">cm</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer py-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restablecer originales
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl border-2 border-slate-950 bg-[#FEE100] hover:bg-[#ebd000] font-black text-xs text-slate-950 flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
            >
              {savedAlert ? <Check className="w-4 h-4 text-emerald-700" /> : null}
              <span>{savedAlert ? '¡Guardado!' : 'Guardar y Aplicar'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
