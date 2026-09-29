import React from 'react';
import { X, CheckCircle2, Flame, Sparkles, AlertTriangle, FileCheck } from 'lucide-react';
import { Logo } from './Logo';

interface DTFGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DTFGuideModal: React.FC<DTFGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border-2 border-slate-950 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b-2 border-slate-900 flex items-center justify-between bg-[#FEE100]">
          <div className="flex items-center gap-3">
            <Logo size={36} />
            <div>
              <h3 className="text-lg font-black text-slate-950">Guía Técnica YES DTF</h3>
              <p className="text-xs font-bold text-slate-800">Preparación de archivos y aplicación</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white border-2 border-slate-900 hover:bg-slate-100 flex items-center justify-center font-black cursor-pointer"
          >
            <X className="w-4 h-4 text-slate-950" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-xs sm:text-sm">
          {/* File Requirements */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-[#FF0088]" />
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                1. Requisitos para enviar tus archivos
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
                <span className="font-extrabold text-slate-900 block text-xs">Formato & Resolución</span>
                <p className="text-xs text-slate-600">
                  PNG sin fondo, PDF vectorial o TIFF a <strong>300 DPI</strong> de resolución real al 100% de tamaño.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
                <span className="font-extrabold text-slate-900 block text-xs">Modo de Color</span>
                <p className="text-xs text-slate-600">
                  Modo <strong>CMYK</strong> (o RGB convirtiendo perfiles). No añadir base blanca: nuestras máquinas generan la capa blanca automáticamente.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
                <span className="font-extrabold text-slate-900 block text-xs">Fondo 100% Transparente</span>
                <p className="text-xs text-slate-600">
                  Asegúrate de eliminar fondos blancos o halos semitransparentes para que no se imprima poliamida indeseada.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
                <span className="font-extrabold text-slate-900 block text-xs">Grosor Mínimo de Trazo</span>
                <p className="text-xs text-slate-600">
                  Líneas de al menos <strong>0.5 mm (1.5 - 2 pt)</strong> para garantizar adherencia perfecta en DTF Textil y <strong>0.3 mm</strong> en UV.
                </p>
              </div>

              <div className="sm:col-span-2 bg-pink-50 border border-pink-200 rounded-xl p-3.5 space-y-1">
                <span className="font-extrabold text-pink-900 block text-xs">Separación de Corte en Imágenes Individuales</span>
                <p className="text-xs text-pink-950">
                  Para pedidos por imagen suelta, la calculadora añade automáticamente <strong>2,5 milímetros de separación por cada imagen en todos los lados (+0,5 cm total en ancho y alto)</strong> para permitir el corte limpio con guillotina o tijera sin dañar la estampación.
                </p>
              </div>
            </div>
          </div>

          {/* Application Instructions */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500" />
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                2. Parámetros de Planchado: DTF Textil
              </h4>
            </div>

            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-2 text-xs text-amber-950">
              <div className="grid grid-cols-3 gap-2 text-center pb-2 border-b border-amber-200">
                <div>
                  <span className="block text-[10px] text-amber-800 uppercase font-bold">Temperatura</span>
                  <strong className="text-sm font-black text-slate-900">150°C - 160°C</strong>
                </div>
                <div>
                  <span className="block text-[10px] text-amber-800 uppercase font-bold">Tiempo</span>
                  <strong className="text-sm font-black text-slate-900">12 a 15 seg.</strong>
                </div>
                <div>
                  <span className="block text-[10px] text-amber-800 uppercase font-bold">Presión</span>
                  <strong className="text-sm font-black text-slate-900">Media - Alta</strong>
                </div>
              </div>
              <p className="text-[11px] leading-relaxed pt-1">
                ✓ <strong>Despegue:</strong> Esperar a que el film esté frío al tacto (cold peel). Retirar suavemente.<br />
                ✓ <strong>Segundo planchado de fijación:</strong> Planchar 5 segundos adicionales con papel siliconado o teflón para un tacto extra suave y máxima durabilidad al lavado.
              </p>
            </div>
          </div>

          {/* UV Application */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                3. Aplicación: DTF UV (Adhesivo para rígidos)
              </h4>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-2 text-xs text-emerald-950">
              <p className="leading-relaxed">
                1. <strong>Limpieza previa:</strong> Limpiar la superficie rígida (taza, termo, madera, metacrilato, vidrio) con alcohol isopropílico para quitar polvo y grasa.<br />
                2. <strong>Colocación:</strong> Frotar el transportador firmemente con una espátula o el dedo.<br />
                3. <strong>Retirada:</strong> Retirar el film transparente protector en ángulo raso de 180° lentamente.
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t-2 border-slate-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border-2 border-slate-950 bg-[#FEE100] font-black text-xs text-slate-950 hover:bg-[#ebd000] cursor-pointer"
          >
            Entendido, volver a calcular
          </button>
        </div>
      </div>
    </div>
  );
};
