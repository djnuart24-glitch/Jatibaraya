import React from 'react';
import { useJatibarayaData } from '../../context/DataContext';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
  light?: boolean;
}

export const JatibarayaOfficialEmblem: React.FC<{
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}> = ({ className = '', size = 'md' }) => {
  const pixelSizes = {
    xs: 28,
    sm: 36,
    md: 46,
    lg: 64,
    xl: 96,
    '2xl': 140,
  };

  const px = pixelSizes[size] || 46;

  return (
    <svg
      viewBox="0 0 500 600"
      width={px}
      height={px * 1.2}
      className={`inline-block flex-shrink-0 drop-shadow-sm ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Lambang Resmi Jatibaraya"
    >
      <defs>
        {/* Globe Gradient (Cerulean / Cyan Blue) */}
        <radialGradient id="emblemGlobeGrad" cx="38%" cy="36%" r="65%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="45%" stopColor="#0ea5e9" />
          <stop offset="85%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0369a1" />
        </radialGradient>

        {/* Kujang Golden Amber Gradient */}
        <linearGradient id="emblemKujangGrad" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="25%" stopColor="#facc15" />
          <stop offset="60%" stopColor="#f59e0b" />
          <stop offset="90%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#c2410c" />
        </linearGradient>

        {/* 9 Walisongo Stars Ruby Red Gradient */}
        <linearGradient id="emblemStarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="40%" stopColor="#ef4444" />
          <stop offset="80%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#991b1b" />
        </linearGradient>

        {/* Green Ribbon Gradient */}
        <linearGradient id="emblemRibbonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#15803d" />
          <stop offset="25%" stopColor="#22c55e" />
          <stop offset="50%" stopColor="#4ade80" />
          <stop offset="75%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>

        <linearGradient id="emblemRibbonFold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#14532d" />
          <stop offset="100%" stopColor="#166534" />
        </linearGradient>

        {/* Book Cover Gradients */}
        <linearGradient id="emblemBookCover" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#27272a" />
          <stop offset="60%" stopColor="#18181b" />
          <stop offset="100%" stopColor="#09090b" />
        </linearGradient>

        {/* Subtle Drop Shadows */}
        <filter id="emblemSoftGlow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#0284c7" floodOpacity="0.25" />
        </filter>
        <filter id="emblemStarShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#7f1d1d" floodOpacity="0.3" />
        </filter>
        <filter id="emblemKujangShadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="1.5" dy="3" stdDeviation="3.5" floodColor="#78350f" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* 1. BOLA DUNIA (GLOBE) */}
      <g filter="url(#emblemSoftGlow)">
        <circle cx="265" cy="270" r="145" fill="url(#emblemGlobeGrad)" stroke="#0284c7" strokeWidth="3" />
        <ellipse cx="265" cy="270" rx="145" ry="52" fill="none" stroke="#0369a1" strokeWidth="2.2" opacity="0.85" />
        <ellipse cx="265" cy="215" rx="132" ry="42" fill="none" stroke="#0369a1" strokeWidth="2" opacity="0.8" />
        <ellipse cx="265" cy="325" rx="132" ry="42" fill="none" stroke="#0369a1" strokeWidth="2" opacity="0.8" />
        <ellipse cx="265" cy="170" rx="105" ry="32" fill="none" stroke="#0369a1" strokeWidth="1.8" opacity="0.75" />
        <ellipse cx="265" cy="370" rx="105" ry="32" fill="none" stroke="#0369a1" strokeWidth="1.8" opacity="0.75" />
        <ellipse cx="265" cy="270" rx="60" ry="145" fill="none" stroke="#0369a1" strokeWidth="2.2" opacity="0.85" />
        <ellipse cx="265" cy="270" rx="110" ry="145" fill="none" stroke="#0369a1" strokeWidth="2" opacity="0.8" />
        <line x1="265" y1="125" x2="265" y2="415" stroke="#0369a1" strokeWidth="2.2" opacity="0.85" />
      </g>

      {/* 2. TIGA BUKU / KITAB PERSPEKTIF 3D */}
      <g>
        <ellipse cx="250" cy="335" rx="75" ry="25" fill="#000000" opacity="0.25" />

        {/* Book 1 (Left) */}
        <g transform="translate(185, 205)">
          <polygon points="0,40 28,15 28,110 0,135" fill="#18181b" stroke="#09090b" strokeWidth="1.5" />
          <polygon points="28,15 90,52 64,74 0,40" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.2" />
          <line x1="26" y1="21" x2="84" y2="55" stroke="#94a3b8" strokeWidth="1" />
          <line x1="22" y1="26" x2="78" y2="59" stroke="#94a3b8" strokeWidth="1" />
          <polygon points="0,40 64,74 64,168 0,135" fill="url(#emblemBookCover)" stroke="#09090b" strokeWidth="1.5" />
          <polygon points="64,74 90,52 90,145 64,168" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.2" />
          <line x1="68" y1="80" x2="88" y2="60" stroke="#94a3b8" strokeWidth="0.8" />
          <line x1="68" y1="95" x2="88" y2="75" stroke="#94a3b8" strokeWidth="0.8" />
          <line x1="68" y1="110" x2="88" y2="90" stroke="#94a3b8" strokeWidth="0.8" />
          <line x1="68" y1="125" x2="88" y2="105" stroke="#94a3b8" strokeWidth="0.8" />
          <line x1="68" y1="140" x2="88" y2="120" stroke="#94a3b8" strokeWidth="0.8" />
          <line x1="68" y1="155" x2="88" y2="135" stroke="#94a3b8" strokeWidth="0.8" />
        </g>

        {/* Book 2 (Middle) */}
        <g transform="translate(205, 190)">
          <polygon points="28,15 92,52 64,74 0,40" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.2" />
          <line x1="26" y1="21" x2="86" y2="55" stroke="#94a3b8" strokeWidth="1" />
          <line x1="22" y1="26" x2="80" y2="59" stroke="#94a3b8" strokeWidth="1" />
          <polygon points="0,40 28,15 28,110 0,135" fill="#27272a" stroke="#09090b" strokeWidth="1.5" />
          <polygon points="0,40 64,74 64,168 0,135" fill="url(#emblemBookCover)" stroke="#09090b" strokeWidth="1.5" />
          <polygon points="64,74 92,52 92,145 64,168" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.2" />
          <line x1="68" y1="80" x2="90" y2="60" stroke="#94a3b8" strokeWidth="0.8" />
          <line x1="68" y1="95" x2="90" y2="75" stroke="#94a3b8" strokeWidth="0.8" />
          <line x1="68" y1="110" x2="90" y2="90" stroke="#94a3b8" strokeWidth="0.8" />
          <line x1="68" y1="125" x2="90" y2="105" stroke="#94a3b8" strokeWidth="0.8" />
          <line x1="68" y1="140" x2="90" y2="120" stroke="#94a3b8" strokeWidth="0.8" />
          <line x1="68" y1="155" x2="90" y2="135" stroke="#94a3b8" strokeWidth="0.8" />
        </g>

        {/* Book 3 (Right) */}
        <g transform="translate(225, 175)">
          <polygon points="28,15 94,52 64,74 0,40" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.2" />
          <line x1="26" y1="21" x2="88" y2="55" stroke="#94a3b8" strokeWidth="1" />
          <line x1="22" y1="26" x2="82" y2="59" stroke="#94a3b8" strokeWidth="1" />
          <polygon points="0,40 28,15 28,110 0,135" fill="#18181b" stroke="#09090b" strokeWidth="1.5" />
          <polygon points="0,40 64,74 64,168 0,135" fill="url(#emblemBookCover)" stroke="#09090b" strokeWidth="1.5" />
          <polygon points="64,74 94,52 94,145 64,168" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.2" />
          <line x1="68" y1="80" x2="92" y2="60" stroke="#94a3b8" strokeWidth="0.8" />
          <line x1="68" y1="95" x2="92" y2="75" stroke="#94a3b8" strokeWidth="0.8" />
          <line x1="68" y1="110" x2="92" y2="90" stroke="#94a3b8" strokeWidth="0.8" />
          <line x1="68" y1="125" x2="92" y2="105" stroke="#94a3b8" strokeWidth="0.8" />
          <line x1="68" y1="140" x2="92" y2="120" stroke="#94a3b8" strokeWidth="0.8" />
          <line x1="68" y1="155" x2="92" y2="135" stroke="#94a3b8" strokeWidth="0.8" />
        </g>
      </g>

      {/* 3. KUJANG PASUNDAN (GOLDEN BLADE & TIGER HILT) */}
      <g filter="url(#emblemKujangShadow)">
        {/* Main Blade */}
        <path
          d="M246,62
             C252,90 240,135 240,165
             C240,195 264,228 270,250
             C276,272 268,290 262,310
             C256,325 248,328 245,335
             C242,328 244,305 252,282
             C258,265 258,245 252,230
             C244,212 226,198 226,170
             C226,145 240,110 246,62 Z"
          fill="url(#emblemKujangGrad)"
          stroke="#b45309"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Outer Back Spine */}
        <path
          d="M246,62
             C255,80 275,115 288,145
             C298,168 300,195 292,225
             C284,255 266,285 245,335
             C260,305 272,280 280,250
             C288,220 286,190 278,165
             C268,135 254,100 246,62 Z"
          fill="url(#emblemKujangGrad)"
          stroke="#d97706"
          strokeWidth="2"
        />

        {/* 3 Mata Kujang (Holes) */}
        <circle cx="254" cy="142" r="5.5" fill="#ffffff" stroke="#b45309" strokeWidth="2" />
        <circle cx="269" cy="172" r="6" fill="#ffffff" stroke="#b45309" strokeWidth="2" />
        <circle cx="274" cy="204" r="6" fill="#ffffff" stroke="#b45309" strokeWidth="2" />
        <circle cx="276" cy="225" r="4.5" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
        <circle cx="272" cy="245" r="4" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />

        {/* Inner Hook / Pamor */}
        <path
          d="M228,210
             C235,230 250,248 260,250
             C270,252 268,265 258,266
             C240,266 220,240 228,210 Z"
          fill="url(#emblemKujangGrad)"
          stroke="#b45309"
          strokeWidth="1.8"
        />

        {/* Crossguard */}
        <path
          d="M230,332 L278,332 C282,332 284,337 282,342 L276,346 L232,346 L226,342 C224,337 226,332 230,332 Z"
          fill="#facc15"
          stroke="#b45309"
          strokeWidth="2"
        />

        {/* Tiger Head Handle */}
        <path
          d="M256,346 L268,350 C272,375 272,410 262,445 C258,460 250,470 236,478 C224,484 212,476 216,464 C220,452 230,448 238,446 C232,442 225,442 220,436 C214,430 220,422 228,422 C234,422 242,426 248,418 C255,408 256,380 252,346 Z"
          fill="url(#emblemKujangGrad)"
          stroke="#b45309"
          strokeWidth="2"
        />

        {/* Tiger Details */}
        <path
          d="M224,468 C216,465 210,472 216,482 C224,488 234,486 240,476"
          fill="none"
          stroke="#78350f"
          strokeWidth="2"
        />
        <ellipse cx="236" cy="454" rx="3.5" ry="2.5" fill="#78350f" />
        <path d="M246,370 C240,378 240,388 246,396" fill="none" stroke="#b45309" strokeWidth="1.8" />
        <path d="M248,402 C242,410 242,420 248,428" fill="none" stroke="#b45309" strokeWidth="1.8" />
      </g>

      {/* 4. SEMBILAN BINTANG MERAH (WALISONGO) */}
      <g filter="url(#emblemStarShadow)">
        {/* Star 1 */}
        <polygon
          points="78,349 83,361 95,361 85,369 89,380 78,373 67,380 71,369 61,361 73,361"
          fill="url(#emblemStarGrad)"
          stroke="#7f1d1d"
          strokeWidth="1.2"
        />
        {/* Star 2 */}
        <polygon
          points="58,288 63,301 76,301 65,309 69,321 58,314 47,321 51,309 40,301 53,301"
          fill="url(#emblemStarGrad)"
          stroke="#7f1d1d"
          strokeWidth="1.2"
        />
        {/* Star 3 */}
        <polygon
          points="48,224 54,237 68,237 57,246 61,259 48,251 35,259 39,246 28,237 42,237"
          fill="url(#emblemStarGrad)"
          stroke="#7f1d1d"
          strokeWidth="1.2"
        />
        {/* Star 4 */}
        <polygon
          points="52,162 58,175 72,175 61,184 65,197 52,189 39,197 43,184 32,175 46,175"
          fill="url(#emblemStarGrad)"
          stroke="#7f1d1d"
          strokeWidth="1.2"
        />
        {/* Star 5 */}
        <polygon
          points="72,107 78,120 92,120 81,129 85,142 72,134 59,142 63,129 52,120 66,120"
          fill="url(#emblemStarGrad)"
          stroke="#7f1d1d"
          strokeWidth="1.2"
        />
        {/* Star 6 */}
        <polygon
          points="104,64 110,77 124,77 113,86 117,99 104,91 91,99 95,86 84,77 98,77"
          fill="url(#emblemStarGrad)"
          stroke="#7f1d1d"
          strokeWidth="1.2"
        />
        {/* Star 7 */}
        <polygon
          points="148,34 154,47 168,47 157,56 161,69 148,61 135,69 139,56 128,47 142,47"
          fill="url(#emblemStarGrad)"
          stroke="#7f1d1d"
          strokeWidth="1.2"
        />
        {/* Star 8 */}
        <polygon
          points="198,20 204,33 218,33 207,42 211,55 198,47 185,55 189,42 178,33 192,33"
          fill="url(#emblemStarGrad)"
          stroke="#7f1d1d"
          strokeWidth="1.2"
        />
        {/* Star 9 (Apex) */}
        <polygon
          points="250,16 256,30 271,30 259,39 264,53 250,44 236,53 241,39 229,30 244,30"
          fill="url(#emblemStarGrad)"
          stroke="#7f1d1d"
          strokeWidth="1.3"
        />
      </g>

      {/* 5. PITA HIJAU & KALIGRAFI ARAB "جاتي برايا" */}
      <g>
        <path
          d="M70,460 C180,515 350,515 460,460 L450,475 C345,530 185,530 80,475 Z"
          fill="#000000"
          opacity="0.2"
        />

        {/* Left Ribbon Notch & Underside */}
        <polygon points="50,465 92,448 92,488 40,495 55,480" fill="url(#emblemRibbonFold)" stroke="#0f3b1e" strokeWidth="1.5" />
        <polygon points="40,495 85,485 85,515 30,522 50,508" fill="#15803d" stroke="#0f3b1e" strokeWidth="1.5" />

        {/* Right Ribbon Notch & Underside */}
        <polygon points="480,465 438,448 438,488 490,495 475,480" fill="url(#emblemRibbonFold)" stroke="#0f3b1e" strokeWidth="1.5" />
        <polygon points="490,495 445,485 445,515 500,522 480,508" fill="#15803d" stroke="#0f3b1e" strokeWidth="1.5" />

        {/* Main Ribbon Arch */}
        <path
          d="M65,465 C170,518 360,518 465,465 L455,515 C355,568 175,568 75,515 Z"
          fill="url(#emblemRibbonGrad)"
          stroke="#14532d"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Upper Highlight Stroke on Banner */}
        <path
          d="M68,467 C172,519 358,519 462,467"
          fill="none"
          stroke="#bbf7d0"
          strokeWidth="2"
          opacity="0.8"
        />

        {/* Arabic Inscription: "جاتي برايا" */}
        <text
          x="265"
          y="528"
          textAnchor="middle"
          fontFamily="'Amiri', 'Traditional Arabic', 'Scheherazade New', 'Noto Naskh Arabic', 'Geeza Pro', serif"
          fontSize="44"
          fontWeight="bold"
          fill="#092612"
          letterSpacing="2"
        >
          جاتي برايا
        </text>
      </g>
    </svg>
  );
};

export const JatibarayaLogo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  light = false,
}) => {
  const { data } = useJatibarayaData();
  const { logoUrl, name, fullName } = data.settings;

  const isCustomUploadedPhoto =
    Boolean(logoUrl) &&
    !logoUrl.endsWith('jatibaraya-logo.svg') &&
    !logoUrl.includes('assets/jatibaraya-logo.svg');

  const containerSizes = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    '2xl': 'w-32 h-32',
  };

  return (
    <div className="flex items-center gap-3 select-none">
      {isCustomUploadedPhoto ? (
        <img
          src={logoUrl}
          alt={name}
          className={`${containerSizes[size]} object-contain rounded-2xl shadow-xs`}
        />
      ) : (
        <div className="flex items-center justify-center flex-shrink-0 transition-transform hover:scale-105 duration-200">
          <JatibarayaOfficialEmblem size={size} />
        </div>
      )}

      {showText && (
        <div className="flex flex-col leading-tight text-left">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-serif font-bold tracking-wider ${
                light ? 'text-white' : 'text-slate-900'
              } ${size === 'lg' || size === 'xl' || size === '2xl' ? 'text-2xl' : 'text-base sm:text-lg'}`}
            >
              {name}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 via-sky-500/15 to-emerald-500/20 text-amber-700 border border-amber-500/30">
              Priangan
            </span>
          </div>
          <span
            className={`text-xs line-clamp-1 font-medium ${
              light ? 'text-emerald-100/90' : 'text-slate-500'
            }`}
          >
            {fullName}
          </span>
        </div>
      )}
    </div>
  );
};
