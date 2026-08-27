import React, { useState } from 'react';
import { useBand } from '../context/BandContext';
import {
  Star,
  Sparkles,
  MessageSquare,
  Music,
  Download,
  Send,
  Heart,
  Award,
  Radio,
  ArrowLeft,
  CheckCircle,
  Play,
  Lock,
  Vote
} from 'lucide-react';
import { motion } from 'motion/react';

export const FanClubPortal: React.FC = () => {
  const {
    bandInfo,
    currentUser,
    fanContent,
    fanMessages,
    postFanMessage,
    likeFanContent,
    setlistPolls,
    voteSetlistPoll,
    playTrack,
    tracks,
    setActiveView
  } = useBand();

  const [activeTab, setActiveTab] = useState<'exclusive_feed' | 'mural' | 'setlist_vote' | 'membership_card'>('exclusive_feed');
  const [newMessage, setNewMessage] = useState('');

  const handlePostMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    postFanMessage(newMessage);
    setNewMessage('');
  };

  const fanTier = currentUser?.fanTier || 'VIP Diamond';
  const memberId = `JET-${currentUser?.id ? currentUser.id.slice(0, 6).toUpperCase() : 'VIP789'}`;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-20">
      {/* Top Header Bar */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-amber-950/30 border-b border-amber-500/20 px-4 sm:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveView('public')}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              title="Voltar ao site público"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <Star className="w-6 h-6 fill-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white">Comunidade VIP dos Fãs</h1>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {fanTier}
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Olá, <strong>{currentUser?.name || 'Fã Apaixonado'}</strong>! Bem-vindo(a) aos bastidores exclusivos de {bandInfo.name}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('membership_card')}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-zinc-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-amber-950/40 cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>Ver Minha Carteirinha VIP</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-zinc-800 scrollbar-none">
          <button
            onClick={() => setActiveTab('exclusive_feed')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'exclusive_feed'
                ? 'bg-amber-500 text-zinc-950 font-black shadow-lg shadow-amber-950/50'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Feed Exclusivo ({fanContent.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('mural')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'mural'
                ? 'bg-amber-500 text-zinc-950 font-black shadow-lg shadow-amber-950/50'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Mural Direto com a Banda ({fanMessages.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('setlist_vote')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'setlist_vote'
                ? 'bg-amber-500 text-zinc-950 font-black shadow-lg shadow-amber-950/50'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Vote className="w-3.5 h-3.5" />
            <span>Votação de Repertório / Setlist</span>
          </button>
          <button
            onClick={() => setActiveTab('membership_card')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'membership_card'
                ? 'bg-amber-500 text-zinc-950 font-black shadow-lg shadow-amber-950/50'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Carteirinha Digital VIP</span>
          </button>
        </div>

        {/* Tab 1: Exclusive VIP Feed */}
        {activeTab === 'exclusive_feed' && (
          <div className="mt-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fanContent.map((post) => (
                <motion.div
                  key={post.id}
                  whileHover={{ y: -4 }}
                  className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 flex flex-col justify-between shadow-xl"
                >
                  <div>
                    {post.thumbnailUrl && (
                      <div className="relative aspect-video bg-zinc-950 overflow-hidden">
                        <img
                          src={post.thumbnailUrl}
                          alt={post.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-black/80 text-amber-300 border border-amber-500/30">
                            Nível Mínimo: {post.minTier}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="p-5">
                      <span className="text-[10px] font-mono text-zinc-400">
                        Publicado em {post.date}
                      </span>
                      <h3 className="text-base font-bold text-white mt-1 leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-xs text-zinc-300 mt-2 leading-relaxed whitespace-pre-line">
                        {post.description}
                      </p>

                      {post.audioTrackId && (
                        <div className="mt-4 p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                          <div className="flex items-center gap-2 min-w-0">
                            <Music className="w-4 h-4 text-rose-400 shrink-0" />
                            <span className="text-xs font-bold text-zinc-200 truncate">
                              Áudio Exclusivo (Demo Inédita)
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              const track = tracks.find(t => t.id === post.audioTrackId) || tracks[0];
                              playTrack(track);
                            }}
                            className="p-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold"
                          >
                            <Play className="w-3.5 h-3.5 fill-white" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex items-center justify-between border-t border-zinc-800/60 mt-2">
                    <button
                      onClick={() => likeFanContent(post.id)}
                      className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
                    >
                      <Heart className="w-4 h-4 fill-rose-500/30" />
                      <span>{post.likes} curtidas</span>
                    </button>

                    <span className="text-[10px] font-bold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/20">
                      ★ Conteúdo Confidencial VIP
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Direct Mural & Band Chat */}
        {activeTab === 'mural' && (
          <div className="mt-8 max-w-4xl mx-auto space-y-6">
            {/* Post a message box */}
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl">
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <span>Deixe seu recado direto para os integrantes</span>
              </h3>
              <p className="text-xs text-zinc-400 mb-4">
                Iuri, Sofia, Ganso e Gabriel leem este mural e respondem diretamente aos fãs membros VIP.
              </p>

              <form onSubmit={handlePostMessage} className="space-y-3">
                <textarea
                  rows={3}
                  required
                  placeholder="Escreva sua mensagem, sugestão de música ou carinho para a banda..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-zinc-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-amber-950/40 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publicar no Mural VIP</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Messages Feed */}
            <div className="space-y-4">
              {fanMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={msg.fanAvatar}
                        alt={msg.fanName}
                        className="w-9 h-9 rounded-full object-cover border border-amber-500/40"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-sm font-bold text-white">{msg.fanName}</strong>
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {msg.fanTier}
                          </span>
                        </div>
                        <span className="text-[11px] text-zinc-400 font-mono">{msg.date}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-zinc-200 leading-relaxed pl-2 border-l-2 border-amber-500/60">
                    "{msg.content}"
                  </p>

                  {/* Band Verified Reply */}
                  {msg.bandReply && (
                    <div className="mt-3 p-4 bg-gradient-to-r from-rose-950/40 to-zinc-900 rounded-xl border border-rose-500/40 space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-black">
                          ✓
                        </div>
                        <span className="text-xs font-bold text-rose-300">
                          Resposta Oficial da Banda ({msg.bandReply.author})
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          • {msg.bandReply.date}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-200 pl-7 leading-relaxed font-sans">
                        "{msg.bandReply.text}"
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Setlist Voting */}
        {activeTab === 'setlist_vote' && (
          <div className="mt-8 max-w-4xl mx-auto space-y-8">
            <div className="text-center max-w-xl mx-auto">
              <h3 className="text-2xl font-black text-white">Votação de Repertório da Turnê</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Os membros do Fã Clube VIP decidem as músicas especiais e surpresas que entrarão no bis de cada show.
              </p>
            </div>

            <div className="space-y-6">
              {setlistPolls.map((poll) => {
                const totalVotes = poll.options.reduce((acc, curr) => acc + curr.votes, 0);

                return (
                  <div key={poll.id} className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl space-y-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded border border-amber-500/30">
                        {poll.category}
                      </span>
                      <h4 className="text-lg font-bold text-white mt-2">{poll.question}</h4>
                      <p className="text-xs text-zinc-400 mt-0.5">Total de {totalVotes} votos computados até agora</p>
                    </div>

                    <div className="space-y-3">
                      {poll.options.map((option) => {
                        const pct = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;

                        return (
                          <div
                            key={option.id}
                            onClick={() => voteSetlistPoll(poll.id, option.id)}
                            className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-amber-500/50 cursor-pointer transition-all relative overflow-hidden group"
                          >
                            {/* Progress bar fill */}
                            <div
                              className="absolute top-0 bottom-0 left-0 bg-amber-500/10 group-hover:bg-amber-500/20 transition-all"
                              style={{ width: `${pct}%` }}
                            />

                            <div className="relative flex items-center justify-between z-10">
                              <span className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                                {option.songTitle}
                              </span>
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-mono font-bold text-amber-400">
                                  {pct}% ({option.votes} votos)
                                </span>
                                <button className="px-3 py-1 bg-zinc-800 group-hover:bg-amber-500 group-hover:text-zinc-950 text-white rounded-lg text-xs font-bold transition-all">
                                  Votar
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Membership VIP Card */}
        {activeTab === 'membership_card' && (
          <div className="mt-8 max-w-xl mx-auto space-y-6 text-center">
            <div>
              <h3 className="text-2xl font-black text-white">Sua Carteirinha Digital Oficial</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Apresente esta credencial nas bilheterias e na entrada VIP dos shows para descontos e fila prioritária.
              </p>
            </div>

            {/* Glowing VIP Pass Card */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="p-8 rounded-3xl bg-gradient-to-br from-zinc-900 via-amber-950/50 to-zinc-900 border-2 border-amber-500/60 shadow-2xl shadow-amber-950/50 text-left relative overflow-hidden"
            >
              {/* Card Hologram effect */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between border-b border-amber-500/30 pb-4 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-zinc-950 border border-amber-500/50 flex items-center justify-center p-0.5 shadow-md">
                    {bandInfo.logoUrl ? (
                      <img
                        src={bandInfo.logoUrl}
                        alt={bandInfo.name}
                        className="w-full h-full object-cover rounded-lg"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="text-amber-400 font-black text-xs">JSB</span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white">{bandInfo.name}</h4>
                    <span className="text-[10px] uppercase font-mono text-amber-400">Official VIP Pass</span>
                  </div>
                </div>

                <div className="px-3 py-1 rounded-full bg-amber-500 text-zinc-950 text-[10px] font-black uppercase tracking-wider">
                  {fanTier}
                </div>
              </div>

              <div className="flex items-center gap-5 my-4">
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                  alt="Avatar"
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-500/40 shadow-lg"
                />
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-zinc-400">Membro Oficial:</span>
                  <h5 className="text-xl font-black text-white">{currentUser?.name || 'Fã VIP Cadastrado'}</h5>
                  <p className="text-xs font-mono text-amber-300">ID: {memberId}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-amber-500/20 text-xs">
                <div>
                  <span className="text-zinc-400 text-[10px] uppercase block">Validade:</span>
                  <strong className="text-white font-mono">31/DEZ/2026</strong>
                </div>
                <div>
                  <span className="text-zinc-400 text-[10px] uppercase block">Desconto em Merch:</span>
                  <strong className="text-emerald-400 font-mono">25% OFF</strong>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};
