import React, { useState } from 'react';
import { Compass, Book, FileText, Search, Mail, Eye, CheckCircle2, Ticket } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface SuitcaseItem {
  id: string;
  name: string;
  description: string;
  isTarget: boolean;
  xPercent: number;
  yPercent: number;
  widthPercent: number;
  heightPercent: number;
  icon: React.ReactNode;
}

const SUITCASE_ITEMS: SuitcaseItem[] = [
  {
    id: 'compass',
    name: 'Brújula de latón',
    description: 'Una brújula náutica antigua que apunta hacia el norte peninsular.',
    isTarget: false,
    xPercent: 12,
    yPercent: 28,
    widthPercent: 18,
    heightPercent: 24,
    icon: <Compass className="w-6 h-6 text-amber-700" />,
  },
  {
    id: 'notebook',
    name: 'Cuaderno de viaje',
    description: 'Notas manuscritas con tinta sepia sobre paisajes y leyendas españolas.',
    isTarget: false,
    xPercent: 32,
    yPercent: 15,
    widthPercent: 28,
    heightPercent: 34,
    icon: <Book className="w-7 h-7 text-stone-700" />,
  },
  {
    id: 'ticket',
    name: 'Billete de tren doblado',
    description: 'Un billete de la Compañía de Ferrocarriles del Norte de España.',
    isTarget: false,
    xPercent: 68,
    yPercent: 22,
    widthPercent: 24,
    heightPercent: 20,
    icon: <Ticket className="w-6 h-6 text-red-800" />,
  },
  {
    id: 'magnifier',
    name: 'Lupa de bronce',
    description: 'Una pesada lente de aumento para examinar mapas y sellos.',
    isTarget: false,
    xPercent: 15,
    yPercent: 62,
    widthPercent: 22,
    heightPercent: 26,
    icon: <Search className="w-7 h-7 text-amber-900" />,
  },
  {
    id: 'letter',
    name: 'Carta sellada con cera roja',
    description: 'Un sobre amarillento lacrado con un sello de cera roja con las iniciales «I.V.».',
    isTarget: true,
    xPercent: 44,
    yPercent: 54,
    widthPercent: 28,
    heightPercent: 32,
    icon: <Mail className="w-8 h-8 text-[#AA151B]" />,
  },
  {
    id: 'postcard',
    name: 'Postal ilustrada',
    description: 'Fotografía en blanco y negro de una catedral gótica.',
    isTarget: false,
    xPercent: 76,
    yPercent: 50,
    widthPercent: 20,
    heightPercent: 30,
    icon: <FileText className="w-6 h-6 text-slate-700" />,
  },
];

interface SuitcaseSceneProps {
  onSuccess: () => void;
  instructionText: string;
}

export const SuitcaseScene: React.FC<SuitcaseSceneProps> = ({ onSuccess, instructionText }) => {
  const [selectedItem, setSelectedItem] = useState<SuitcaseItem | null>(null);
  const [examinedIds, setExaminedIds] = useState<string[]>([]);
  const [isLetterOpened, setIsLetterOpened] = useState(false);

  const handleInspectItem = (item: SuitcaseItem) => {
    playClickSound();
    setSelectedItem(item);
    if (!examinedIds.includes(item.id)) {
      setExaminedIds((prev) => [...prev, item.id]);
    }
  };

  const handleConfirmDocument = () => {
    playClickSound();
    setIsLetterOpened(true);
    setTimeout(() => {
      onSuccess();
    }, 1200);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      {/* Header Clue / Instruction Bar */}
      <div className="w-full bg-[#17243A] text-[#F7F0DF] p-3 rounded-t-lg border-t border-x border-[#F1BF00]/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-[#F1BF00]" />
          <span className="font-display text-sm font-semibold text-[#F1BF00]">{instructionText}</span>
        </div>
        <span className="text-xs font-typewriter text-[#F7F0DF]/60">
          Objetos examinados: {examinedIds.length}/{SUITCASE_ITEMS.length}
        </span>
      </div>

      {/* Main Suitcase Interior Container */}
      <div className="relative w-full aspect-[16/10] bg-[#4A2E18] rounded-b-lg border-4 border-[#2A180B] shadow-2xl overflow-hidden p-4">
        {/* Leather texture lining */}
        <div className="absolute inset-2 bg-[#613e21] rounded border-2 border-[#82542e] shadow-inner" />
        <div className="absolute inset-4 bg-[#7a4e2a] rounded border border-dashed border-[#a36939]/40 opacity-90" />

        {/* Suitcase straps */}
        <div className="absolute top-0 bottom-0 left-[25%] w-6 bg-[#2B170B] border-x border-[#593318] shadow" />
        <div className="absolute top-0 bottom-0 right-[25%] w-6 bg-[#2B170B] border-x border-[#593318] shadow" />

        {/* Vintage Stamp sticker in the suitcase corner */}
        <div className="absolute top-6 right-6 border border-[#F1BF00]/40 p-1.5 bg-[#17243A]/40 text-[#F1BF00] font-typewriter text-[10px] rounded rotate-6 pointer-events-none">
          VIAJES ESPAÑA · 1936
        </div>

        {/* Clickable Items */}
        {SUITCASE_ITEMS.map((item) => {
          const isSelected = selectedItem?.id === item.id;
          const isExamined = examinedIds.includes(item.id);

          return (
            <button
              key={item.id}
              onClick={() => handleInspectItem(item)}
              style={{
                left: `${item.xPercent}%`,
                top: `${item.yPercent}%`,
                width: `${item.widthPercent}%`,
                height: `${item.heightPercent}%`,
              }}
              className={`absolute rounded-lg transition-all flex flex-col items-center justify-center p-2 cursor-pointer shadow-lg group ${
                item.isTarget
                  ? 'bg-[#F7F0DF] border-2 border-[#AA151B] hover:shadow-[0_0_15px_rgba(170,21,27,0.6)]'
                  : 'bg-[#F7F0DF]/90 border border-stone-400 hover:bg-[#F7F0DF]'
              } ${isSelected ? 'ring-4 ring-[#F1BF00] scale-105 z-20' : 'hover:scale-102 z-10'}`}
              title={item.name}
            >
              <div className="transition-transform group-hover:scale-110 mb-1">{item.icon}</div>
              <span className="font-typewriter text-[11px] font-bold text-[#17243A] text-center leading-tight line-clamp-2">
                {item.name}
              </span>

              {isExamined && (
                <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#17243A] text-[#F1BF00] text-[9px] flex items-center justify-center font-bold">
                  ✓
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Item Inspector Panel */}
      {selectedItem && (
        <div className="w-full mt-4 parchment-texture rounded-lg p-4 vintage-border shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/70 rounded-full border border-stone-300">
              {selectedItem.icon}
            </div>
            <div>
              <h4 className="font-display font-bold text-sm text-[#AA151B]">{selectedItem.name}</h4>
              <p className="font-body text-xs text-[#17243A]/85 mt-0.5">{selectedItem.description}</p>
            </div>
          </div>

          <div className="shrink-0">
            {selectedItem.isTarget ? (
              <button
                onClick={handleConfirmDocument}
                disabled={isLetterOpened}
                className="flex items-center gap-2 px-5 py-2.5 rounded bg-[#AA151B] hover:bg-[#881015] text-[#F7F0DF] font-display font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4 text-[#F1BF00]" />
                <span>Identificar Documento Principal</span>
              </button>
            ) : (
              <span className="text-xs font-typewriter text-[#17243A]/60 italic bg-black/5 px-3 py-1.5 rounded">
                Objeto examinado. No es la carta sellada.
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
