import React from 'react';
import type { Location } from '../hooks/useGeolocation';

const PerspectiveTerrain: React.FC<{ location: Location }> = ({ location }) => {
  const driftX = ((Math.abs(location.lng * 100_000) % 100) - 50) * 0.45;
  const driftY = ((Math.abs(location.lat * 100_000) % 100) - 50) * 0.28;

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#91d5d9]">
      <div className="absolute inset-x-0 top-0 h-[27%] bg-[linear-gradient(180deg,#8bd5e5_0%,#bce9e1_52%,rgba(196,235,215,0)_100%)]" />
      <div className="absolute inset-x-0 top-[14%] h-[13%] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,.82),rgba(255,255,255,0)_68%)] blur-md" />

      <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id="terrain-land" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a8d8a1" /><stop offset=".48" stopColor="#8dcc8e" /><stop offset="1" stopColor="#68b97a" /></linearGradient>
          <linearGradient id="terrain-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#87d4d9" /><stop offset="1" stopColor="#49aebf" /></linearGradient>
          <linearGradient id="terrain-road" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f4f2e4" /><stop offset="1" stopColor="#eae8d8" /></linearGradient>
          <pattern id="terrain-dots" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="4" cy="4" r="2" fill="#2c8e69" opacity=".08" /></pattern>
          <clipPath id="terrain-ground"><path d="M0 150H1000V1000H0Z" /></clipPath>
        </defs>

        <path d="M0 135C170 145 265 122 410 139c190 21 346-13 590 3v858H0Z" fill="url(#terrain-land)" />
        <path d="M0 135C170 145 265 122 410 139c190 21 346-13 590 3" fill="none" stroke="#d4eed0" strokeWidth="8" opacity=".65" />

        <g clipPath="url(#terrain-ground)" transform={`translate(${driftX} ${driftY})`}>
          <path d="M817 121c-43 154 27 257-31 389-55 127 9 250-66 490h280V105Z" fill="url(#terrain-water)" />
          <path d="M818 122c-40 156 29 258-27 389-52 126 11 254-61 489" fill="none" stroke="#d8f5ea" strokeWidth="12" opacity=".46" />

          <path d="M64 244c86-51 193-38 250 44 37 54 8 128-81 150-99 24-189-50-169-194Z" fill="#65b879" opacity=".78" />
          <path d="M597 300c68-35 136 2 147 65 11 61-34 104-106 88-68-15-93-101-41-153Z" fill="#61b879" opacity=".76" />
          <path d="M54 731c103-84 232-59 291 59 32 65-1 143-97 182H0V780Z" fill="#5dad70" opacity=".72" />

          <path d="M430 128h138l192 872H214Z" fill="#b7b7aa" opacity=".38" />
          <path d="M446 128h106l166 872H258Z" fill="url(#terrain-road)" />
          <path d="M488 128h24l20 872h-64Z" fill="#fff" opacity=".44" />

          <path d="M0 350l1000-67v75L0 443Z" fill="#b7b7aa" opacity=".34" />
          <path d="M0 363l1000-64v45L0 423Z" fill="url(#terrain-road)" />
          <path d="M0 391l1000-70" fill="none" stroke="#fff" strokeWidth="5" strokeDasharray="28 34" opacity=".38" />

          <path d="M0 708l1000-131v127L0 889Z" fill="#aeafa4" opacity=".42" />
          <path d="M0 733l1000-128v77L0 850Z" fill="url(#terrain-road)" />
          <path d="M0 789l1000-148" fill="none" stroke="#fff" strokeWidth="9" strokeDasharray="44 48" opacity=".38" />

          <path d="M114 137h91l241 863H330Z" fill="#ebeadc" />
          <path d="M736 130h66l-196 870H486Z" fill="#ecebdd" opacity=".94" />
          <path d="M0 551l1000-74v38L0 600Z" fill="#eeeede" opacity=".96" />

          <g fill="#78b78b" stroke="#d6e2d7" strokeWidth="7" opacity=".86">
            <path d="M244 174h92l18 68H254Z" /><path d="M626 176h86l-16 74h-91Z" /><path d="M105 466h128l27 104H122Z" />
            <path d="M682 436h123l-31 112H655Z" /><path d="M284 515h104l19 121H306Z" /><path d="M520 746h132l-39 178H492Z" />
          </g>
          <rect x="0" y="130" width="1000" height="870" fill="url(#terrain-dots)" />
        </g>
      </svg>

      <div className="map-cloud-shadow absolute left-[-20%] top-[28%] h-24 w-[62%] rounded-[50%] bg-[#276f67]/8 blur-2xl" />
      <div className="absolute inset-x-0 bottom-0 h-[24%] bg-[linear-gradient(180deg,rgba(40,111,76,0),rgba(31,94,64,.14))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(255,255,255,0)_32%,rgba(31,84,77,.15)_100%)]" />
    </div>
  );
};

export default PerspectiveTerrain;
