import React from 'react';
import { useBand } from '../context/BandContext';
import { Star, Sparkles, MessageSquare, Gift, ShieldAlert, CheckCircle, ArrowRight, Lock, Users } from 'lucide-react';
import { motion } from 'motion/react';

export const FanClubSection: React.FC = () => {
  const { currentUser, userRole, setActiveView, openAuthModal, bandInfo } = useBand();

  const perks = [
    {
      title: 'Mural de Recados Direto',
      desc: 'Converse diretamente com Iuri, Sofia, Ganso e Gabriel. Respostas reais dos integrantes no fórum.',
      icon: '💬'
    },
    {
      title: 'Demos & Faixas Inéditas',
      desc: 'Ouça gravações brutas de estúdio e versões acústicas antes de qualquer lançamento oficial.',
      icon: '🎧'
    },
    {
      title: 'Votação de Setlist',
      desc: 'Vote nas músicas que você mais quer ouvir nos shows da turnê e decida as surpresas do palco.',
      icon: '🗳️'
    },
    {
      title: 'Carteirinha VIP & Descontos',
      desc: 'Acesso prioritário a ingressos e 25% de desconto no merch oficial com sua credencial digital.',
      icon: '⭐'
    }
  ];

  return (
    <section id="fa-clube" className="py-24 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100 border-t border-zinc-800 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>Comunidade Oficial VIP</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Fã Clube {bandInfo.name}
          </h2>
          <p className="mt-4 text-base text-zinc-400 leading-relaxed">
            Um espaço exclusivo para quem vive a música com a gente. Acesso a bastidores confidenciais, votações e interação direta com a banda.
          </p>
        </div>

        {/* Perks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {perks.map((perk, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800 hover:border-amber-500/40 shadow-xl transition-all"
            >
              <div className="text-3xl mb-4">{perk.icon}</div>
              <h3 className="text-lg font-bold text-white mb-2">{perk.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{perk.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Call to Action Box */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-amber-950/40 via-zinc-900 to-rose-950/40 border border-amber-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Junte-se a mais de 8.500 membros oficiais
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Já é membro VIP ou quer entrar agora?
            </h3>
            <p className="text-xs text-zinc-300 max-w-xl">
              Acesse sua carteirinha digital, participe dos sorteios de Meet & Greet e comente nos tópicos exclusivos.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            {userRole === 'fan' ? (
              <button
                onClick={() => setActiveView('fan_club')}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-zinc-950 font-black text-sm tracking-wide shadow-xl shadow-amber-950/40 transition-all flex items-center gap-2 cursor-pointer hover:scale-105"
              >
                <span>Acessar Meu Painel VIP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => openAuthModal('fan')}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-zinc-950 font-black text-sm tracking-wide shadow-xl shadow-amber-950/40 transition-all flex items-center gap-2 cursor-pointer hover:scale-105"
              >
                <Lock className="w-4 h-4" />
                <span>Entrar no Fã Clube</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
