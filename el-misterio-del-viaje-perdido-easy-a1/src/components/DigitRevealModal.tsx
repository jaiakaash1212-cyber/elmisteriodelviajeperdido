import React, { useEffect, useState } from 'react';
import { KeyRound, Eye, Clock } from 'lucide-react';
import { playDigitReveal, playClickSound } from '../utils/audio';

interface DigitRevealModalProps {
  digit: string;
  mysteryTitle: string;
  onDismiss: () => void;
}

export const DigitRevealModal: React.FC<DigitRevealModalProps> = ({
  digit,
  mysteryTitle,
  onDismiss,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(3);

  useEffect(() => {
    playDigitReveal();

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onDismiss();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onDismiss]);

  const handleManualDismiss = () => {
    playClickSound();
    onDismiss();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="relative max-w-sm w-full parchment-texture text-[#17243A] rounded-xl p-6 sm:p-8 vintage-border shadow-2xl text-center border-4 border-[#AA151B]">
        {/* Wax seal emblem */}
        <div className="w-16 h-16 mx-auto mb-3 rounded-full wax-seal flex items-center justify-center shadow-lg border-2 border-[#F1BF00]">
          <KeyRound className="w-8 h-8 text-[#F1BF00] animate-pulse" />
        </div>

        <span className="text-xs font-typewriter text-[#AA151B] font-bold uppercase tracking-wider block">
          ¡Misterio Resuelto!
        </span>
        <h3 className="font-display font-bold text-base text-[#17243A] mt-0.5 mb-3 line-clamp-1">
          {mysteryTitle}
        </h3>

        {/* Big Secret Digit Card */}
        <div className="my-4 py-4 px-6 bg-white/90 rounded-lg border-2 border-dashed border-[#AA151B] shadow-inner inline-block min-w-[140px]">
          <span className="text-xs font-typewriter text-stone-500 block mb-1">Cifra Secreta:</span>
          <span className="font-mono text-6xl font-extrabold text-[#AA151B] tracking-wider tabular-nums animate-bounce">
            {digit}
          </span>
        </div>

        {/* Memory warning notice */}
        <div className="bg-amber-100/90 border border-amber-300 rounded p-2.5 text-xs text-[#17243A] font-body mb-4 flex items-center gap-2 text-left">
          <Eye className="w-4 h-4 text-[#AA151B] shrink-0" />
          <span>
            <strong>¡Memoria de detective!</strong> No se guardará en ningún cuaderno. Recuerda esta
            cifra para la cerradura del acto.
          </span>
        </div>

        {/* Auto dismiss countdown bar */}
        <div className="w-full bg-stone-300 h-1.5 rounded-full overflow-hidden mb-4">
          <div
            className="bg-[#AA151B] h-full transition-all duration-1000 ease-linear"
            style={{ width: `${(secondsLeft / 3) * 100}%` }}
          />
        </div>

        <button
          onClick={handleManualDismiss}
          className="w-full py-2 px-4 rounded bg-[#17243A] hover:bg-[#25395a] text-[#F1BF00] font-display font-bold text-xs uppercase tracking-wider shadow transition-all flex items-center justify-center gap-2"
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Memorizada ({secondsLeft}s)</span>
        </button>
      </div>
    </div>
  );
};
