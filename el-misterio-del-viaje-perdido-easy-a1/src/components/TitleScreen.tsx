import React from 'react';
import archiveDeskImage from '../assets/images/vintage_archive_desk_1792245258230.jpg';
import { Compass, BookOpen, Clock, Key, Shield, ArrowRight } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface TitleScreenProps {
  onStartGame: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStartGame }) => {
  const handleStart = () => {
    playClickSound();
    onStartGame();
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between bg-[#17243A] text-[#F7F0DF] overflow-hidden selection:bg-[#F1BF00] selection:text-[#17243A]">
      {/* Background Image with Cinematic Scrim */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src={archiveDeskImage}
          alt="Mesa de archivo de 1936 con maleta antigua"
          className="w-full h-full object-cover object-center filter brightness-[0.4] contrast-[1.1]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#17243A] via-[#17243A]/70 to-[#17243A]/40" />
      </div>

      {/* Top Banner / Stamp */}
      <div className="relative z-10 pt-6 px-6 max-w-6xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-[#F1BF00] flex items-center justify-center bg-[#AA151B]/40 shadow">
            <Compass className="w-5 h-5 text-[#F1BF00]" />
          </div>
          <div>
            <span className="font-typewriter text-xs tracking-widest text-[#F1BF00] uppercase">
              Archivo de España · Año 1936
            </span>
            <p className="text-[11px] text-[#F7F0DF]/60">Caso N.º 49 · Un secreto</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-typewriter text-[#F7F0DF]/70 bg-black/40 px-3 py-1.5 rounded border border-white/10">
          <Clock className="w-3.5 h-3.5 text-[#F1BF00]" />
          <span>Tiempo: 20:00</span>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-8 flex flex-col items-center text-center my-auto">
        {/* Title Lockup */}
        <div className="mb-4">
          <div className="inline-block px-3 py-1 rounded bg-[#AA151B]/80 text-[#F7F0DF] font-typewriter text-xs tracking-widest mb-3 border border-[#F1BF00]/40">
            ESCAPE ROOM EN ESPAÑOL · NIVEL A1
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl md:text-6xl tracking-tight text-[#F7F0DF] drop-shadow-md">
            El Misterio del <span className="text-[#F1BF00]">Viaje Perdido</span>
          </h1>
          <p className="font-typewriter text-sm sm:text-base text-[#F7F0DF]/80 mt-2 max-w-xl mx-auto">
            El enigma de Isabel de la Vega y el Atlas de los Siete Secretos
          </p>
        </div>

        {/* Vintage Parchment Letter Container with Story */}
        <div className="w-full parchment-texture text-[#17243A] rounded-lg p-6 sm:p-8 vintage-border shadow-2xl text-left my-4 relative">
          <div className="absolute top-4 right-4 hidden sm:block">
            <div className="w-12 h-12 rounded-full wax-seal flex items-center justify-center text-white/90 font-display font-bold text-sm shadow">
              IV
            </div>
          </div>

          <h2 className="font-display font-bold text-lg text-[#AA151B] mb-3 border-b border-[#AA151B]/20 pb-1.5">
            La historia de Isabel (1936)
          </h2>

          <div className="space-y-3 font-body text-sm leading-relaxed text-[#17243A]/90">
            <p>
              En <strong>1936</strong>, <em>Isabel de la Vega</em> vive en España. Le gusta viajar y escribir.
              Tiene un libro especial: <strong className="text-[#AA151B]">«El Atlas de los Siete Secretos»</strong>.
            </p>
            <p>
              Un día, Isabel desaparece. Muchos años después, una maleta aparece en una sala. Dentro hay un mapa,
              un billete de tren, fotos y una carta. ¡Pero el libro no está!
            </p>
            <p className="font-medium text-[#17243A]">
              ¡Ayuda a Isabel! Tienes <strong>20 minutos</strong> para resolver <strong>15 misterios</strong>
              en <strong>4 actos</strong>. Busca pistas, encuentra cuatro llaves y abre los candados.
            </p>
            <p className="rounded border border-[#AA151B]/20 bg-white/50 p-3 text-xs">
              <strong className="text-[#AA151B]">Palabras nuevas:</strong> <em>atlas</em> = un libro de mapas ·
              <em> pista</em> = algo que ayuda a encontrar una respuesta · <em>candado</em> = una cerradura pequeña.
            </p>
          </div>
          {/* Quick Mission Briefing Strips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-[#17243A]/10 text-xs">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#AA151B] shrink-0" />
              <span><strong>20 minutos</strong> de tiempo continuo</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#AA151B] shrink-0" />
              <span><strong>15 misterios</strong> para resolver</span>
            </div>
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-[#AA151B] shrink-0" />
              <span><strong>4 llaves</strong> por conseguir</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#AA151B] shrink-0" />
              <span><strong>Candados</strong> con código</span>
            </div>
          </div>
        </div>

        {/* Primary Start CTA Button */}
        <div className="mt-4 flex flex-col items-center">
          <button
            onClick={handleStart}
            className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-lg bg-[#AA151B] hover:bg-[#881015] text-[#F7F0DF] font-display font-bold text-base sm:text-lg shadow-xl hover:shadow-[0_0_20px_rgba(241,191,0,0.4)] transition-all border border-[#F1BF00]/50 active:scale-95"
          >
            <span>Abrir la maleta y jugar</span>
            <ArrowRight className="w-5 h-5 text-[#F1BF00] group-hover:translate-x-1 transition-transform" />
          </button>
          <span className="text-xs text-[#F7F0DF]/60 mt-2 font-typewriter">
            Pulsa para empezar el juego
          </span>
        </div>
      </main>

      {/* Footer / Copyright / Discretion */}
      <footer className="relative z-10 py-4 px-6 text-center text-xs text-[#F7F0DF]/50 border-t border-white/5 font-typewriter">
        Una historia de detectives en español A1 · España
      </footer>
    </div>
  );
};
