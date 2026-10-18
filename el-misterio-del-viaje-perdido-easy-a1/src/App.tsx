import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ActId, GameState } from './types/game';
import { ACT_CONFIGS, MYSTERIES } from './data/mysteries';
import { Header } from './components/Header';
import { TitleScreen } from './components/TitleScreen';
import { MapOfSpain } from './components/MapOfSpain';
import { SuitcaseScene } from './components/SuitcaseScene';
import { TicketInspection } from './components/TicketInspection';
import {
  LandmarkPuzzle,
  StarCountingPuzzle,
  LetterReconstructPuzzle,
  FlamencoDancePuzzle,
} from './components/Puzzles/ActIIPuzzles';
import {
  AqueductPuzzle,
  FoodMatchPuzzle,
  MapRoutePuzzle,
  FillBlankPuzzle,
} from './components/Puzzles/ActIIIPuzzles';
import {
  EvidenceBoardPuzzle,
  FinalWordsPuzzle,
} from './components/Puzzles/ActIVPuzzles';
import { DigitRevealModal } from './components/DigitRevealModal';
import { CombinationLock } from './components/CombinationLock';
import { ActSummaryModal } from './components/ActSummaryModal';
import { FinalVictory } from './components/FinalVictory';
import { TimeUpModal } from './components/TimeUpModal';
import { playClickSound, playMysterySuccess, setMuted, getIsMuted, playErrorSound } from './utils/audio';
import { HelpCircle, ChevronRight, Lock, Key, CheckCircle2, AlertCircle } from 'lucide-react';

const INITIAL_TIME_SECONDS = 20 * 60; // 20 minutes = 1200s

export default function App() {
  const [screen, setScreen] = useState<GameState['screen']>('TITLE');
  const [currentActId, setCurrentActId] = useState<ActId>(1);
  const [currentMysteryIndex, setCurrentMysteryIndex] = useState<number>(0);
  const [solvedMysteryIds, setSolvedMysteryIds] = useState<number[]>([]);
  const solvedMysteryIdsRef = useRef<Set<number>>(new Set());
  const [attemptedMysteryIds, setAttemptedMysteryIds] = useState<number[]>([]);
  const [earnedDigitsByAct, setEarnedDigitsByAct] = useState<Record<ActId, string[]>>({ 1: [], 2: [], 3: [], 4: [] });
  const [recoveryPassedByAct, setRecoveryPassedByAct] = useState<Record<ActId, boolean>>({ 1: false, 2: false, 3: false, 4: false });
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);
  const [actKeysEarned, setActKeysEarned] = useState<Record<ActId, boolean>>({
    1: false,
    2: false,
    3: false,
    4: false,
  });
  const [rawScore, setRawScore] = useState<number>(0);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(INITIAL_TIME_SECONDS);
  const [isRelaxedMode, setIsRelaxedMode] = useState<boolean>(false);
  const [isTimeUpModalOpen, setIsTimeUpModalOpen] = useState<boolean>(false);
  const [translationUsedInAct, setTranslationUsedInAct] = useState<Record<ActId, boolean>>({
    1: false,
    2: false,
    3: false,
    4: false,
  });
  const [isTranslationActive, setIsTranslationActive] = useState<boolean>(false);
  const [isMutedState, setIsMutedState] = useState<boolean>(getIsMuted());

  // Memory-only earned digits for current mystery reveal
  const [revealingDigit, setRevealingDigit] = useState<{ digit: string; title: string } | null>(null);

  // Act summary modal state
  const [summaryData, setSummaryData] = useState<{
    actConfig: typeof ACT_CONFIGS[0];
    isKeyAwarded: boolean;
    isBonusAwarded: boolean;
    successPercentage: number;
  } | null>(null);

  // Spanish hint toggle
  const [showSpanishHint, setShowSpanishHint] = useState<boolean>(false);

  // Timer reference
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Countdown timer effect
  useEffect(() => {
    if (screen === 'TITLE' || screen === 'FINAL_VICTORY' || isRelaxedMode) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setIsTimeUpModalOpen(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [screen, isRelaxedMode]);

  // Restart / Reset game state
  const handleRestartGame = () => {
    setScreen('TITLE');
    setCurrentActId(1);
    setCurrentMysteryIndex(0);
    setSolvedMysteryIds([]);
    solvedMysteryIdsRef.current.clear();
    setAttemptedMysteryIds([]);
    setEarnedDigitsByAct({ 1: [], 2: [], 3: [], 4: [] });
    setRecoveryPassedByAct({ 1: false, 2: false, 3: false, 4: false });
    setNoticeMessage(null);
    setActKeysEarned({ 1: false, 2: false, 3: false, 4: false });
    setRawScore(0);
    setTimeRemainingSeconds(INITIAL_TIME_SECONDS);
    setIsRelaxedMode(false);
    setIsTimeUpModalOpen(false);
    setTranslationUsedInAct({ 1: false, 2: false, 3: false, 4: false });
    setIsTranslationActive(false);
    setRevealingDigit(null);
    setSummaryData(null);
    setShowSpanishHint(false);
  };

  // Start game from title
  const handleStartGame = () => {
    setScreen('PLAYING_MYSTERY');
    setCurrentActId(1);
    setCurrentMysteryIndex(0);
  };

  // Toggle Mute
  const handleToggleMute = () => {
    const nextMuted = !isMutedState;
    setMuted(nextMuted);
    setIsMutedState(nextMuted);
  };

  // Activate English translation for current act
  const handleActivateTranslation = () => {
    if (translationUsedInAct[currentActId]) return;

    // Deduct 50 raw points (minimum 0)
    setRawScore((prev) => Math.max(0, prev - 50));
    setTranslationUsedInAct((prev) => ({ ...prev, [currentActId]: true }));
    setIsTranslationActive(true);
  };

  // Current mystery object
  const currentMystery = MYSTERIES[currentMysteryIndex];
  const currentActConfig = ACT_CONFIGS.find((a) => a.actId === currentActId)!;

  // Mysteries belonging to the current act
  const currentActMysteries = MYSTERIES.filter((m) => m.actId === currentActId);

  // Count correctly solved in current act
  const correctInCurrentAct = currentActMysteries.filter((m) => solvedMysteryIds.includes(m.id)).length;

  // Handle mystery solve
  const handleMysterySolved = (mysteryId: number) => {
    const myst = MYSTERIES.find((m) => m.id === mysteryId);
    if (!myst || solvedMysteryIdsRef.current.has(mysteryId)) return;
    solvedMysteryIdsRef.current.add(mysteryId);

    setSolvedMysteryIds((prev) => prev.includes(mysteryId) ? prev : [...prev, mysteryId]);
    setAttemptedMysteryIds((prev) => prev.includes(mysteryId) ? prev : [...prev, mysteryId]);
    setEarnedDigitsByAct((prev) => ({
      ...prev,
      [myst.actId]: [...prev[myst.actId], myst.secretDigit],
    }));
    setRawScore((prev) => prev + 10);
    setNoticeMessage(null);
    playMysterySuccess();
    setRevealingDigit({ digit: myst.secretDigit, title: myst.title });
  };

  // Dismiss secret digit modal & progress
  const handleDismissDigitModal = useCallback(() => {
    setRevealingDigit(null);
    setShowSpanishHint(false);
    setIsTranslationActive(false);
    const actMysteries = MYSTERIES.filter((m) => m.actId === currentActId);
    const nextUnattempted = actMysteries.find((m) => !attemptedMysteryIds.includes(m.id));
    if (nextUnattempted) {
      const nextIndex = MYSTERIES.findIndex((m) => m.id === nextUnattempted.id);
      if (nextIndex >= 0) setCurrentMysteryIndex(nextIndex);
    } else {
      setScreen('ACT_LOCK');
    }
  }, [currentActId, attemptedMysteryIds]);

  const handleSkipMystery = () => {
    setAttemptedMysteryIds((prev) => prev.includes(currentMystery.id) ? prev : [...prev, currentMystery.id]);
    setShowSpanishHint(false);
    setIsTranslationActive(false);
    setNoticeMessage('Misterio marcado para revisar. No has recibido puntos ni una cifra.');
    const attemptedAfterSkip = attemptedMysteryIds.includes(currentMystery.id)
      ? attemptedMysteryIds
      : [...attemptedMysteryIds, currentMystery.id];
    const nextUnattempted = currentActMysteries.find((m) => !attemptedAfterSkip.includes(m.id));
    if (nextUnattempted) {
      const nextIndex = MYSTERIES.findIndex((m) => m.id === nextUnattempted.id);
      if (nextIndex >= 0) setCurrentMysteryIndex(nextIndex);
    } else {
      setScreen('ACT_LOCK');
    }
  };

  // Handle Lock Unlocked
  const handleLockSuccess = (isKeyAwarded: boolean, isBonusAwarded: boolean) => {
    if (isKeyAwarded) {
      setActKeysEarned((prev) => ({ ...prev, [currentActId]: true }));
    }

    const percentage = (correctInCurrentAct / currentActMysteries.length) * 100;

    if (currentActId === 4) {
      // Victory!
      setScreen('FINAL_VICTORY');
    } else {
      // Show Act summary modal
      setSummaryData({
        actConfig: currentActConfig,
        isKeyAwarded,
        isBonusAwarded,
        successPercentage: percentage,
      });
      setScreen('ACT_SUMMARY');
    }
  };

  // Proceed from Summary to next act
  const handleProceedNextAct = () => {
    const nextAct = (currentActId + 1) as ActId;
    setCurrentActId(nextAct);
    setIsTranslationActive(false); // reset translation allowance for next act
    setSummaryData(null);

    // Find first mystery of the next act
    const firstMysteryNextActIndex = MYSTERIES.findIndex((m) => m.actId === nextAct);
    if (firstMysteryNextActIndex !== -1) {
      setCurrentMysteryIndex(firstMysteryNextActIndex);
    }

    setScreen('PLAYING_MYSTERY');
  };

  // Recovery challenge enables key eligibility without falsely awarding puzzle points or digits.
  const handleRecoveryComplete = () => {
    setRecoveryPassedByAct((prev) => ({ ...prev, [currentActId]: true }));
    setNoticeMessage('¡Desafío superado! Ahora puedes volver a la cerradura.');
  };

  // Map City selection handler for map-based mysteries
  const handleMapCitySelect = (cityName: string) => {
    if (currentMystery.type !== 'map_click') return;

    if (cityName.toLowerCase() === currentMystery.targetAnswer.toLowerCase()) {
      handleMysterySolved(currentMystery.id);
    } else {
      playErrorSound();
      setNoticeMessage('Esa ciudad no coincide con las pistas. Lee la descripción y vuelve a intentarlo.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#17243A] text-[#F7F0DF] flex flex-col font-body selection:bg-[#F1BF00] selection:text-[#17243A]">
      {/* Title Screen View */}
      {screen === 'TITLE' && <TitleScreen onStartGame={handleStartGame} />}

      {/* Final Victory View */}
      {screen === 'FINAL_VICTORY' && (
        <FinalVictory
          solvedMysteriesCount={solvedMysteryIds.length}
          keysCount={Object.values(actKeysEarned).filter(Boolean).length}
          rawScore={rawScore}
          finalScore100={Math.min(100, Math.round((rawScore / 150) * 100))}
          timeUsedSeconds={INITIAL_TIME_SECONDS - timeRemainingSeconds}
          onRestartGame={handleRestartGame}
        />
      )}

      {/* Active Game Header */}
      {screen !== 'TITLE' && screen !== 'FINAL_VICTORY' && (
        <Header
          currentActId={currentActId}
          rawScore={rawScore}
          timeRemainingSeconds={timeRemainingSeconds}
          isTimerPaused={screen === 'ACT_SUMMARY'}
          isRelaxedMode={isRelaxedMode}
          actKeysEarned={actKeysEarned}
          translationUsedInAct={translationUsedInAct}
          isTranslationActive={isTranslationActive}
          isMuted={isMutedState}
          onToggleMute={handleToggleMute}
          onActivateTranslation={handleActivateTranslation}
        />
      )}

      {/* Main Gameplay Shell */}
      {screen === 'PLAYING_MYSTERY' && (
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 flex flex-col items-center">
          {/* Mystery Navigator Strip for Current Act */}
          <div className="w-full max-w-3xl mb-4 flex items-center justify-between bg-black/30 p-2 rounded-lg border border-white/10 text-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {currentActMysteries.map((m, idx) => {
                const isCurrent = MYSTERIES[currentMysteryIndex].id === m.id;
                const isSolved = solvedMysteryIds.includes(m.id);

                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      playClickSound();
                      setNoticeMessage(null);
                      setIsTranslationActive(false);
                      const globalIdx = MYSTERIES.findIndex((item) => item.id === m.id);
                      if (globalIdx !== -1) setCurrentMysteryIndex(globalIdx);
                    }}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded transition-all whitespace-nowrap ${
                      isCurrent
                        ? 'bg-[#AA151B] text-white font-semibold ring-1 ring-[#F1BF00]'
                        : isSolved
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    <span>M{idx + 1}</span>
                    {isSolved && <CheckCircle2 className="w-3 h-3 text-[#F1BF00]" />}
                    {!isSolved && attemptedMysteryIds.includes(m.id) && <span className="text-amber-300">·</span>}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                playClickSound();
                if (currentActMysteries.every((m) => attemptedMysteryIds.includes(m.id))) setScreen('ACT_LOCK');
                else setNoticeMessage('Explora o pasa por todos los misterios de este acto antes de probar la cerradura.');
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded bg-[#F1BF00]/20 hover:bg-[#F1BF00]/30 text-[#F1BF00] border border-[#F1BF00]/40 font-semibold whitespace-nowrap ml-2"
              title="Ir a la cerradura del acto"
            >
              <Lock className="w-3 h-3" />
              <span>Cerradura</span>
            </button>
          </div>

          {/* Mystery Card Header */}
          <div className="w-full max-w-3xl mb-4 text-center">
            <span className="font-typewriter text-xs text-[#F1BF00] uppercase tracking-wider block">
              {currentMystery.subtitle}
            </span>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-[#F7F0DF] mt-0.5">
              {currentMystery.title}
            </h2>

            {/* Instruction Banner */}
            <div className="mt-2 inline-block px-4 py-1.5 rounded bg-[#AA151B]/80 text-[#F7F0DF] border border-[#F1BF00]/30 text-xs sm:text-sm font-semibold">
              «{currentMystery.instruction}»
            </div>
          </div>

          {/* Optional English Translation Callout (if activated) */}
          {isTranslationActive && (
            <div className="w-full max-w-3xl mb-4 bg-sky-950/80 border border-sky-400/40 text-sky-200 p-3 rounded-lg text-xs font-body shadow animate-fadeIn">
              <strong className="font-display text-sky-300 block mb-0.5">
                English Translation (Active for Act {currentActId}):
              </strong>
              <p>Instruction: «{currentMystery.instructionEn}»</p>
              <p className="mt-0.5 text-sky-300/80">Clue: «{currentMystery.clueEn}»</p>
            </div>
          )}

          {/* Active Mystery Interactive Scene */}
          <div className="w-full flex justify-center mb-6">
            {solvedMysteryIds.includes(currentMystery.id) ? (
              <div className="w-full max-w-2xl parchment-texture rounded-xl p-8 vintage-border text-[#17243A] text-center shadow-xl">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-display font-bold text-xl text-[#AA151B]">Misterio resuelto</h3>
                <p className="mt-2 text-sm">Ya has recibido la cifra de este misterio. La cifra no se volverá a mostrar.</p>
                <button
                  onClick={() => {
                    setIsTranslationActive(false);
                    setNoticeMessage(null);
                    const next = currentActMysteries.find((m) => !attemptedMysteryIds.includes(m.id));
                    if (next) setCurrentMysteryIndex(MYSTERIES.findIndex((m) => m.id === next.id));
                    else setScreen('ACT_LOCK');
                  }}
                  className="mt-5 rounded-lg bg-[#AA151B] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#881015]"
                >Continuar investigación
                </button>
              </div>
            ) : (
              <>
            {/* Mystery 1: Suitcase */}
            {currentMystery.id === 1 && (
              <SuitcaseScene
                instructionText={currentMystery.instruction}
                onSuccess={() => handleMysterySolved(1)}
              />
            )}

            {/* Mystery 2: Map of Spain (Barcelona) */}
            {currentMystery.id === 2 && (
              <MapOfSpain
                targetPrompt="«Busca la ciudad de Gaudí». Haz clic en la ciudad correcta en el mapa."
                onSelectCity={handleMapCitySelect}
                selectedCity={solvedMysteryIds.includes(2) ? 'Barcelona' : null}
              />
            )}

            {/* Mystery 3: Ticket Inspection */}
            {currentMystery.id === 3 && (
              <TicketInspection
                instructionText={currentMystery.instruction}
                onSuccess={() => handleMysterySolved(3)}
              />
            )}

            {/* Mystery 4: Sagrada Família Landmark Identification */}
            {currentMystery.id === 4 && (
              <LandmarkPuzzle
                instructionText={currentMystery.instruction}
                onSuccess={() => handleMysterySolved(4)}
              />
            )}

            {/* Mystery 5: Alhambra Star Counting */}
            {currentMystery.id === 5 && (
              <StarCountingPuzzle
                instructionText={currentMystery.instruction}
                onSuccess={() => handleMysterySolved(5)}
              />
            )}

            {/* Mystery 6: Madrid Letter Reconstruction */}
            {currentMystery.id === 6 && (
              <LetterReconstructPuzzle
                instructionText={currentMystery.instruction}
                onSuccess={() => handleMysterySolved(6)}
              />
            )}

            {/* Mystery 7: Flamenco Dance Clue Matching */}
            {currentMystery.id === 7 && (
              <FlamencoDancePuzzle
                instructionText={currentMystery.instruction}
                onSuccess={() => handleMysterySolved(7)}
              />
            )}

            {/* Mystery 8: Segovia Aqueduct Arches Counting */}
            {currentMystery.id === 8 && (
              <AqueductPuzzle
                instructionText={currentMystery.instruction}
                onSuccess={() => handleMysterySolved(8)}
              />
            )}

            {/* Mystery 9: Map of Spain (San Sebastián beach) */}
            {currentMystery.id === 9 && (
              <MapOfSpain
                targetPrompt="«Está en el norte de España. Tiene una playa famosa». Busca la ciudad en el mapa."
                onSelectCity={handleMapCitySelect}
                selectedCity={solvedMysteryIds.includes(9) ? 'San Sebastián' : null}
              />
            )}

            {/* Mystery 10: Basque Pintxos Food Match */}
            {currentMystery.id === 10 && (
              <FoodMatchPuzzle
                instructionText={currentMystery.instruction}
                onSuccess={() => handleMysterySolved(10)}
              />
            )}

            {/* Mystery 11: Broken Map Route Puzzle */}
            {currentMystery.id === 11 && (
              <MapRoutePuzzle
                instructionText={currentMystery.instruction}
                onSuccess={() => handleMysterySolved(11)}
              />
            )}

            {/* Mystery 12: Fill in Blank («cultura») */}
            {currentMystery.id === 12 && (
              <FillBlankPuzzle
                instructionText={currentMystery.instruction}
                onSuccess={() => handleMysterySolved(12)}
              />
            )}

            {/* Mystery 13: Evidence Board Antagonist */}
            {currentMystery.id === 13 && (
              <EvidenceBoardPuzzle
                instructionText={currentMystery.instruction}
                onSuccess={() => handleMysterySolved(13)}
              />
            )}

            {/* Mystery 14: Map of Spain (Santiago de Compostela) */}
            {currentMystery.id === 14 && (
              <MapOfSpain
                targetPrompt="«Está en Galicia. Hay una catedral grande. Muchas personas caminan hasta aquí». Busca la ciudad en el mapa."
                onSelectCity={handleMapCitySelect}
                selectedCity={solvedMysteryIds.includes(14) ? 'Santiago de Compostela' : null}
              />
            )}

            {/* Mystery 15: Final Words Assembly */}
            {currentMystery.id === 15 && (
              <FinalWordsPuzzle
                instructionText={currentMystery.instruction}
                onSuccess={() => handleMysterySolved(15)}
              />
            )}
              </>
            )}
          </div>

          {/* Spanish Hint Drawer */}
          <div className="w-full max-w-3xl flex flex-col items-center">
            <button
              onClick={() => {
                playClickSound();
                setShowSpanishHint(!showSpanishHint);
              }}
              className="flex items-center gap-1.5 text-xs text-[#F1BF00] hover:text-white transition-colors py-1.5 px-3 rounded bg-black/20 hover:bg-black/30 border border-white/10"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#F1BF00]" />
              <span>{showSpanishHint ? 'Ocultar pista en español' : 'Consultar pista en español'}</span>
            </button>

            {showSpanishHint && (
              <div className="w-full mt-2 p-3 rounded bg-[#17243A]/90 border border-[#F1BF00]/30 text-xs font-body text-[#F7F0DF] text-center shadow animate-fadeIn">
                <span className="text-[#F1BF00] font-semibold">Pista:</span> {currentMystery.hint}
              </div>
            )}
            {noticeMessage && <div role="status" className="w-full mt-3 p-3 rounded-lg border border-[#F1BF00]/30 bg-[#F1BF00]/10 text-center text-sm text-[#F7F0DF]">{noticeMessage}</div>}
            {!solvedMysteryIds.includes(currentMystery.id) && !attemptedMysteryIds.includes(currentMystery.id) && (
              <button onClick={handleSkipMystery} className="mt-4 rounded-lg border border-white/20 px-4 py-2 text-xs text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                Pasar este misterio por ahora (sin puntos ni cifra)
              </button>
            )}
          </div>
        </main>
      )}

      {/* Act Combination Lock Screen */}
      {screen === 'ACT_LOCK' && (
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 flex flex-col items-center justify-center">
          <div className="w-full mb-4 flex items-center justify-between max-w-2xl">
            <button
              onClick={() => {
                playClickSound();
                setScreen('PLAYING_MYSTERY');
              }}
              className="text-xs text-[#F1BF00] hover:underline flex items-center gap-1"
            >
              <span>← Volver a los misterios del acto</span>
            </button>
          </div>

          <CombinationLock
            key={`${currentActId}-${earnedDigitsByAct[currentActId].length}`}
            actConfig={currentActConfig}
            expectedCode={earnedDigitsByAct[currentActId].join('')}
            recoveryPassed={recoveryPassedByAct[currentActId]}
            correctMysteriesCount={correctInCurrentAct}
            totalMysteriesInAct={currentActMysteries.length}
            onSuccess={handleLockSuccess}
            onRecoveryComplete={handleRecoveryComplete}
          />
        </main>
      )}

      {/* Act Summary Modal */}
      {screen === 'ACT_SUMMARY' && summaryData && (
        <ActSummaryModal
          actConfig={summaryData.actConfig}
          isKeyAwarded={summaryData.isKeyAwarded}
          isBonusAwarded={summaryData.isBonusAwarded}
          successPercentage={summaryData.successPercentage}
          onProceedNextAct={handleProceedNextAct}
        />
      )}

      {/* Secret Digit Reveal Modal */}
      {revealingDigit && (
        <DigitRevealModal
          digit={revealingDigit.digit}
          mysteryTitle={revealingDigit.title}
          onDismiss={handleDismissDigitModal}
        />
      )}

      {/* Time's Up Screen Modal */}
      {isTimeUpModalOpen && (
        <TimeUpModal
          onContinueRelaxed={() => {
            setIsTimeUpModalOpen(false);
            setIsRelaxedMode(true);
          }}
        />
      )}
    </div>
  );
}
