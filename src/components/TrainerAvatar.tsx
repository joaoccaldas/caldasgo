import React from 'react';

interface TrainerAvatarProps {
  heading?: number;
  isWalking?: boolean;
  isMock?: boolean;
  className?: string;
}

const TrainerAvatar: React.FC<TrainerAvatarProps> = ({
  heading = 0,
  isWalking = false,
  isMock = false,
  className = '',
}) => {
  return (
    <div
      className={`trainer-avatar pointer-events-none relative flex h-[132px] w-[104px] items-end justify-center ${isWalking ? 'trainer-avatar--walking' : ''} ${className}`}
      style={{ '--trainer-heading': `${heading}deg` } as React.CSSProperties}
      aria-label="Trainer position"
    >
      <div className="trainer-radius absolute bottom-[12px] left-1/2 h-[92px] w-[92px] -translate-x-1/2 rounded-full border border-[#58c8ff]/55 bg-[#4bc4ff]/14 shadow-[0_0_22px_rgba(74,194,255,.18)]" />
      <div className="trainer-radius-pulse absolute bottom-[9px] left-1/2 h-[98px] w-[98px] -translate-x-1/2 rounded-full border-2 border-[#6fd4ff]/50" />
      <div className="trainer-shadow absolute bottom-[13px] left-1/2 h-[13px] w-[52px] -translate-x-1/2 rounded-[50%] bg-[#123a42]/30 blur-[2px]" />

      <svg
        viewBox="0 0 120 170"
        className="trainer-body relative z-10 h-[126px] w-[90px] overflow-visible drop-shadow-[0_7px_7px_rgba(17,56,61,.28)]"
        role="img"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="trainerSkin" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d9a579" />
            <stop offset="1" stopColor="#bb754f" />
          </linearGradient>
          <linearGradient id="trainerJacket" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#31a7bd" />
            <stop offset="1" stopColor="#17677a" />
          </linearGradient>
          <linearGradient id="trainerPants" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#243c59" />
            <stop offset="1" stopColor="#14263f" />
          </linearGradient>
          <linearGradient id="trainerCap" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f15462" />
            <stop offset="1" stopColor="#bc2b48" />
          </linearGradient>
        </defs>

        <g className="trainer-turn" style={{ transformOrigin: '60px 88px' }}>
          <g className="trainer-backpack">
            <path d="M31 73c0-11 7-18 16-18h25c10 0 17 8 17 19v42H31Z" fill="#173d4f" />
            <path d="M35 73c1-8 6-13 14-13h22c8 0 13 6 14 14v34H35Z" fill="#f3a329" />
            <rect x="40" y="83" width="40" height="24" rx="8" fill="#d87d1f" />
            <path d="M48 60V47h24v13" fill="none" stroke="#173d4f" strokeWidth="6" strokeLinecap="round" />
          </g>

          <g className="trainer-leg trainer-leg--back" style={{ transformOrigin: '72px 119px' }}>
            <path d="M63 109h20l-3 38H65Z" fill="url(#trainerPants)" />
            <path d="M65 143h17l7 10c2 3 0 7-4 7H65c-4 0-6-4-4-7Z" fill="#f2f5f6" />
            <path d="M64 151h25" stroke="#cf4555" strokeWidth="5" strokeLinecap="round" />
          </g>

          <g className="trainer-leg trainer-leg--front" style={{ transformOrigin: '49px 119px' }}>
            <path d="M39 109h22l-4 39H41Z" fill="url(#trainerPants)" />
            <path d="M41 144h18l5 10c2 3-1 7-5 7H39c-4 0-6-4-3-7Z" fill="#ffffff" />
            <path d="M38 152h25" stroke="#cf4555" strokeWidth="5" strokeLinecap="round" />
          </g>

          <g className="trainer-arm trainer-arm--back" style={{ transformOrigin: '78px 77px' }}>
            <path d="M77 72c7-1 11 3 12 10l4 27c1 6-8 9-11 3L72 86c-3-7-1-12 5-14Z" fill="url(#trainerJacket)" />
            <circle cx="90" cy="112" r="7" fill="url(#trainerSkin)" />
          </g>

          <path d="M38 70c3-10 12-16 23-16 13 0 22 7 25 19l-4 42H39Z" fill="url(#trainerJacket)" />
          <path d="M46 62c5 8 25 8 31 0v16H46Z" fill="#f3f7f4" opacity=".9" />
          <path d="M55 67h13v37H55Z" fill="#f7c94c" />
          <path d="M40 104h42v12H39Z" fill="#184b63" />
          <circle cx="61" cy="110" r="4" fill="#f7c94c" />

          <g className="trainer-arm trainer-arm--front" style={{ transformOrigin: '40px 77px' }}>
            <path d="M40 72c-7-1-12 3-13 10l-4 26c-1 7 8 10 12 4l11-27c3-7 0-12-6-13Z" fill="url(#trainerJacket)" />
            <circle cx="26" cy="111" r="7" fill="url(#trainerSkin)" />
          </g>

          <g className="trainer-head" style={{ transformOrigin: '60px 48px' }}>
            <path d="M40 31c1-17 39-18 41 1v18c0 14-9 23-21 23S39 64 39 50Z" fill="url(#trainerSkin)" />
            <path d="M39 40c1-17 9-26 23-26 13 0 21 8 21 24-8-7-15-8-23-8-7 0-14 2-21 10Z" fill="#24333f" />
            <path d="M38 31c2-18 42-22 46-1l-3 7c-12-4-28-4-42 2Z" fill="url(#trainerCap)" />
            <path d="M39 35c-9 1-14 5-14 9 8 2 18 0 26-5Z" fill="#a91f3a" />
            <path d="M56 23c5-2 12-1 17 2v8H56Z" fill="#f8f8f5" opacity=".94" />
            <circle cx="72" cy="47" r="2.4" fill="#26333d" />
            <path d="M65 59c5 3 10 2 13-1" fill="none" stroke="#844b3a" strokeWidth="2" strokeLinecap="round" />
            <path d="M79 41c4 3 5 9 2 13" fill="none" stroke="#9e5d43" strokeWidth="2" strokeLinecap="round" />
          </g>
        </g>
      </svg>

      {isMock && (
        <div className="absolute bottom-[112px] left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/70 bg-[#183d4a]/82 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.13em] text-white shadow-lg backdrop-blur-md">
          Tap to walk
        </div>
      )}

      <style>{`
        .trainer-avatar { --trainer-heading: 0deg; }
        .trainer-turn { transform: rotateY(calc(var(--trainer-heading) * .08)); }
        .trainer-body { animation: trainer-idle 2.4s ease-in-out infinite; transform-origin: 50% 100%; }
        .trainer-avatar--walking .trainer-body { animation: trainer-bob .38s ease-in-out infinite alternate; }
        .trainer-avatar--walking .trainer-leg--front { animation: trainer-leg-front .46s ease-in-out infinite alternate; }
        .trainer-avatar--walking .trainer-leg--back { animation: trainer-leg-back .46s ease-in-out infinite alternate; }
        .trainer-avatar--walking .trainer-arm--front { animation: trainer-arm-front .46s ease-in-out infinite alternate; }
        .trainer-avatar--walking .trainer-arm--back { animation: trainer-arm-back .46s ease-in-out infinite alternate; }
        .trainer-avatar--walking .trainer-backpack { animation: trainer-pack .46s ease-in-out infinite alternate; transform-origin: 60px 82px; }
        .trainer-radius-pulse { animation: trainer-radius 2s ease-out infinite; }
        .trainer-shadow { animation: trainer-shadow 2.4s ease-in-out infinite; }
        @keyframes trainer-idle { 0%,100% { transform: translateY(0) rotate(.2deg); } 50% { transform: translateY(-2px) rotate(-.2deg); } }
        @keyframes trainer-bob { from { transform: translateY(0) rotate(-1deg); } to { transform: translateY(-5px) rotate(1deg); } }
        @keyframes trainer-leg-front { from { transform: rotate(13deg) translateY(-1px); } to { transform: rotate(-12deg) translateY(1px); } }
        @keyframes trainer-leg-back { from { transform: rotate(-12deg) translateY(1px); } to { transform: rotate(13deg) translateY(-1px); } }
        @keyframes trainer-arm-front { from { transform: rotate(-12deg); } to { transform: rotate(12deg); } }
        @keyframes trainer-arm-back { from { transform: rotate(12deg); } to { transform: rotate(-12deg); } }
        @keyframes trainer-pack { from { transform: rotate(-1.5deg); } to { transform: rotate(1.5deg); } }
        @keyframes trainer-radius { 0% { opacity: .72; transform: translateX(-50%) scale(.72); } 80%,100% { opacity: 0; transform: translateX(-50%) scale(1.2); } }
        @keyframes trainer-shadow { 0%,100% { transform: translateX(-50%) scaleX(1); opacity: .32; } 50% { transform: translateX(-50%) scaleX(.88); opacity: .24; } }
        @media (prefers-reduced-motion: reduce) {
          .trainer-body, .trainer-radius-pulse, .trainer-shadow, .trainer-leg, .trainer-arm, .trainer-backpack { animation: none !important; }
        }
      `}</style>
    </div>
  );
};

export default TrainerAvatar;
