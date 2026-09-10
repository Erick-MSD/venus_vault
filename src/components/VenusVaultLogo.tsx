import React from 'react';

interface VenusVaultLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  theme?: 'dark' | 'light';
  badgeOnly?: boolean;
}

export const VenusVaultLogo: React.FC<VenusVaultLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  theme = 'dark',
  badgeOnly = false,
}) => {
  const sizeDimensions = {
    sm: { icon: 34, textScale: 'text-sm' },
    md: { icon: 46, textScale: 'text-base' },
    lg: { icon: 68, textScale: 'text-xl' },
    xl: { icon: 110, textScale: 'text-3xl' },
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* High-Fidelity Circular Vault Emblem */}
      <svg
        width={sizeDimensions.icon}
        height={sizeDimensions.icon}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 drop-shadow-[0_4px_16px_rgba(147,51,234,0.35)] transition-transform duration-300 hover:scale-105"
      >
        <defs>
          {/* Metallic Outer Ring Gradient */}
          <linearGradient id="metalRing" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#CBD5E1" />
            <stop offset="25%" stopColor="#64748B" />
            <stop offset="50%" stopColor="#94A3B8" />
            <stop offset="75%" stopColor="#475569" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>

          {/* Dark Inner Steel Bevel */}
          <radialGradient id="innerChamber" cx="100" cy="100" r="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4A154B" />
            <stop offset="45%" stopColor="#2E1065" />
            <stop offset="85%" stopColor="#170A2C" />
            <stop offset="100%" stopColor="#0B0516" />
          </radialGradient>

          {/* Radial Iris Petals Shadow */}
          <linearGradient id="irisShine" x1="50" y1="50" x2="150" y2="150" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A855F7" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#3B0764" stopOpacity="0.9" />
          </linearGradient>

          {/* 3D Silver Facet (Left) */}
          <linearGradient id="silverFacet" x1="70" y1="50" x2="100" y2="150" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#E2E8F0" />
            <stop offset="70%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#64748B" />
          </linearGradient>

          {/* 3D Purple Gleam Facet (Right) */}
          <linearGradient id="purpleGleamFacet" x1="100" y1="50" x2="135" y2="150" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E9D5FF" />
            <stop offset="30%" stopColor="#C084FC" />
            <stop offset="70%" stopColor="#7E22CE" />
            <stop offset="100%" stopColor="#4C1D95" />
          </linearGradient>

          {/* Bolt Stud Pattern */}
          <linearGradient id="boltGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
        </defs>

        {/* 6 Outer Vault Mechanical Locking Bolting Tabs */}
        {/* Top */}
        <rect x="94" y="2" width="12" height="18" rx="2" fill="url(#metalRing)" stroke="#1E293B" strokeWidth="1.5" />
        <circle cx="100" cy="11" r="2" fill="#E2E8F0" />
        {/* Bottom */}
        <rect x="94" y="180" width="12" height="18" rx="2" fill="url(#metalRing)" stroke="#1E293B" strokeWidth="1.5" />
        <circle cx="100" cy="189" r="2" fill="#E2E8F0" />
        {/* Top-Right (approx 60 deg) */}
        <g transform="rotate(60 100 100)">
          <rect x="94" y="2" width="12" height="18" rx="2" fill="url(#metalRing)" stroke="#1E293B" strokeWidth="1.5" />
          <circle cx="100" cy="11" r="2" fill="#E2E8F0" />
        </g>
        {/* Bottom-Right (approx 120 deg) */}
        <g transform="rotate(120 100 100)">
          <rect x="94" y="2" width="12" height="18" rx="2" fill="url(#metalRing)" stroke="#1E293B" strokeWidth="1.5" />
          <circle cx="100" cy="11" r="2" fill="#E2E8F0" />
        </g>
        {/* Bottom-Left (approx 240 deg) */}
        <g transform="rotate(240 100 100)">
          <rect x="94" y="2" width="12" height="18" rx="2" fill="url(#metalRing)" stroke="#1E293B" strokeWidth="1.5" />
          <circle cx="100" cy="11" r="2" fill="#E2E8F0" />
        </g>
        {/* Top-Left (approx 300 deg) */}
        <g transform="rotate(300 100 100)">
          <rect x="94" y="2" width="12" height="18" rx="2" fill="url(#metalRing)" stroke="#1E293B" strokeWidth="1.5" />
          <circle cx="100" cy="11" r="2" fill="#E2E8F0" />
        </g>

        {/* Outer Heavy Metallic Armor Ring */}
        <circle cx="100" cy="100" r="88" fill="url(#metalRing)" stroke="#0F172A" strokeWidth="2.5" />
        <circle cx="100" cy="100" r="81" fill="#1E1B2E" stroke="#334155" strokeWidth="1.5" />

        {/* Outer Stud Rivets (16 round rivets) */}
        {[...Array(16)].map((_, i) => {
          const angle = (i * 360) / 16;
          const rad = (angle * Math.PI) / 180;
          const cx = 100 + 84.5 * Math.cos(rad);
          const cy = 100 + 84.5 * Math.sin(rad);
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r="2.2"
              fill="url(#boltGrad)"
              stroke="#0F172A"
              strokeWidth="0.75"
            />
          );
        })}

        {/* Inner Chamber Background (Dark Purple Vault Iris) */}
        <circle cx="100" cy="100" r="76" fill="url(#innerChamber)" />

        {/* Vault Iris Blades (Segmented Radial Lines) */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 360) / 12;
          return (
            <line
              key={`blade-${i}`}
              x1="100"
              y1="100"
              x2="100"
              y2="24"
              stroke="#6B21A8"
              strokeWidth="1"
              strokeOpacity="0.45"
              transform={`rotate(${angle} 100 100)`}
            />
          );
        })}

        {/* Inner Glow Ring */}
        <circle cx="100" cy="100" r="76" stroke="#9333EA" strokeWidth="1.5" strokeOpacity="0.4" fill="none" />

        {/* Sharp Metallic 3D Faceted "V" */}
        {/* Left Silver Facet of the V */}
        <polygon
          points="62,56 78,56 100,148 100,154 96,150"
          fill="url(#silverFacet)"
          stroke="#475569"
          strokeWidth="0.8"
        />
        {/* Left Inner Wing of the V */}
        <polygon
          points="78,56 94,56 100,140 100,148"
          fill="#CBD5E1"
        />

        {/* Right Facet with Intense Violet / Purple Gleam */}
        <polygon
          points="138,56 122,56 100,148 100,154 104,150"
          fill="url(#purpleGleamFacet)"
          stroke="#3B0764"
          strokeWidth="0.8"
        />
        {/* Right Inner Wing of the V */}
        <polygon
          points="122,56 106,56 100,140 100,148"
          fill="#A855F7"
        />

        {/* Top Serif Caps on the V */}
        {/* Left top serif */}
        <polygon points="56,56 84,56 80,62 60,62" fill="#E2E8F0" stroke="#64748B" strokeWidth="0.5" />
        {/* Right top serif */}
        <polygon points="116,56 144,56 140,62 120,62" fill="#D8B4FE" stroke="#581C87" strokeWidth="0.5" />

        {/* Center Ridge Highlight (The spine where the two 3D facets meet) */}
        <line x1="100" y1="56" x2="100" y2="152" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />

        {/* Central Core Violet Glow */}
        <circle cx="100" cy="100" r="14" fill="#C084FC" opacity="0.15" filter="blur(6px)" />
      </svg>

      {/* Typography: VENUS - VAULT - */}
      {showText && !badgeOnly && (
        <div className="flex flex-col leading-none">
          <span
            className={`font-['Cinzel',serif] tracking-[0.22em] font-extrabold transition-colors duration-200 ${
              sizeDimensions.textScale
            } ${
              theme === 'dark'
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-purple-200 to-purple-400'
                : 'text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-purple-900 to-purple-700'
            }`}
          >
            VENUS
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className={`h-[1px] w-2.5 transition-colors ${
                theme === 'dark' ? 'bg-purple-400/60' : 'bg-purple-600/60'
              }`}
            />
            <span
              className={`font-['Space_Grotesk',sans-serif] text-[10px] tracking-[0.35em] font-bold uppercase ${
                theme === 'dark' ? 'text-purple-300' : 'text-purple-800'
              }`}
            >
              VAULT
            </span>
            <span
              className={`h-[1px] w-2.5 transition-colors ${
                theme === 'dark' ? 'bg-purple-400/60' : 'bg-purple-600/60'
              }`}
            />
          </div>
        </div>
      )}
    </div>
  );
};
