import React, { useState } from 'react';
import { useBand } from '../context/BandContext';
import { Sparkles, Award, Compass, Music, Flame, Calendar, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const AboutSection: React.FC = () => {
  const { bandInfo } = useBand();
  const [selectedMilestone, setSelectedMilestone] = useState<number>(bandInfo.historyMilestones.length - 1);

  return (
    <section id="historia" className="py-24 bg-zinc-900/60 text-zinc-100 border-t border-zinc-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nossa Trajetória</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            História & Identidade Sonora
          </h2>
          <p className="mt-4 text-base text-zinc-400 leading-relaxed">
            Conheça as raízes, os palcos e os momentos decisivos que transformaram o {bandInfo.name}.
          </p>
        </div>

        {/* Story Grid (Bio + Philosophy) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-20">
          <div className="lg:col-span-6 space-y-6">
            <div className="p-8 rounded-2xl bg-zinc-950/80 border border-zinc-800 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Flame className="w-6 h-6 text-rose-500" />
                <span>O Som que Desperta Multidões</span>
              </h3>
              <p className="text-zinc-300 leading-relaxed text-base">
                {bandInfo.bio}
              </p>
              <p className="text-zinc-400 leading-relaxed text-sm mt-4">
                {bandInfo.longBio}
              </p>

              <div className="mt-6 pt-6 border-t border-zinc-800 flex flex-wrap gap-4 text-xs font-semibold text-zinc-400">
                <div className="flex items-center gap-1.5 bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800">
                  <Compass className="w-4 h-4 text-amber-400" />
                  <span>Origem: <strong>{bandInfo.cityOrigin}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800">
                  <Calendar className="w-4 h-4 text-rose-400" />
                  <span>Fundação: <strong>{bandInfo.yearFormed}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800">
                  <Music className="w-4 h-4 text-emerald-400" />
                  <span>Gênero: <strong>{bandInfo.genre}</strong></span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80"
                alt="Aurora Eclipse Estúdio de Gravação"
                className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-black/60 px-2.5 py-1 rounded-md backdrop-blur-md">
                  Processo Criativo
                </span>
                <p className="text-white font-bold text-lg mt-2">
                  "A música é a nossa linguagem mais pura e sem filtros."
                </p>
                <p className="text-zinc-400 text-xs mt-1">
                  Composições autorais gravadas com equipamentos valvulados analógicos e tecnologia moderna.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Milestones Timeline */}
        <div className="bg-zinc-950/80 rounded-2xl border border-zinc-800 p-6 sm:p-10 shadow-2xl">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-800">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span>Linha do Tempo & Conquistas</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Clique nos anos abaixo para explorar cada capítulo da história
              </p>
            </div>
          </div>

          {/* Timeline Buttons Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-8">
            {bandInfo.historyMilestones.map((m, idx) => (
              <button
                key={m.year}
                onClick={() => setSelectedMilestone(idx)}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  selectedMilestone === idx
                    ? 'bg-gradient-to-br from-rose-600 to-amber-600 border-rose-500 text-white font-bold shadow-lg shadow-rose-950/50'
                    : 'bg-zinc-900/90 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                <div className="text-base sm:text-lg font-black">{m.year}</div>
                <div className="text-[11px] truncate mt-0.5 opacity-90">{m.title}</div>
              </button>
            ))}
          </div>

          {/* Selected Milestone Detail Box */}
          {bandInfo.historyMilestones[selectedMilestone] && (
            <motion.div
              key={selectedMilestone}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 sm:p-8 rounded-xl bg-zinc-900/90 border border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-amber-400">
                    {bandInfo.historyMilestones[selectedMilestone].year}
                  </span>
                  <span className="text-lg font-bold text-white">
                    — {bandInfo.historyMilestones[selectedMilestone].title}
                  </span>
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed max-w-3xl">
                  {bandInfo.historyMilestones[selectedMilestone].description}
                </p>
              </div>

              {bandInfo.historyMilestones[selectedMilestone].highlight && (
                <div className="shrink-0 bg-rose-950/40 border border-rose-500/30 p-4 rounded-xl max-w-sm">
                  <div className="text-[11px] uppercase font-bold text-rose-400 flex items-center gap-1 mb-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Destaque</span>
                  </div>
                  <p className="text-xs text-zinc-200 font-medium">
                    {bandInfo.historyMilestones[selectedMilestone].highlight}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};
