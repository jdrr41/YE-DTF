import React, { useState } from 'react';
import { LayoutGrid, Sparkles, Flame, Plus, Check } from 'lucide-react';
import { DTFType, QuoteItem } from '../types';
import { formatBs, DEFAULT_BCV_EUR_RATE } from '../utils/currency';

interface AdditionalServicesCardProps {
  dtfType: DTFType;
  bcvRate?: number;
  onAddItem: (item: QuoteItem) => void;
}

interface ServiceDef {
  id: string;
  title: string;
  tagline: string;
  description: string;
  priceEur: number;
  unitLabel: string;
  icon: React.ReactNode;
  accentBg: string;
  highlightNote?: string;
}

export const AdditionalServicesCard: React.FC<AdditionalServicesCardProps> = ({
  dtfType,
  bcvRate = DEFAULT_BCV_EUR_RATE,
  onAddItem,
}) => {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({
    mesa: 1,
    semitonos: 1,
    planchado: 1,
  });

  const [addedAnimation, setAddedAnimation] = useState<{ [key: string]: boolean }>({});

  const services: ServiceDef[] = [
    {
      id: 'mesa',
      title: 'Armado de Mesa de Trabajo',
      tagline: 'Optimización y vectorización profesional',
      description:
        'Si no imprimes con nosotros pero necesitas que te armen la mesa de trabajo en tiempo récord, nosotros lo hacemos por ti. Mejoramos la resolución de la imagen, las vectorizamos y las organizamos optimizando el espacio para que tu impresión cueste lo menos posible.',
      priceEur: 3.0,
      unitLabel: 'por mesa de trabajo',
      icon: <LayoutGrid className="w-5 h-5 text-indigo-600" />,
      accentBg: 'bg-indigo-50 border-indigo-200 text-indigo-900',
      highlightNote: '¡Si imprimes con nosotros el armado de la mesa es GRATIS!',
    },
    {
      id: 'semitonos',
      title: 'Diseños de Semitonos',
      tagline: 'Eliminación de fondos y efecto transpirable',
      description:
        '¿Tienes una imagen de calidad fotográfica y quieres quitarle el fondo? Nosotros lo hacemos por ti. Mejora la transpiración: Deja espacios libres de tinta para que pase el aire y la prenda respire. Reduce el efecto "parche": Evita que los estampados grandes se sientan rígidos, duros o plastificados al tacto.',
      priceEur: 1.5,
      unitLabel: 'por imagen',
      icon: <Sparkles className="w-5 h-5 text-pink-600" />,
      accentBg: 'bg-pink-50 border-pink-200 text-pink-900',
    },
    {
      id: 'planchado',
      title: 'Servicio de Planchado',
      tagline: 'Fijación térmica industrial de alta durabilidad',
      description:
        'Deja de perder clientes por planchar tus DTF con la plancha casera y evita el riesgo de que tus estampados se despeguen, nosotros lo hacemos por ti con plancha profesional neumática de calor uniforme.',
      priceEur: 0.5,
      unitLabel: 'por planchado',
      icon: <Flame className="w-5 h-5 text-amber-600" />,
      accentBg: 'bg-amber-50 border-amber-200 text-amber-900',
    },
  ];

  const handleQuantityChange = (serviceId: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [serviceId]: Math.max(1, (prev[serviceId] || 1) + delta),
    }));
  };

  const handleAddService = (service: ServiceDef) => {
    const qty = quantities[service.id] || 1;
    const item: QuoteItem = {
      id: `service-${service.id}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      dtfType,
      mode: 'service',
      title: service.title,
      description: `${service.unitLabel} • ${service.tagline}`,
      dimensionsText: `${qty} ${qty === 1 ? 'servicio' : 'servicios'} (${service.unitLabel})`,
      quantity: qty,
      unitPrice: service.priceEur,
      totalPrice: service.priceEur * qty,
      timestamp: Date.now(),
    };

    onAddItem(item);

    setAddedAnimation((prev) => ({ ...prev, [service.id]: true }));
    setTimeout(() => {
      setAddedAnimation((prev) => ({ ...prev, [service.id]: false }));
    }, 1400);
  };

  return (
    <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#FEE100] border-2 border-slate-900 flex items-center justify-center font-black text-slate-950 shadow-2xs">
            <Sparkles className="w-4 h-4 text-slate-950" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-950 tracking-tight uppercase">
              Servicios adicionales
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Servicios complementarios de diseño, optimización y estampado
            </p>
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="space-y-3.5">
        {services.map((service) => {
          const qty = quantities[service.id] || 1;
          const totalCostEur = service.priceEur * qty;
          const totalCostBs = totalCostEur * bcvRate;
          const isAdded = addedAnimation[service.id];

          return (
            <div
              key={service.id}
              className="bg-slate-50/70 hover:bg-slate-50 border border-slate-200 hover:border-slate-400 rounded-xl p-3.5 transition-all space-y-2.5"
            >
              {/* Title & Price Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1.5">
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-white border border-slate-200 shadow-2xs mt-0.5">
                    {service.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 leading-snug">
                      {service.title}
                    </h4>
                    <span className="text-[11px] text-slate-500 font-semibold block">
                      {service.tagline}
                    </span>
                  </div>
                </div>

                <div className="text-left sm:text-right pl-9 sm:pl-0">
                  <div className="inline-flex items-baseline gap-1.5">
                    <span className="text-sm sm:text-base font-black text-slate-950 tabular-nums">
                      {service.priceEur.toFixed(2)} €
                    </span>
                    <span className="text-xs font-black text-emerald-700 tabular-nums">
                      ≈ {formatBs(service.priceEur * bcvRate)}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block">
                    {service.unitLabel}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed pl-0 sm:pl-1">
                {service.description}
              </p>

              {/* Highlight promo note if any */}
              {service.highlightNote && (
                <div className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1 flex items-center gap-1.5">
                  <span className="text-xs">💡</span>
                  <span>{service.highlightNote}</span>
                </div>
              )}

              {/* Action row: Quantity & Add Button */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-500">Cantidad:</span>
                  <div className="inline-flex items-center bg-white border border-slate-300 rounded-lg p-0.5 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(service.id, -1)}
                      disabled={qty <= 1}
                      className="w-6 h-6 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 rounded disabled:opacity-40 disabled:hover:bg-transparent text-xs cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-7 text-center font-mono font-bold text-xs text-slate-900 tabular-nums">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(service.id, 1)}
                      className="w-6 h-6 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 rounded text-xs cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleAddService(service)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs border-2 transition-all cursor-pointer shadow-2xs ${
                    isAdded
                      ? 'bg-emerald-500 text-white border-emerald-600'
                      : 'bg-white hover:bg-slate-900 text-slate-900 hover:text-white border-slate-900 active:scale-95'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>¡Añadido!</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>
                        Añadir ({totalCostEur.toFixed(2)} €)
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
