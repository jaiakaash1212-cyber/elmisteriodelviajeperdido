import React, { useState } from 'react';
import archiveDeskImage from '../assets/images/vintage_archive_desk_1792245258230.jpg';
import { Award, Key, Clock, CheckCircle2, RotateCcw, ShieldCheck, Mail, Sparkles } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface FinalVictoryProps {
  solvedMysteriesCount: number;
  keysCount: number;
  rawScore: number;
  finalScore100: number;
  timeUsedSeconds: number;
  onRestartGame: () => void;
}

export const FinalVictory: React.FC<FinalVictoryProps> = ({
  solvedMysteriesCount,
  keysCount,
  rawScore,
  finalScore100,
  timeUsedSeconds,
  onRestartGame,
}) => {
  const [isLetterOpened, setIsLetterOpened] = useState(true);

  const minutesUsed = Math.floor(timeUsedSeconds / 60);
  const secondsUsed = timeUsedSeconds % 60;
  const timeUsedFormatted = `${String(minutesUsed).padStart(2, '0')}:${String(secondsUsed).padStart(2, '0')}`;

  const handleRestart = () => {
    playClickSound();
    onRestartGame();
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 bg-[#17243A] text-[#F7F0DF] overflow-y-auto">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <img
          src={archiveDeskImage}
          alt="Archivo de 1936"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-[#17243A]/90" />
      </div>

      <div className="relative z-10 max-w-3xl w-full my-auto parchment-texture text-[#17243A] rounded-xl p-6 sm:p-10 vintage-border shadow-2xl border-4 border-[#AA151B]">
        {/* Header Badge */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto rounded-full wax-seal flex items-center justify-center shadow-xl border-4 border-[#F1BF00] mb-3">
            <Sparkles className="w-10 h-10 text-[#F1BF00]" />
          </div>
          <span className="font-typewriter text-xs font-bold text-[#AA151B] uppercase tracking-widest block">
            Caso Resuelto · Archivo Histórico de 1936
          </span>
          <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-[#17243A] mt-1">
            El Misterio del Viaje Perdido
          </h1>
          <p className="font-typewriter text-xs sm:text-sm text-stone-600 mt-1">
            La historia de Isabel
          </p>
        </div>

        {/* Dramatic Letter from Isabel with exact required message */}
        <div className="bg-white/95 p-6 sm:p-8 rounded-lg border-2 border-[#8A5A36] shadow-md mb-8 relative font-typewriter">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-stone-200 text-[#AA151B] font-display font-bold text-sm">
            <Mail className="w-4 h-4" />
            <span>Carta de Isabel</span>
          </div>

          <p className="text-sm sm:text-base text-[#17243A]/90 leading-relaxed mb-4">
            «Hola, detective:»
          </p>
          <p className="text-sm sm:text-base text-[#17243A]/90 leading-relaxed mb-4">
            Un hombre quiere comprar mi libro. Su nombre es El Coleccionista. Quiere guardar el libro solo para él.
            Yo no quiero eso. Los libros, la música, el arte y las historias son para todos.
            Por eso pongo pistas en muchas ciudades. ¡Tú encuentras las pistas y me ayudas!
            <br />
            <strong>Palabra nueva:</strong> coleccionista = una persona que guarda muchas cosas parecidas.
          </p>

          {/* EXACT REQUIRED MESSAGE AS MANDATED BY SECTION 11 */}
          <div className="bg-[#17243A] text-[#F1BF00] p-4 sm:p-5 rounded-md my-4 border-l-4 border-[#AA151B] shadow-inner font-display font-bold text-base sm:text-lg leading-relaxed text-center">
            «¡Felicidades! Has resuelto los quince misterios. Isabel está a salvo. La cultura es para
            todos. Gracias por cuidar las historias de España. ¡Eres un guardián de la cultura!»
          </div>

          <div className="text-right mt-4 font-typewriter text-xs text-stone-600">
            — Isabel de la Vega · Santiago de Compostela, 1936
          </div>
        </div>

        {/* Final Statistics Breakdown */}
        <div className="border-t border-[#AA151B]/20 pt-6 mb-8">
          <h3 className="font-display font-bold text-base text-[#AA151B] mb-4 text-center">
            Tu resultado
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-white/80 p-3 rounded border border-stone-300 shadow-sm">
              <span className="text-[11px] font-typewriter text-stone-500 uppercase block">Misterios</span>
              <span className="font-mono text-2xl font-extrabold text-[#17243A] tabular-nums">
                {solvedMysteriesCount}/15
              </span>
            </div>

            <div className="bg-white/80 p-3 rounded border border-stone-300 shadow-sm">
              <span className="text-[11px] font-typewriter text-stone-500 uppercase block">Llaves</span>
              <span className="font-mono text-2xl font-extrabold text-[#AA151B] tabular-nums">
                {keysCount}/4
              </span>
            </div>

            <div className="bg-white/80 p-3 rounded border border-stone-300 shadow-sm">
              <span className="text-[11px] font-typewriter text-stone-500 uppercase block">Puntos Brutos</span>
              <span className="font-mono text-2xl font-extrabold text-stone-800 tabular-nums">
                {rawScore}/150
              </span>
            </div>

            <div className="bg-white/80 p-3 rounded border border-stone-300 shadow-sm ring-2 ring-[#F1BF00]">
              <span className="text-[11px] font-typewriter text-[#AA151B] font-bold uppercase block">
                Puntuación Final
              </span>
              <span className="font-mono text-2xl font-extrabold text-[#AA151B] tabular-nums">
                {finalScore100}/100
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs font-typewriter text-stone-600">
            <Clock className="w-3.5 h-3.5 text-[#AA151B]" />
            <span>Tiempo de juego: <strong>{timeUsedFormatted}</strong></span>
          </div>
        </div>

        {/* Action Button: Play Again */}
        <div className="flex flex-col items-center">
          <button
            onClick={handleRestart}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-[#AA151B] hover:bg-[#881015] text-[#F7F0DF] font-display font-bold text-sm uppercase tracking-wider shadow-xl transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4 text-[#F1BF00]" />
            <span>Jugar de Nuevo</span>
          </button>
          <span className="text-xs text-stone-500 mt-2 font-typewriter">
            Empieza el juego otra vez
          </span>
        </div>
      </div>
    </div>
  );
};
