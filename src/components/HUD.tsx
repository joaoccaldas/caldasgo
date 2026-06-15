import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PokemonSprite from './PokemonSprite';

interface HUDProps {
  onOpenMenu: () => void;
  playerLevel: number;
  xpProgress: number;
  onRecenter?: () => void;
  heading?: number;
  isMock?: boolean;
}

type HudPanel = 'weather' | 'research' | 'nearby' | null;
type NearbyTab = 'pokemon' | 'raid' | 'route';

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

const ProfilePortrait = ({ playerLevel, xpProgress }: Pick<HUDProps, 'playerLevel' | 'xpProgress'>) => {
  const circumference = 2 * Math.PI * 31;
  const clampedProgress = Math.min(1, Math.max(0, xpProgress));

  return (
    <div className="relative h-[66px] w-[66px] shrink-0">
      <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 70 70" aria-hidden="true">
        <circle cx="35" cy="35" r="31" fill="rgba(247,252,251,.94)" stroke="rgba(31,83,90,.20)" strokeWidth="5" />
        <circle
          cx="35"
          cy="35"
          r="31"
          fill="none"
          stroke="#f6c549"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - clampedProgress)}
          style={{ filter: 'drop-shadow(0 0 2px rgba(246,197,73,.72))', transition: 'stroke-dashoffset .35s ease' }}
        />
      </svg>
      <div className="absolute inset-[7px] overflow-hidden rounded-full border-2 border-white bg-gradient-to-b from-[#bde8f1] via-[#7ed0b0] to-[#5eb37f] shadow-[inset_0_-8px_12px_rgba(38,92,90,.15),0_3px_9px_rgba(27,66,73,.22)]">
        <div className="absolute bottom-[-8px] left-1/2 h-[48px] w-[31px] -translate-x-1/2 rounded-t-[15px] bg-[#247c91]" />
        <div className="absolute left-1/2 top-[10px] h-[25px] w-[25px] -translate-x-1/2 rounded-full bg-[#c58a62]" />
        <div className="absolute left-1/2 top-[5px] h-[13px] w-[30px] -translate-x-1/2 rounded-t-full bg-[#dd4056]" />
        <div className="absolute left-[29px] top-[19px] h-[3px] w-[3px] rounded-full bg-[#23353e]" />
      </div>
      <span className="absolute -bottom-1 left-1/2 min-w-7 -translate-x-1/2 rounded-full border-2 border-white bg-[#408fc7] px-2 py-0.5 text-center text-[10px] font-black leading-none text-white shadow-md">
        {playerLevel}
      </span>
    </div>
  );
};

const ActionBall = ({ onClick }: { onClick: () => void }) => (
  <motion.button
    type="button"
    whileTap={{ scale: 0.91 }}
    onClick={onClick}
    aria-label="Open main menu"
    className="group relative h-[84px] w-[84px] rounded-full border-[5px] border-white bg-white shadow-[0_9px_17px_rgba(20,55,63,.34),inset_0_0_0_1px_rgba(24,59,68,.15)]"
  >
    <span className="absolute inset-[2px] overflow-hidden rounded-full bg-[#f4f7f5]">
      <span className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-[#f05d66] to-[#d73e51]" />
      <span className="absolute inset-x-0 top-1/2 h-[8px] -translate-y-1/2 bg-[#233844]" />
      <span className="absolute left-1/2 top-1/2 h-[30px] w-[30px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[7px] border-[#233844] bg-white shadow-[0_0_0_2px_rgba(255,255,255,.8)] transition-transform duration-200 group-active:scale-90" />
      <span className="absolute left-[18px] top-[13px] h-[8px] w-[15px] -rotate-[26deg] rounded-full bg-white/42 blur-[1px]" />
    </span>
  </motion.button>
);

const HUD: React.FC<HUDProps> = ({
  onOpenMenu,
  playerLevel,
  xpProgress,
  onRecenter,
  heading = 0,
  isMock = false,
}) => {
  const [panel, setPanel] = useState<HudPanel>(null);
  const [nearbyTab, setNearbyTab] = useState<NearbyTab>('pokemon');

  return (
    <>
      <div className="pointer-events-none absolute inset-0 z-[400] font-sans">
        <div className="absolute left-1/2 top-[max(12px,env(safe-area-inset-top))] -translate-x-1/2">
          <div className="flex items-center gap-2 rounded-full border border-white/70 bg-[#153f49]/64 px-3 py-1.5 text-white shadow-[0_4px_14px_rgba(18,54,61,.16)] backdrop-blur-md">
            <span className={`h-2 w-2 rounded-full ${isMock ? 'bg-[#f5c64c]' : 'bg-[#70e29b]'} shadow-[0_0_8px_currentColor]`} />
            <span className="text-[9px] font-black uppercase tracking-[0.17em]">{isMock ? 'Explorer mode' : 'GPS connected'}</span>
          </div>
        </div>

        <div className="pointer-events-auto absolute right-3 top-[max(14px,env(safe-area-inset-top))] flex flex-col items-end gap-2.5">
          <button
            type="button"
            onClick={onRecenter}
            aria-label="Recenter map"
            className="relative flex h-12 w-12 items-center justify-center rounded-full border border-white/85 bg-white/91 text-[#366c74] shadow-[0_5px_16px_rgba(28,75,82,.24)] backdrop-blur-md active:scale-95"
          >
            <svg viewBox="0 0 24 24" className="h-[23px] w-[23px] transition-transform duration-300" style={{ transform: `rotate(${-heading}deg)` }} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="8" />
              <path d="m12 5 3.2 7L12 19l-3.2-7Z" fill="currentColor" opacity=".16" />
              <path d="m12 5 3.2 7H8.8Z" fill="#e45561" stroke="none" />
            </svg>
            <span className="absolute -bottom-1 rounded-full border border-white bg-[#eff7f5] px-1.5 py-0.5 text-[7px] font-black text-[#4c777a]">N</span>
          </button>

          <button
            type="button"
            onClick={() => setPanel('weather')}
            aria-label="Open weather information"
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-gradient-to-br from-[#69d7c3] to-[#2f9caf] text-white shadow-[0_5px_16px_rgba(28,86,95,.25)] backdrop-blur active:scale-95"
          >
            <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
              <circle cx="12" cy="12" r="4" fill="rgba(255,255,255,.18)" />
              <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </svg>
            <span className="absolute -bottom-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full border border-white bg-[#f6c243] px-1 text-[8px] font-black text-[#365e64]">18°</span>
          </button>
        </div>

        <div className="pointer-events-auto absolute bottom-[max(17px,env(safe-area-inset-bottom))] left-0 right-0 grid grid-cols-[1fr_auto_1fr] items-end px-3">
          <div className="flex items-end justify-self-start gap-1.5">
            <button type="button" aria-label="Open trainer profile" className="relative active:scale-95">
              <ProfilePortrait playerLevel={playerLevel} xpProgress={xpProgress} />
            </button>
            <button type="button" aria-label="Open buddy" className="relative mb-1 active:scale-95">
              <div className="flex h-[48px] w-[48px] items-center justify-center overflow-hidden rounded-full border-[3px] border-white bg-gradient-to-b from-[#d9f2a1] to-[#78c77c] shadow-[0_5px_14px_rgba(31,75,69,.28)]">
                <PokemonSprite id={1} name="Buddy" className="h-[112%] w-[112%] object-contain" />
              </div>
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#ef6270] text-white shadow-sm">
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor"><path d="M12 21s-8-4.4-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6.6-8 11-8 11Z" /></svg>
              </span>
            </button>
          </div>

          <div className="justify-self-center">
            <ActionBall onClick={onOpenMenu} />
          </div>

          <div className="flex flex-col items-end justify-self-end gap-2">
            <button
              type="button"
              onClick={() => setPanel('research')}
              aria-label="Open field research"
              className="relative mr-1 flex h-11 w-11 items-center justify-center rounded-full border border-white/85 bg-white/92 text-[#39717a] shadow-[0_4px_13px_rgba(29,70,77,.24)] backdrop-blur active:scale-95"
            >
              <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3h6l1 3h3v15H5V6h3l1-3Z" /><path d="M9 11h6M9 15h6" /></svg>
              <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-[#ef5c6d]" />
            </button>

            <button
              type="button"
              onClick={() => setPanel('nearby')}
              aria-label="Open nearby Pokémon"
              className="flex h-[56px] min-w-[112px] items-center justify-center gap-0.5 overflow-hidden rounded-[17px] border border-white/90 bg-white/93 px-2 shadow-[0_5px_16px_rgba(29,70,77,.28)] backdrop-blur active:scale-95"
            >
              {[1, 4, 7].map((id) => <div key={id} className="h-8 w-8 opacity-92"><PokemonSprite id={id} name="Nearby" className="h-full w-full object-contain" /></div>)}
              <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4 text-[#55a684]" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="m9 18 6-6-6-6" /></svg>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {panel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[575] flex items-end bg-[#143c46]/38 px-3 pb-[max(11px,env(safe-area-inset-bottom))] backdrop-blur-[2px]"
            onClick={() => setPanel(null)}
          >
            <motion.section
              initial={{ y: '105%' }}
              animate={{ y: 0 }}
              exit={{ y: '105%' }}
              transition={{ type: 'spring', stiffness: 270, damping: 27 }}
              onClick={(event) => event.stopPropagation()}
              className="mx-auto w-full max-w-xl overflow-hidden rounded-[30px] border border-white/80 bg-[#f8fcfb] shadow-[0_22px_55px_rgba(14,56,64,.36)]"
            >
              <div className="flex items-center justify-between border-b border-[#dfecea] px-5 py-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.17em] text-[#72a09d]">CaldasGO</p>
                  <h3 className="text-xl font-black tracking-tight text-[#28555b]">
                    {panel === 'weather' ? 'Current weather' : panel === 'research' ? 'Field research' : 'Nearby'}
                  </h3>
                </div>
                <button type="button" onClick={() => setPanel(null)} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e9f3f1] text-[#47777b] active:scale-95"><CloseIcon /></button>
              </div>

              {panel === 'weather' && (
                <div className="p-5">
                  <div className="flex items-center gap-4 rounded-2xl bg-gradient-to-r from-[#51c9b0] to-[#338eaa] p-4 text-white shadow-lg">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/18 ring-1 ring-white/35"><svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg></div>
                    <div><p className="text-3xl font-black">18°C</p><p className="text-sm font-bold text-white/85">Clear weather</p></div>
                  </div>
                  <p className="mt-4 text-xs font-black uppercase tracking-[0.12em] text-[#6a8e8e]">Weather boost</p>
                  <div className="mt-2 grid grid-cols-3 gap-2">{['Fire', 'Grass', 'Ground'].map((type) => <div key={type} className="rounded-xl bg-[#edf6f2] px-3 py-3 text-center text-xs font-black text-[#396d70] ring-1 ring-[#dcece6]">{type}</div>)}</div>
                </div>
              )}

              {panel === 'research' && (
                <div className="space-y-3 p-5">
                  {[
                    ['Catch 3 Pokémon', '1 / 3', 33],
                    ['Visit 2 PokéStops', '0 / 2', 0],
                    ['Make a Great Throw', 'Ready', 100],
                  ].map(([label, value, progress]) => (
                    <div key={label as string} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#dfebe8]">
                      <div className="flex items-center justify-between gap-3"><p className="text-sm font-black text-[#315e63]">{label}</p><span className="rounded-full bg-[#eaf5ef] px-2.5 py-1 text-[10px] font-black text-[#458576]">{value}</span></div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#dbeae6]"><div className="h-full rounded-full bg-gradient-to-r from-[#66ce99] to-[#29afa8]" style={{ width: `${progress}%` }} /></div>
                    </div>
                  ))}
                </div>
              )}

              {panel === 'nearby' && (
                <div>
                  <div className="grid grid-cols-3 border-b border-[#dfecea] bg-white/75 px-3">
                    {([
                      ['pokemon', 'Pokémon'],
                      ['raid', 'Raid'],
                      ['route', 'Route'],
                    ] as [NearbyTab, string][]).map(([tab, label]) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setNearbyTab(tab)}
                        className={`relative py-3 text-[11px] font-black uppercase tracking-[0.12em] ${nearbyTab === tab ? 'text-[#2c7b80]' : 'text-[#8aa5a4]'}`}
                      >
                        {label}
                        {nearbyTab === tab && <motion.span layoutId="nearby-tab" className="absolute inset-x-4 bottom-0 h-1 rounded-t-full bg-[#39b39c]" />}
                      </button>
                    ))}
                  </div>

                  {nearbyTab === 'pokemon' && (
                    <div className="grid grid-cols-3 gap-3 p-5">
                      {[1, 4, 7, 25, 133, 143].map((id, index) => (
                        <button key={id} type="button" className="relative overflow-hidden rounded-2xl bg-[#edf6f2] p-2 text-center ring-1 ring-[#dcece6] active:scale-95">
                          <div className="absolute inset-x-0 bottom-0 h-7 bg-[linear-gradient(135deg,transparent_25%,rgba(61,130,108,.08)_25%,rgba(61,130,108,.08)_50%,transparent_50%,transparent_75%,rgba(61,130,108,.08)_75%)] bg-[length:18px_18px]" />
                          <div className="relative mx-auto h-16 w-16"><PokemonSprite id={id} name="Nearby" className="h-full w-full object-contain" /></div>
                          <p className="relative mt-1 text-[10px] font-black uppercase tracking-wide text-[#4f777a]">{index < 3 ? `${80 + index * 45} m` : 'Explore'}</p>
                        </button>
                      ))}
                    </div>
                  )}

                  {nearbyTab === 'raid' && (
                    <div className="p-5">
                      <div className="rounded-3xl bg-gradient-to-br from-[#6c5aa6] to-[#303f75] p-5 text-white shadow-lg">
                        <div className="flex items-center justify-between"><div><p className="text-[10px] font-black uppercase tracking-[0.15em] text-white/70">Nearby gym</p><p className="mt-1 text-xl font-black">Raid forming</p></div><div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/14 text-3xl">★</div></div>
                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/20"><div className="h-full w-[58%] rounded-full bg-[#f0c34f]" /></div>
                        <p className="mt-2 text-xs font-bold text-white/78">Starts in 12:46</p>
                      </div>
                    </div>
                  )}

                  {nearbyTab === 'route' && (
                    <div className="p-5">
                      <div className="rounded-3xl bg-white p-5 ring-1 ring-[#dceae7]">
                        <div className="flex items-center gap-4"><div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e4f6ef] text-[#2da985]"><svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 19c7-1 4-8 10-9 3-.5 4-2 4-5" /><circle cx="5" cy="19" r="2" /><circle cx="19" cy="5" r="2" /></svg></div><div><p className="font-black text-[#315f65]">Park discovery loop</p><p className="text-xs font-bold text-[#779493]">0.8 km · 12 minutes</p></div></div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HUD;
