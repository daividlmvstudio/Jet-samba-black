import React, { useState } from 'react';
import { useBand } from '../context/BandContext';
import { Calendar, MapPin, Clock, Ticket, Search, ExternalLink, Flame, CheckCircle, AlertCircle, Sparkles, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { ShowEvent } from '../types';

export const TourSection: React.FC = () => {
  const { shows } = useBand();
  const [filterType, setFilterType] = useState<'upcoming' | 'past' | 'all'>('upcoming');
  const [searchCity, setSearchCity] = useState('');

  const filteredShows = shows.filter(show => {
    if (filterType === 'upcoming' && show.isPast) return false;
    if (filterType === 'past' && !show.isPast) return false;
    if (searchCity) {
      const q = searchCity.toLowerCase();
      return (
        show.city.toLowerCase().includes(q) ||
        show.state.toLowerCase().includes(q) ||
        show.venue.toLowerCase().includes(q) ||
        show.title.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status: ShowEvent['ticketStatus'], isPast?: boolean) => {
    if (isPast) {
      return (
        <span className="px-3 py-1 text-xs font-bold rounded-lg bg-zinc-800 text-zinc-400 border border-zinc-700">
          Show Realizado
        </span>
      );
    }
    switch (status) {
      case 'available':
        return (
          <span className="px-3 py-1 text-xs font-bold rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
            <Ticket className="w-3.5 h-3.5" /> Ingressos À Venda
          </span>
        );
      case 'sold_out':
        return (
          <span className="px-3 py-1 text-xs font-bold rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5" /> Esgotado!
          </span>
        );
      case 'coming_soon':
        return (
          <span className="px-3 py-1 text-xs font-bold rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Vendas em Breve
          </span>
        );
      case 'free':
        return (
          <span className="px-3 py-1 text-xs font-bold rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Livre / Entrada Franca</span>
          </span>
        );
      case 'private':
        return (
          <span className="px-3 py-1 text-xs font-bold rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1.5 shadow-sm">
            <Lock className="w-3.5 h-3.5 text-purple-400" />
            <span>Show Privado / Fechado</span>
          </span>
        );
    }
  };

  const formatDateDisplay = (dateString: string) => {
    try {
      const [year, month, day] = dateString.split('-');
      const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
      const monthIdx = parseInt(month, 10) - 1;
      return {
        day,
        month: months[monthIdx] || month,
        year
      };
    } catch {
      return { day: '12', month: 'SET', year: '2026' };
    }
  };

  return (
    <section id="shows" className="py-24 bg-zinc-900/80 text-zinc-100 border-t border-zinc-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Calendar className="w-3.5 h-3.5" />
              <span>JET OFICIAL</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Agenda de Shows & Eventos
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Garanta seu ingresso e viva a experiência arrebatadora do show ao vivo.
            </p>
          </div>

          {/* Controls: Filters + Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800">
              <button
                onClick={() => setFilterType('upcoming')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  filterType === 'upcoming' ? 'bg-rose-600 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Próximos
              </button>
              <button
                onClick={() => setFilterType('past')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  filterType === 'past' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Passados
              </button>
              <button
                onClick={() => setFilterType('all')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  filterType === 'all' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Todos ({shows.length})
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar por cidade ou local..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded-xl py-2 pl-9 pr-3 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-rose-500 w-full sm:w-56"
              />
            </div>
          </div>
        </div>

        {/* Shows Table / List */}
        {filteredShows.length === 0 ? (
          <div className="bg-zinc-950/60 rounded-2xl border border-zinc-800 p-12 text-center text-zinc-500">
            <Calendar className="w-10 h-10 mx-auto mb-3 opacity-40 text-zinc-400" />
            <p className="text-base font-semibold text-zinc-300">Nenhum show encontrado para esta busca.</p>
            <p className="text-xs text-zinc-500 mt-1">Fique atento, novas datas são adicionadas semanalmente!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredShows.map((show) => {
              const dateInfo = formatDateDisplay(show.date);
              return (
                <motion.div
                  key={show.id}
                  whileHover={{ scale: 1.005 }}
                  className={`p-5 sm:p-6 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
                    show.featured
                      ? 'bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-rose-500/40 shadow-xl shadow-rose-950/20'
                      : 'bg-zinc-950/70 border-zinc-800/90 hover:border-zinc-700'
                  }`}
                >
                  {/* Left: Date Block + Details */}
                  <div className="flex items-start sm:items-center gap-4 sm:gap-6 w-full md:w-auto">
                    {/* Date Stamp */}
                    <div className="shrink-0 w-16 h-18 sm:w-20 sm:h-20 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center text-center shadow-inner">
                      <span className="text-[10px] font-black text-rose-400 uppercase tracking-wider">
                        {dateInfo.month}
                      </span>
                      <span className="text-xl sm:text-2xl font-black text-white leading-none my-0.5">
                        {dateInfo.day}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {dateInfo.year}
                      </span>
                    </div>

                    {/* Show Details */}
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                          {show.title}
                        </h3>
                        {show.featured && (
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            Super Destaque
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-zinc-400">
                        <span className="flex items-center gap-1 text-zinc-300 font-semibold">
                          <MapPin className="w-3.5 h-3.5 text-rose-400" />
                          {show.city}, {show.state}
                        </span>
                        <span className="text-zinc-400">
                          {show.venue}
                        </span>
                        <span className="flex items-center gap-1 text-zinc-400 font-mono">
                          <Clock className="w-3.5 h-3.5 text-zinc-500" />
                          {show.time}
                        </span>
                        {show.ticketPrice && (
                          <span className="text-emerald-400 font-semibold">
                            {show.ticketPrice}
                          </span>
                        )}
                      </div>

                      {show.description && (
                        <p className="text-xs text-zinc-400 mt-1 max-w-xl line-clamp-1">
                          {show.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Status & Action Button */}
                  <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-zinc-800">
                    <div className="shrink-0">
                      {getStatusBadge(show.ticketStatus, show.isPast)}
                    </div>

                    {!show.isPast && show.ticketStatus === 'available' && (
                      <a
                        href={show.ticketUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-bold text-xs shadow-lg shadow-rose-950/40 flex items-center gap-1.5 transition-all hover:scale-105"
                      >
                        <span>Comprar Ingresso</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
