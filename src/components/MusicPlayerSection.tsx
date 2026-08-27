import React, { useState } from 'react';
import { useBand } from '../context/BandContext';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Radio,
  FileText,
  ExternalLink,
  Disc3,
  Flame,
  Music2,
  Copy,
  Check
} from 'lucide-react';
import { AudioTrack } from '../types';
import { SOUNDCLOUD_TRACK_URL } from './SoundCloudLadyPlayer';

export const MusicPlayerSection: React.FC = () => {
  const {
    bandInfo,
    tracks,
    currentTrack,
    isPlaying,
    currentTime,
    volume,
    playTrack,
    pauseTrack,
    togglePlayTrack,
    nextTrack,
    prevTrack,
    seekTrack,
    setTrackVolume
  } = useBand();

  const [showLyricsModal, setShowLyricsModal] = useState<AudioTrack | null>(null);
  const [copiedLyrics, setCopiedLyrics] = useState(false);

  const activeTrack: AudioTrack = currentTrack || tracks[0] || {
    id: 'default-lady',
    title: 'LADY (Ao Vivo no God Bar)',
    album: 'Single Oficial (2023)',
    duration: '3:19',
    durationSeconds: 199,
    audioTone: 'anthem',
    plays: 1845000,
    coverUrl: bandInfo.logoUrl
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleCopyLyrics = (lyricsText: string) => {
    if (!lyricsText) return;
    navigator.clipboard.writeText(lyricsText);
    setCopiedLyrics(true);
    setTimeout(() => setCopiedLyrics(false), 2000);
  };

  const streamingPlatforms = [
    {
      name: 'Spotify',
      url: bandInfo.socialLinks.spotify,
      color: 'hover:border-emerald-500 hover:text-emerald-400',
      icon: '🟢',
      subtitle: '+120k ouvintes mensais'
    },
    {
      name: 'Apple Music',
      url: bandInfo.socialLinks.appleMusic,
      color: 'hover:border-rose-500 hover:text-rose-400',
      icon: '🍎',
      subtitle: 'Áudio Espacial Dolby Atmos'
    },
    {
      name: 'Deezer',
      url: bandInfo.socialLinks.deezer,
      color: 'hover:border-purple-500 hover:text-purple-400',
      icon: '🟣',
      subtitle: 'Qualidade Hi-Fi FLAC'
    },
    {
      name: 'Soundcloud',
      url: activeTrack.soundCloudUrl || SOUNDCLOUD_TRACK_URL,
      color: 'hover:border-amber-500 hover:text-amber-400',
      icon: '🔥',
      subtitle: 'Seja ouvida/o por até 100 ouvintes'
    },
    {
      name: 'Amazon Music',
      url: bandInfo.socialLinks.amazonMusic,
      color: 'hover:border-sky-500 hover:text-sky-400',
      icon: '🔵',
      subtitle: 'Ultra HD Audio'
    },
    {
      name: 'Tidal',
      url: bandInfo.socialLinks.tidal,
      color: 'hover:border-cyan-500 hover:text-cyan-400',
      icon: '💎',
      subtitle: 'Master Quality Authenticated'
    }
  ];

  return (
    <section id="streaming" className="py-24 bg-zinc-950 text-zinc-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Radio className="w-3.5 h-3.5" />
            <span>Músicas & Streaming</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Ouça Nossas Músicas Onde Quiser
          </h2>
          <p className="mt-4 text-base text-zinc-400 leading-relaxed">
            Disponível em todas as principais plataformas de áudio digitais do mundo.
          </p>
        </div>

        {/* Streaming Platforms Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-16">
          {streamingPlatforms.map((platform) => (
            <a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex flex-col items-center text-center transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl hover:shadow-black/60 ${platform.color}`}
            >
              <div className="text-2xl mb-2">{platform.icon}</div>
              <span className="text-sm font-bold text-white group-hover:text-current transition-colors">
                {platform.name}
              </span>
              <span className="text-[10px] text-zinc-500 mt-1 leading-tight line-clamp-1">
                {platform.subtitle}
              </span>
            </a>
          ))}
        </div>

        {/* Interactive Audio Player & Tracklist Showcase */}
        <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 rounded-3xl border border-zinc-800 shadow-2xl p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Active Track Player Controller */}
            <div className="lg:col-span-6 bg-zinc-950 p-6 sm:p-8 rounded-2xl border border-zinc-800 relative overflow-hidden">
              <div className="flex items-center gap-5">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-2xl shrink-0 border border-zinc-700 bg-zinc-900">
                  <img
                    src={activeTrack.coverUrl || bandInfo.logoUrl}
                    alt={activeTrack.title}
                    className={`w-full h-full object-cover ${isPlaying ? 'scale-105 animate-pulse' : ''}`}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-black uppercase tracking-wider text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/30">
                      {activeTrack.album || 'Single Oficial'}
                    </span>
                    {isPlaying && (
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        Tocando Agora
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white mt-1.5 truncate">
                    {activeTrack.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {bandInfo.name || 'JET SAMBA BLACK'} • Oficial
                  </p>
                  <p className="text-[11px] text-zinc-500 mt-1">
                    {(activeTrack.plays || 1845000).toLocaleString()} reproduções
                  </p>
                </div>
              </div>

              {/* Waveform Sound Visualizer Animation */}
              <div className="my-6 flex items-end justify-between h-8 px-2 bg-zinc-900/80 rounded-xl p-2 border border-zinc-800/80">
                {Array.from({ length: 28 }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-1 rounded-full transition-all duration-200 ${
                      isPlaying
                        ? 'bg-gradient-to-t from-rose-500 to-amber-400'
                        : 'bg-zinc-700'
                    }`}
                    style={{
                      height: isPlaying
                        ? `${Math.max(15, ((idx * 17) % 85) + (currentTime % 3) * 10)}%`
                        : '20%'
                    }}
                  />
                ))}
              </div>

              {/* Progress Slider */}
              <div className="space-y-1.5">
                <input
                  type="range"
                  min="0"
                  max={activeTrack.durationSeconds || 218}
                  value={currentTime}
                  onChange={(e) => seekTrack(Number(e.target.value))}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
                <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                  <span>{formatTime(currentTime)}</span>
                  <span>{activeTrack.duration || '3:30'}</span>
                </div>
              </div>

              {/* Playback Controls & Dynamic Single + Lyrics Buttons */}
              <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Previous / Play / Next */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <button
                    onClick={prevTrack}
                    className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                    title="Música Anterior (Sequência)"
                  >
                    <SkipBack className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => togglePlayTrack(activeTrack)}
                    className="w-12 h-12 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white flex items-center justify-center shadow-lg shadow-rose-950/60 hover:scale-105 transition-all cursor-pointer"
                    title={isPlaying ? 'Pausar' : 'Tocar'}
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 fill-white text-white" />
                    ) : (
                      <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                    )}
                  </button>

                  <button
                    onClick={nextTrack}
                    className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                    title="Próxima Música (Sequência)"
                  >
                    <SkipForward className="w-5 h-5" />
                  </button>
                </div>

                {/* Dynamic SoundCloud Single Link & Ver Letra */}
                <div className="flex items-center gap-2 flex-wrap min-w-0">
                  {/* Now Playing Animated Track Title Ticker (Moving from Right to Left) */}
                  <div
                    className="h-8 max-w-[200px] sm:max-w-[230px] md:max-w-[260px] px-2.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-900 text-xs font-semibold text-rose-300 border border-rose-500/40 flex items-center gap-2 shadow-sm overflow-hidden shrink-0 select-none"
                    title={`Música em reprodução: ${activeTrack.title}`}
                  >
                    <div className="flex items-center shrink-0">
                      <Music2 className={`w-3.5 h-3.5 ${isPlaying ? 'text-rose-400 animate-bounce' : 'text-amber-400'}`} />
                    </div>
                    <div className="relative overflow-hidden w-full flex items-center">
                      <div className="animate-marquee-infinite flex items-center gap-6">
                        <span className="whitespace-nowrap font-bold text-[11px] sm:text-xs text-white">
                          {activeTrack.title}
                        </span>
                        <span className="text-amber-400 font-mono text-[10px]">✦</span>
                        <span className="whitespace-nowrap font-bold text-[11px] sm:text-xs text-rose-300" aria-hidden="true">
                          {activeTrack.title}
                        </span>
                        <span className="text-amber-400 font-mono text-[10px]" aria-hidden="true">✦</span>
                      </div>
                    </div>
                  </div>

                  {/* Ver Letra Button */}
                  <button
                    type="button"
                    onClick={() => setShowLyricsModal(activeTrack)}
                    className="h-8 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-zinc-200 hover:text-white border border-zinc-700 hover:border-zinc-500 flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm shrink-0"
                    title={`Ver letra e detalhes de "${activeTrack.title}"`}
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    <span>Ver Letra</span>
                  </button>

                  {/* Volume Control */}
                  <div className="hidden xl:flex items-center gap-1.5 pl-1">
                    <Volume2 className="w-3.5 h-3.5 text-zinc-500" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={volume}
                      onChange={(e) => setTrackVolume(Number(e.target.value))}
                      className="w-14 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Tracklist selection (Sequence from Admin Panel) */}
            <div className="lg:col-span-6 space-y-2">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                  <Disc3 className="w-4 h-4 text-rose-400" />
                  <span>Faixas Principais & Demos</span>
                </h4>
                <span className="text-xs text-zinc-500 font-medium">
                  {tracks.length} {tracks.length === 1 ? 'faixa' : 'faixas'} na sequência
                </span>
              </div>

              <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1 no-scrollbar">
                {tracks.map((track, idx) => {
                  const isCurrent = activeTrack.id === track.id;
                  const isThisPlaying = isCurrent && isPlaying;

                  return (
                    <div
                      key={track.id}
                      onClick={() => playTrack(track)}
                      className={`p-3.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer group ${
                        isCurrent
                          ? 'bg-zinc-800/90 border-rose-500/60 shadow-lg shadow-rose-950/30 ring-1 ring-rose-500/30'
                          : 'bg-zinc-950/70 border-zinc-800/80 hover:bg-zinc-900 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`text-xs font-mono font-bold w-6 text-center shrink-0 ${
                          isCurrent ? 'text-amber-400 font-black' : 'text-zinc-500'
                        }`}>
                          #{idx + 1}
                        </span>

                        <div className="w-11 h-11 rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 shrink-0 shadow-sm relative">
                          <img
                            src={track.coverUrl || bandInfo.logoUrl}
                            alt={track.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          {isThisPlaying && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h5 className={`text-sm font-bold truncate ${isCurrent ? 'text-rose-400' : 'text-white group-hover:text-rose-300 transition-colors'}`}>
                              {track.title}
                            </h5>
                            {track.isExclusive && (
                              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                                VIP
                              </span>
                            )}
                            {isThisPlaying && (
                              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0 hidden sm:inline-flex">
                                Tocando
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-400 truncate">{track.album}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        {/* Quick Lyrics Modal Trigger */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowLyricsModal(track);
                          }}
                          className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-amber-300 border border-zinc-800 transition-colors cursor-pointer"
                          title={`Ver Letra de "${track.title}"`}
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>

                        {/* YouTube Music External Link if available */}
                        {track.youtubeMusicUrl && (
                          <a
                            href={track.youtubeMusicUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-white border border-red-500/30 transition-colors"
                            title="Ouvir no YouTube Music"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}

                        <span className="text-xs font-mono text-zinc-400 hidden sm:inline-block">
                          {track.duration}
                        </span>

                        {/* Play/Pause Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isThisPlaying) {
                              pauseTrack();
                            } else {
                              playTrack(track);
                            }
                          }}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                            isThisPlaying
                              ? 'bg-rose-500 text-white shadow-md shadow-rose-950/50 scale-105'
                              : isCurrent
                              ? 'bg-zinc-700 text-white'
                              : 'bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700'
                          }`}
                          title={isThisPlaying ? 'Pausar' : 'Tocar'}
                        >
                          {isThisPlaying ? (
                            <Pause className="w-3.5 h-3.5 fill-white" />
                          ) : (
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Lyrics & Track Info Modal */}
        {showLyricsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
            <div className="bg-zinc-900 border border-zinc-700 rounded-3xl max-w-xl w-full p-6 sm:p-7 text-zinc-100 shadow-2xl relative max-h-[90vh] flex flex-col">
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-zinc-800 pb-4 mb-4 gap-3">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-700 shrink-0 shadow-md">
                    <img
                      src={showLyricsModal.coverUrl || bandInfo.logoUrl}
                      alt={showLyricsModal.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        {showLyricsModal.album || 'Single Oficial'}
                      </span>
                      {showLyricsModal.id === activeTrack.id && isPlaying && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          Tocando Agora
                        </span>
                      )}
                    </div>
                    <h4 className="text-xl font-black text-white mt-1 truncate">
                      {showLyricsModal.title}
                    </h4>
                    <p className="text-xs text-zinc-400">
                      {bandInfo.name || 'JET SAMBA BLACK'} • Duração: {showLyricsModal.duration || '3:30'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowLyricsModal(null)}
                  className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
                  title="Fechar"
                >
                  ✕
                </button>
              </div>

              {/* Track Metadata Bar */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 text-center mb-4">
                <div>
                  <span className="block text-[10px] text-zinc-500 font-bold uppercase">Artista</span>
                  <span className="text-xs font-bold text-zinc-200 truncate block">
                    {bandInfo.name || 'JET SAMBA BLACK'}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-zinc-500 font-bold uppercase">Reproduções</span>
                  <span className="text-xs font-bold text-amber-400">
                    {(showLyricsModal.plays || 1845000).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-zinc-500 font-bold uppercase">Áudio</span>
                  <span className="text-xs font-bold text-rose-400">
                    {showLyricsModal.duration || '3:30'}
                  </span>
                </div>
              </div>

              {/* Lyrics Content */}
              <div className="flex-1 overflow-y-auto pr-2 text-sm text-zinc-200 whitespace-pre-line leading-relaxed font-sans bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800/80">
                {showLyricsModal.lyrics ? (
                  showLyricsModal.lyrics
                ) : (
                  <div className="space-y-4 text-center py-6">
                    <Music2 className="w-10 h-10 text-rose-500/60 mx-auto" />
                    <div>
                      <p className="text-sm font-bold text-white">Letra Oficial - {showLyricsModal.title}</p>
                      <p className="text-xs text-zinc-400 mt-1">JET SAMBA BLACK • Composição e Arranjos Oficiais</p>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed max-w-md mx-auto">
                      Esta faixa traz a assinatura inconfundível do samba rock e black music da JET SAMBA BLACK. 
                      Para conferir a interpretação completa com o balanço de bateria, baixo e guitarra, ouça no player ou acesse as plataformas digitais.
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons in Modal */}
              <div className="mt-4 pt-3 border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyLyrics(showLyricsModal.lyrics || `Letra de ${showLyricsModal.title} - JET SAMBA BLACK`)}
                    className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedLyrics ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Letra Copiada!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Letra</span>
                      </>
                    )}
                  </button>

                  {showLyricsModal.soundCloudUrl && (
                    <a
                      href={showLyricsModal.soundCloudUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-500/30 flex items-center gap-1.5 transition-colors"
                    >
                      <Flame className="w-3.5 h-3.5" />
                      <span>SoundCloud</span>
                    </a>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      playTrack(showLyricsModal);
                      setShowLyricsModal(null);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Tocar Esta Faixa</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowLyricsModal(null)}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

