/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface DosLogoProps {
  className?: string;
  size?: number;
}

export const DosLogo: React.FC<DosLogoProps> = ({ className = '', size = 56 }) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none shrink-0 ${className}`}
      style={{ width: size, height: size }}
      title="دائرة الإحصاءات العامة - المملكة الأردنية الهاشمية (تأسست 1949)"
    >
      <svg
        viewBox="0 0 360 360"
        width="100%"
        height="100%"
        className="w-full h-full drop-shadow-xs"
      >
        <defs>
          {/* Main Blue Emblem Disc */}
          <radialGradient id="dosCoreBlue" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#225bb9" />
            <stop offset="55%" stopColor="#174391" />
            <stop offset="100%" stopColor="#0d2861" />
          </radialGradient>

          {/* Bar Chart 3D Gradients */}
          {/* Bar 1: Orange/Red (Left Short) */}
          <linearGradient id="dosCol1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>

          {/* Bar 2: Bright Emerald Green (Tallest) */}
          <linearGradient id="dosCol2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>

          {/* Bar 3: Dark Navy Blue (Tall) */}
          <linearGradient id="dosCol3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>

          {/* Bar 4: Lime Green (Medium) */}
          <linearGradient id="dosCol4" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#16a34a" />
          </linearGradient>

          {/* Bar 5: Coral Red (Tall Right) */}
          <linearGradient id="dosCol5" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>

          {/* Swoosh Red Dynamic Ribbon */}
          <linearGradient id="dosRedSwoosh" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#991b1b" />
          </linearGradient>

          {/* Drop shadow for 3D elements */}
          <filter id="dosDepth" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* ============ CENTRAL BLUE CIRCULAR EMBLEM ============ */}
        <circle cx="180" cy="165" r="98" fill="url(#dosCoreBlue)" />

        {/* Outer stylized arc accents at top right of circle */}
        <path
          d="M 245 80 A 108 108 0 0 1 285 160"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* ============ 5 STATISTICAL COLUMNS (EMERGING FROM BLUE CIRCLE) ============ */}
        {/* Column 1: Orange-Red (Left Short ~ 135px to 175px) */}
        <g filter="url(#dosDepth)">
          <rect x="110" y="130" width="22" height="48" rx="1.5" fill="url(#dosCol1)" />
          <polygon points="110,130 121,124 132,130 121,134" fill="#ffedd5" />
        </g>

        {/* Column 2: Tall Emerald Green (Highest ~ 35px to 175px) */}
        <g filter="url(#dosDepth)">
          <rect x="138" y="38" width="23" height="138" rx="2" fill="url(#dosCol2)" />
          <polygon points="138,38 149,31 161,38 149,43" fill="#dcfce7" />
        </g>

        {/* Column 3: Navy Blue (Tall ~ 55px to 175px) */}
        <g filter="url(#dosDepth)">
          <rect x="167" y="58" width="24" height="118" rx="2" fill="url(#dosCol3)" />
          <polygon points="167,58 179,51 191,58 179,63" fill="#e0f2fe" />
        </g>

        {/* Column 4: Medium Lime Green (~ 95px to 175px) */}
        <g filter="url(#dosDepth)">
          <rect x="197" y="98" width="23" height="78" rx="2" fill="url(#dosCol4)" />
          <polygon points="197,98 208,91 220,98 208,103" fill="#bbf7d0" />
        </g>

        {/* Column 5: Coral Red (Tall Right ~ 68px to 175px) */}
        <g filter="url(#dosDepth)">
          <rect x="226" y="68" width="22" height="108" rx="2" fill="url(#dosCol5)" />
          <polygon points="226,68 237,61 248,68 237,73" fill="#fee2e2" />
        </g>

        {/* ============ "DOS" 3D LETTERS DIRECTLY ON BLUE DISC ============ */}
        {/* Deep 3D extrusion shadows */}
        <g filter="url(#dosDepth)">
          {/* Black/dark 3D extrusion under the letters */}
          <text
            x="180"
            y="214"
            fontFamily="Impact, 'Arial Black', sans-serif"
            fontSize="54"
            fontWeight="900"
            fontStyle="italic"
            letterSpacing="5"
            fill="#0f172a"
            stroke="#020617"
            strokeWidth="3"
            textAnchor="middle"
          >
            DOS
          </text>
          {/* Main White Metallic Face of DOS */}
          <text
            x="180"
            y="209"
            fontFamily="Impact, 'Arial Black', sans-serif"
            fontSize="54"
            fontWeight="900"
            fontStyle="italic"
            letterSpacing="5"
            fill="#ffffff"
            stroke="#1e293b"
            strokeWidth="2.2"
            textAnchor="middle"
          >
            DOS
          </text>
        </g>

        {/* ============ DYNAMIC RED CRESCENT SWOOSH ============ */}
        {/* Curving from bottom-left under DOS, across front of blue circle */}
        <path
          d="M 92 216 C 125 244, 215 244, 276 194 C 280 190, 285 196, 280 200 C 218 256, 120 254, 90 222 Z"
          fill="url(#dosRedSwoosh)"
          filter="url(#dosDepth)"
        />
        {/* Red bulb / circle at right end of swoosh */}
        <circle cx="280" cy="193" r="6" fill="#dc2626" />

        {/* ============ YEAR 1949 ============ */}
        <text
          x="180"
          y="250"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="18"
          fontWeight="800"
          letterSpacing="2.5"
          fill="#ffffff"
          textAnchor="middle"
        >
          1949
        </text>

        {/* ============ CIRCULAR ARABIC TEXT: "دائرة الإحصاءات العامة" ============ */}
        {/* Semicircle path underneath the emblem */}
        <path
          id="dosArabicArcOfficial"
          d="M 40 215 A 148 148 0 0 0 320 215"
          fill="none"
          stroke="transparent"
        />
        <text fill="#143e88" fontSize="24" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif">
          <textPath
            href="#dosArabicArcOfficial"
            startOffset="50%"
            textAnchor="middle"
            spacing="auto"
          >
            دائـــرة الإحــصــاءات الـعــامــة
          </textPath>
        </text>
      </svg>
    </div>
  );
};
