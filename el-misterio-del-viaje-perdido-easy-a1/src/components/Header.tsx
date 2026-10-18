import React, { useState } from 'react';
import { Volume2, VolumeX, Globe, Clock, Key, Award, AlertCircle } from 'lucide-react';
import { ActId } from '../types/game';
import { ACT_CONFIGS } from '../data/mysteries';
import { playClickSound } from '../utils/audio';

interface HeaderProps {
  currentActId: ActId;
  rawScore: number;
  timeRemainingSeconds: number;
  isTimerPaused: boolean;
  isRelaxedMode: boolean;
  actKeysEarned: Record<ActId, boolean>;
  translationUsedInAct: Record<ActId, boolean>;
  isTranslationActive: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  onActivateTranslation: () => void;
  onSelectMystery?: (index: number) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentActId,
  rawScore,
  timeRemainingSeconds,
  isRelaxedMode,
  actKeysEarned,
  translationUsedInAct,
  isTranslationActive,
  isMuted,
  onToggleMute,
  onActivateTranslation,
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Time formatted mm:ss
  const minutes = Math.floor(timeRemainingSeconds / 60);
  const seconds = timeRemainingSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isTimeCritical = timeRemainingSeconds < 180 && !isRelaxedMode;

  // Final score projection
  const finalScore100 = Math.min(100, Math.round((rawScore / 150) * 100));

  const handleTranslationClick = () => {
    playClickSound();
    if (translationUsedInAct[currentActId] || rawScore < 50) {
      return; // already used in this act or insufficient points
    }
    setShowConfirmModal(true);
  };

  const confirmTranslation = () => {
    playClickSound();
    setShowConfirmModal(false);
    onActivateTranslation();
  };

  const currentActConfig = ACT_CONFIGS.find((a) => a.actId === currentActId);

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#17243A]/95 border-b border-[#F1BF00]/30 backdrop-blur-md text-[#F7F0DF] shadow-md px-4 py-2.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Zone 1: Brand title & Act Indicator */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="font-display font-bold text-lg md:text-xl tracking-wider text-[#F1BF00] whitespace-nowrap">
              El Misterio del Viaje Perdido
            </span>
            <span className="hidden sm:inline-block text-xs font-typewriter text-[#F7F0DF]/60 border-l border-[#F7F0DF]/20 pl-3">
              1936 · Archivo Secreto
            </span>
          </div>

          {/* Zone 2: Status Hub (Timer, Keys, Score) */}
          <div className="flex items-center gap-4 md:gap-6 text-sm">
            {/* Countdown Timer */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded border transition-colors ${
                isTimeCritical
                  ? 'border-red-500 bg-red-950/50 text-red-300 animate-pulse'
                  : 'border-[#F1BF00]/30 bg-black/30 text-[#F7F0DF]'
              }`}
              title={isRelaxedMode ? 'Modo sin límite de tiempo' : 'Tiempo restante'}
            >
              <Clock className="w-4 h-4 text-[#F1BF00]" />
              <span className="font-mono tabular-nums font-semibold tracking-wide text-sm">
                {isRelaxedMode ? 'SIN TIEMPO' : formattedTime}
              </span>
            </div>

            {/* Keys Inventory */}
            <div className="flex items-center gap-1.5" title="Llaves de los 4 actos">
              <span className="text-xs text-[#F7F0DF]/70 hidden md:inline">Llaves:</span>
              <div className="flex items-center gap-1">
                {([1, 2, 3, 4] as ActId[]).map((actId) => {
                  const hasKey = actKeysEarned[actId];
                  const cfg = ACT_CONFIGS.find((a) => a.actId === actId);
                  return (
                    <div
                      key={actId}
                      className={`w-7 h-7 rounded flex items-center justify-center transition-all ${
                        hasKey
                          ? 'bg-[#F1BF00]/20 border border-[#F1BF00] text-[#F1BF00] shadow-[0_0_8px_rgba(241,191,0,0.4)]'
                          : 'bg-black/30 border border-white/10 text-white/20'
                      }`}
                      title={hasKey ? `${cfg?.keyName} (Conseguida)` : `${cfg?.keyName} (Bloqueada)`}
                    >
                      <Key className="w-3.5 h-3.5" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Score Metric */}
            <div className="hidden lg:flex items-center gap-1.5 bg-black/25 px-2.5 py-1 rounded border border-white/10">
              <Award className="w-4 h-4 text-[#F1BF00]" />
              <span className="text-xs text-[#F7F0DF]/80">
                Puntos: <strong className="font-mono tabular-nums text-white">{rawScore}</strong>/150
              </span>
              <span className="text-[#F7F0DF]/40">·</span>
              <span className="text-xs text-[#F1BF00]">
                Final: <strong className="font-mono tabular-nums">{finalScore100}</strong>/100
              </span>
            </div>
          </div>

          {/* Zone 3: Functional Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Translation Button */}
            <button
              onClick={handleTranslationClick}
              disabled={(translationUsedInAct[currentActId] && !isTranslationActive) || rawScore < 50}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium transition-all ${
                isTranslationActive
                  ? 'bg-[#F1BF00] text-[#17243A] font-semibold shadow'
                  : translationUsedInAct[currentActId]
                  ? 'bg-black/20 text-white/30 border border-white/5 cursor-not-allowed'
                  : rawScore < 50
                  ? 'bg-black/20 text-white/30 border border-white/5 cursor-not-allowed'
                  : 'bg-[#AA151B] hover:bg-[#881015] text-white border border-[#AA151B]/60 shadow-sm'
              }`}
              title={
                translationUsedInAct[currentActId]
                  ? 'Traducción ya utilizada en este acto'
                  : rawScore < 50
                  ? 'Necesitas al menos 50 puntos para traducir'
                  : 'Traducir pista al inglés (-50 pts)'
              }
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isTranslationActive ? 'Traducción Activa' : 'Traducir (EN)'}
              </span>
            </button>

            {/* Mute Toggle */}
            <button
              onClick={() => {
                playClickSound();
                onToggleMute();
              }}
              className="p-1.5 rounded hover:bg-white/10 text-[#F7F0DF]/80 hover:text-[#F1BF00] transition-colors"
              title={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
              aria-label="Alternar sonido"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Sub-bar for Current Act Title & Progress Bar */}
        <div className="max-w-7xl mx-auto mt-1 flex items-center justify-between text-xs text-[#F7F0DF]/70">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#F1BF00]">{currentActConfig?.title}</span>
            <span>·</span>
            <span className="text-[#F7F0DF]/80">{currentActConfig?.subtitle}</span>
          </div>
          <div className="text-right font-typewriter text-[11px] text-[#F7F0DF]/60">
            «El Atlas de los Siete Secretos»
          </div>
        </div>
      </header>

      {/* Confirmation Modal for Translation */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#F7F0DF] text-[#17243A] rounded-lg max-w-md w-full p-6 shadow-2xl border-2 border-[#AA151B]">
            <div className="flex items-center gap-3 mb-4 text-[#AA151B]">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="font-display font-bold text-lg">¿Activar traducción al inglés?</h3>
            </div>

            <p className="text-sm text-[#17243A]/90 mb-4 font-body leading-relaxed">
              Activar la traducción al inglés tiene un coste de{' '}
              <strong className="text-[#AA151B] font-semibold">50 puntos</strong> y solo puede
              utilizarse <strong className="underline">una vez por acto</strong>.
            </p>

            <p className="text-xs text-[#17243A]/70 mb-6 bg-amber-100/80 p-2.5 rounded border border-amber-300">
              Nota: La traducción te ayudará a comprender las pistas e instrucciones, pero nunca revelará
              la respuesta ni la combinación secreta.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  playClickSound();
                  setShowConfirmModal(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-[#17243A]/80 hover:bg-black/5 rounded transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmTranslation}
                disabled={rawScore < 50}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#AA151B] hover:bg-[#881015] rounded shadow transition-colors"
              >
                Confirmar (-50 pts)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
