import React from 'react';
import { Key, Sparkles, Scroll, ArrowRight, Award } from 'lucide-react';
import { ActConfig } from '../types/game';
import { playClickSound } from '../utils/audio';

interface ActSummaryModalProps {
  actConfig: ActConfig;
  isKeyAwarded: boolean;
  isBonusAwarded: boolean;
  successPercentage: number;
  onProceedNextAct: () => void;
}

export const ActSummaryModal: React.FC<ActSummaryModalProps> = ({
  actConfig,
  isKeyAwarded,
  isBonusAwarded,
  successPercentage,
  onProceedNextAct,
}) => {
  const handleProceed = () => {
    playClickSound();
    onProceedNextAct();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="relative max-w-lg w-full parchment-texture text-[#17243A] rounded-xl p-6 sm:p-8 vintage-border shadow-2xl border-4 border-[#AA151B]">
        {/* Wax seal banner */}
        <div className="text-center mb-4">
          <div className="w-16 h-16 mx-auto rounded-full wax-seal flex items-center justify-center shadow-lg border-2 border-[#F1BF00] mb-2">
            <Key className="w-8 h-8 text-[#F1BF00]" />
          </div>
          <span className="font-typewriter text-xs font-bold text-[#AA151B] uppercase tracking-widest block">
            ¡Acto terminado!
          </span>
          <h2 className="font-display font-bold text-xl text-[#17243A] mt-0.5">
            {actConfig.title}
          </h2>
        </div>

        {/* Success Percentage Badge */}
        <div className="flex items-center justify-center gap-2 mb-6 text-xs font-display">
          <Award className="w-4 h-4 text-[#AA151B]" />
          <span>Tu resultado:</span>
          <strong className="font-mono text-sm text-[#AA151B] tabular-nums">
            {Math.round(successPercentage)}%
          </strong>
        </div>

        {/* Key Award Card */}
        {isKeyAwarded && (
          <div className="bg-white/90 p-4 rounded-lg border-2 border-[#8A5A36] shadow-sm mb-4 flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-md border-2"
              style={{ backgroundColor: `${actConfig.keyColor}20`, borderColor: actConfig.keyColor }}
            >
              <Key className="w-6 h-6" style={{ color: actConfig.keyColor }} />
            </div>
            <div>
              <span className="text-[11px] font-typewriter text-stone-500 uppercase block">
                Llave encontrada
              </span>
              <h4 className="font-display font-bold text-base text-[#17243A]">
                {actConfig.keyName}
              </h4>
              <p className="text-xs text-stone-600 font-body">
                Guarda esta llave para el final.
              </p>
            </div>
          </div>
        )}

        {/* Story Fragment Revealed */}
        <div className="bg-[#17243A] text-[#F7F0DF] p-4 rounded-lg shadow-inner mb-4 border border-[#F1BF00]/30">
          <div className="flex items-center gap-2 mb-2 text-[#F1BF00] text-xs font-display font-bold">
            <Scroll className="w-4 h-4" />
            <span>Nueva pista:</span>
          </div>
          <p className="font-typewriter text-sm sm:text-base italic leading-relaxed text-[#F7F0DF]">
            {actConfig.storyFragment}
          </p>
        </div>

        {/* Bonus Clue (if >= 70%) */}
        {isBonusAwarded && (
          <div className="bg-amber-100/90 border border-amber-400 p-3 rounded-lg mb-6 flex items-start gap-2.5 text-xs text-[#17243A]">
            <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-display block text-amber-900">
                Pista extra (70% o más):
              </strong>
              <p className="font-body text-[#17243A]/90 mt-0.5">{actConfig.bonusClue}</p>
            </div>
          </div>
        )}

        {/* CTA Button */}
        <button
          onClick={handleProceed}
          className="w-full py-3 px-6 rounded-lg bg-[#AA151B] hover:bg-[#881015] text-[#F7F0DF] font-display font-bold text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <span>Continuar</span>
          <ArrowRight className="w-4 h-4 text-[#F1BF00]" />
        </button>
      </div>
    </div>
  );
};
