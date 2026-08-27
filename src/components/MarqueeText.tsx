import React from 'react';

interface MarqueeTextProps {
  text: string;
  speed?: 'normal' | 'slow' | 'fast';
  className?: string;
  badge?: string;
  icon?: React.ReactNode;
  fadeEdges?: boolean;
}

export const MarqueeText: React.FC<MarqueeTextProps> = ({
  text,
  speed = 'normal',
  className = '',
  badge,
  icon,
  fadeEdges = true
}) => {
  const speedClass =
    speed === 'fast'
      ? 'animate-marquee-fast'
      : speed === 'slow'
      ? 'animate-marquee-slow'
      : 'animate-marquee-infinite';

  return (
    <div className={`relative overflow-hidden w-full select-none ${className}`}>
      {fadeEdges && (
        <>
          <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none" />
        </>
      )}

      <div className={`${speedClass} flex items-center`}>
        {/* Item 1 */}
        <div className="flex items-center gap-2 pr-8 shrink-0">
          {icon}
          {badge && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40">
              {badge}
            </span>
          )}
          <span className="font-bold tracking-wide whitespace-nowrap">{text}</span>
          <span className="text-zinc-600 font-mono">✦</span>
        </div>

        {/* Item 2 (Seamless loop duplicate) */}
        <div className="flex items-center gap-2 pr-8 shrink-0" aria-hidden="true">
          {icon}
          {badge && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40">
              {badge}
            </span>
          )}
          <span className="font-bold tracking-wide whitespace-nowrap">{text}</span>
          <span className="text-zinc-600 font-mono">✦</span>
        </div>

        {/* Item 3 */}
        <div className="flex items-center gap-2 pr-8 shrink-0" aria-hidden="true">
          {icon}
          {badge && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40">
              {badge}
            </span>
          )}
          <span className="font-bold tracking-wide whitespace-nowrap">{text}</span>
          <span className="text-zinc-600 font-mono">✦</span>
        </div>

        {/* Item 4 */}
        <div className="flex items-center gap-2 pr-8 shrink-0" aria-hidden="true">
          {icon}
          {badge && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40">
              {badge}
            </span>
          )}
          <span className="font-bold tracking-wide whitespace-nowrap">{text}</span>
          <span className="text-zinc-600 font-mono">✦</span>
        </div>
      </div>
    </div>
  );
};
