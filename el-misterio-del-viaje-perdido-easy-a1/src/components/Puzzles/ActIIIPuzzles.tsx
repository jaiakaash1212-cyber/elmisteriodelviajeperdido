import React, { useState } from 'react';
import { Columns, Utensils, Map, FileCode, ChevronUp, ChevronDown, CheckCircle2, ArrowRight } from 'lucide-react';
import { playClickSound, playTumblerTick, playErrorSound } from '../../utils/audio';


function shuffleItems<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
// --- Mystery 8: Segovia Aqueduct Arches Counting Puzzle ---
interface AqueductPuzzleProps {
  onSuccess: () => void;
  instructionText: string;
}

export const AqueductPuzzle: React.FC<AqueductPuzzleProps> = ({ onSuccess, instructionText }) => {
  const [archCount, setArchCount] = useState<number>(0);
  const [clickedArches, setClickedArches] = useState<number[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Exactly 6 marked Roman arches
  const arches = [
    { id: 1, label: 'Arco I', x: 18, y: 32 },
    { id: 2, label: 'Arco II', x: 50, y: 32 },
    { id: 3, label: 'Arco III', x: 82, y: 32 },
    { id: 4, label: 'Arco IV', x: 25, y: 68 },
    { id: 5, label: 'Arco V', x: 50, y: 68 },
    { id: 6, label: 'Arco VI', x: 75, y: 68 },
  ];

  const toggleArch = (id: number) => {
    playTumblerTick();
    setClickedArches((prev) => {
      const next = prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id];
      setArchCount(next.length);
      return next;
    });
  };

  const handleVerify = () => {
    playClickSound();
    if (archCount === 6) {
      setErrorMsg(null);
      onSuccess();
    } else {
      playErrorSound();
      setErrorMsg('Conteo incorrecto. Cuenta exactamente los arcos romanos destacados marcados en el acueducto.');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto parchment-texture rounded-lg p-5 sm:p-7 vintage-border shadow-2xl text-[#17243A]">
      <div className="border-b border-[#AA151B]/20 pb-2 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Columns className="w-5 h-5 text-[#AA151B]" />
          <h3 className="font-display font-bold text-base sm:text-lg text-[#AA151B]">
            Misterio 8: El acueducto de Segovia
          </h3>
        </div>
        <span className="text-xs font-typewriter text-[#17243A]/60">Monumento Romano</span>
      </div>

      <p className="text-sm font-body text-[#17243A]/90 mb-4 text-center">{instructionText}</p>

      {/* Segovia Aqueduct Graphic with 6 clickable Roman stone arches */}
      <div className="relative w-full max-w-xl mx-auto aspect-[16/10] bg-[#E5D7B7] rounded-md border-2 border-[#8A5A36] shadow-xl overflow-hidden mb-6 p-4">
        <svg viewBox="0 0 600 380" className="w-full h-full">
          {/* Sky gradient */}
          <rect width="600" height="380" fill="#E8F1F5" opacity="0.6" />

          {/* Sierra de Guadarrama mountains background */}
          <path d="M 0,220 L 120,130 L 250,190 L 380,110 L 520,180 L 600,140 L 600,380 L 0,380 Z" fill="#C5D3C8" opacity="0.5" />

          {/* Roman Stone Masonry Pillars */}
          {/* Upper tier pillars */}
          <rect x="70" y="40" width="40" height="130" fill="#A48C6B" stroke="#68553B" strokeWidth="2" />
          <rect x="230" y="40" width="40" height="130" fill="#A48C6B" stroke="#68553B" strokeWidth="2" />
          <rect x="390" y="40" width="40" height="130" fill="#A48C6B" stroke="#68553B" strokeWidth="2" />
          <rect x="550" y="40" width="40" height="130" fill="#A48C6B" stroke="#68553B" strokeWidth="2" />

          {/* Horizontal cornice */}
          <rect x="0" y="160" width="600" height="24" fill="#8C7353" stroke="#5C4B35" strokeWidth="2" />

          {/* Lower tier pillars */}
          <rect x="60" y="184" width="55" height="190" fill="#967E5E" stroke="#5C4B35" strokeWidth="2" />
          <rect x="220" y="184" width="55" height="190" fill="#967E5E" stroke="#5C4B35" strokeWidth="2" />
          <rect x="380" y="184" width="55" height="190" fill="#967E5E" stroke="#5C4B35" strokeWidth="2" />
          <rect x="540" y="184" width="55" height="190" fill="#967E5E" stroke="#5C4B35" strokeWidth="2" />

          {/* Upper 3 Arches */}
          <path d="M 110,160 A 60,60 0 0,0 230,160 Z" fill="#E8F1F5" stroke="#AA151B" strokeWidth="3" />
          <path d="M 270,160 A 60,60 0 0,0 390,160 Z" fill="#E8F1F5" stroke="#AA151B" strokeWidth="3" />
          <path d="M 430,160 A 60,60 0 0,0 550,160 Z" fill="#E8F1F5" stroke="#AA151B" strokeWidth="3" />

          {/* Lower 3 Arches */}
          <path d="M 115,360 A 52,100 0 0,0 220,360 Z" fill="#E8F1F5" stroke="#AA151B" strokeWidth="3" />
          <path d="M 275,360 A 52,100 0 0,0 380,360 Z" fill="#E8F1F5" stroke="#AA151B" strokeWidth="3" />
          <path d="M 435,360 A 52,100 0 0,0 540,360 Z" fill="#E8F1F5" stroke="#AA151B" strokeWidth="3" />
        </svg>

        {/* Interactive Clickable Arch Badges */}
        {arches.map((arch) => {
          const isSelected = clickedArches.includes(arch.id);
          return (
            <button
              key={arch.id}
              onClick={() => toggleArch(arch.id)}
              style={{ left: `${arch.x}%`, top: `${arch.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 px-2.5 py-1 rounded-full text-xs font-display font-bold shadow-md transition-transform hover:scale-110 flex items-center gap-1 ${
                isSelected
                  ? 'bg-[#AA151B] text-white ring-2 ring-[#F1BF00]'
                  : 'bg-white/90 text-[#17243A] hover:bg-white border border-stone-400'
              }`}
            >
              <span>{arch.label}</span>
              {isSelected && <span className="text-[#F1BF00]">✓</span>}
            </button>
          );
        })}
      </div>

      {/* Arch Counter Control */}
      <div className="w-full max-w-xs mx-auto flex flex-col items-center">
        <label className="text-xs font-display font-bold text-[#17243A] mb-2">
          Número total de arcos destacados:
        </label>

        <div className="flex items-center gap-4 bg-white/90 p-2 rounded-lg border border-stone-400 shadow-inner mb-4">
          <button
            onClick={() => {
              playTumblerTick();
              setArchCount((prev) => Math.max(0, prev - 1));
            }}
            className="w-10 h-10 rounded bg-[#17243A] text-white flex items-center justify-center hover:bg-[#25395a] transition-colors"
          >
            <ChevronDown className="w-5 h-5" />
          </button>

          <span className="font-mono text-3xl font-extrabold text-[#AA151B] tabular-nums w-12 text-center">
            {archCount}
          </span>

          <button
            onClick={() => {
              playTumblerTick();
              setArchCount((prev) => Math.min(12, prev + 1));
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
          Confirmar Número de Arcos
        </button>
      </div>
    </div>
  );
};

// --- Mystery 10: Secret Basque Food (Pintxos) Matching ---
interface FoodMatchPuzzleProps {
  onSuccess: () => void;
  instructionText: string;
}

export const FoodMatchPuzzle: React.FC<FoodMatchPuzzleProps> = ({ onSuccess, instructionText }) => {
  const [selectedFood, setSelectedFood] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [foods] = useState(() => shuffleItems([
    {
      id: 'paella',
      name: 'Paella Valenciana',
      desc: 'Arroz con pollo y verduras. Es una comida típica de Valencia.',
      isCorrect: false,
      tag: 'Plato grande de arroz',
    },
    {
      id: 'pintxos',
      name: 'Pintxos',
      desc: 'Pequeños trozos de pan con comida. Son populares en el norte.',
      isCorrect: true,
      tag: 'Pan pequeño con comida',
    },
    {
      id: 'gazpacho',
      name: 'Gazpacho Andaluz',
      desc: 'Sopa fría de tomate. Es típica del sur de España.',
      isCorrect: false,
      tag: 'Sopa fría en cuenco',
    },
    {
      id: 'churros',
      name: 'Churros con Chocolate',
      desc: 'Masa frita alargada con chocolate caliente dulce para desayunar.',
      isCorrect: false,
      tag: 'Dulce tradicional',
    },
  ]));

  const handleVerify = () => {
    playClickSound();
    if (selectedFood === 'pintxos') {
      setErrorMsg(null);
      onSuccess();
    } else {
      playErrorSound();
      setErrorMsg('No coincide con la pista: «Son pequeños. Son muy populares en el norte de España». Selecciona los pintxos.');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto parchment-texture rounded-lg p-5 sm:p-7 vintage-border shadow-2xl text-[#17243A]">
      <div className="border-b border-[#AA151B]/20 pb-2 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Utensils className="w-5 h-5 text-[#AA151B]" />
          <h3 className="font-display font-bold text-base sm:text-lg text-[#AA151B]">
            Misterio 10: La comida secreta
          </h3>
        </div>
        <span className="text-xs font-typewriter text-[#17243A]/60">Gastronomía Tradicional</span>
      </div>

      <p className="text-sm font-body text-[#17243A]/90 mb-4 text-center">{instructionText}</p>

      {/* Clue Reminder Box */}
      <div className="max-w-md mx-auto mb-6 p-3 bg-amber-50 rounded border border-amber-300 text-center font-typewriter text-xs text-[#17243A]">
        «Pista de Isabel: Son pequeños y populares en el norte».
      </div>

      {/* Food Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {foods.map((food) => {
          const isSelected = selectedFood === food.id;
          return (
            <button
              key={food.id}
              onClick={() => {
                playClickSound();
                setSelectedFood(food.id);
              }}
              className={`p-4 rounded-lg border-2 text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-[#AA151B] shadow-lg ring-2 ring-[#F1BF00]'
                  : 'bg-white/80 hover:bg-white border-stone-300 shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-display font-bold text-sm text-[#17243A]">{food.name}</h4>
                  <span className="text-[10px] font-typewriter px-2 py-0.5 rounded bg-black/5 text-[#AA151B] font-semibold">
                    {food.tag}
                  </span>
                </div>
                <p className="font-body text-xs text-stone-600 leading-relaxed">{food.desc}</p>
              </div>

              {isSelected && (
                <div className="mt-2 text-xs font-semibold text-[#AA151B] flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-[#F1BF00]" />
                  <span>Seleccionado para el informe</span>
                </div>
              )}
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
        disabled={!selectedFood}
        className="w-full max-w-md mx-auto block py-2.5 px-4 rounded bg-[#17243A] hover:bg-[#25395a] text-[#F1BF00] font-display font-bold text-xs uppercase tracking-wider shadow transition-all disabled:opacity-40"
      >
        Confirmar Comida Típica
      </button>
    </div>
  );
};

// --- Mystery 11: Broken Map Jigsaw Route Reconstruction ---
interface MapRoutePuzzleProps {
  onSuccess: () => void;
  instructionText: string;
}

export const MapRoutePuzzle: React.FC<MapRoutePuzzleProps> = ({ onSuccess, instructionText }) => {
  const fragments = [
    { id: 'sevilla', name: 'Fragmento C: Sevilla', step: '3.ª etapa', icon: '🏛️ Sur', isCorrectThird: true },
    { id: 'barcelona', name: 'Fragmento A: Barcelona', step: '1.ª etapa', icon: '⛵ Este', isCorrectFirst: true },
    { id: 'madrid', name: 'Fragmento B: Madrid', step: '2.ª etapa', icon: '👑 Centro', isCorrectSecond: true },
  ];

  const [routeOrder, setRouteOrder] = useState<string[]>(['sevilla', 'barcelona', 'madrid']);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const moveLeft = (index: number) => {
    if (index === 0) return;
    playTumblerTick();
    const next = [...routeOrder];
    const temp = next[index - 1];
    next[index - 1] = next[index];
    next[index] = temp;
    setRouteOrder(next);
  };

  const moveRight = (index: number) => {
    if (index === routeOrder.length - 1) return;
    playTumblerTick();
    const next = [...routeOrder];
    const temp = next[index + 1];
    next[index + 1] = next[index];
    next[index] = temp;
    setRouteOrder(next);
  };

  const isSolved =
    routeOrder[0] === 'barcelona' && routeOrder[1] === 'madrid' && routeOrder[2] === 'sevilla';

  const handleVerify = () => {
    playClickSound();
    if (isSolved) {
      setErrorMsg(null);
      onSuccess();
    } else {
      playErrorSound();
      setErrorMsg('El itinerario debe seguir exactamente el orden: Barcelona → Madrid → Sevilla.');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto parchment-texture rounded-lg p-5 sm:p-7 vintage-border shadow-2xl text-[#17243A]">
      <div className="border-b border-[#AA151B]/20 pb-2 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Map className="w-5 h-5 text-[#AA151B]" />
          <h3 className="font-display font-bold text-base sm:text-lg text-[#AA151B]">
            Misterio 11: El mapa roto
          </h3>
        </div>
        <span className="text-xs font-typewriter text-[#17243A]/60">Reconstrucción de Ruta</span>
      </div>

      <p className="text-sm font-body text-[#17243A]/90 mb-4 text-center">{instructionText}</p>

      {/* Jigsaw pieces container */}
      <div className="w-full max-w-xl mx-auto grid grid-cols-3 gap-2 sm:gap-4 mb-6">
        {routeOrder.map((fragId, idx) => {
          const item = fragments.find((f) => f.id === fragId)!;
          return (
            <div
              key={fragId}
              className="bg-white/90 rounded-md p-3 border-2 border-dashed border-[#8A5A36] shadow flex flex-col items-center justify-between"
            >
              <span className="text-[10px] font-mono font-bold text-stone-500 uppercase">
                Posición {idx + 1}
              </span>
              <div className="my-2 text-center">
                <span className="text-2xl block mb-1">{item.icon.split(' ')[0]}</span>
                <span className="font-display font-bold text-xs sm:text-sm text-[#17243A] block">
                  {item.name.replace('Fragmento ', '')}
                </span>
                <span className="text-[10px] text-stone-500">{item.icon.split(' ')[1]}</span>
              </div>
              <div className="flex items-center gap-1 w-full justify-center pt-2 border-t border-stone-200">
                <button
                  onClick={() => moveLeft(idx)}
                  disabled={idx === 0}
                  className="px-2 py-0.5 text-xs bg-stone-100 rounded hover:bg-stone-200 disabled:opacity-20"
                >
                  ←
                </button>
                <button
                  onClick={() => moveRight(idx)}
                  disabled={idx === routeOrder.length - 1}
                  className="px-2 py-0.5 text-xs bg-stone-100 rounded hover:bg-stone-200 disabled:opacity-20"
                >
                  →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {isSolved && (
        <div className="w-full max-w-xl mx-auto mb-6 p-3 bg-amber-50 rounded border border-amber-300 text-xs font-typewriter text-[#17243A] text-center flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#F1BF00]" />
          <span>¡Ruta conectada correctamente! Barcelona → Madrid → Sevilla.</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-4 text-xs font-semibold text-[#AA151B] bg-red-100 p-2.5 rounded border border-red-300 text-center">
          {errorMsg}
        </div>
      )}

      <button
        onClick={handleVerify}
        className="w-full max-w-md mx-auto block py-2.5 px-4 rounded bg-[#17243A] hover:bg-[#25395a] text-[#F1BF00] font-display font-bold text-xs uppercase tracking-wider shadow transition-all"
      >
        Validar Ruta del Mapa
      </button>
    </div>
  );
};

// --- Mystery 12: Hidden Message Fill-in-the-Blank Puzzle ---
interface FillBlankPuzzleProps {
  onSuccess: () => void;
  instructionText: string;
}

export const FillBlankPuzzle: React.FC<FillBlankPuzzleProps> = ({ onSuccess, instructionText }) => {
  const [selectedWord, setSelectedWord] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const wordOptions = ['cultura', 'riqueza', 'fábrica'];

  const handleVerify = () => {
    playClickSound();
    if (selectedWord.toLowerCase() === 'cultura') {
      setErrorMsg(null);
      onSuccess();
    } else {
      playErrorSound();
      setErrorMsg('No es correcto. La palabra es «cultura». Cultura = arte, música, comida e historias.');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto parchment-texture rounded-lg p-5 sm:p-7 vintage-border shadow-2xl text-[#17243A]">
      <div className="border-b border-[#AA151B]/20 pb-2 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileCode className="w-5 h-5 text-[#AA151B]" />
          <h3 className="font-display font-bold text-base sm:text-lg text-[#AA151B]">
            Misterio 12: El mensaje escondido
          </h3>
        </div>
        <span className="text-xs font-typewriter text-[#17243A]/60">Frase Clave de Isabel</span>
      </div>

      <p className="text-sm font-body text-[#17243A]/90 mb-4 text-center">{instructionText}</p>

      {/* Sentence Frame */}
      <div className="w-full max-w-xl mx-auto bg-white/95 p-6 rounded-lg border-2 border-[#8A5A36] shadow-md my-6 text-center">
        <div className="font-display text-lg sm:text-xl font-bold text-[#17243A] flex flex-wrap items-center justify-center gap-2">
          <span>«Isabel quiere proteger la</span>
          <span
            className={`inline-block min-w-[120px] px-3 py-1 border-b-2 font-mono text-base ${
              selectedWord
                ? 'border-[#AA151B] text-[#AA151B] bg-amber-50'
                : 'border-stone-400 text-stone-400 border-dashed'
            }`}
          >
            {selectedWord || '______'}
          </span>
          <span>».</span>
        </div>
      </div>

      {/* Movable word options */}
      <div className="w-full max-w-md mx-auto">
        <label className="block text-xs font-semibold text-[#17243A] mb-2 font-display text-center">
          Elige la palabra que falta:
        </label>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {wordOptions.map((word) => (
            <button
              key={word}
              onClick={() => {
                playClickSound();
                setSelectedWord(word);
              }}
              className={`py-3 px-2 rounded font-mono font-bold text-sm transition-all border ${
                selectedWord === word
                  ? 'bg-[#AA151B] text-white border-[#AA151B] ring-2 ring-[#F1BF00]'
                  : 'bg-white/80 hover:bg-white text-[#17243A] border-stone-300'
              }`}
            >
              {word}
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
          disabled={!selectedWord}
          className="w-full py-2.5 px-4 rounded bg-[#17243A] hover:bg-[#25395a] text-[#F1BF00] font-display font-bold text-xs uppercase tracking-wider shadow transition-all disabled:opacity-40"
        >
          Confirmar Mensaje Secreto
        </button>
      </div>
    </div>
  );
};
