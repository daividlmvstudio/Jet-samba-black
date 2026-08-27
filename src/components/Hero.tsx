import React from 'react';
import { useBand } from '../context/BandContext';
import { Play, Pause, Calendar, Briefcase, Sparkles, Music, ChevronRight, Disc, Flame, ExternalLink, Radio } from 'lucide-react';
import { motion } from 'motion/react';
import { SOUNDCLOUD_TRACK_URL } from './SoundCloudLadyPlayer';
import { DEFAULT_BAND_LOGO } from '../data/bandLogos';

export const Hero: React.FC = () => {
  const { bandInfo, currentTrack, isPlaying, togglePlayTrack, siteVisits } = useBand();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-zinc-950 text-white">
      {/* Dynamic Concert Stage Background with Atmospheric Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=2000&q=80"
          alt="Aurora Eclipse Live Stage"
          className="w-full h-full object-cover object-center opacity-30 scale-105 transform filter brightness-75 contrast-125"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose-950/40 via-transparent to-zinc-950" />
      </div>

      {/* Atmospheric Stage Lighting Flares */}
      <div className="absolute -top-24 left-1/4 w-96 h-96 bg-rose-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute top-1/3 -right-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
        {/* Tour Status Pill & Logo Emblem */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-3 mb-6"
        >
          <div id="hero-band-logo-container" className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-zinc-900/95 border-2 border-orange-500/50 shadow-2xl shadow-orange-950/70 p-1 backdrop-blur-md hover:scale-105 transition-transform duration-300">
            <img
              id="hero-band-logo-img"
              src={bandInfo.heroLogoUrl || bandInfo.logoUrl || DEFAULT_BAND_LOGO}
              alt={bandInfo.name}
              className="w-full h-full object-cover rounded-xl"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src !== DEFAULT_BAND_LOGO) {
                  target.src = DEFAULT_BAND_LOGO;
                }
              }}
            />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/90 border border-orange-500/40 backdrop-blur-md shadow-lg shadow-orange-950/40">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-orange-300">
              {`JET OFICIAL ${new Date().getFullYear()}`}
            </span>
          </div>
        </motion.div>

        {/* Main Band Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight uppercase leading-none max-w-5xl"
        >
          <span className="block bg-clip-text text-transparent bg-gradient-to-b from-white via-zinc-100 to-zinc-400">
            {bandInfo.name}
          </span>
        </motion.h1>

        {/* Tagline / Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg text-zinc-200 max-w-3xl font-normal leading-relaxed whitespace-pre-line text-center space-y-2"
        >
          {bandInfo.tagline}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-9 flex flex-wrap gap-4 justify-center items-center"
        >
          <button
            onClick={() => scrollTo('shows')}
            className="px-7 py-4 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-bold text-sm shadow-xl shadow-rose-950/60 hover:shadow-rose-600/30 hover:scale-105 transition-all flex items-center gap-2.5 cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Ver Agenda de Shows</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => scrollTo('contratacoes')}
            className="px-7 py-4 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 text-zinc-100 font-bold text-sm hover:border-zinc-500 hover:scale-105 transition-all flex items-center gap-2.5 cursor-pointer backdrop-blur-md"
          >
            <Briefcase className="w-4 h-4 text-emerald-400" />
            <span>Contratar para Evento</span>
          </button>

          <button
            onClick={() => scrollTo('streaming')}
            className="px-7 py-4 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-bold text-sm shadow-xl shadow-rose-950/60 hover:shadow-rose-600/30 hover:scale-105 transition-all flex items-center gap-2.5 cursor-pointer"
          >
            <Music className="w-4 h-4" />
            <span>Conheça o Som</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Quick Highlights Counters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 w-full max-w-4xl pt-8 border-t border-zinc-800/80"
        >
          <div className="text-center p-3 rounded-xl bg-zinc-950/60 border border-zinc-900">
            <div className="text-2xl sm:text-3xl font-black text-rose-400">
              +{siteVisits.toLocaleString('pt-BR')}
            </div>
            <div className="text-xs text-zinc-400 mt-1 uppercase font-semibold tracking-wider">VISITAS</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-zinc-950/60 border border-zinc-900">
            <div className="text-2xl sm:text-3xl font-black text-amber-400">+180</div>
            <div className="text-xs text-zinc-400 mt-1 uppercase font-semibold tracking-wider">Concertos Realizados</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-zinc-950/60 border border-zinc-900">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">14</div>
            <div className="text-xs text-zinc-400 mt-1 uppercase font-semibold tracking-wider">Capitais na Turnê</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-zinc-950/60 border border-zinc-900">
            <div className="text-2xl sm:text-3xl font-black text-purple-400">100%</div>
            <div className="text-xs text-zinc-400 mt-1 uppercase font-semibold tracking-wider">Energia Autoral</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
