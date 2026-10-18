import React, { useState } from 'react';
import { Eye, ShieldAlert, Sparkles, CheckCircle2, Pin, MoveHorizontal, RotateCcw } from 'lucide-react';
import { playClickSound, playTumblerTick, playErrorSound } from '../../utils/audio';


function shuffleItems<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
// --- Mystery 13: Evidence Board Antagonist Identification ---
interface EvidenceBoardPuzzleProps {
  onSuccess: () => void;
  instructionText: string;
}

export const EvidenceBoardPuzzle: React.FC<EvidenceBoardPuzzleProps> = ({
  onSuccess,
  instructionText,
}) => {
  const [selectedSuspect, setSelectedSuspect] = useState<string>('');
  const [selectedDocId, setSelectedDocId] = useState<string | null>('doc-1');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const evidenceDocs = [
    {
      id: 'doc-1',
      title: 'Telegrama de Madrid',
      text: '«Quiero comprar el Atlas de los Siete Secretos. No quiero que otras personas lo lean. — El Coleccionista»',
      date: '10 Mayo 1936',
    },
    {
      id: 'doc-2',
      title: 'Nota manuscrita de Isabel',
      text: '«Un hombre quiere comprar mis mapas y guardarlos solo para él. La cultura es para todos. Voy al norte.»',
      date: '12 Mayo 1936',
    },
    {
      id: 'doc-3',
      title: 'Recibo de galería de arte',
      text: '«Isabel dice no. No quiere vender su libro. La carta es de El Coleccionista.»',
      date: '13 Mayo 1936',
    },
  ];

  const [suspectOptions] = useState(() => shuffleItems([
    { name: 'El Coleccionista', role: 'Un hombre rico que quiere el libro solo para él', isCorrect: true },
    { name: 'El Jefe de Estación', role: 'Un hombre que trabaja en la estación', isCorrect: false },
    { name: 'El Bibliotecario', role: 'Una persona que cuida los libros', isCorrect: false },
  ]));

  const handleVerify = () => {
    playClickSound();
    if (selectedSuspect === 'El Coleccionista') {
      setErrorMsg(null);
      onSuccess();
    } else {
      playErrorSound();
      setErrorMsg('No es correcto. Es «El Coleccionista».');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto parchment-texture rounded-lg p-5 sm:p-7 vintage-border shadow-2xl text-[#17243A]">
      <div className="border-b border-[#AA151B]/20 pb-2 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-[#AA151B]" />
          <h3 className="font-display font-bold text-base sm:text-lg text-[#AA151B]">
            Misterio 13: El nombre del coleccionista
          </h3>
        </div>
        <span className="text-xs font-typewriter text-[#17243A]/60">Las pistas</span>
      </div>

      <p className="text-sm font-body text-[#17243A]/90 mb-4 text-center">{instructionText}</p>

      {/* Corkboard / Evidence Board Simulation */}
      <div className="w-full max-w-xl mx-auto bg-[#cbb28d] p-4 rounded-lg border-4 border-[#7a4e2a] shadow-inner mb-6 relative overflow-hidden">
        {/* Red String overlay line */}
        <div className="text-[10px] font-typewriter text-[#AA151B] font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
          <Pin className="w-3.5 h-3.5 text-[#AA151B]" />
          <span>Papeles de la maleta:</span>
        </div>

        <div className="space-y-2 mb-3">
          {evidenceDocs.map((doc) => {
            const isSelected = selectedDocId === doc.id;
            return (
              <div
                key={doc.id}
                onClick={() => {
                  playClickSound();
                  setSelectedDocId(doc.id);
                }}
                className={`p-3 rounded bg-[#F7F0DF] border shadow-sm cursor-pointer transition-all ${
                  isSelected ? 'border-[#AA151B] ring-2 ring-[#AA151B]/50 scale-101' : 'border-stone-300 opacity-90'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-display font-bold text-[#AA151B] mb-1">
                  <span>{doc.title}</span>
                  <span className="font-typewriter text-[10px] text-stone-500">{doc.date}</span>
                </div>
                <p className="font-typewriter text-xs text-[#17243A] leading-relaxed italic">{doc.text}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Suspect Identification */}
      <div className="w-full max-w-md mx-auto">
        <label className="block text-xs font-semibold text-[#17243A] mb-2 font-display text-center">
          ¿Quién quiere el libro de Isabel?
        </label>
        <div className="space-y-2 mb-4">
          {suspectOptions.map((suspect) => {
            const isSelected = selectedSuspect === suspect.name;
            return (
              <button
                key={suspect.name}
                onClick={() => {
                  playClickSound();
                  setSelectedSuspect(suspect.name);
                }}
                className={`w-full p-2.5 rounded-md border text-left text-xs font-medium transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#AA151B] text-white border-[#AA151B] shadow ring-2 ring-[#F1BF00]'
                    : 'bg-white/80 hover:bg-white text-[#17243A] border-stone-300'
                }`}
              >
                <div>
                  <strong className="font-display font-bold block">{suspect.name}</strong>
                  <span className={`text-[11px] ${isSelected ? 'text-white/80' : 'text-stone-500'}`}>
                    {suspect.role}
                  </span>
                </div>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-[#F1BF00]" />}
              </button>
            );
          })}
        </div>

        {errorMsg && (
          <div className="mb-4 text-xs font-semibold text-[#AA151B] bg-red-100 p-2.5 rounded border border-red-300 text-center">
            {errorMsg}
          </div>
        )}

        <button
          onClick={handleVerify}
          disabled={!selectedSuspect}
          className="w-full py-2.5 px-4 rounded bg-[#17243A] hover:bg-[#25395a] text-[#F1BF00] font-display font-bold text-xs uppercase tracking-wider shadow transition-all disabled:opacity-40"
        >
          Comprobar respuesta
        </button>
      </div>
    </div>
  );
};

// --- Mystery 15: Final Word Assembly Puzzle ---
interface FinalWordsPuzzleProps {
  onSuccess: () => void;
  instructionText: string;
}

export const FinalWordsPuzzle: React.FC<FinalWordsPuzzleProps> = ({ onSuccess, instructionText }) => {
  const targetWords = ['Quiere', 'compartir', 'la', 'cultura'];
  const poolWords = ['compartir', 'la', 'cultura', 'Quiere'];

  const [assembled, setAssembled] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const addWord = (word: string) => {
    playTumblerTick();
    setAssembled((prev) => [...prev, word]);
  };

  const removeWord = (index: number) => {
    playTumblerTick();
    setAssembled((prev) => prev.filter((_, i) => i !== index));
  };

  const resetWords = () => {
    playClickSound();
    setAssembled([]);
    setErrorMsg(null);
  };

  const handleVerify = () => {
    playClickSound();
    const sentence = assembled.join(' ');
    if (sentence === 'Quiere compartir la cultura') {
      setErrorMsg(null);
      onSuccess();
    } else {
      playErrorSound();
      setErrorMsg('El orden es: «Quiere compartir la cultura».');
    }
  };

  // Remaining pool words
  const availableWords = poolWords.filter((w) => {
    const totalCount = poolWords.filter((x) => x === w).length;
    const usedCount = assembled.filter((x) => x === w).length;
    return usedCount < totalCount;
  });

  return (
    <div className="w-full max-w-3xl mx-auto parchment-texture rounded-lg p-5 sm:p-7 vintage-border shadow-2xl text-[#17243A]">
      <div className="border-b border-[#AA151B]/20 pb-2 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#AA151B]" />
          <h3 className="font-display font-bold text-base sm:text-lg text-[#AA151B]">
            Misterio 15: El último secreto
          </h3>
        </div>
        <span className="text-xs font-typewriter text-[#17243A]/60">La Revelación Final</span>
      </div>

      <p className="text-sm font-body text-[#17243A]/90 mb-2 text-center">{instructionText}</p>
      <p className="text-xs font-typewriter text-center text-[#AA151B] font-bold mb-6">
        Pregunta: «¿Qué quiere Isabel?»
      </p>

      {/* Assembled Sentence Box */}
      <div className="w-full max-w-xl mx-auto min-h-[90px] bg-white/95 rounded-lg border-2 border-dashed border-[#AA151B] p-4 flex flex-wrap items-center justify-center gap-2 mb-4 shadow-inner">
        {assembled.length === 0 ? (
          <span className="text-xs text-stone-400 font-typewriter">
            Pulsa las palabras de abajo en orden para construir la respuesta
          </span>
        ) : (
          assembled.map((word, idx) => (
            <button
              key={`${word}-${idx}`}
              onClick={() => removeWord(idx)}
              className="px-3.5 py-1.5 rounded bg-[#AA151B] text-white font-display font-bold text-sm shadow hover:bg-red-800 transition-colors flex items-center gap-1.5"
              title="Haz clic para quitar"
            >
              <span>{word}</span>
              <span className="text-white/60 text-xs">×</span>
            </button>
          ))
        )}
      </div>

      {/* Available Word Buttons */}
      <div className="w-full max-w-md mx-auto mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-[#17243A] font-display">
            Palabras disponibles:
          </label>
          {assembled.length > 0 && (
            <button
              onClick={resetWords}
              className="text-[11px] text-stone-500 hover:text-[#AA151B] flex items-center gap-1 font-typewriter"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reiniciar frase</span>
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {availableWords.map((word, idx) => (
            <button
              key={`${word}-${idx}`}
              onClick={() => addWord(word)}
              className="px-4 py-2 rounded bg-white hover:bg-amber-50 text-[#17243A] border-2 border-[#8A5A36] font-display font-bold text-sm shadow-sm transition-transform active:scale-95"
            >
              {word}
            </button>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="max-w-md mx-auto mb-4 text-xs font-semibold text-[#AA151B] bg-red-100 p-2.5 rounded border border-red-300 text-center">
          {errorMsg}
        </div>
      )}

      <button
        onClick={handleVerify}
        disabled={assembled.length !== targetWords.length}
        className="w-full max-w-md mx-auto block py-2.5 px-4 rounded bg-[#17243A] hover:bg-[#25395a] text-[#F1BF00] font-display font-bold text-xs uppercase tracking-wider shadow transition-all disabled:opacity-40"
      >
        Descubrir el secreto de Isabel
      </button>
    </div>
  );
};
