import React, { useState } from 'react';
import { Search, Train, Check, ArrowRight } from 'lucide-react';
import { playClickSound, playTumblerTick } from '../utils/audio';

interface TicketInspectionProps {
  onSuccess: () => void;
  instructionText: string;
}

export const TicketInspection: React.FC<TicketInspectionProps> = ({ onSuccess, instructionText }) => {
  const [selectedDestination, setSelectedDestination] = useState<string>('');
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [zoomSection, setZoomSection] = useState<'origin' | 'dest' | 'date'>('dest');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const destinationOptions = ['Valencia', 'Sevilla', 'Barcelona', 'Bilbao', 'Granada'];

  const handleVerify = () => {
    playClickSound();
    if (selectedDestination === 'Barcelona') {
      setErrorMessage(null);
      onSuccess();
    } else {
      setErrorMessage('Destino incorrecto. Utiliza la lupa sobre el billete para leer la casilla «DESTINO».');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center parchment-texture rounded-lg p-5 sm:p-7 vintage-border shadow-2xl text-[#17243A]">
      {/* Header */}
      <div className="w-full border-b border-[#AA151B]/20 pb-3 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Train className="w-5 h-5 text-[#AA151B]" />
          <h3 className="font-display font-bold text-base sm:text-lg text-[#AA151B]">
            Inspección de Billete de Ferrocarril (1936)
          </h3>
        </div>
        <button
          onClick={() => {
            playTumblerTick();
            setIsZoomed(!isZoomed);
          }}
          className="flex items-center gap-1.5 px-3 py-1 bg-[#17243A] text-[#F1BF00] text-xs font-semibold rounded shadow hover:bg-[#25395a] transition-all"
        >
          <Search className="w-3.5 h-3.5" />
          <span>{isZoomed ? 'Alejar Lupa' : 'Usar Lupa de Aumento'}</span>
        </button>
      </div>

      <p className="text-xs sm:text-sm font-body text-[#17243A]/90 mb-4 text-center">
        {instructionText}
      </p>

      {/* Vintage Ticket Graphic */}
      <div className="relative w-full max-w-xl bg-[#F0E6CF] border-2 border-[#8A5A36] rounded-md p-4 sm:p-6 shadow-inner font-typewriter overflow-hidden mb-6">
        {/* Perforated ticket edges */}
        <div className="absolute left-0 top-0 bottom-0 w-2.5 flex flex-col justify-between py-1 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="w-2.5 h-2.5 rounded-full bg-[#17243A] -ml-1.5" />
          ))}
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-2.5 flex flex-col justify-between py-1 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="w-2.5 h-2.5 rounded-full bg-[#17243A] -mr-1.5" />
          ))}
        </div>

        {/* Vintage stamps and watermarks */}
        <div className="text-center border-b border-[#8A5A36]/40 pb-2 mb-3">
          <div className="text-[10px] tracking-widest uppercase text-[#8A5A36] font-bold">
            Compañía de los Caminos de Hierro del Norte de España
          </div>
          <div className="text-xs font-display font-bold text-[#AA151B] tracking-wider mt-0.5">
            BILLETE DE PASAJE · 1.ª CLASE
          </div>
        </div>

        {/* Ticket fields */}
        <div className="grid grid-cols-2 gap-3 text-xs mb-3">
          <div className="bg-white/60 p-2 rounded border border-[#8A5A36]/30">
            <span className="text-[9px] uppercase tracking-wider text-stone-500 block">ORIGEN:</span>
            <span className="font-bold text-sm text-[#17243A]">MADRID - ATOCHA</span>
          </div>

          <div
            className={`p-2 rounded border transition-all ${
              isZoomed && zoomSection === 'dest'
                ? 'bg-amber-100 border-2 border-[#AA151B] shadow-md scale-102'
                : 'bg-white/60 border border-[#8A5A36]/30'
            }`}
          >
            <span className="text-[9px] uppercase tracking-wider text-[#AA151B] font-bold block flex items-center justify-between">
              <span>DESTINO:</span>
              <span className="text-[8px] bg-[#AA151B] text-white px-1 rounded">OFICIAL</span>
            </span>
            <span className="font-bold text-sm sm:text-base text-[#AA151B] tracking-wider">
              BARCELONA - FRANÇA
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-[11px] text-stone-700 bg-black/5 p-2 rounded">
          <div>
            <span className="block text-[9px] text-stone-500 uppercase">FECHA:</span>
            <span className="font-semibold">14 MAY 1936</span>
          </div>
          <div>
            <span className="block text-[9px] text-stone-500 uppercase">TREN:</span>
            <span className="font-semibold">RÁPIDO N.º 204</span>
          </div>
          <div>
            <span className="block text-[9px] text-stone-500 uppercase">COCHE / ASIENTO:</span>
            <span className="font-semibold">COCHE 2 / 18</span>
          </div>
        </div>

        {/* Circular Vintage Railway Stamp */}
        <div className="mt-3 flex items-center justify-between">
          <div className="text-[9px] text-stone-500">SERIE B · N.º 048291</div>
          <div className="w-14 h-14 rounded-full border border-red-700/60 text-red-700/70 flex flex-col items-center justify-center text-[8px] font-bold rotate-12">
            <span>NORTE</span>
            <span>14.05.36</span>
            <span>MADRID</span>
          </div>
        </div>
      </div>

      {/* Zoom Lens detail view if active */}
      {isZoomed && (
        <div className="w-full max-w-xl bg-[#17243A] text-[#F7F0DF] p-3 rounded-md mb-5 border border-[#F1BF00] flex items-center gap-3 animate-fadeIn">
          <Search className="w-5 h-5 text-[#F1BF00] shrink-0" />
          <div className="text-xs">
            <span className="text-[#F1BF00] font-bold">Lupa de aumento activa:</span> En la casilla
            DESTINO se lee con claridad: <strong className="underline text-white">«BARCELONA - FRANÇA»</strong>.
          </div>
        </div>
      )}

      {/* Answer Selection */}
      <div className="w-full max-w-xl">
        <label className="block text-xs font-semibold text-[#17243A] mb-2 font-display">
          Selecciona la ciudad de destino confirmada en el billete:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
          {destinationOptions.map((city) => {
            const isSelected = selectedDestination === city;
            return (
              <button
                key={city}
                onClick={() => {
                  playClickSound();
                  setSelectedDestination(city);
                }}
                className={`py-2 px-2 rounded text-xs font-semibold transition-all border ${
                  isSelected
                    ? 'bg-[#AA151B] text-white border-[#AA151B] shadow-md ring-2 ring-[#F1BF00]'
                    : 'bg-white/80 hover:bg-white text-[#17243A] border-stone-300'
                }`}
              >
                {city}
              </button>
            );
          })}
        </div>

        {errorMessage && (
          <div className="mb-4 text-xs font-semibold text-[#AA151B] bg-red-100 p-2.5 rounded border border-red-300 text-center">
            {errorMessage}
          </div>
        )}

        <button
          onClick={handleVerify}
          disabled={!selectedDestination}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded bg-[#17243A] hover:bg-[#25395a] text-[#F1BF00] font-display font-bold text-xs uppercase tracking-wider shadow transition-all disabled:opacity-40"
        >
          <span>Confirmar Ciudad de Destino</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
