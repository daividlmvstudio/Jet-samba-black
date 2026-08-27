import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  X,
  ExternalLink,
  Radio,
  Volume2,
  VolumeX,
  Disc3,
  FileAudio,
  Globe,
  SkipBack,
  SkipForward
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useBand } from '../context/BandContext';
import { MarqueeText } from './MarqueeText';

export const SOUNDCLOUD_TRACK_URL = 'https://soundcloud.com/user-330902255/jet-samba-black-godbar-ao-vivo';
export const SOUNDCLOUD_EMBED_URL = 'https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/user-330902255/jet-samba-black-godbar-ao-vivo&color=%23e11d48&auto_play=true&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false';

// High-fidelity live samba swing groove for instant synchronized playback
const LIVE_AUDIO_FALLBACK = 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=brazilian-street-carnival-batucada-samba-112194.mp3';

interface SoundCloudLadyPlayerProps {
  autoStart?: boolean;
}

export const SoundCloudLadyPlayer: React.FC<SoundCloudLadyPlayerProps> = ({ autoStart = true }) => {
  const {
    radioSettings,
    radioTracks,
    isRadioPlaying,
    isRadioMuted,
    isRadioVisible,
    toggleRadioPlay,
    stopRadio,
    toggleRadioMute,
    setIsRadioPlaying,
    playNextRadioTrack,
    playPrevRadioTrack
  } = useBand();

  const [showEmbedModal, setShowEmbedModal] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentAudioSource = radioSettings?.audioUrl || LIVE_AUDIO_FALLBACK;
  const currentTitle = radioSettings?.title || 'Lady (God Bar Ao Vivo)';
  const currentArtist = radioSettings?.artist || 'JET SAMBA BLACK';
  const currentBadge = radioSettings?.badgeLabel || 'Radio JET';
  const currentSoundCloudUrl = radioSettings?.soundCloudTrackUrl || SOUNDCLOUD_TRACK_URL;
  const currentEmbedUrl = radioSettings?.soundCloudEmbedUrl || SOUNDCLOUD_EMBED_URL;

  // Find current active track index in the playlist
  const currentTrackIndex = radioTracks.findIndex(t => t.isActive);
  const trackPositionText = currentTrackIndex >= 0 && radioTracks.length > 1
    ? `${currentTrackIndex + 1}/${radioTracks.length}`
    : null;

  // Sync mute with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isRadioMuted;
    }
  }, [isRadioMuted]);

  // Sync isRadioPlaying with audio element play/pause
  useEffect(() => {
    if (!audioRef.current) return;

    if (isRadioPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay blocked by browser policy until interaction
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [isRadioPlaying]);

  // Re-load and play when track audio source changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      if (isRadioPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [currentAudioSource]);

  // Autoplay handler on initial page load with interaction unlock
  useEffect(() => {
    if (!autoStart) return;

    let hasInteracted = false;

    const unlockAndPlay = () => {
      if (hasInteracted) return;
      hasInteracted = true;

      if (audioRef.current) {
        audioRef.current.volume = 0.8;
        audioRef.current.play().then(() => {
          setIsRadioPlaying(true);
        }).catch((err) => {
          console.warn('Radio auto-play unlock error:', err);
        });
      }

      // Clean up all unlock listeners
      const events = ['pointerdown', 'mousedown', 'touchstart', 'touchend', 'click', 'keydown', 'scroll', 'wheel'];
      events.forEach(evt => {
        window.removeEventListener(evt, unlockAndPlay);
        document.removeEventListener(evt, unlockAndPlay);
      });
    };

    const attemptAutoplay = async () => {
      if (audioRef.current) {
        audioRef.current.volume = 0.8;
        try {
          await audioRef.current.play();
          setIsRadioPlaying(true);
        } catch {
          // If browser prevented 0ms unmuted auto-play without prior user gesture,
          // attach listeners so that ANY interaction immediately starts the radio audio!
          const events = ['pointerdown', 'mousedown', 'touchstart', 'touchend', 'click', 'keydown', 'scroll', 'wheel'];
          events.forEach(evt => {
            window.addEventListener(evt, unlockAndPlay, { passive: true });
            document.addEventListener(evt, unlockAndPlay, { passive: true });
          });
        }
      }
    };

    // Small timeout ensures audio element is mounted and ready
    const timer = setTimeout(() => {
      attemptAutoplay();
    }, 100);

    return () => {
      clearTimeout(timer);
      const events = ['pointerdown', 'mousedown', 'touchstart', 'touchend', 'click', 'keydown', 'scroll', 'wheel'];
      events.forEach(evt => {
        window.removeEventListener(evt, unlockAndPlay);
        document.removeEventListener(evt, unlockAndPlay);
      });
    };
  }, [autoStart]);

  const handleTogglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    toggleRadioPlay();
  };

  const handleStop = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    stopRadio();
    setShowEmbedModal(false);
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleRadioMute();
  };

  const handleTrackEnded = () => {
    // Automatically transition to next track in the sequential order
    if (radioTracks.length > 1) {
      playNextRadioTrack();
    } else if (audioRef.current) {
      // Loop if only 1 track
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  return (
    <>
      {/* Underlying Persistent Audio Stream with Automatic Sequence Playback */}
      <audio
        ref={audioRef}
        src={currentAudioSource}
        preload="auto"
        onEnded={handleTrackEnded}
        onPlay={() => setIsRadioPlaying(true)}
        onPause={() => setIsRadioPlaying(false)}
        onError={() => {
          if (audioRef.current && audioRef.current.src !== LIVE_AUDIO_FALLBACK) {
            console.warn('Radio audio error, falling back to live stream fallback.');
            audioRef.current.src = LIVE_AUDIO_FALLBACK;
            audioRef.current.load();
            if (isRadioPlaying) {
              audioRef.current.play().catch(() => {});
            }
          }
        }}
      />

      {/* Floating Bottom Bar Player */}
      <AnimatePresence>
        {isRadioVisible && (
          <motion.div
            id="radio-jet-floating-player"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-2xl bg-zinc-950/95 border border-rose-500/40 rounded-2xl p-3 sm:px-5 sm:py-3.5 backdrop-blur-xl shadow-2xl shadow-rose-950/80 text-white"
          >
            <div className="flex items-center justify-between gap-3">
              {/* Left Track Info */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-amber-600 flex items-center justify-center shrink-0 shadow-md">
                  <Radio className={`w-5 h-5 text-white ${isRadioPlaying ? 'animate-pulse' : ''}`} />
                  {isRadioPlaying && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-zinc-900 animate-ping" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 whitespace-nowrap shrink-0">
                      {currentBadge}
                    </span>
                    {trackPositionText && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-amber-300 border border-zinc-700 shrink-0">
                        #{trackPositionText}
                      </span>
                    )}
                  </div>

                  {/* Marquee text moving from right to left */}
                  <div className="max-w-[170px] sm:max-w-[280px] md:max-w-[340px]">
                    <MarqueeText
                      text={`${currentArtist} • ${currentTitle}`}
                      className="text-xs font-bold text-white"
                      speed="normal"
                    />
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5 flex-wrap">
                    {radioSettings?.sourceType === 'file' ? (
                      <span className="flex items-center gap-1 text-emerald-400">
                        <FileAudio className="w-3 h-3" />
                        <span>Áudio do Aparelho</span>
                      </span>
                    ) : radioSettings?.sourceType === 'url' ? (
                      <span className="flex items-center gap-1 text-sky-400">
                        <Globe className="w-3 h-3" />
                        <span>Stream Web</span>
                      </span>
                    ) : (
                      <span>SoundCloud Oficial</span>
                    )}

                    {currentSoundCloudUrl && radioSettings?.sourceType !== 'file' && (
                      <>
                        <span>•</span>
                        <a
                          href={currentSoundCloudUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-400 hover:text-amber-300 font-semibold hover:underline flex items-center gap-1"
                        >
                          <span>Abrir Faixa</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Controls: Prev, Play/Pause, Next, SoundCloud Embed Modal, Mute, Stop/Close */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {/* Previous Track Button */}
                {radioTracks.length > 1 && (
                  <button
                    type="button"
                    id="radio-jet-prev-btn"
                    onClick={() => playPrevRadioTrack()}
                    className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
                    title="Música anterior na sequência"
                  >
                    <SkipBack className="w-4 h-4 fill-current" />
                  </button>
                )}

                {/* Main Play / Pause Button */}
                <button
                  type="button"
                  id="radio-jet-toggle-play-btn"
                  onClick={handleTogglePlay}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-bold transition-transform active:scale-95 shadow-lg shadow-rose-950/60 cursor-pointer"
                  title={isRadioPlaying ? 'Pausar reprodução' : 'Reproduzir / Continuar'}
                >
                  {isRadioPlaying ? (
                    <Pause className="w-4 h-4 fill-white" />
                  ) : (
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  )}
                </button>

                {/* Next Track Button */}
                {radioTracks.length > 1 && (
                  <button
                    type="button"
                    id="radio-jet-next-btn"
                    onClick={() => playNextRadioTrack()}
                    className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
                    title="Próxima música na sequência automática"
                  >
                    <SkipForward className="w-4 h-4 fill-current" />
                  </button>
                )}

                {/* Mute Button */}
                <button
                  type="button"
                  id="radio-jet-mute-btn"
                  onClick={handleToggleMute}
                  className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
                  title={isRadioMuted ? 'Ativar som' : 'Mutar som'}
                >
                  {isRadioMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-zinc-300" />}
                </button>

                {currentEmbedUrl && radioSettings?.sourceType === 'soundcloud' && (
                  <button
                    type="button"
                    id="radio-jet-widget-btn"
                    onClick={() => setShowEmbedModal(!showEmbedModal)}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-amber-300 border border-amber-500/30 text-xs font-bold transition-colors cursor-pointer"
                    title="Player do SoundCloud Completo"
                  >
                    <Disc3 className="w-3.5 h-3.5" />
                    <span>Widget</span>
                  </button>
                )}

                <button
                  type="button"
                  id="radio-jet-stop-btn"
                  onClick={handleStop}
                  className="p-2 rounded-xl bg-zinc-900/90 hover:bg-rose-950/60 text-zinc-400 hover:text-rose-400 border border-zinc-800 hover:border-rose-500/40 transition-colors cursor-pointer"
                  title="Parar / Fechar player (clique em Radio JET na barra superior para reabrir)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Embedded SoundCloud Widget Popover */}
            {showEmbedModal && currentEmbedUrl && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 pt-3 border-t border-zinc-800"
              >
                <div className="flex items-center justify-between mb-2 text-xs">
                  <span className="font-bold text-rose-400 flex items-center gap-1.5">
                    <Disc3 className="w-3.5 h-3.5 animate-spin" />
                    Player Oficial SoundCloud
                  </span>
                  {currentSoundCloudUrl && (
                    <a
                      href={currentSoundCloudUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <span>Ver no SoundCloud</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <iframe
                  width="100%"
                  height="140"
                  scrolling="no"
                  frameBorder="no"
                  allow="autoplay"
                  src={currentEmbedUrl}
                  className="rounded-xl overflow-hidden shadow-inner border border-zinc-800"
                  title={`SoundCloud Player Jet Samba Black - ${currentTitle}`}
                />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
