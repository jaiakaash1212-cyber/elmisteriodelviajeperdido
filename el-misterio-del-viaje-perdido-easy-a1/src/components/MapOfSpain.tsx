import React, { useState } from 'react';
import { MAP_CITIES } from '../data/mysteries';
import { playClickSound } from '../utils/audio';
import { Compass, MapPin } from 'lucide-react';

interface MapOfSpainProps {
  onSelectCity?: (cityName: string) => void;
  selectedCity?: string | null;
  highlightedCities?: string[];
  targetPrompt?: string;
  isInteractive?: boolean;
}

export const MapOfSpain: React.FC<MapOfSpainProps> = ({
  onSelectCity,
  selectedCity,
  highlightedCities = [],
  targetPrompt,
  isInteractive = true,
}) => {
  const [hoveredCity, setHoveredCity] = useState<typeof MAP_CITIES[0] | null>(null);

  const handleCityClick = (cityName: string) => {
    if (!isInteractive || !onSelectCity) return;
    playClickSound();
    onSelectCity(cityName);
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto parchment-texture rounded-lg p-4 sm:p-6 vintage-border shadow-xl select-none text-[#17243A]">
      {/* Map Header / Banner */}
      <div className="flex items-center justify-between border-b border-[#AA151B]/20 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-[#AA151B]" />
          <h3 className="font-display font-bold text-base sm:text-lg text-[#AA151B]">
            Mapa Histórico de las Provincias de España (1936)
          </h3>
        </div>
        <div className="text-xs font-typewriter text-[#17243A]/70 hidden sm:block">
          Escala Cartográfica 1:2.000.000
        </div>
      </div>

      {targetPrompt && (
        <div className="mb-3 px-3 py-1.5 bg-[#AA151B]/10 rounded border border-[#AA151B]/30 text-xs font-medium text-[#AA151B] flex items-center gap-2">
          <MapPin className="w-4 h-4 shrink-0 text-[#AA151B]" />
          <span>{targetPrompt}</span>
        </div>
      )}

      {/* SVG Container for the Peninsula */}
      <div className="relative aspect-[16/11] w-full rounded border border-[#AA151B]/30 bg-[#F7F0DF] overflow-hidden shadow-inner">
        {/* Ocean Graticules & Waterlines */}
        <svg viewBox="0 0 1000 700" className="w-full h-full">
          <defs>
            <pattern id="hatch" width="20" height="20" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="20" stroke="#d5c8ab" strokeWidth="0.5" />
            </pattern>
            <radialGradient id="waterGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#dce8eb" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#c5d8dc" stopOpacity="0.7" />
            </radialGradient>
          </defs>

          {/* Ocean Background */}
          <rect width="1000" height="700" fill="url(#waterGlow)" />
          <rect width="1000" height="700" fill="url(#hatch)" opacity="0.35" />

          {/* Compass Rose in upper left */}
          <g transform="translate(140, 110)">
            <circle cx="0" cy="0" r="45" fill="none" stroke="#AA151B" strokeWidth="1" strokeDasharray="2,3" opacity="0.5" />
            <circle cx="0" cy="0" r="38" fill="none" stroke="#17243A" strokeWidth="0.75" />
            {/* Compass points */}
            <polygon points="0,-45 7,-10 0,0 -7,-10" fill="#AA151B" />
            <polygon points="0,45 7,10 0,0 -7,10" fill="#17243A" />
            <polygon points="45,0 10,7 0,0 10,-7" fill="#17243A" />
            <polygon points="-45,0 -10,7 0,0 -10,-7" fill="#17243A" />
            <text x="0" y="-50" textAnchor="middle" className="font-display text-[12px] font-bold" fill="#AA151B">N</text>
            <text x="52" y="4" textAnchor="middle" className="font-display text-[10px]" fill="#17243A">E</text>
            <text x="0" y="58" textAnchor="middle" className="font-display text-[10px]" fill="#17243A">S</text>
            <text x="-52" y="4" textAnchor="middle" className="font-display text-[10px]" fill="#17243A">O</text>
          </g>

          {/* Sea Labels */}
          <text x="280" y="70" className="font-display italic text-[14px]" fill="#3a5a6b" opacity="0.7">MAR CANTÁBRICO</text>
          <text x="750" y="530" className="font-display italic text-[14px]" fill="#3a5a6b" opacity="0.7">MAR MEDITERRÁNEO</text>
          <text x="60" y="450" className="font-display italic text-[14px]" fill="#3a5a6b" opacity="0.7">OCÉANO ATLÁNTICO</text>

          {/* Iberian Peninsula Landmass SVG path */}
          <path
            d="M 120,110 
               C 170,120 220,115 280,115 
               C 340,115 420,110 470,112 
               C 520,115 570,125 610,135 
               C 650,145 680,180 720,195 
               C 760,210 820,230 840,245 
               C 855,255 860,270 855,290 
               C 845,310 815,340 805,370 
               C 795,400 780,440 760,470 
               C 740,500 700,530 670,550 
               C 640,570 590,575 560,590 
               C 530,605 480,620 440,620 
               C 400,620 350,610 320,600 
               C 280,590 250,570 230,550 
               C 210,530 190,470 185,430 
               C 180,390 175,340 170,300 
               C 165,260 160,220 150,190 
               C 140,160 110,130 120,110 Z"
            fill="#F3EBD8"
            stroke="#AA151B"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Topography details & Rivers */}
          <path
            d="M 480,360 Q 600,370 800,380"
            fill="none"
            stroke="#b8ccd4"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.8"
          />
          <path
            d="M 480,360 Q 350,380 200,410"
            fill="none"
            stroke="#b8ccd4"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.8"
          />
          <path
            d="M 480,360 Q 380,490 310,570"
            fill="none"
            stroke="#b8ccd4"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Pyrenees border line to France */}
          <path
            d="M 610,135 Q 720,180 840,245"
            fill="none"
            stroke="#888"
            strokeWidth="1.5"
            strokeDasharray="4,3"
          />
          <text x="730" y="165" className="font-display text-[11px] font-bold" fill="#777">FRANCIA</text>

          {/* Portugal separation dash */}
          <path
            d="M 195,185 Q 225,320 230,550"
            fill="none"
            stroke="#888"
            strokeWidth="1.5"
            strokeDasharray="4,4"
          />
          <text x="175" y="360" className="font-display text-[11px] font-bold" fill="#777" transform="rotate(-75 175 360)">PORTUGAL</text>

          {/* Balearic Islands */}
          <ellipse cx="890" cy="410" rx="28" ry="16" fill="#F3EBD8" stroke="#AA151B" strokeWidth="1.5" transform="rotate(-25 890 410)" />
          <ellipse cx="850" cy="435" rx="14" ry="9" fill="#F3EBD8" stroke="#AA151B" strokeWidth="1.5" transform="rotate(-30 850 435)" />
          <ellipse cx="940" cy="380" rx="15" ry="8" fill="#F3EBD8" stroke="#AA151B" strokeWidth="1.5" transform="rotate(-20 940 380)" />
          <text x="890" y="445" className="font-display text-[9px] text-center" fill="#17243A">Islas Baleares</text>

          {/* City Interactive Markers */}
          {MAP_CITIES.map((city) => {
            // Map 0-100 coordinates to SVG viewBox 1000x700
            const cx = 100 + (city.x / 100) * 800;
            const cy = 60 + (city.y / 100) * 580;
            const isSelected = selectedCity === city.name;
            const isHighlighted = highlightedCities.includes(city.name);

            return (
              <g
                key={city.name}
                className="cursor-pointer"
                onClick={() => handleCityClick(city.name)}
                onMouseEnter={() => setHoveredCity(city)}
                onMouseLeave={() => setHoveredCity(null)}
              >
                {/* Ping ring if highlighted */}
                {isHighlighted && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r="18"
                    fill="none"
                    stroke="#F1BF00"
                    strokeWidth="2.5"
                    className="animate-ping"
                    opacity="0.6"
                  />
                )}

                {/* Selection halo */}
                {isSelected && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r="16"
                    fill="#AA151B"
                    opacity="0.25"
                  />
                )}

                {/* Outer decorative pin */}
                <circle
                  cx={cx}
                  cy={cy}
                  r="8"
                  fill={isSelected ? '#AA151B' : '#17243A'}
                  stroke="#F7F0DF"
                  strokeWidth="2"
                  className="shadow-sm transition-colors"
                />

                {/* Center dot */}
                <circle
                  cx={cx}
                  cy={cy}
                  r="3.5"
                  fill={isSelected ? '#F1BF00' : '#F7F0DF'}
                />

                {/* City Name Label */}
                <text
                  x={cx}
                  y={cy - 12}
                  textAnchor="middle"
                  className={`font-display text-[12px] font-bold tracking-wide transition-all ${
                    isSelected
                      ? 'fill-[#AA151B] font-extrabold text-[14px]'
                      : 'fill-[#17243A] hover:fill-[#AA151B]'
                  }`}
                  style={{ textShadow: '1px 1px 2px #fff, -1px -1px 2px #fff' }}
                >
                  {city.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover City Tooltip Box */}
        {hoveredCity && (
          <div className="absolute bottom-2 left-2 right-2 sm:right-auto sm:max-w-xs bg-[#17243A]/95 text-[#F7F0DF] text-xs p-2.5 rounded shadow-lg border border-[#F1BF00]/40 pointer-events-none transition-all">
            <div className="font-display font-bold text-[#F1BF00] text-sm">
              {hoveredCity.name}
            </div>
            <div className="text-[11px] text-white/70 italic mb-1">{hoveredCity.region}</div>
            <div className="font-body text-[11px] text-white/90 leading-tight">
              {hoveredCity.info}
            </div>
          </div>
        )}
      </div>

      <div className="mt-2 text-center text-xs text-[#17243A]/70 font-typewriter">
        Haz clic sobre una ciudad en el mapa para marcarla en tu informe de investigación
      </div>
    </div>
  );
};
