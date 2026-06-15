interface ScreenHeaderProps {
  title: string;
  /** Optional stat shown on the right, e.g. "10 / 300". */
  rightLabel?: string;
}

/**
 * The shared Pokémon GO menu header: a single unified teal-navy bar with a
 * white, letter-spaced title. Used across the Pokédex, Pokémon storage, and
 * Items screens so they share one identity instead of red/blue/green banners.
 */
const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, rightLabel }) => {
  return (
    <div
      className="h-20 flex flex-col justify-end items-center pb-3 relative z-10 shrink-0"
      style={{
        background: 'linear-gradient(to bottom, #12515e 0%, #0b2a3a 100%)',
        boxShadow: '0 4px 10px rgba(0,0,0,0.35), inset 0 -2px 6px rgba(0,0,0,0.25)',
      }}
    >
      <h1 className="text-white font-black tracking-[0.18em] text-xl drop-shadow-md font-sans">{title}</h1>
      {rightLabel && (
        <span className="absolute right-4 bottom-3 text-white/80 font-bold text-sm tracking-wide">{rightLabel}</span>
      )}
    </div>
  );
};

export default ScreenHeader;
