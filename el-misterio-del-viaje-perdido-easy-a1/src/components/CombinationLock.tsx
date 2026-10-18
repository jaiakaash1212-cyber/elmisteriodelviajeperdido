import React, { useState } from 'react';
import { Lock, Unlock, ChevronUp, ChevronDown, ShieldAlert, Key, HelpCircle, CheckCircle2 } from 'lucide-react';
import { ActConfig } from '../types/game';
import { playTumblerTick, playLockUnlocked, playErrorSound, playClickSound } from '../utils/audio';

function shuffleItems<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface CombinationLockProps {
  actConfig: ActConfig;
  expectedCode: string;
  recoveryPassed: boolean;
  correctMysteriesCount: number;
  totalMysteriesInAct: number;
  onSuccess: (isKeyAwarded: boolean, isBonusAwarded: boolean) => void;
  onRecoveryComplete: () => void;
}

export const CombinationLock: React.FC<CombinationLockProps> = ({
  actConfig,
  expectedCode,
  recoveryPassed,
  correctMysteriesCount,
  totalMysteriesInAct,
  onSuccess,
  onRecoveryComplete,
}) => {
  const codeLength = Math.max(1, expectedCode.length);
  const [dials, setDials] = useState<number[]>(Array(codeLength).fill(0));
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [selectedRecoveryOption, setSelectedRecoveryOption] = useState<number | null>(null);
  const [shuffledRecoveryOptions] = useState(() => shuffleItems(
    actConfig.recoveryChallenge.options.map((option, originalIndex) => ({ option, originalIndex }))
  ));
  const [recoveryError, setRecoveryError] = useState<string | null>(null);

  const incrementDial = (index: number) => {
    playTumblerTick();
    setDials((prev) => {
      const next = [...prev];
      next[index] = (next[index] + 1) % 10;
      return next;
    });
  };

  const decrementDial = (index: number) => {
    playTumblerTick();
    setDials((prev) => {
      const next = [...prev];
      next[index] = (next[index] - 1 + 10) % 10;
      return next;
    });
  };

  const handleUnlock = () => {
    playClickSound();
    const enteredCode = dials.join('');
    const successPercentage = (correctMysteriesCount / Math.max(1, totalMysteriesInAct)) * 100;

    // Teams below the 50% threshold must complete the recovery challenge first.
    if (successPercentage < 50 && !recoveryPassed) {
      setShowRecoveryModal(true);
      setErrorMsg('Responde a la pregunta para conseguir la llave.');
      return;
    }

    // If no puzzle was solved, the successful recovery challenge is the fallback unlock path.
    const codeIsValid = expectedCode.length === 0
      ? recoveryPassed && successPercentage < 50
      : enteredCode === expectedCode;

    if (!codeIsValid) {
      playErrorSound();
      setErrorMsg('Código incorrecto. ¡Inténtalo otra vez! Recuerda las cifras en el orden en que las descubriste.');
      return;
    }

    const isKeyAwarded = successPercentage >= 50 || recoveryPassed;
    const isBonusAwarded = successPercentage >= 70;
    if (!isKeyAwarded) {
      setErrorMsg('Responde a la pregunta para tener la llave.');
      setShowRecoveryModal(true);
      return;
    }

    setErrorMsg(null);
    setIsUnlocked(true);
    playLockUnlocked();
    setTimeout(() => onSuccess(isKeyAwarded, isBonusAwarded), 900);
  };

  const handleVerifyRecovery = () => {
    playClickSound();
    if (selectedRecoveryOption === actConfig.recoveryChallenge.correctIndex) {
      setRecoveryError(null);
      setShowRecoveryModal(false);
      onRecoveryComplete();
      setErrorMsg('¡Muy bien! Prueba el candado otra vez.');
    } else {
      playErrorSound();
      setRecoveryError('Respuesta incorrecta. Lee la pregunta otra vez.');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto parchment-texture rounded-xl p-6 sm:p-8 vintage-border shadow-2xl text-[#17243A]">
      {/* Header */}
      <div className="border-b border-[#AA151B]/20 pb-3 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#17243A] text-[#F1BF00] flex items-center justify-center shadow">
            {isUnlocked ? <Unlock className="w-5 h-5 text-emerald-400" /> : <Lock className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-[#AA151B]">
              Candado secreto
            </h3>
            <p className="font-typewriter text-xs text-[#17243A]/70">
              {actConfig.title} · {expectedCode.length > 0 ? `${expectedCode.length} ${expectedCode.length === 1 ? 'tambor rotatorio' : 'tambores rotatorios'}` : 'Desafío de recuperación'}
            </p>
          </div>
        </div>

        <div className="text-right text-xs font-typewriter">
          <span className="text-[#17243A]/60 block">Misterios del acto:</span>
          <span className="font-bold text-[#AA151B]">
            {correctMysteriesCount}/{totalMysteriesInAct} resueltos
          </span>
        </div>
      </div>

      <p className="text-xs sm:text-sm font-body text-[#17243A]/90 mb-6 text-center leading-relaxed">
        Escribe los números que encuentras, en el mismo orden. ¿Necesitas ayuda? Responde a la pregunta.
      </p>

      {/* Brass Vault Lock Mechanism Graphic */}
      <div className="relative max-w-lg mx-auto bg-gradient-to-b from-[#2B1B10] via-[#432A18] to-[#1A0E07] rounded-xl p-6 sm:p-8 border-4 border-[#8A5A36] shadow-[0_10px_30px_rgba(0,0,0,0.5)] mb-6 text-white">
        {/* Brass Rivets on corners */}
        <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-amber-600 border border-amber-300 shadow" />
        <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-amber-600 border border-amber-300 shadow" />
        <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-amber-600 border border-amber-300 shadow" />
        <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-amber-600 border border-amber-300 shadow" />

        <div className="text-center mb-4">
          <span className="font-display text-xs tracking-widest text-[#F1BF00] uppercase font-bold">
            Mecanismo de Latón y Acero · Toledo 1936
          </span>
        </div>

        {/* Tumbler Wheels Container */}
        {expectedCode.length > 0 ? (
        <div className="flex items-center justify-center gap-2 sm:gap-4 my-2">
          {dials.map((digit, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <button
                onClick={() => incrementDial(idx)}
                className="w-10 h-8 rounded-t bg-[#613E22] hover:bg-[#7D512E] active:scale-95 text-[#F1BF00] flex items-center justify-center border-t border-x border-[#8A5A36] transition-colors"
                title="Girar hacia arriba"
              >
                <ChevronUp className="w-5 h-5" />
              </button>

              {/* Dial Wheel Cylinder */}
              <div className="w-12 sm:w-14 h-16 sm:h-20 bg-gradient-to-b from-stone-800 via-stone-200 to-stone-800 rounded-sm border-2 border-amber-600 flex items-center justify-center shadow-inner relative overflow-hidden">
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-8 bg-amber-100/30 border-y border-amber-600/60 pointer-events-none" />
                <span className="font-mono text-3xl sm:text-4xl font-extrabold text-[#17243A] tabular-nums z-10 drop-shadow-sm">
                  {digit}
                </span>
              </div>

              <button
                onClick={() => decrementDial(idx)}
                className="w-10 h-8 rounded-b bg-[#613E22] hover:bg-[#7D512E] active:scale-95 text-[#F1BF00] flex items-center justify-center border-b border-x border-[#8A5A36] transition-colors"
                title="Girar hacia abajo"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
        ) : (
          <div className="my-5 rounded-lg border border-amber-400/50 bg-black/25 px-4 py-6 text-center text-sm text-amber-100">
            No tienes números todavía. Responde a la pregunta para continuar.
          </div>
        )}

        {/* Keyhole Accent */}
        <div className="flex justify-center mt-4">
          <div className="w-6 h-6 rounded-full bg-black/60 border border-amber-500/50 flex flex-col items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <div className="w-1 h-2 bg-amber-400 -mt-0.5" />
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="max-w-lg mx-auto mb-6 text-xs font-semibold text-[#AA151B] bg-red-100 p-3 rounded border border-red-300 text-center flex items-center justify-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="max-w-lg mx-auto flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={handleUnlock}
          disabled={isUnlocked}
          className="w-full py-3 px-6 rounded-lg bg-[#AA151B] hover:bg-[#881015] text-[#F7F0DF] font-display font-bold text-sm uppercase tracking-wider shadow-xl transition-all flex items-center justify-center gap-2 border border-[#F1BF00]/40 disabled:opacity-50"
        >
          <Lock className="w-4 h-4 text-[#F1BF00]" />
          <span>{expectedCode.length === 0 && !recoveryPassed ? 'Resolver recuperación' : 'Abrir cerradura del acto'}</span>
        </button>

        {correctMysteriesCount / Math.max(1, totalMysteriesInAct) < 0.5 && !recoveryPassed && (
          <button
            onClick={() => setShowRecoveryModal(true)}
            className="w-full sm:w-auto shrink-0 py-3 px-4 rounded-lg bg-amber-200 hover:bg-amber-300 text-[#17243A] font-display font-bold text-xs shadow flex items-center justify-center gap-1.5 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-[#AA151B]" />
            <span>Pregunta de ayuda</span>
          </button>
        )}
      </div>

      {/* Recovery Challenge Modal */}
      {showRecoveryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-[#F7F0DF] text-[#17243A] rounded-xl max-w-md w-full p-6 shadow-2xl border-2 border-[#AA151B]">
            <div className="flex items-center gap-3 mb-3 text-[#AA151B]">
              <Key className="w-6 h-6 shrink-0 text-[#F1BF00]" />
              <h3 className="font-display font-bold text-base">Pregunta extra</h3>
            </div>

            <p className="text-xs text-[#17243A]/80 mb-4 font-body leading-relaxed">
              Para tener la llave, responde a esta pregunta sobre España:
            </p>

            <div className="bg-white/90 p-4 rounded-lg border border-stone-300 mb-4">
              <h4 className="font-display font-bold text-sm text-[#17243A] mb-3">
                {actConfig.recoveryChallenge.question}
              </h4>

              <div className="space-y-2">
                {shuffledRecoveryOptions.map(({ option, originalIndex }) => {
                  const isSelected = selectedRecoveryOption === originalIndex;
                  return (
                    <button
                      key={originalIndex}
                      onClick={() => {
                        playClickSound();
                        setSelectedRecoveryOption(originalIndex);
                      }}
                      className={`w-full p-2.5 rounded text-left text-xs font-medium border transition-all ${
                        isSelected
                          ? 'bg-[#AA151B] text-white border-[#AA151B] shadow ring-1 ring-[#F1BF00]'
                          : 'bg-white hover:bg-stone-50 text-[#17243A] border-stone-300'
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            {recoveryError && (
              <div className="mb-4 text-xs font-semibold text-[#AA151B] bg-red-100 p-2.5 rounded border border-red-300 text-center">
                {recoveryError}
              </div>
            )}

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  playClickSound();
                  setShowRecoveryModal(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-[#17243A]/70 hover:bg-black/5 rounded"
              >
                Volver
              </button>
              <button
                onClick={handleVerifyRecovery}
                disabled={selectedRecoveryOption === null}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#AA151B] hover:bg-[#881015] rounded shadow disabled:opacity-40"
              >
                Comprobar respuesta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
