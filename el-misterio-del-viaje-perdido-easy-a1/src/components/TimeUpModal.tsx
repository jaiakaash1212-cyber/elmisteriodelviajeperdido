import React from 'react';
import { Clock, ShieldAlert, ArrowRight, Play } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface TimeUpModalProps {
  onContinueRelaxed: () => void;
}

export const TimeUpModal: React.FC<TimeUpModalProps> = ({ onContinueRelaxed }) => {
  const handleContinue = () => {
    playClickSound();
    onContinueRelaxed();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn">
      <div className="relative max-w-md w-full parchment-texture text-[#17243A] rounded-xl p-6 sm:p-8 vintage-border shadow-2xl border-4 border-[#AA151B] text-center">
        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[#AA151B] text-[#F1BF00] flex items-center justify-center shadow-lg border-2 border-[#F1BF00]">
          <Clock className="w-8 h-8 animate-pulse" />
        </div>

        <span className="font-typewriter text-xs font-bold text-[#AA151B] uppercase tracking-widest block">
          Expediente Pausado
        </span>
        <h2 className="font-display font-bold text-2xl text-[#17243A] mt-1 mb-3">
          ¡Tiempo Agotado!
        </h2>

        <p className="font-body text-xs sm:text-sm text-[#17243A]/90 leading-relaxed mb-6">
          Los 20 minutos previstos para la consulta del archivo han concluido. Sin embargo,{' '}
          <strong>todo tu progreso, tus llaves y tus misterios resueltos se conservan intactos</strong>.
          Puedes continuar en el <strong>Modo Relajado</strong> sin límite de tiempo hasta completar
          la investigación de Isabel de la Vega.
        </p>

        <button
          onClick={handleContinue}
          className="w-full py-3 px-6 rounded-lg bg-[#17243A] hover:bg-[#25395a] text-[#F1BF00] font-display font-bold text-sm uppercase tracking-wider shadow-xl transition-all flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4 text-[#F1BF00]" />
          <span>Continuar sin límite de tiempo</span>
        </button>
      </div>
    </div>
  );
};
