import React, { useState } from 'react';
import sagradaImage from '../../assets/images/sagrada_familia_vintage_1792245258386.jpg';
import alhambraImage from '../../assets/images/alhambra_palace_vintage_1792245259087.jpg';
import { Church, Sparkles, FileText, Music, CheckCircle2, ChevronUp, ChevronDown, MoveRight } from 'lucide-react';
import { playClickSound, playTumblerTick, playErrorSound } from '../../utils/audio';


function shuffleItems<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
// --- Mystery 4: Sagrada Família Landmark Identification ---
interface LandmarkPuzzleProps {
  onSuccess: () => void;
  instructionText: string;
}

export const LandmarkPuzzle: React.FC<LandmarkPuzzleProps> = ({ onSuccess, instructionText }) => {
  const [selectedLandmark, setSelectedLandmark] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [landmarks] = useState(() => shuffleItems([
    { name: 'Sagrada Família', architect: 'Antoni Gaudí', city: 'Barcelona', isCorrect: true },
    { name: 'Catedral de Burgos', architect: 'Maestro Enrique', city: 'Burgos', isCorrect: false },
    { name: 'Mezquita de Córdoba', architect: 'Califato Omeya', city: 'Córdoba', isCorrect: false },
  ]));

  const handleVerify = () => {
    playClickSound();
    if (selectedLandmark === 'Sagrada Família') {
      setErrorMsg(null);
      onSuccess();
    } else {
      playErrorSound();
      setErrorMsg('No es este lugar. Mira la foto de Barcelona.');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto parchment-texture rounded-lg p-5 sm:p-7 vintage-border shadow-2xl text-[#17243A]">
      <div className="border-b border-[#AA151B]/20 pb-2 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Church className="w-5 h-5 text-[#AA151B]" />
          <h3 className="font-display font-bold text-base sm:text-lg text-[#AA151B]">
            Misterio 4: La iglesia de Barcelona
          </h3>
        </div>
        <span className="text-xs font-typewriter text-[#17243A]/60">Tarjeta Postal n.º 18</span>
      </div>

      <p className="text-sm font-body text-[#17243A]/90 mb-4 text-center">{instructionText}</p>

      {/* Postcard Image */}
      <div className="w-full max-w-lg mx-auto bg-white p-3 rounded-md shadow-lg border border-stone-300 mb-6 rotate-[-0.5deg]">
        <div className="relative aspect-[4/3] rounded overflow-hidden border border-stone-200">
          <img
            src={sagradaImage}
            alt="Postal de la Sagrada Familia de Antoni Gaudi"
            className="w-full h-full object-cover filter contrast-[1.05]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-2 left-2 right-2 bg-black/60 text-white text-[11px] font-typewriter px-2 py-1 rounded backdrop-blur-xs text-center">
            «Iglesia famosa de Barcelona · Antoni Gaudí»
          </div>
        </div>
      </div>

      {/* Selection */}
      <div className="w-full max-w-md mx-auto">
        <label className="block text-xs font-semibold text-[#17243A] mb-2 font-display text-center">
          ¿Qué lugar ves en la foto?
        </label>
        <div className="space-y-2 mb-4">
          {landmarks.map((l) => (
            <button
              key={l.name}
              onClick={() => {
                playClickSound();
                setSelectedLandmark(l.name);
              }}
              className={`w-full p-3 rounded-md border text-left text-xs font-medium transition-all flex items-center justify-between ${
                selectedLandmark === l.name
                  ? 'bg-[#AA151B] text-white border-[#AA151B] shadow-md ring-2 ring-[#F1BF00]'
                  : 'bg-white/80 hover:bg-white text-[#17243A] border-stone-300'
              }`}
            >
              <div>
                <span className="font-bold font-display text-sm block">{l.name}</span>
                <span className={`text-[11px] ${selectedLandmark === l.name ? 'text-white/80' : 'text-stone-500'}`}>
                  Ciudad: {l.city} · Arquitecto: {l.architect}
                </span>
              </div>
              {selectedLandmark === l.name && <CheckCircle2 className="w-4 h-4 text-[#F1BF00]" />}
            </button>
          ))}
        </div>

        {errorMsg && (
          <div className="mb-4 text-xs font-semibold text-[#AA151B] bg-red-100 p-2.5 rounded border border-red-300 text-center">
            {errorMsg}
          </div>
        )}

        <button
          onClick={handleVerify}
          disabled={!selectedLandmark}
          className="w-full py-2.5 px-4 rounded bg-[#17243A] hover:bg-[#25395a] text-[#F1BF00] font-display font-bold text-xs uppercase tracking-wider shadow transition-all disabled:opacity-40"
        >
          Confirmar Monumento
        </button>
      </div>
    </div>
  );
};

// --- Mystery 5: Alhambra Star Counting Puzzle ---
interface StarCountingPuzzleProps {
  onSuccess: () => void;
  instructionText: string;
}

export const StarCountingPuzzle: React.FC<StarCountingPuzzleProps> = ({ onSuccess, instructionText }) => {
  const [starCount, setStarCount] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Exact 4 interactive highlighted stars positioned in the night sky over the Alhambra
  const highlightedStars = [
    { id: 1, x: 50, y: 15, name: 'Estrella de Oriente' },
    { id: 2, x: 58, y: 22, name: 'Estrella de la Vega' },
    { id: 3, x: 67, y: 18, name: 'Estrella de Sierra Nevada' },
    { id: 4, x: 42, y: 26, name: 'Estrella del Darro' },
  ];

  const handleVerify = () => {
    playClickSound();
    if (starCount === 4) {
      setErrorMsg(null);
      onSuccess();
    } else {
      playErrorSound();
      setErrorMsg('Conteo incorrecto. Observa atentamente las estrellas doradas numeradas en el cielo nocturno.');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto parchment-texture rounded-lg p-5 sm:p-7 vintage-border shadow-2xl text-[#17243A]">
      <div className="border-b border-[#AA151B]/20 pb-2 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#AA151B]" />
          <h3 className="font-display font-bold text-base sm:text-lg text-[#AA151B]">
            Misterio 5: El palacio de Granada
          </h3>
        </div>
        <span className="text-xs font-typewriter text-[#17243A]/60">Alhambra de Granada</span>
      </div>

      <p className="text-sm font-body text-[#17243A]/90 mb-4 text-center">{instructionText}</p>

      {/* Alhambra Illustration with 4 distinct glowing stars */}
      <div className="relative w-full max-w-xl mx-auto rounded-md overflow-hidden border-2 border-[#8A5A36] shadow-xl mb-6">
        <img
          src={alhambraImage}
          alt="Palacio de la Alhambra de noche"
          className="w-full h-auto object-cover"
          referrerPolicy="no-referrer"
        />

        {/* 4 Highlighted Stars overlay */}
        {highlightedStars.map((star, idx) => (
          <div
            key={star.id}
            style={{ left: `${star.x}%`, top: `${star.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group"
          >
            <div className="relative">
              <Sparkles className="w-6 h-6 text-[#F1BF00] animate-pulse drop-shadow-[0_0_8px_rgba(241,191,0,0.9)]" />
              <div className="absolute inset-0 bg-[#F1BF00]/30 rounded-full animate-ping pointer-events-none" />
            </div>
            <span className="font-typewriter text-[9px] font-bold text-white bg-black/70 px-1 rounded shadow -mt-0.5 pointer-events-none">
              ★ {idx + 1}
            </span>
          </div>
        ))}

        <div className="absolute bottom-2 left-2 right-2 bg-black/60 text-[#F1BF00] font-typewriter text-[11px] text-center p-1 rounded backdrop-blur-xs">
          Cielo sobre el Patio de los Arrayanes · Granada
        </div>
      </div>

      {/* Star Counter Control */}
      <div className="w-full max-w-xs mx-auto flex flex-col items-center">
        <label className="text-xs font-display font-bold text-[#17243A] mb-2">
          Número de estrellas doradas en el cielo:
        </label>

        <div className="flex items-center gap-4 bg-white/90 p-2 rounded-lg border border-stone-400 shadow-inner mb-4">
          <button
            onClick={() => {
              playTumblerTick();
              setStarCount((prev) => Math.max(0, prev - 1));
            }}
            className="w-10 h-10 rounded bg-[#17243A] text-white flex items-center justify-center hover:bg-[#25395a] transition-colors"
          >
            <ChevronDown className="w-5 h-5" />
          </button>

          <span className="font-mono text-3xl font-extrabold text-[#AA151B] tabular-nums w-12 text-center">
            {starCount}
          </span>

          <button
            onClick={() => {
              playTumblerTick();
              setStarCount((prev) => Math.min(10, prev + 1));
            }}
            className="w-10 h-10 rounded bg-[#17243A] text-white flex items-center justify-center hover:bg-[#25395a] transition-colors"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 text-xs font-semibold text-[#AA151B] bg-red-100 p-2.5 rounded border border-red-300 text-center w-full">
            {errorMsg}
          </div>
        )}

        <button
          onClick={handleVerify}
          className="w-full py-2.5 px-4 rounded bg-[#AA151B] hover:bg-[#881015] text-[#F7F0DF] font-display font-bold text-xs uppercase tracking-wider shadow transition-all"
        >
          Enviar Conteo de Estrellas
        </button>
      </div>
    </div>
  );
};

// --- Mystery 6: Madrid Letter Reconstruction Puzzle ---
interface LetterReconstructPuzzleProps {
  onSuccess: () => void;
  instructionText: string;
}

export const LetterReconstructPuzzle: React.FC<LetterReconstructPuzzleProps> = ({
  onSuccess,
  instructionText,
}) => {
  const initialFragments = [
    { id: 'frag-3', text: 'para firmar el contrato.', correctPos: 3 },
    { id: 'frag-1', text: 'Deseo comprar su Atlas de España.', correctPos: 1 },
    { id: 'frag-0', text: 'Estimada Señora Isabel:', correctPos: 0 },
    { id: 'frag-2', text: 'Visite mi galería en Madrid', correctPos: 2 },
  ];

  const [order, setOrder] = useState<string[]>(['frag-3', 'frag-1', 'frag-0', 'frag-2']);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const moveUp = (index: number) => {
    if (index === 0) return;
    playTumblerTick();
    const newOrder = [...order];
    const temp = newOrder[index - 1];
    newOrder[index - 1] = newOrder[index];
    newOrder[index] = temp;
    setOrder(newOrder);
  };

  const moveDown = (index: number) => {
    if (index === order.length - 1) return;
    playTumblerTick();
    const newOrder = [...order];
    const temp = newOrder[index + 1];
    newOrder[index + 1] = newOrder[index];
    newOrder[index] = temp;
    setOrder(newOrder);
  };

  const isOrderCorrect =
    order[0] === 'frag-0' && order[1] === 'frag-1' && order[2] === 'frag-2' && order[3] === 'frag-3';

  const handleVerify = () => {
    playClickSound();
    if (!isOrderCorrect) {
      playErrorSound();
      setErrorMsg('El orden de las líneas no es coherente. Reconstruye el saludo, la propuesta y la invitación.');
      return;
    }
    if (selectedCity !== 'Madrid') {
      playErrorSound();
      setErrorMsg('La ciudad asociada al coleccionista debe coincidir con la mencionada en el texto (Madrid).');
      return;
    }
    setErrorMsg(null);
    onSuccess();
  };

  return (
    <div className="w-full max-w-3xl mx-auto parchment-texture rounded-lg p-5 sm:p-7 vintage-border shadow-2xl text-[#17243A]">
      <div className="border-b border-[#AA151B]/20 pb-2 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#AA151B]" />
          <h3 className="font-display font-bold text-base sm:text-lg text-[#AA151B]">
            Misterio 6: La carta de Madrid
          </h3>
        </div>
        <span className="text-xs font-typewriter text-[#17243A]/60">Documento Rasgado</span>
      </div>

      <p className="text-sm font-body text-[#17243A]/90 mb-4 text-center">{instructionText}</p>

      {/* Torn Letter Fragments */}
      <div className="w-full max-w-xl mx-auto space-y-2 mb-6">
        {order.map((fragId, idx) => {
          const item = initialFragments.find((f) => f.id === fragId)!;
          return (
            <div
              key={fragId}
              className="flex items-center justify-between bg-white/90 p-3 rounded border-2 border-dashed border-[#8A5A36]/50 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-stone-400 font-bold">Línea {idx + 1}</span>
                <span className="font-typewriter text-sm font-semibold text-[#17243A]">{item.text}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => moveUp(idx)}
                  disabled={idx === 0}
                  className="p-1 text-stone-600 hover:text-[#AA151B] disabled:opacity-20"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveDown(idx)}
                  disabled={idx === order.length - 1}
                  className="p-1 text-stone-600 hover:text-[#AA151B] disabled:opacity-20"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {isOrderCorrect && (
        <div className="w-full max-w-xl mx-auto mb-6 p-3 bg-amber-50 rounded border border-amber-300 text-xs font-typewriter text-[#17243A] text-center">
          ✓ Carta armada: «Estimada Señora Isabel: Deseo comprar su Atlas de España. Visite mi galería en Madrid para firmar el contrato.»
        </div>
      )}

      {/* City Confirmation */}
      <div className="w-full max-w-md mx-auto">
        <label className="block text-xs font-semibold text-[#17243A] mb-2 font-display text-center">
          ¿En qué ciudad se encuentra la galería del coleccionista?
        </label>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {['Toledo', 'Madrid', 'Zaragoza'].map((city) => (
            <button
              key={city}
              onClick={() => {
                playClickSound();
                setSelectedCity(city);
              }}
              className={`py-2 px-3 rounded text-xs font-semibold transition-all border ${
                selectedCity === city
                  ? 'bg-[#AA151B] text-white border-[#AA151B] ring-2 ring-[#F1BF00]'
                  : 'bg-white/80 hover:bg-white text-[#17243A] border-stone-300'
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {errorMsg && (
          <div className="mb-4 text-xs font-semibold text-[#AA151B] bg-red-100 p-2.5 rounded border border-red-300 text-center">
            {errorMsg}
          </div>
        )}

        <button
          onClick={handleVerify}
          className="w-full py-2.5 px-4 rounded bg-[#17243A] hover:bg-[#25395a] text-[#F1BF00] font-display font-bold text-xs uppercase tracking-wider shadow transition-all"
        >
          Verificar Carta y Ciudad
        </button>
      </div>
    </div>
  );
};

// --- Mystery 7: Flamenco Dance Clue Matching ---
interface FlamencoDancePuzzleProps {
  onSuccess: () => void;
  instructionText: string;
}

export const FlamencoDancePuzzle: React.FC<FlamencoDancePuzzleProps> = ({
  onSuccess,
  instructionText,
}) => {
  const [selectedClue, setSelectedClue] = useState<string | null>(null);
  const [droppedClue, setDroppedClue] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [clues] = useState(() => shuffleItems([
    { text: 'La mujer baila', isCorrect: true },
    { text: 'El tren viaja', isCorrect: false },
    { text: 'El libro duerme', isCorrect: false },
  ]));

  const handleDrop = (clueText: string) => {
    playTumblerTick();
    setDroppedClue(clueText);
  };

  const handleVerify = () => {
    playClickSound();
    if (droppedClue === 'La mujer baila') {
      setErrorMsg(null);
      onSuccess();
    } else {
      playErrorSound();
      setErrorMsg('Esa frase no coincide con la acción del baile flamenco. Selecciona «La mujer baila».');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto parchment-texture rounded-lg p-5 sm:p-7 vintage-border shadow-2xl text-[#17243A]">
      <div className="border-b border-[#AA151B]/20 pb-2 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Music className="w-5 h-5 text-[#AA151B]" />
          <h3 className="font-display font-bold text-base sm:text-lg text-[#AA151B]">
            Misterio 7: El baile de Sevilla
          </h3>
        </div>
        <span className="text-xs font-typewriter text-[#17243A]/60">Arte y Tradición Andaluza</span>
      </div>

      <p className="text-sm font-body text-[#17243A]/90 mb-4 text-center">{instructionText}</p>

      {/* Flamenco Stage Scene Graphic */}
      <div className="w-full max-w-lg mx-auto bg-[#17243A] rounded-lg p-4 shadow-xl border-2 border-[#AA151B] mb-6 flex flex-col items-center text-white">
        {/* SVG Illustration of Flamenco Dancer silhouette with vibrant dress */}
        <div className="relative w-48 h-56 flex items-center justify-center">
          <svg viewBox="0 0 200 240" className="w-full h-full">
            {/* Stage Arch */}
            <path d="M 20,220 Q 100,40 180,220" fill="none" stroke="#F1BF00" strokeWidth="2" strokeDasharray="3,3" opacity="0.6" />
            {/* Dancer Silhouette in red ruffles */}
            <g transform="translate(100, 110)">
              {/* Head & hair with flower */}
              <circle cx="0" cy="-65" r="14" fill="#F7F0DF" />
              <path d="M -8,-75 Q 0,-85 8,-75 Q 12,-65 8,-55 Z" fill="#222" />
              <circle cx="8" cy="-70" r="4" fill="#AA151B" /> {/* Red flower */}
              {/* Torso & arms in flamenco pose */}
              <path d="M 0,-50 Q -15,-65 -35,-80 Q -25,-60 0,-40" fill="none" stroke="#F7F0DF" strokeWidth="6" strokeLinecap="round" />
              <path d="M 0,-50 Q 25,-40 38,-70 Q 30,-50 0,-40" fill="none" stroke="#F7F0DF" strokeWidth="6" strokeLinecap="round" />
              {/* Dress body */}
              <path d="M -12,-40 L 12,-40 L 18,-15 L -18,-15 Z" fill="#AA151B" />
              {/* Volantes (ruffles) of the skirt */}
              <path d="M -18,-15 Q -40,40 -65,85 Q 0,100 65,85 Q 40,40 18,-15 Z" fill="#AA151B" />
              <path d="M -30,20 Q 0,40 30,20 Q 45,55 -45,55 Z" fill="#c41c23" />
              <path d="M -45,55 Q 0,75 45,55 Q 60,85 -60,85 Z" fill="#881015" stroke="#F1BF00" strokeWidth="1" />
              {/* Castanets in hands */}
              <circle cx="-35" cy="-80" r="3" fill="#663300" />
              <circle cx="38" cy="-70" r="3" fill="#663300" />
            </g>
          </svg>
        </div>

        {/* Drop Target Frame */}
        <div
          onClick={() => selectedClue && handleDrop(selectedClue)}
          className={`w-full max-w-sm p-3 rounded-md border-2 border-dashed transition-all text-center cursor-pointer mt-2 ${
            droppedClue
              ? 'bg-[#AA151B]/30 border-[#F1BF00] text-[#F1BF00]'
              : 'bg-black/40 border-white/30 text-white/60 hover:border-[#F1BF00]'
          }`}
        >
          {droppedClue ? (
            <div className="flex items-center justify-center gap-2 font-display font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-[#F1BF00]" />
              <span>Frase asignada: «{droppedClue}»</span>
            </div>
          ) : (
            <div className="text-xs font-typewriter">
              {selectedClue
                ? `Haz clic aquí para asignar: «${selectedClue}»`
                : 'Selecciona una frase abajo y colócala aquí'}
            </div>
          )}
        </div>
      </div>

      {/* Clue Options to Drag or Tap */}
      <div className="w-full max-w-md mx-auto">
        <label className="block text-xs font-semibold text-[#17243A] mb-2 font-display text-center">
          Frases disponibles:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
          {clues.map((clue) => {
            const isSelected = selectedClue === clue.text;
            return (
              <button
                key={clue.text}
                onClick={() => {
                  playClickSound();
                  setSelectedClue(clue.text);
                  handleDrop(clue.text);
                }}
                className={`p-2.5 rounded text-xs font-semibold transition-all border text-center ${
                  droppedClue === clue.text
                    ? 'bg-[#AA151B] text-white border-[#AA151B] ring-2 ring-[#F1BF00]'
                    : isSelected
                    ? 'bg-amber-100 text-[#17243A] border-[#AA151B]'
                    : 'bg-white/80 hover:bg-white text-[#17243A] border-stone-300'
                }`}
              >
                «{clue.text}»
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
          disabled={!droppedClue}
          className="w-full py-2.5 px-4 rounded bg-[#17243A] hover:bg-[#25395a] text-[#F1BF00] font-display font-bold text-xs uppercase tracking-wider shadow transition-all disabled:opacity-40"
        >
          Confirmar Asociación Cultural
        </button>
      </div>
    </div>
  );
};
